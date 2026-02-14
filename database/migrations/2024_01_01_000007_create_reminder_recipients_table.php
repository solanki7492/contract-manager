<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminder_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reminder_id')->constrained()->onDelete('cascade');
            $table->string('recipient_type');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('email')->nullable();
            $table->timestamps();

            $table->index('reminder_id');
            $table->index(['reminder_id', 'recipient_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminder_recipients');
    }
};
