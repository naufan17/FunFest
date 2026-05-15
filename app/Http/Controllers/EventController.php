<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('Events/Index', [
            'events' => Event::withCount('registrations')->latest()->paginate(12)
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Event::class);
        return Inertia::render('Events/Create');
    }

    public function store(StoreEventRequest $request)
    {
        Gate::authorize('create', Event::class);

        $validated = $request->validated();
        
        $bannerUrl = null;
        if ($request->hasFile('banner_image')) {
            $path = $request->file('banner_image')->store('events', 'public');
            $bannerUrl = '/storage/' . $path;
        }

        DB::transaction(function () use ($validated, $request, $bannerUrl) {
            $event = Event::create([
                ...collect($validated)->except(['categories', 'banner_image'])->toArray(),
                'banner_url' => $bannerUrl,
                'created_by' => $request->user()->id,
            ]);

            foreach ($validated['categories'] as $gender) {
                EventCategory::create([
                    'event_id' => $event->id,
                    'gender' => $gender,
                ]);
            }
        });

        return redirect()->route('events.index')->with('success', 'Event created successfully.');
    }

    public function show(Event $event)
    {
        $event->load(['creator', 'categories', 'registrations.user']);
        
        $userId = auth()->id();
        
        return Inertia::render('Events/Show', [
            'event' => $event,
            'isOwner' => $userId ? $event->created_by === $userId : false,
            'isRegistered' => $userId ? $event->registrations()->where('user_id', $userId)->exists() : false,
            'registration' => $userId ? $event->registrations()->where('user_id', $userId)->first() : null,
        ]);
    }

    public function edit(Event $event)
    {
        Gate::authorize('update', $event);
        return Inertia::render('Events/Edit', ['event' => $event]);
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        Gate::authorize('update', $event);
        
        $validated = $request->validated();
        
        $dataToUpdate = collect($validated)->except(['banner_image'])->toArray();

        if ($request->hasFile('banner_image')) {
            // Delete old banner if exists
            if ($event->banner_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $event->banner_url));
            }
            $path = $request->file('banner_image')->store('events', 'public');
            $dataToUpdate['banner_url'] = '/storage/' . $path;
        }

        $event->update($dataToUpdate);

        return redirect()->route('events.show', $event->id)->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event)
    {
        Gate::authorize('delete', $event);
        $event->delete();
        return redirect()->route('events.index')->with('success', 'Event deleted successfully.');
    }
}
