<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contract_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('color')->nullable();
            $table->boolean('is_system')->default(false);
            $table->timestamps();

            $table->index('company_id');
            $table->index('is_system');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contract_types');
    }
};
