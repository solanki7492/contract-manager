<?php

namespace App\Http\Requests;

use App\Enums\RecipientType;
use App\Enums\ReminderChannel;
use App\Enums\ReminderTriggerType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReminderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $triggerType = $this->input('trigger_type');

        return [
            'contract_id' => ['required', 'exists:contracts,id'],
            'trigger_type' => ['required', Rule::enum(ReminderTriggerType::class)],
            'days_before' => [
                Rule::requiredIf(fn() => in_array($triggerType, [
                    ReminderTriggerType::BEFORE_END_DATE->value,
                    ReminderTriggerType::BEFORE_TERMINATION_DEADLINE->value
                ])),
                'nullable',
                'integer',
                'min:1',
                'max:365',
            ],
            'custom_date' => [
                Rule::requiredIf(fn() => $triggerType === ReminderTriggerType::CUSTOM_DATE->value),
                'nullable',
                'date',
            ],
            'send_time' => ['required', 'date_format:H:i'],
            'channels' => ['required', 'array', 'min:1'],
            'channels.*' => [Rule::enum(ReminderChannel::class)],
            'recipients' => ['required', 'array', 'min:1'],
            'recipients.*.recipient_type' => ['required', Rule::enum(RecipientType::class)],
            'recipients.*.id' => ['required_if:recipients.*.recipient_type,' . RecipientType::USER->value, 'nullable', 'exists:users,id'],
            'recipients.*.email' => ['required_if:recipients.*.recipient_type,' . RecipientType::EXTERNAL->value, 'nullable', 'email'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
