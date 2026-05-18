<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', User::class);

        $search = $request->input('search');
        $role = $request->input('role');

        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => ['search' => $search, 'role' => $role]
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'admin',
        ]);

        return back()->with('success', 'Administrative account created successfully.');
    }

    public function updateRole(Request $request, User $user)
    {
        Gate::authorize('update', clone $user);

        $request->validate([
            'role' => 'required|in:admin,organizer,participant',
        ]);

        $user->update(['role' => $request->role]);

        return back()->with('success', 'User role updated successfully.');
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', clone $user);

        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete yourself.']);
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
