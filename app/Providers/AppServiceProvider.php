<?php

namespace App\Providers;

use App\Models\Event;
use App\Models\Registration;
use App\Policies\EventPolicy;
use App\Policies\RegistrationPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register Policies
        Gate::policy(Event::class, EventPolicy::class);
        Gate::policy(Registration::class, RegistrationPolicy::class);

        // Role-based Gates
        Gate::define('admin', function ($user) {
            return $user->role === 'admin';
        });

        Gate::define('organizer', function ($user) {
            return $user->role === 'organizer' || $user->role === 'admin';
        });
    }
}
