<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CompanyService
{
    public function createCompanyWithUser(array $companyData, array $userData): array
    {
        return DB::transaction(function () use ($companyData, $userData) {
            $company = Company::create($companyData);

            $temporaryPassword = Str::random(12);

            $user = User::withoutGlobalScope('App\Scopes\CompanyScope')->create([
                'company_id' => $company->id,
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($temporaryPassword),
                'role' => UserRole::COMPANY_ADMIN,
                'force_password_change' => true,
            ]);

            return [
                'company' => $company,
                'user' => $user,
                'temporary_password' => $temporaryPassword,
            ];
        });
    }

    public function updateCompany(Company $company, array $data): Company
    {
        $company->update($data);
        return $company->fresh();
    }
}
