<?php

namespace App\Models;

use App\Enums\ReminderStatus;
use App\Enums\ReminderTriggerType;
use App\Scopes\CompanyScope;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'contract_id',
        'created_by',
        'trigger_type',
        'days_before',
        'custom_date',
        'send_time',
        'trigger_datetime',
        'channels',
        'status',
        'sent_at',
        'handled_at',
        'handled_by',
        'notes',
    ];

    protected $casts = [
        'custom_date' => 'date',
        'trigger_datetime' => 'datetime',
        'sent_at' => 'datetime',
        'handled_at' => 'datetime',
        'channels' => 'array',
        'status' => ReminderStatus::class,
        'trigger_type' => ReminderTriggerType::class,
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);

        static::saving(function ($reminder) {
            if (!$reminder->trigger_datetime || $reminder->isDirty(['trigger_type', 'days_before', 'custom_date', 'send_time'])) {
                $reminder->calculateTriggerDatetime();
            }
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(ReminderRecipient::class);
    }

    public function calculateTriggerDatetime(): void
    {
        $contract = $this->contract;
        
        if (!$contract) {
            return;
        }

        $targetDate = match($this->trigger_type) {
            ReminderTriggerType::BEFORE_END_DATE => $contract->end_date->copy()->subDays($this->days_before ?? 0),
            ReminderTriggerType::BEFORE_TERMINATION_DEADLINE => $contract->termination_deadline?->subDays($this->days_before ?? 0),
            ReminderTriggerType::CUSTOM_DATE => $this->custom_date,
            default => null,
        };

        if ($targetDate) {
            $this->trigger_datetime = Carbon::parse($targetDate->format('Y-m-d') . ' ' . $this->send_time);
        }
    }

    public function markAsSent(): void
    {
        $this->update([
            'status' => ReminderStatus::SENT,
            'sent_at' => now(),
        ]);
    }

    public function markAsHandled(User $user): void
    {
        $this->update([
            'status' => ReminderStatus::HANDLED,
            'handled_at' => now(),
            'handled_by' => $user->id,
        ]);
    }

    public function markAsFailed(): void
    {
        $this->update([
            'status' => ReminderStatus::FAILED,
        ]);
    }

    public function scopePending($query)
    {
        return $query->where('status', ReminderStatus::PENDING);
    }

    public function scopeDueToSend($query)
    {
        return $query->pending()
                     ->where('trigger_datetime', '<=', now());
    }

    public function scopeUpcoming($query, int $days = 7)
    {
        return $query->pending()
                     ->where('trigger_datetime', '<=', now()->addDays($days))
                     ->where('trigger_datetime', '>=', now());
    }
}
