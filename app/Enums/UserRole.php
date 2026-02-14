<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPERADMIN = 'superadmin';
    case COMPANY_ADMIN = 'company_admin';
    case USER = 'user';

    public function label(): string
    {
        return match($this) {
            self::SUPERADMIN => 'Super Admin',
            self::COMPANY_ADMIN => 'Company Admin',
            self::USER => 'User',
        };
    }

    public function canManageCompany(): bool
    {
        return $this === self::SUPERADMIN;
    }

    public function canManageUsers(): bool
    {
        return in_array($this, [self::SUPERADMIN, self::COMPANY_ADMIN]);
    }
}
