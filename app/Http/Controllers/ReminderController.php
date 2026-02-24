<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReminderRequest;
use App\Http\Requests\UpdateReminderRequest;
use App\Models\Contract;
use App\Models\Reminder;
use App\Models\User;
use App\Services\ReminderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReminderController extends Controller
{
    public function __construct(
        protected ReminderService $reminderService
    ) {}

    public function index(Request $request): Response
    {
        $query = Reminder::with(['contract', 'recipients.user'])
            ->orderBy('trigger_datetime', 'asc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('contract_id')) {
            $query->where('contract_id', $request->contract_id);
        }

        if ($request->filled('date_from')) {
            $query->where('trigger_datetime', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('trigger_datetime', '<=', $request->date_to);
        }

        // Filter by upcoming days (from dashboard)
        if ($request->filled('upcoming_days')) {
            $days = (int) $request->upcoming_days;
            $query->whereBetween('trigger_datetime', [
                now(),
                now()->addDays($days)
            ]);
        }

        $reminders = $query->paginate(15)->withQueryString();

        $contracts = Contract::select('id', 'title')
            ->orderBy('title')
            ->get();

        return Inertia::render('Reminders/Index', [
            'reminders' => $reminders,
            'contracts' => $contracts,
            'filters' => $request->only(['status', 'contract_id', 'date_from', 'date_to', 'upcoming_days']),
        ]);
    }

    public function create(Request $request): Response
    {
        $contracts = Contract::select('id', 'title', 'end_date', 'termination_deadline_date', 'termination_notice_days')
            ->orderBy('title')
            ->get();

        $users = User::select('id', 'name', 'email')
            ->where('company_id', auth()->user()->company_id)
            ->orderBy('name')
            ->get();

        $preselectedContractId = $request->query('contract_id');

        return Inertia::render('Reminders/Create', [
            'contracts' => $contracts,
            'users' => $users,
            'preselectedContractId' => $preselectedContractId,
        ]);
    }

    public function store(StoreReminderRequest $request): RedirectResponse
    {
        $reminder = $this->reminderService->create(
            $request->validated(),
            $request->user()
        );

        return redirect()->route('reminders.index')
            ->with('success', 'Reminder created successfully.');
    }

    public function show(Reminder $reminder): Response
    {
        //$this->authorize('view', $reminder);

        $reminder->load(['contract', 'recipients.user', 'creator', 'handler']);

        return Inertia::render('Reminders/Show', [
            'reminder' => $reminder,
        ]);
    }

    public function edit(Reminder $reminder): Response
    {
        //$this->authorize('update', $reminder);

        $reminder->load(['contract', 'recipients.user']);

        $contracts = Contract::select('id', 'title', 'end_date', 'termination_deadline_date', 'termination_notice_days')
            ->orderBy('title')
            ->get();

        $users = User::select('id', 'name', 'email')
            ->where('company_id', auth()->user()->company_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Reminders/Edit', [
            'reminder' => $reminder,
            'contracts' => $contracts,
            'users' => $users,
        ]);
    }

    public function update(UpdateReminderRequest $request, Reminder $reminder): RedirectResponse
    {
        $reminder = $this->reminderService->update(
            $reminder,
            $request->validated()
        );

        return redirect()->route('reminders.show', $reminder)
            ->with('success', 'Reminder updated successfully.');
    }

    public function destroy(Reminder $reminder): RedirectResponse
    {
        //$this->authorize('delete', $reminder);

        $this->reminderService->delete($reminder);

        return redirect()->route('reminders.index')
            ->with('success', 'Reminder deleted successfully.');
    }

    public function markAsHandled(Request $request, Reminder $reminder): RedirectResponse
    {
        //$this->authorize('handle', $reminder);

        $this->reminderService->markAsHandled($reminder, $request->user());

        return back()->with('success', 'Reminder marked as handled.');
    }
}
