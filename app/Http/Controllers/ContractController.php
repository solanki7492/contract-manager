<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContractRequest;
use App\Http\Requests\UpdateContractRequest;
use App\Models\Contract;
use App\Models\ContractType;
use App\Services\ContractService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
    public function __construct(
        protected ContractService $contractService
    ) {}

    public function index(Request $request): Response
    {
        $query = Contract::with(['contractType', 'creator'])
            ->orderBy('end_date', 'asc');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('counterparty', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('contract_type_id', $request->type);
        }

        if ($request->filled('end_date_from')) {
            $query->where('end_date', '>=', $request->end_date_from);
        }

        if ($request->filled('end_date_to')) {
            $query->where('end_date', '<=', $request->end_date_to);
        }

        $contracts = $query->paginate(15)->withQueryString();

        $contractTypes = ContractType::where('company_id', auth()->user()->company_id)
            ->orWhere('is_system', true)
            ->get();

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts,
            'contractTypes' => $contractTypes,
            'filters' => $request->only(['search', 'status', 'type', 'end_date_from', 'end_date_to']),
        ]);
    }

    public function create(): Response
    {
        $contractTypes = ContractType::where('company_id', auth()->user()->company_id)
            ->orWhere('is_system', true)
            ->get();

        return Inertia::render('Contracts/Create', [
            'contractTypes' => $contractTypes,
        ]);
    }

    public function store(StoreContractRequest $request): RedirectResponse
    {
        $contract = $this->contractService->create(
            $request->validated(),
            $request->user()
        );

        return redirect()->route('contracts.show', $contract)
            ->with('success', 'Contract created successfully.');
    }

    public function show(Contract $contract): Response
    {
        //$this->authorize('view', $contract);

        $contract->load(['contractType', 'creator', 'reminders.recipients.user']);

        $downloadUrl = $this->contractService->getDownloadUrl($contract);

        return Inertia::render('Contracts/Show', [
            'contract' => $contract,
            'downloadUrl' => $downloadUrl,
        ]);
    }

    public function edit(Contract $contract): Response
    {
        //$this->authorize('update', $contract);

        $contract->load(['contractType']);

        $contractTypes = ContractType::where('company_id', auth()->user()->company_id)
            ->orWhere('is_system', true)
            ->get();

        return Inertia::render('Contracts/Edit', [
            'contract' => $contract,
            'contractTypes' => $contractTypes,
        ]);
    }

    public function update(UpdateContractRequest $request, Contract $contract): RedirectResponse
    {
        $contract = $this->contractService->update(
            $contract,
            $request->validated()
        );

        return redirect()->route('contracts.show', $contract)
            ->with('success', 'Contract updated successfully.');
    }

    public function destroy(Contract $contract): RedirectResponse
    {
        //$this->authorize('delete', $contract);

        $this->contractService->delete($contract);

        return redirect()->route('contracts.index')
            ->with('success', 'Contract deleted successfully.');
    }

    public function download(Contract $contract)
    {
        //$this->authorize('download', $contract);

        if (!$contract->file_path) {
            abort(404, 'No file attached to this contract.');
        }

        $url = $this->contractService->getDownloadUrl($contract);

        return redirect($url);
    }
}
