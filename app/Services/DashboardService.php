<?php

namespace App\Services;

use App\Models\Contract;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getStats(int $companyId): array
    {
        return [
            'active_contracts' => Contract::where('company_id', $companyId)
                ->active()
                ->count(),
            'expiring_30_days' => Contract::where('company_id', $companyId)
                ->expiringInDays(30)
                ->count(),
            'expiring_60_days' => Contract::where('company_id', $companyId)
                ->expiringInDays(60)
                ->count(),
            'expiring_90_days' => Contract::where('company_id', $companyId)
                ->expiringInDays(90)
                ->count(),
            'upcoming_reminders_7_days' => DB::table('reminders')
                ->where('company_id', $companyId)
                ->where('status', 'pending')
                ->whereBetween('trigger_datetime', [now(), now()->addDays(7)])
                ->count(),
            'upcoming_reminders_30_days' => DB::table('reminders')
                ->where('company_id', $companyId)
                ->where('status', 'pending')
                ->whereBetween('trigger_datetime', [now(), now()->addDays(30)])
                ->count(),
        ];
    }

    public function getExpiringContracts(int $companyId, int $days = 30)
    {
        return Contract::where('company_id', $companyId)
            ->with(['contractType', 'creator', 'nextReminder'])
            ->expiringInDays($days)
            ->orderBy('end_date', 'asc')
            ->limit(10)
            ->get();
    }

    public function getUpcomingReminders(int $companyId, int $days = 7)
    {
        return DB::table('reminders')
            ->join('contracts', 'reminders.contract_id', '=', 'contracts.id')
            ->select('reminders.*', 'contracts.title as contract_title')
            ->where('reminders.company_id', $companyId)
            ->where('reminders.status', 'pending')
            ->whereBetween('reminders.trigger_datetime', [now(), now()->addDays($days)])
            ->orderBy('reminders.trigger_datetime', 'asc')
            ->limit(10)
            ->get();
    }
}
