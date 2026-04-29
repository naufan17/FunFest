<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('Events/Index', [
            'events' => Event::withCount('registrations')->latest()->get()
        ]);
    }

    public function create()
    {
        if (\Illuminate\Support\Facades\Gate::denies('organizer')) {
            abort(403);
        }
        return Inertia::render('Events/Create');
    }

    public function store(Request $request)
    {
        if (\Illuminate\Support\Facades\Gate::denies('organizer')) {
            abort(403);
        }
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'distance' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string',
            'max_participants' => 'required|integer',
            'registration_start' => 'required|date',
            'registration_end' => 'required|date',
            'race_start_time' => 'required',
            'cut_off_time' => 'required',
            'organizer_name' => 'required|string',
            'contact' => 'required|string',
            'categories' => 'required|array', // e.g. ['male', 'female']
        ]);

        $event = Event::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        foreach ($validated['categories'] as $gender) {
            EventCategory::create([
                'event_id' => $event->id,
                'gender' => $gender,
            ]);
        }

        return redirect()->route('events.index');
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
        if ($event->created_by !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }
        return Inertia::render('Events/Edit', ['event' => $event]);
    }

    public function update(Request $request, Event $event)
    {
        if ($event->created_by !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'distance' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string',
            'max_participants' => 'required|integer',
            'registration_start' => 'required|date',
            'registration_end' => 'required|date',
            'race_start_time' => 'required',
            'cut_off_time' => 'required',
            'organizer_name' => 'required|string',
            'contact' => 'required|string',
        ]);

        $event->update($validated);

        return redirect()->route('events.show', $event->id);
    }

    public function destroy(Event $event)
    {
        if ($event->created_by !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }
        $event->delete();
        return redirect()->route('events.index');
    }
}
