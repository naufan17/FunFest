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

    public function index(Request $request)
    {
        $search = $request->input('search');
        $distance = $request->input('distance');

        $events = Event::withCount('registrations')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($distance, function ($query, $distance) {
                $query->where('distance', $distance);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $distances = Event::select('distance')->distinct()->pluck('distance');

        return Inertia::render('Events/Index', [
            'events' => $events,
            'filters' => [
                'search' => $search,
                'distance' => $distance,
            ],
            'distances' => $distances,
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

    public function show(Request $request, Event $event)
    {
        $event->load(['creator', 'categories']);
        
        $userId = auth()->id();

        $search = $request->input('search');
        $status = $request->input('status');
        $gender = $request->input('gender');
        
        // Paginated participants with search & filters
        $participants = $event->registrations()
            ->with('user')
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($gender, function ($query, $gender) {
                $query->where('gender', $gender);
            })
            ->latest()
            ->paginate(10, ['*'], 'participants_page')
            ->withQueryString();

        // Top 10 Leaderboard
        $topMale = $event->registrations()
            ->with('user')
            ->where('gender', 'male')
            ->where('status', 'finished')
            ->orderBy('finish_time')
            ->limit(10)
            ->get();

        $topFemale = $event->registrations()
            ->with('user')
            ->where('gender', 'female')
            ->where('status', 'finished')
            ->orderBy('finish_time')
            ->limit(10)
            ->get();
        
        return Inertia::render('Events/Show', [
            'event' => $event,
            'participants' => $participants,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'gender' => $gender,
            ],
            'leaderboard' => [
                'male' => $topMale,
                'female' => $topFemale,
            ],
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
