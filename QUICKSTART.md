# Quick Setup Guide - Contract Management MVP

## Prerequisites Installed
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Backblaze B2 account

## Installation Steps

### 1. Install Dependencies

```bash
cd contract-mvp

# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env`:
```env
DB_DATABASE=contract_manager
DB_USERNAME=root
DB_PASSWORD=your_password

B2_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_application_key
B2_BUCKET=your_bucket_name
B2_REGION=us-west-002
B2_ENDPOINT=https://s3.us-west-002.backblazeb2.com
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE contract_manager;
EXIT;

# Run migrations and seeders
php artisan migrate
php artisan db:seed
```

### 4. Build Frontend

```bash
npm run dev
```

### 5. Start Application

```bash
# Terminal 1: Application server
php artisan serve

# Terminal 2: Queue worker (REQUIRED for reminders)
php artisan queue:work

# Terminal 3: Vite dev server
npm run dev
```

### 6. Setup Cron (Important for Reminders)

Add to crontab:
```bash
* * * * * cd /path/to/contract-mvp && php artisan schedule:run >> /dev/null 2>&1
```

## Default Login

Superadmin:
- Email: `admin@contractmanager.com`
- Password: `password`

Demo Admin (local environment):
- Email: `demo@demo.com`
- Password: `password`

## Quick Test

1. Login as superadmin
2. Create a company (Companies menu)
3. Login with the company user credentials sent to email
4. Change password
5. Create a contract
6. Create a reminder for the contract
7. Wait for reminder to trigger (or manually run: `php artisan reminders:process`)

## Troubleshooting

### Queue not processing
```bash
php artisan queue:work --verbose
```

### Migrations fail
```bash
php artisan migrate:fresh --seed
```

### Frontend not loading
```bash
npm run build
php artisan optimize:clear
```

### File upload not working
- Check B2 credentials in `.env`
- Verify: `composer show league/flysystem-aws-s3-v3`

## Next Steps

1. Configure mail server for real emails
2. Setup SSL certificate
3. Configure Redis for production queue
4. Setup Supervisor for queue workers
5. Add monitoring (Sentry, etc.)

## Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure real mail server
- [ ] Use Redis for queue and cache
- [ ] Setup Supervisor for queue workers
- [ ] Configure cron job
- [ ] Setup SSL (Let's Encrypt)
- [ ] Run `php artisan optimize`
- [ ] Run `npm run build`
- [ ] Set proper file permissions
- [ ] Configure backup strategy
- [ ] Setup monitoring

## Documentation

See `README_COMPLETE.md` for full documentation.
