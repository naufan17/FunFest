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
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Events
    Route::resource('events', EventController::class);
    
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
        Route::patch('/admin/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('admin.users.role');
        Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
    });
});

require __DIR__.'/auth.php';
