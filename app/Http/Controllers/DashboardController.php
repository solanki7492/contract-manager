<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index(): Response
    {
        $user = auth()->user();
        
        // Super admin dashboard
        if ($user->isSuperAdmin()) {
            $companies = Company::withCount('users')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
            
            return Inertia::render('Dashboard/Index', [
                'companies' => $companies,
                'totalCompanies' => Company::count(),
                'totalUsers' => User::count(),
            ]);
        }
        
        // Company user dashboard
        if (!$user->company_id) {
            return Inertia::render('Dashboard/Index', [
                'stats' => [
                    'active_contracts' => 0,
                    'expiring_30_days' => 0,
                    'expiring_60_days' => 0,
                    'expiring_90_days' => 0,
                    'upcoming_reminders_7_days' => 0,
                    'upcoming_reminders_30_days' => 0,
                ],
                'expiringContracts' => [],
                'upcomingReminders' => [],
            ]);
        }
        
        $stats = $this->dashboardService->getStats($user->company_id);
        $expiringContracts = $this->dashboardService->getExpiringContracts($user->company_id, 90);
        //$upcomingReminders = $this->dashboardService->getUpcomingReminders($user->company_id, 30);

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'expiringContracts' => $expiringContracts,
        ]);
    }
}
