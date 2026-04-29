<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        return Inertia::render('Admin/Users', [
            'users' => User::latest()->get()
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $request->validate([
            'role' => 'required|in:admin,organizer,participant',
        ]);

        $user->update(['role' => $request->role]);

        return back();
    }

    public function destroy(User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete yourself.']);
        }

        $user->delete();

        return back();
    }
}
