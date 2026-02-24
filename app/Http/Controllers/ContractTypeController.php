<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContractTypeRequest;
use App\Http\Requests\UpdateContractTypeRequest;
use App\Models\ContractType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractTypeController extends Controller
{
    public function index(Request $request): Response
    {
        $contractTypes = ContractType::where('company_id', $request->user()->company_id)
            ->orderBy('is_system', 'desc')
            ->orderBy('name')
            ->get();

        return Inertia::render('Settings/ContractTypes', [
            'contractTypes' => $contractTypes,
        ]);
    }

    public function store(StoreContractTypeRequest $request): RedirectResponse
    {
        ContractType::create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'color' => $request->color ?? '#3B82F6',
            'is_system' => false,
        ]);

        return back()->with('success', 'Contract type created successfully.');
    }

    public function update(UpdateContractTypeRequest $request, ContractType $contractType): RedirectResponse
    {
        // Prevent editing system types
        if ($contractType->is_system) {
            return back()->with('error', 'Cannot edit system contract types.');
        }

        $contractType->update($request->validated());

        return back()->with('success', 'Contract type updated successfully.');
    }

    public function destroy(ContractType $contractType): RedirectResponse
    {
        // Prevent deleting system types
        if ($contractType->is_system) {
            return back()->with('error', 'Cannot delete system contract types.');
        }

        // Check if contract type is in use
        if ($contractType->contracts()->count() > 0) {
            return back()->with('error', 'Cannot delete contract type that is in use.');
        }

        $contractType->delete();

        return back()->with('success', 'Contract type deleted successfully.');
    }
}
