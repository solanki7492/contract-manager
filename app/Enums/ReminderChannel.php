<?php

namespace App\Enums;

enum ReminderChannel: string
{
    case EMAIL = 'email';
    case IN_APP = 'in_app';

    public function label(): string
    {
        return match($this) {
            self::EMAIL => 'Email',
            self::IN_APP => 'In-App',
        };
    }
}
