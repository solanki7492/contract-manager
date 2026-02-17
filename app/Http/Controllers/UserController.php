<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\Notifications\NewCompanyUserNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        //$this->authorize('viewAny', User::class);

        $query = User::with('company')->orderBy('name');

        if (!$request->user()->isSuperAdmin()) {
            $query->where('company_id', $request->user()->company_id);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->paginate(15)->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create(Request $request): Response
    {
        //$this->authorize('create', User::class);

        $data = [];
        
        if ($request->user()->isSuperAdmin()) {
            $data['companies'] = \App\Models\Company::orderBy('name')->get(['id', 'name']);
        }

        return Inertia::render('Users/Create', $data);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $temporaryPassword = Str::random(12);

        // Superadmin can specify company_id, otherwise use authenticated user's company
        $companyId = $request->user()->isSuperAdmin() && $request->filled('company_id')
            ? $request->company_id
            : $request->user()->company_id;

        $user = User::withoutGlobalScope('App\Scopes\CompanyScope')->create([
            'company_id' => $companyId,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($temporaryPassword),
            'role' => $request->role,
            'force_password_change' => true,
        ]);

        // Get the company for notification
        $company = \App\Models\Company::find($companyId);
        
        $user->notify(new NewCompanyUserNotification(
            $company,
            $temporaryPassword
        ));

        return redirect()->route('users.index')
            ->with('success', 'User created successfully. Login credentials sent via email.');
    }

    public function edit(User $user): Response
    {
        //$this->authorize('update', $user);

        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        //$this->authorize('update', $user);
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role' => ['required', 'string'],
        ]);

        $user->update($request->only(['name', 'email', 'role']));

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        //$this->authorize('delete', $user);

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}
