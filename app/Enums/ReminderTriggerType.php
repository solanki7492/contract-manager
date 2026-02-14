<?php

namespace App\Enums;

enum ReminderTriggerType: string
{
    case BEFORE_END_DATE = 'before_end_date';
    case BEFORE_TERMINATION_DEADLINE = 'before_termination_deadline';
    case CUSTOM_DATE = 'custom_date';

    public function label(): string
    {
        return match($this) {
            self::BEFORE_END_DATE => 'Before End Date',
            self::BEFORE_TERMINATION_DEADLINE => 'Before Termination Deadline',
            self::CUSTOM_DATE => 'Custom Date',
        };
    }
}
