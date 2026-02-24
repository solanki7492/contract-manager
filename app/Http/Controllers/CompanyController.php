<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Models\Company;
use App\Notifications\NewCompanyUserNotification;
use App\Services\CompanyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Enums\UserRole;

class CompanyController extends Controller
{
    public function __construct(
        protected CompanyService $companyService
    ) {
        //$this->middleware('superadmin');
    }

    public function index(Request $request): Response
    {
        $query = Company::withCount('users')->orderBy('name');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $companies = $query->paginate(15)->withQueryString();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Companies/Create');
    }

    public function store(StoreCompanyRequest $request): RedirectResponse
    {
        $result = $this->companyService->createCompanyWithUser(
            $request->only(['name', 'phone', 'timezone']),
            ['name' => $request->user_name, 'email' => $request->user_email]
        );

        if($result['user']->role !== UserRole::USER) {
            $result['user']->notify(new NewCompanyUserNotification(
                $result['company'],
                $result['temporary_password']
            ));
        }

        return redirect()->route('companies.index')
            ->with('success', 'Company and user created successfully. Login credentials sent via email.');
    }

    public function edit(Company $company): Response
    {
        return Inertia::render('Companies/Edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'timezone' => ['required', 'string', 'timezone'],
            'is_active' => ['required', 'boolean'],
        ]);

        $this->companyService->updateCompany($company, $request->all());

        return redirect()->route('companies.index')
            ->with('success', 'Company updated successfully.');
    }
}
