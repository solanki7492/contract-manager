<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('contract'));
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'contract_type_id' => ['nullable', 'exists:contract_types,id'],
            'counterparty' => ['required', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'termination_notice_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'termination_deadline_date' => [
                'nullable',
                'date',
                'before:end_date',
                Rule::requiredIf(function () {
                    return !$this->termination_notice_days;
                }),
            ],
            'notes' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ];
    }
}
