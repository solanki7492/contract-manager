<?php

namespace App\Notifications;

use App\Models\Contract;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ContractCreatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Contract $contract,
        public User $creator
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'contract_created',
            'contract_id' => $this->contract->id,
            'contract_title' => $this->contract->title,
            'contract_counterparty' => $this->contract->counterparty,
            'creator_id' => $this->creator->id,
            'creator_name' => $this->creator->name,
            'message' => "{$this->creator->name} created a new contract: {$this->contract->title}",
            'action_url' => route('contracts.show', $this->contract),
        ];
    }
}
