<?php

namespace App\Enums;

enum ContractStatus: string
{
    case ACTIVE = 'active';
    case EXPIRING = 'expiring';
    case EXPIRED = 'expired';
    case TERMINATED = 'terminated';

    public function label(): string
    {
        return match($this) {
            self::ACTIVE => 'Active',
            self::EXPIRING => 'Expiring Soon',
            self::EXPIRED => 'Expired',
            self::TERMINATED => 'Terminated',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::ACTIVE => 'success',
            self::EXPIRING => 'warning',
            self::EXPIRED => 'danger',
            self::TERMINATED => 'secondary',
        };
    }
}
