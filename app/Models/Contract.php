<?php

namespace App\Models;

use App\Enums\ContractStatus;
use App\Scopes\CompanyScope;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Contract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id',
        'contract_type_id',
        'created_by',
        'title',
        'counterparty',
        'start_date',
        'end_date',
        'termination_notice_days',
        'termination_deadline_date',
        'notes',
        'file_path',
        'file_name',
        'file_mime',
        'file_size',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'termination_deadline_date' => 'date',
        'status' => ContractStatus::class,
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);

        static::saving(function ($contract) {
            $contract->updateStatus();
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function contractType(): BelongsTo
    {
        return $this->belongsTo(ContractType::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }

    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) {
            return null;
        }

        return Storage::disk('s3')->url($this->file_path);
    }

    public function updateStatus(): void
    {
        $now = Carbon::now();
        $daysUntilEnd = $now->diffInDays($this->end_date, false);

        if ($this->end_date->isPast()) {
            $this->status = ContractStatus::EXPIRED;
        } elseif ($daysUntilEnd <= 90) {
            $this->status = ContractStatus::EXPIRING;
        } else {
            $this->status = ContractStatus::ACTIVE;
        }
    }

    public function getTerminationDeadlineAttribute(): ?Carbon
    {
        if ($this->termination_deadline_date) {
            return $this->termination_deadline_date;
        }

        if ($this->termination_notice_days && $this->end_date) {
            return $this->end_date->copy()->subDays($this->termination_notice_days);
        }

        return null;
    }

    public function getDaysUntilEndAttribute(): int
    {
        return Carbon::now()->diffInDays($this->end_date, false);
    }

    public function getDaysUntilTerminationDeadlineAttribute(): ?int
    {
        $deadline = $this->termination_deadline;
        
        if (!$deadline) {
            return null;
        }

        return Carbon::now()->diffInDays($deadline, false);
    }

    public function scopeActive($query)
    {
        return $query->where('status', ContractStatus::ACTIVE);
    }

    public function scopeExpiring($query)
    {
        return $query->where('status', ContractStatus::EXPIRING);
    }

    public function scopeExpired($query)
    {
        return $query->where('status', ContractStatus::EXPIRED);
    }

    public function scopeExpiringInDays($query, int $days)
    {
        $targetDate = Carbon::now()->addDays($days);
        return $query->where('end_date', '<=', $targetDate)
                     ->where('end_date', '>=', Carbon::now());
    }

    public function nextReminder()
    {
        return $this->hasOne(Reminder::class)
            ->whereDate('trigger_datetime', '>=', now())
            ->orderBy('trigger_datetime', 'asc');
    }
}
