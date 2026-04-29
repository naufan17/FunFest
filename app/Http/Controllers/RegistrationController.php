<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $request->validate([
            'gender' => 'required|in:male,female',
        ]);

        Registration::create([
            'user_id' => $request->user()->id,
            'event_id' => $event->id,
            'gender' => $request->gender,
            'status' => 'registered',
        ]);

        return back();
    }

    public function update(Request $request, Registration $registration)
    {
        // Only organizer or admin can update status/time
        $event = $registration->event;
        if ($event->created_by !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:registered,checked_in,finished',
            'finish_time' => 'nullable|string',
        ]);

        $registration->update($validated);

        return back();
    }
}
