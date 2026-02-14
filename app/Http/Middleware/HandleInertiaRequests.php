<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role->value,
                    'company_id' => $request->user()->company_id,
                    'force_password_change' => $request->user()->force_password_change,
                    'company' => $request->user()->company ? [
                        'id' => $request->user()->company->id,
                        'name' => $request->user()->company->name,
                        'timezone' => $request->user()->company->timezone,
                    ] : null,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'unreadNotifications' => $request->user() 
                ? $request->user()->unreadNotifications()->count() 
                : 0,
        ]);
    }
}
