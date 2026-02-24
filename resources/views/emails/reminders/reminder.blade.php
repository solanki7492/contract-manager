@component('mail::message')

<p align="center">
    <img src="{{ config('app.url') }}/media/app/default-logo.png" height="60">
</p>

# Contract Reminder

This is a reminder about the following contract:

**Title:** {{ $contract->title }}

**Counterparty:** {{ $contract->counterparty }}

**End Date:** {{ $contract->end_date->format('F d, Y') }}

@if($contract->termination_deadline)
**Termination Deadline:** {{ $contract->termination_deadline->format('F d, Y') }}
@endif

@if($reminder->notes)
**Notes:** {{ $reminder->notes }}
@endif

@component('mail::button', ['url' => url("/contracts/{$contract->id}")])
View Contract
@endcomponent

Please take appropriate action.

Thanks,<br>
{{ config('app.name') }}

@endcomponent