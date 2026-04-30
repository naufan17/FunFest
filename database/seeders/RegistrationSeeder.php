<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Seeder;

class RegistrationSeeder extends Seeder
{
    public function run(): void
    {
        $participants = User::where('role', 'participant')->get();
        $events = Event::all();

        foreach ($events as $event) {
            // Register some users for each event
            $toRegister = $participants->random(rand(10, min(20, $participants->count())));

            foreach ($toRegister as $index => $user) {
                $status = 'registered';
                $finishTime = null;

                // Randomly set some as checked in or finished
                if ($index < 5) {
                    $status = 'finished';
                    $finishTime = sprintf('%02d:%02d:%02d', 0, rand(20, 59), rand(0, 59));
                } elseif ($index < 10) {
                    $status = 'checked_in';
                }

                Registration::create([
                    'user_id' => $user->id,
                    'event_id' => $event->id,
                    'gender' => $index % 2 === 0 ? 'male' : 'female',
                    'status' => $status,
                    'finish_time' => $finishTime,
                ]);
            }
        }
    }
}
