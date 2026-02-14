<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Company;
use App\Models\ContractType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'company_id' => null,
            'name' => 'Super Admin',
            'email' => 'admin@contractmanager.com',
            'password' => Hash::make('password'),
            'role' => UserRole::SUPERADMIN,
            'force_password_change' => false,
        ]);

        $this->createSystemContractTypes();

        if (app()->environment('local')) {
            $this->createDemoData();
        }
    }

    protected function createSystemContractTypes(): void
    {
        $types = [
            ['name' => 'Employment Contract', 'color' => '#3B82F6', 'is_system' => true],
            ['name' => 'Service Agreement', 'color' => '#10B981', 'is_system' => true],
            ['name' => 'Lease Agreement', 'color' => '#F59E0B', 'is_system' => true],
            ['name' => 'Non-Disclosure Agreement', 'color' => '#EF4444', 'is_system' => true],
            ['name' => 'Purchase Agreement', 'color' => '#8B5CF6', 'is_system' => true],
            ['name' => 'Partnership Agreement', 'color' => '#EC4899', 'is_system' => true],
            ['name' => 'Vendor Contract', 'color' => '#6366F1', 'is_system' => true],
            ['name' => 'License Agreement', 'color' => '#14B8A6', 'is_system' => true],
        ];

        foreach ($types as $type) {
            ContractType::create($type);
        }
    }

    protected function createDemoData(): void
    {
        $company = Company::create([
            'name' => 'Demo Company',
            'email' => 'demo@company.com',
            'phone' => '+1234567890',
            'address' => '123 Business Street, City, Country',
            'timezone' => 'UTC',
            'is_active' => true,
        ]);

        User::create([
            'company_id' => $company->id,
            'name' => 'Demo Admin',
            'email' => 'demo@demo.com',
            'password' => Hash::make('password'),
            'role' => UserRole::COMPANY_ADMIN,
            'force_password_change' => false,
        ]);

        User::create([
            'company_id' => $company->id,
            'name' => 'Demo User',
            'email' => 'user@demo.com',
            'password' => Hash::make('password'),
            'role' => UserRole::USER,
            'force_password_change' => false,
        ]);
    }
}
