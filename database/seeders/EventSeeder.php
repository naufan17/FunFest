<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $organizer = User::where('role', 'organizer')->first();

        $events = [
            [
                'title' => 'Summer City 5K',
                'description' => 'A fast and flat 5K through the heart of the city. Perfect for beginners and those looking for a personal best.',
                'distance' => '5K',
                'date' => now()->addDays(30)->format('Y-m-d'),
                'location' => 'Central Park',
                'max_participants' => 200,
                'registration_start' => now()->subDays(5)->format('Y-m-d'),
                'registration_end' => now()->addDays(25)->format('Y-m-d'),
                'race_start_time' => '07:00:00',
                'cut_off_time' => '09:00:00',
                'organizer_name' => 'City Runners Club',
                'contact' => 'info@cityrunners.com',
            ],
            [
                'title' => 'Mountain Trail 10K',
                'description' => 'Challenging trail run with scenic views. Prepare for elevation changes and technical terrain.',
                'distance' => '10K',
                'date' => now()->addDays(45)->format('Y-m-d'),
                'location' => 'Evergreen Trail',
                'max_participants' => 100,
                'registration_start' => now()->subDays(2)->format('Y-m-d'),
                'registration_end' => now()->addDays(40)->format('Y-m-d'),
                'race_start_time' => '06:00:00',
                'cut_off_time' => '10:00:00',
                'organizer_name' => 'Peak Performance',
                'contact' => 'trails@peakperf.com',
            ],
            [
                'title' => 'RunFest Marathon',
                'description' => 'The ultimate challenge. 42.2 kilometers of grit and glory. Finishers get the legendary RunFest medal.',
                'distance' => 'Marathon',
                'date' => now()->addDays(60)->format('Y-m-d'),
                'location' => 'Main Stadium to Coastal Road',
                'max_participants' => 500,
                'registration_start' => now()->subDays(10)->format('Y-m-d'),
                'registration_end' => now()->addDays(50)->format('Y-m-d'),
                'race_start_time' => '05:00:00',
                'cut_off_time' => '12:00:00',
                'organizer_name' => 'RunFest Official',
                'contact' => 'events@runfest.com',
            ],
        ];

        foreach ($events as $eventData) {
            $event = Event::create([
                ...$eventData,
                'created_by' => $organizer->id,
            ]);

            EventCategory::create(['event_id' => $event->id, 'gender' => 'male']);
            EventCategory::create(['event_id' => $event->id, 'gender' => 'female']);
        }
    }
}
