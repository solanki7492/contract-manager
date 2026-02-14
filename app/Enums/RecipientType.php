<?php

namespace App\Enums;

enum RecipientType: string
{
    case USER = 'user';
    case EXTERNAL = 'external';

    public function label(): string
    {
        return match($this) {
            self::USER => 'Internal User',
            self::EXTERNAL => 'External Email',
        };
    }
}
