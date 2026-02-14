<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('trigger_type');
            $table->integer('days_before')->nullable();
            $table->date('custom_date')->nullable();
            $table->time('send_time')->default('09:00:00');
            $table->dateTime('trigger_datetime')->nullable();
            $table->json('channels')->nullable();
            $table->string('status')->default('pending');
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('handled_at')->nullable();
            $table->foreignId('handled_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index(['company_id', 'contract_id']);
            $table->index(['status', 'trigger_datetime']);
            $table->index('trigger_datetime');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
