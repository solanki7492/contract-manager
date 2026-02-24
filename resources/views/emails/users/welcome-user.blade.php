@component('mail::message')

<p align="center">
    <img src="{{ config('app.url') }}/media/app/default-logo.png" height="60">
</p>

# Hello {{ $user->name }}!

Welcome to **{{ $company->name }} – Contract Management System**

An account has been created for you.

---

### Login Credentials

**Email:** {{ $user->email }}

**Temporary Password:** {{ $temporaryPassword }}

@component('mail::button', ['url' => url('/login')])
Login Now
@endcomponent

⚠ You will be required to change your password upon first login.

Please keep your credentials secure.

Thanks,<br>
{{ config('app.name') }}

@endcomponent