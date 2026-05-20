<?php

namespace App\Services;

use App\Models\Event;
use App\Models\Registration;
use App\Models\User;

class RegistrationService
{
    public function register(Event $event, User $user, array $data): Registration
    {
        $now = now()->format('Y-m-d');
        if ($now < $event->registration_start || $now > $event->registration_end) {
            throw new \Exception('Registration for this event is currently closed.');
        }

        if ($event->registrations()->count() >= $event->max_participants) {
            throw new \Exception('This event has reached its maximum participant limit.');
        }

        if (Registration::where('user_id', $user->id)->where('event_id', $event->id)->exists()) {
            throw new \Exception('You are already registered for this event.');
        }

        if (!$event->categories()->where('gender', $data['gender'])->exists()) {
            throw new \Exception('The selected gender category is not supported by this event.');
        }

        if ($user->gender !== $data['gender']) {
            throw new \Exception('Your profile gender does not match this event category.');
        }

        return Registration::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'gender' => $data['gender'],
            'status' => 'registered',
        ]);
    }

    public function update(Registration $registration, array $data): Registration
    {
        $registration->update($data);
        return $registration;
    }
}
