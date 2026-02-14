<?php

namespace App\Models;

use App\Enums\RecipientType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReminderRecipient extends Model
{
    use HasFactory;

    protected $fillable = [
        'reminder_id',
        'recipient_type',
        'user_id',
        'email',
    ];

    protected $casts = [
        'recipient_type' => RecipientType::class,
    ];

    public function reminder(): BelongsTo
    {
        return $this->belongsTo(Reminder::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getEmailAddressAttribute(): string
    {
        if ($this->recipient_type === RecipientType::USER && $this->user) {
            return $this->user->email;
        }

        return $this->email;
    }

    public function getDisplayNameAttribute(): string
    {
        if ($this->recipient_type === RecipientType::USER && $this->user) {
            return $this->user->name;
        }

        return $this->email;
    }
}
