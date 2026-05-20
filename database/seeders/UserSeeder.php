<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'RunFest Admin',
            'email' => 'admin@runfest.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Organizer
        User::create([
            'name' => 'Elite Organizer',
            'email' => 'organizer@runfest.com',
            'password' => Hash::make('password'),
            'role' => 'organizer',
        ]);

        // Participants
        User::create([
            'name' => 'John Runner',
            'email' => 'john@runfest.com',
            'password' => Hash::make('password'),
            'role' => 'participant',
            'gender' => 'male',
        ]);

        User::create([
            'name' => 'Jane Runner',
            'email' => 'jane@runfest.com',
            'password' => Hash::make('password'),
            'role' => 'participant',
            'gender' => 'female',
        ]);

        User::factory(5)->create([
            'role' => 'organizer',
            'gender' => null,
        ]);

        User::factory(50)->create([
            'role' => 'participant',
        ]);
    }
}
