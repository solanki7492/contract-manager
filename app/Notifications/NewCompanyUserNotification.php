<?php

namespace App\Notifications;

use App\Models\Company;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCompanyUserNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Company $company,
        public string $temporaryPassword
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Welcome to {$this->company->name} - Contract Management System")
            ->greeting("Hello {$notifiable->name}!")
            ->line("An account has been created for you at {$this->company->name}'s Contract Management System.")
            ->line("**Email:** {$notifiable->email}")
            ->line("**Temporary Password:** {$this->temporaryPassword}")
            ->action('Login Now', url('/login'))
            ->line('You will be required to change your password upon first login.')
            ->line('Please keep your credentials secure.');
    }
}
