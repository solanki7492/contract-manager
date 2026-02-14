<?php

namespace App\Jobs;

use App\Models\Reminder;
use App\Notifications\ContractReminderNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class SendReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [60, 300, 600];

    public function __construct(
        public Reminder $reminder
    ) {}

    public function handle(): void
    {
        try {
            $reminder = $this->reminder->fresh(['contract', 'recipients.user']);

            if (!$reminder || $reminder->status->value !== 'pending') {
                Log::warning("Reminder {$this->reminder->id} is no longer pending. Skipping.");
                return;
            }

            if (!$reminder->contract) {
                Log::error("Contract not found for reminder {$this->reminder->id}");
                $reminder->markAsFailed();
                return;
            }

            $recipients = $reminder->recipients;

            if ($recipients->isEmpty()) {
                Log::warning("No recipients found for reminder {$this->reminder->id}");
                $reminder->markAsFailed();
                return;
            }

            foreach ($recipients as $recipient) {
                if ($recipient->recipient_type->value === 'user' && $recipient->user) {
                    $recipient->user->notify(new ContractReminderNotification($reminder, $reminder->contract));
                } elseif ($recipient->recipient_type->value === 'external' && $recipient->email) {
                    Notification::route('mail', $recipient->email)
                        ->notify(new ContractReminderNotification($reminder, $reminder->contract));
                }
            }

            $reminder->markAsSent();

            Log::info("Reminder {$this->reminder->id} sent successfully to {$recipients->count()} recipients");

        } catch (\Exception $e) {
            Log::error("Failed to send reminder {$this->reminder->id}: {$e->getMessage()}");
            
            if ($this->attempts() >= $this->tries) {
                $this->reminder->markAsFailed();
            }
            
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Reminder {$this->reminder->id} permanently failed: {$exception->getMessage()}");
        $this->reminder->markAsFailed();
    }
}
