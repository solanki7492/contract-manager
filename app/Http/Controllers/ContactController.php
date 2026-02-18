<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use App\Notifications\NewCompanyUserNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::with('company')
            ->where('role', UserRole::USER->value)
            ->orderBy('name');

        if (!$request->user()->isSuperAdmin()) {
            $query->where('company_id', $request->user()->company_id);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $contacts = $query->paginate(15)->withQueryString();

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Contacts/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:255'],
        ]);

        $temporaryPassword = Str::random(12);

        $user = User::withoutGlobalScope('App\Scopes\CompanyScope')->create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($temporaryPassword),
            'role' => UserRole::USER->value,
            'force_password_change' => true,
        ]);

        $company = $request->user()->company;
        
        $user->notify(new NewCompanyUserNotification(
            $company,
            $temporaryPassword
        ));

        return redirect()->route('contacts.index')
            ->with('success', 'User created successfully. Login credentials sent via email.');
    }

    public function show(User $contact): Response
    {
        $contact->load('company');

        return Inertia::render('Contacts/Show', [
            'contact' => $contact,
        ]);
    }

    public function edit(User $contact): Response
    {
        return Inertia::render('Contacts/Edit', [
            'contact' => $contact,
        ]);
    }

    public function update(Request $request, User $contact): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $contact->id],
            'phone' => ['nullable', 'string', 'max:255'],
        ]);

        $contact->update($request->only(['name', 'email', 'phone']));

        return redirect()->route('contacts.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $contact): RedirectResponse
    {
        $contact->delete();

        return redirect()->route('contacts.index')
            ->with('success', 'User deleted successfully.');
    }
}
