<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $distances = ['5K', '10K', 'Half Marathon', 'Marathon', 'Ultra 50K'];
        $date = $this->faker->dateTimeBetween('now', '+6 months');
        $regStart = (clone $date)->modify('-60 days');
        $regEnd = (clone $date)->modify('-5 days');

        return [
            'title' => $this->faker->city() . ' ' . $this->faker->randomElement($distances),
            'description' => $this->faker->paragraphs(3, true),
            'distance' => $this->faker->randomElement($distances),
            'date' => $date->format('Y-m-d'),
            'location' => $this->faker->streetAddress() . ', ' . $this->faker->city(),
            'max_participants' => $this->faker->numberBetween(100, 1000),
            'registration_start' => $regStart->format('Y-m-d'),
            'registration_end' => $regEnd->format('Y-m-d'),
            'race_start_time' => $this->faker->time('H:i:s', '08:00:00'),
            'cut_off_time' => $this->faker->time('H:i:s', '14:00:00'),
            'organizer_name' => $this->faker->company() . ' Events',
            'contact' => $this->faker->companyEmail(),
            'created_by' => User::where('role', 'organizer')->inRandomOrder()->first()?->id ?? User::factory()->create(['role' => 'organizer'])->id,
        ];
    }
}
