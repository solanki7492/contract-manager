<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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

    public function messages(): array
    {
        return [
            'end_date.after' => 'End date must be after start date.',
            'termination_deadline_date.before' => 'Termination deadline must be before end date.',
            'file.mimes' => 'File must be a PDF or Word document.',
            'file.max' => 'File size must not exceed 10MB.',
        ];
    }
}
