<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('contract_type_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('counterparty');
            $table->date('start_date')->nullable();
            $table->date('end_date');
            $table->integer('termination_notice_days')->nullable();
            $table->date('termination_deadline_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_mime')->nullable();
            $table->integer('file_size')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('company_id');
            $table->index(['company_id', 'status']);
            $table->index(['company_id', 'end_date']);
            $table->index('end_date');
            $table->index('termination_deadline_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
