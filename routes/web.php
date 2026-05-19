<?php

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'upcomingEvents' => \App\Models\Event::where('date', '>=', now())
            ->orderBy('date', 'asc')
            ->take(5)
            ->get(),
    ]);
});

// Public Event Routes
Route::resource('events', EventController::class)->only(['index', 'show']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/guide', function () {
        return Inertia::render('Guide');
    })->name('guide');

    // Protected Event Routes
    Route::resource('events', EventController::class)->except(['index', 'show']);
    
    // Registrations
    Route::post('/events/{event}/join', [RegistrationController::class, 'store'])->name('events.join');
    Route::patch('/registrations/{registration}', [RegistrationController::class, 'update'])->name('registrations.update');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
    Route::middleware('can:admin')->group(function () {
        Route::get('/admin/users', [AdminUserController::class, 'index'])->name('admin.users.index');
        Route::get('/admin/users/{user}', [AdminUserController::class, 'show'])->name('admin.users.show');
        Route::post('/admin/users', [AdminUserController::class, 'store'])->name('admin.users.store');
        Route::patch('/admin/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('admin.users.role');
        Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
    });
});

require __DIR__.'/auth.php';
