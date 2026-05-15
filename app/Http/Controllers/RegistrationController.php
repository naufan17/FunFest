<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RegistrationController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $request->validate([
            'gender' => 'required|in:male,female',
        ]);

        $now = now()->format('Y-m-d');
        if ($now < $event->registration_start || $now > $event->registration_end) {
            return back()->withErrors(['error' => 'Registration for this event is currently closed.']);
        }

        if ($event->registrations()->count() >= $event->max_participants) {
            return back()->withErrors(['error' => 'This event has reached its maximum participant limit.']);
        }

        Registration::create([
            'user_id' => $request->user()->id,
            'event_id' => $event->id,
            'gender' => $request->gender,
            'status' => 'registered',
        ]);

        return back()->with('success', 'You have been successfully registered for ' . $event->name);
    }

    public function update(Request $request, Registration $registration)
    {
        // Only organizer or admin can update status/time
        $event = $registration->event;
        Gate::authorize('update', $registration);

        $validated = $request->validate([
            'status' => 'sometimes|in:registered,checked_in,finished',
            'finish_time' => 'nullable|string',
        ]);

        $registration->update($validated);

        return back()->with('success', 'Registration updated successfully.');
    }
}
