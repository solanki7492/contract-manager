<?php

namespace App\Notifications;

use App\Enums\ReminderChannel;
use App\Models\Contract;
use App\Models\Reminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Reminder $reminder,
        public Contract $contract
    ) {}

    public function via($notifiable): array
    {
        $channels = [];
        
        if (in_array(ReminderChannel::EMAIL->value, $this->reminder->channels ?? [])) {
            $channels[] = 'mail';
        }
        
        if (in_array(ReminderChannel::IN_APP->value, $this->reminder->channels ?? [])) {
            $channels[] = 'database';
        }

        return $channels;
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Contract Reminder: {$this->contract->title}")
            ->markdown('emails.reminders.reminder', [
                'contract' => $this->contract,
                'reminder' => $this->reminder,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'reminder_id' => $this->reminder->id,
            'contract_id' => $this->contract->id,
            'contract_title' => $this->contract->title,
            'contract_counterparty' => $this->contract->counterparty,
            'end_date' => $this->contract->end_date->format('Y-m-d'),
            'termination_deadline' => $this->contract->termination_deadline?->format('Y-m-d'),
            'message' => "Reminder for contract '{$this->contract->title}' ending on {$this->contract->end_date->format('F d, Y')}.",
            'notes' => $this->reminder->notes,
            'trigger_type' => $this->reminder->trigger_type->value,
        ];
    }
}
