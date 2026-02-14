<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class CompanyScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        // Skip scope for User model to prevent infinite loop
        if ($model instanceof \App\Models\User) {
            return;
        }

        $user = auth()->user();

        if ($user && !$user->isSuperAdmin() && $user->company_id) {
            $builder->where($model->getTable() . '.company_id', $user->company_id);
        }
    }
}
