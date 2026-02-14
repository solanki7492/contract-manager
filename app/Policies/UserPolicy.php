<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManageUsers();
    }

    public function view(User $user, User $model): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->company_id === $model->company_id && $user->canManageUsers();
    }

    public function create(User $user): bool
    {
        return $user->canManageUsers();
    }

    public function update(User $user, User $model): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->company_id === $model->company_id && $user->canManageUsers();
    }

    public function delete(User $user, User $model): bool
    {
        if ($model->isSuperAdmin()) {
            return false;
        }

        if ($user->id === $model->id) {
            return false;
        }

        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->company_id === $model->company_id && $user->canManageUsers();
    }
}
