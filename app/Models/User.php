<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'role',
        'force_password_change',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'force_password_change' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function createdContracts(): HasMany
    {
        return $this->hasMany(Contract::class, 'created_by');
    }

    public function createdReminders(): HasMany
    {
        return $this->hasMany(Reminder::class, 'created_by');
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SUPERADMIN;
    }

    public function isCompanyAdmin(): bool
    {
        return $this->role === UserRole::COMPANY_ADMIN;
    }

    public function canManageUsers(): bool
    {
        return $this->role->canManageUsers();
    }
}
