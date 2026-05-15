<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use App\Http\Requests\StoreRegistrationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RegistrationController extends Controller
{
    protected $registrationService;

    public function __construct(\App\Services\RegistrationService $registrationService)
    {
        $this->registrationService = $registrationService;
    }

    public function store(StoreRegistrationRequest $request, Event $event)
    {
        try {
            $this->registrationService->register($event, $request->user(), $request->validated());
            return back()->with('success', 'You have been successfully registered for ' . $event->title);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update(Request $request, Registration $registration)
    {
        Gate::authorize('update', $registration);

        $validated = $request->validate([
            'status' => 'sometimes|in:registered,checked_in,finished',
            'finish_time' => 'nullable|string',
        ]);

        $this->registrationService->update($registration, $validated);

        return back()->with('success', 'Registration updated successfully.');
    }
}
