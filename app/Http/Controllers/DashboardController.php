<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // 1. Admin Dashboard
        if ($user->role === 'admin') {
            return Inertia::render('Dashboard', [
                'stats' => [
                    'totalUsers' => User::count(),
                    'totalEvents' => Event::count(),
                    'totalRegistrations' => Registration::count(),
                ],
                'recentActivity' => [
                    'latestUsers' => User::latest()->take(5)->get(),
                    'latestEvents' => Event::latest()->take(5)->get(),
                ]
            ]);
        }

        // 2. Organizer Dashboard
        if ($user->role === 'organizer') {
            return Inertia::render('Dashboard', [
                'myEvents' => Event::where('created_by', $user->id)
                    ->withCount('registrations')
                    ->latest()
                    ->paginate(5)
                    ->withQueryString(),
            ]);
        }

        // 3. Participant Dashboard
        return Inertia::render('Dashboard', [
            'myActivities' => Registration::with('event')
                ->where('user_id', $user->id)
                ->latest()
                ->get(),
        ]);
    }
}
