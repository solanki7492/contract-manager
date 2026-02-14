<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCompanyContext
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->isSuperAdmin()) {
            if (!$user->company_id) {
                abort(403, 'No company assigned to user.');
            }

            if (!$user->company || !$user->company->is_active) {
                abort(403, 'Company is not active.');
            }
        }

        return $next($request);
    }
}
