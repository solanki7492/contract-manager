<?php

namespace App\Enums;

enum ReminderStatus: string
{
    case PENDING = 'pending';
    case SENT = 'sent';
    case HANDLED = 'handled';
    case FAILED = 'failed';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pending',
            self::SENT => 'Sent',
            self::HANDLED => 'Handled',
            self::FAILED => 'Failed',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'info',
            self::SENT => 'primary',
            self::HANDLED => 'success',
            self::FAILED => 'danger',
        };
    }
}
