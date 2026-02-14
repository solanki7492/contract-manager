# Contract Management MVP - Production-Ready SaaS Application

A comprehensive multi-tenant contract management and reminder system built with Laravel 11, Inertia.js, and React.

## Features

### Multi-Tenancy
- Complete data isolation between companies
- Company-scoped queries with global scopes
- Superadmin can manage all companies
- Company admins manage their company users

### Contract Management
- Create, update, and delete contracts
- File upload (PDF/DOC) to Backblaze B2
- Contract types and categories
- Track start date, end date, and termination deadlines
- Automatic status updates (Active, Expiring, Expired)
- Search and filter contracts

### Reminder System
- Multiple trigger types:
  - Days before end date
  - Days before termination deadline
  - Custom fixed date
- Multiple channels (Email, In-App notifications)
- Multiple recipients (Internal users, External emails)
- Automated processing via Laravel scheduler
- Queued job processing for scalability
- Mark reminders as handled

### Dashboard
- Active contracts count
- Contracts expiring in 30/60/90 days
- Upcoming reminders (7/30 days)
- Quick access to expiring contracts

### User Management
- Role-based access control (Superadmin, Company Admin, User)
- Force password change on first login
- User invitation via email with temporary password
- Profile management

### Security
- Multi-tenant enforcement at query level
- Policy-based authorization
- Protected routes and middleware
- Secure file storage

## Tech Stack

- **Backend**: Laravel 11
- **Frontend**: React 18 with Inertia.js
- **Database**: MySQL
- **Storage**: Backblaze B2 (S3-compatible)
- **Queue**: Database driver (can be upgraded to Redis)
- **CSS**: Tailwind CSS
- **Build Tool**: Vite

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and NPM
- MySQL 8.0+
- Backblaze B2 account (for file storage)

## Installation

### 1. Clone and Setup

```bash
cd contract-mvp
cp .env.example .env
composer install
npm install
```

### 2. Configure Environment

Edit `.env` file:

```env
APP_NAME="Contract Manager"
APP_URL=http://localhost:8000

DB_DATABASE=contract_manager
DB_USERNAME=root
DB_PASSWORD=your_password

# Backblaze B2 Configuration
B2_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_application_key
B2_BUCKET=your_bucket_name
B2_REGION=us-west-002
B2_ENDPOINT=https://s3.us-west-002.backblazeb2.com

# Mail Configuration (for production)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@contractmanager.com
MAIL_FROM_NAME="Contract Manager"

# Queue (use 'database' for development, 'redis' for production)
QUEUE_CONNECTION=database
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Run Migrations and Seeders

```bash
php artisan migrate
php artisan db:seed
```

This will create:
- Superadmin account: `admin@contractmanager.com` / `password`
- Demo company with users (in local environment)
- System contract types

### 5. Install Composer Dependencies for S3

```bash
composer require league/flysystem-aws-s3-v3
```

### 6. Build Frontend Assets

```bash
npm run dev
```

For production:
```bash
npm run build
```

### 7. Start Development Server

```bash
php artisan serve
```

Visit: http://localhost:8000

## Queue Workers & Scheduler

### Queue Worker (Required for reminders)

In development:
```bash
php artisan queue:work
```

In production (use Supervisor):
```ini
[program:contract-manager-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/contract-mvp/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/logs/worker.log
stopwaitsecs=3600
```

### Scheduler (Required for reminder processing)

Add to crontab:
```bash
* * * * * cd /path/to/contract-mvp && php artisan schedule:run >> /dev/null 2>&1
```

The scheduler will run `reminders:process` command every 5 minutes.

## Default Login Credentials

### Superadmin
- Email: `admin@contractmanager.com`
- Password: `password`

### Demo Company Admin (local only)
- Email: `demo@demo.com`
- Password: `password`

### Demo User (local only)
- Email: `user@demo.com`
- Password: `password`

## Architecture

### Models
- `Company` - Multi-tenant companies
- `User` - Users with company association
- `Contract` - Contract records
- `ContractType` - Contract categories
- `Contact` - External contact emails
- `Reminder` - Scheduled reminders
- `ReminderRecipient` - Reminder recipients

### Services
- `ContractService` - Contract business logic and file upload
- `ReminderService` - Reminder creation and management
- `DashboardService` - Dashboard statistics
- `CompanyService` - Company and user creation

### Jobs
- `SendReminderJob` - Process and send individual reminders

### Commands
- `reminders:process` - Find and queue due reminders

### Notifications
- `ContractReminderNotification` - Email and database notification
- `NewCompanyUserNotification` - New user credentials email

### Middleware
- `EnsureCompanyContext` - Verify company assignment and status
- `ForcePasswordChange` - Require password change on first login
- `EnsureSuperAdmin` - Restrict superadmin routes
- `HandleInertiaRequests` - Share auth and flash data with frontend

### Policies
- `ContractPolicy` - Contract authorization
- `ReminderPolicy` - Reminder authorization
- `UserPolicy` - User management authorization

## Multi-Tenancy Implementation

### Global Scopes
All company-scoped models use `CompanyScope`:
```php
protected static function booted(): void
{
    static::addGlobalScope(new CompanyScope);
}
```

The scope automatically filters queries by `company_id` for non-superadmin users.

### Creating Records
Always include `company_id`:
```php
Contract::create([
    'company_id' => auth()->user()->company_id,
    // ... other fields
]);
```

### Bypassing Scope (Superadmin only)
```php
User::withoutGlobalScope(CompanyScope::class)->get();
```

## File Storage (Backblaze B2)

### Configuration
Files are stored using Laravel's S3-compatible driver pointing to Backblaze B2.

### Usage
```php
// Upload
Storage::disk('s3')->putFile('companies/' . $companyId . '/contracts', $file, 'private');

// Download URL
Storage::disk('s3')->temporaryUrl($path, now()->addMinutes(60));

// Delete
Storage::disk('s3')->delete($path);
```

## Reminder Engine Logic

1. **Creation**: When a reminder is created, `trigger_datetime` is calculated based on:
   - Contract end date - X days
   - Termination deadline - X days
   - Custom fixed date
   - Combined with `send_time`

2. **Processing**: 
   - Scheduler runs `reminders:process` every 5 minutes
   - Finds reminders where `trigger_datetime <= now()` and `status = pending`
   - Dispatches `SendReminderJob` for each reminder

3. **Sending**:
   - Job sends notifications to all recipients
   - Supports email and in-app channels
   - Updates reminder status to `sent`
   - Retries on failure (3 attempts)

4. **Handling**:
   - Users can mark reminders as `handled`
   - Prevents unnecessary notifications

## Production Deployment

### Environment
```env
APP_ENV=production
APP_DEBUG=false
QUEUE_CONNECTION=redis
CACHE_STORE=redis
SESSION_DRIVER=redis
```

### Optimize Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### Build Assets
```bash
npm run build
```

### File Permissions
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Web Server (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/contract-mvp/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### SSL (Let's Encrypt)
```bash
sudo certbot --nginx -d yourdomain.com
```

## Testing

Run tests:
```bash
php artisan test
```

## Monitoring

### Logs
```bash
tail -f storage/logs/laravel.log
```

### Queue Status
```bash
php artisan queue:work --verbose
php artisan queue:failed
php artisan queue:retry all
```

### Database Optimization
```bash
php artisan db:monitor
php artisan model:prune
```

## Security Checklist

- ✅ Multi-tenant data isolation
- ✅ Policy-based authorization
- ✅ CSRF protection (Laravel default)
- ✅ Password hashing (bcrypt)
- ✅ Force password change on first login
- ✅ File upload validation
- ✅ SQL injection protection (Eloquent)
- ✅ XSS protection (React escaping)
- ✅ Rate limiting (can be added)
- ✅ Secure file storage (private S3)

## Troubleshooting

### Reminders not sending
1. Check queue worker is running
2. Check scheduler crontab entry
3. Check logs: `storage/logs/laravel.log`
4. Test manually: `php artisan reminders:process`

### File upload errors
1. Verify Backblaze B2 credentials
2. Check bucket permissions
3. Verify S3 driver installed: `composer show league/flysystem-aws-s3-v3`

### Permission denied
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

## Support & Documentation

- Laravel: https://laravel.com/docs/11.x
- Inertia.js: https://inertiajs.com/
- React: https://react.dev/
- Backblaze B2: https://www.backblaze.com/b2/docs/

## License

Proprietary - All rights reserved

---

**Built with ❤️ using Laravel, Inertia.js, and React**
