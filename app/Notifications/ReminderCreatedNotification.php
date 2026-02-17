<?php

namespace App\Notifications;

use App\Models\Reminder;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReminderCreatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Reminder $reminder,
        public User $creator
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'reminder_created',
            'reminder_id' => $this->reminder->id,
            'reminder_title' => $this->reminder->title,
            'contract_id' => $this->reminder->contract_id,
            'contract_title' => $this->reminder->contract->title ?? null,
            'creator_id' => $this->creator->id,
            'creator_name' => $this->creator->name,
            'trigger_datetime' => $this->reminder->trigger_datetime,
            'message' => "{$this->creator->name} created a new reminder: {$this->reminder->title}",
            'action_url' => route('reminders.show', $this->reminder),
        ];
    }
}
