<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordChange
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->force_password_change) {
            if (!$request->routeIs('password.change') && !$request->routeIs('password.update') && !$request->routeIs('logout')) {
                return redirect()->route('password.change');
            }
        }

        return $next($request);
    }
}
