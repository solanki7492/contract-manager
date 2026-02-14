<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Contact::query()->orderBy('name');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('organization', 'like', "%{$request->search}%");
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

    public function store(StoreContactRequest $request): RedirectResponse
    {
        $contact = Contact::create([
            ...$request->validated(),
            'company_id' => $request->user()->company_id,
        ]);

        return redirect()->route('contacts.index')
            ->with('success', 'Contact created successfully.');
    }

    public function edit(Contact $contact): Response
    {
        return Inertia::render('Contacts/Edit', [
            'contact' => $contact,
        ]);
    }

    public function update(StoreContactRequest $request, Contact $contact): RedirectResponse
    {
        $contact->update($request->validated());

        return redirect()->route('contacts.index')
            ->with('success', 'Contact updated successfully.');
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $contact->delete();

        return redirect()->route('contacts.index')
            ->with('success', 'Contact deleted successfully.');
    }
}
