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
    protected $eventService;

    public function __construct(\App\Services\EventService $eventService)
    {
        $this->eventService = $eventService;
    }

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

        $this->eventService->create($request->validated(), $request->user()->id);

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
        
        $this->eventService->update($event, $request->validated());

        return redirect()->route('events.show', $event->id)->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event)
    {
        Gate::authorize('delete', $event);
        
        $this->eventService->delete($event);

        return redirect()->route('events.index')->with('success', 'Event deleted successfully.');
    }
}
