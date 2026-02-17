<?php

namespace App\Providers;

use App\Models\ContractType;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Gate for managing contract types
        Gate::define('manage', function ($user, $model) {
            if ($model === ContractType::class || $model instanceof ContractType) {
                return $user->role->canManageUsers();
            }
            return false;
        });
    }
}
