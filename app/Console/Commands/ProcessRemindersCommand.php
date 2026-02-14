<?php

namespace App\Console\Commands;

use App\Jobs\SendReminderJob;
use App\Models\Reminder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessRemindersCommand extends Command
{
    protected $signature = 'reminders:process';
    
    protected $description = 'Process and send due reminders';

    public function handle(): int
    {
        $this->info('Processing due reminders...');

        $reminders = Reminder::dueToSend()
            ->with(['contract', 'recipients'])
            ->get();

        if ($reminders->isEmpty()) {
            $this->info('No reminders due to be sent.');
            return self::SUCCESS;
        }

        $this->info("Found {$reminders->count()} reminders to process.");

        foreach ($reminders as $reminder) {
            try {
                SendReminderJob::dispatch($reminder);
                $this->info("Queued reminder ID: {$reminder->id}");
            } catch (\Exception $e) {
                $this->error("Failed to queue reminder ID: {$reminder->id} - {$e->getMessage()}");
                Log::error("Failed to queue reminder {$reminder->id}: {$e->getMessage()}");
            }
        }

        $this->info('Reminder processing complete.');

        return self::SUCCESS;
    }
}
