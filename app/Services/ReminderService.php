<?php

namespace App\Services;

use App\Enums\RecipientType;
use App\Enums\ReminderChannel;
use App\Models\Reminder;
use App\Models\User;
use App\Notifications\ReminderCreatedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ReminderService
{
    public function create(array $data, User $user): Reminder
    {
        return DB::transaction(function () use ($data, $user) {
            $recipients = $data['recipients'] ?? [];
            unset($data['recipients']);

            $data['company_id'] = $user->company_id;
            $data['created_by'] = $user->id;

            $reminder = Reminder::create($data);

            $this->attachRecipients($reminder, $recipients);

            // Notify all company users about the new reminder
            $companyUsers = User::where('company_id', $user->company_id)->get();
            
            Notification::send($companyUsers, new ReminderCreatedNotification($reminder, $user));

            return $reminder->load(['contract', 'recipients.user']);
        });
    }

    public function update(Reminder $reminder, array $data): Reminder
    {
        return DB::transaction(function () use ($reminder, $data) {
            $recipients = $data['recipients'] ?? null;
            unset($data['recipients']);

            $reminder->update($data);

            if ($recipients !== null) {
                $reminder->recipients()->delete();
                $this->attachRecipients($reminder, $recipients);
            }

            return $reminder->fresh(['contract', 'recipients.user']);
        });
    }

    protected function attachRecipients(Reminder $reminder, array $recipients): void
    {
        foreach ($recipients as $recipient) {
            $reminder->recipients()->create([
                'recipient_type' => $recipient['recipient_type'],
                'user_id' => $recipient['recipient_type'] === RecipientType::USER->value ? $recipient['id'] : null,
                'email' => $recipient['recipient_type'] === RecipientType::EXTERNAL->value ? $recipient['email'] : null,
            ]);
        }
    }

    public function markAsHandled(Reminder $reminder, User $user): Reminder
    {
        $reminder->markAsHandled($user);

        return $reminder->fresh();
    }

    public function delete(Reminder $reminder): bool
    {
        return $reminder->delete();
    }
}
