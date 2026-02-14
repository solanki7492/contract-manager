# Production Deployment Checklist

## Pre-Deployment

### Code Review
- [ ] All migrations tested
- [ ] All seeders tested
- [ ] All routes working
- [ ] All policies enforced
- [ ] No console.log or dd() statements
- [ ] Error handling in place
- [ ] Validation rules complete

### Environment Configuration
- [ ] `.env` file configured for production
- [ ] `APP_ENV=production`
- [ ] `APP_DEBUG=false`
- [ ] Strong `APP_KEY` generated
- [ ] `APP_URL` set to production domain
- [ ] Database credentials configured
- [ ] Backblaze B2 credentials added
- [ ] Mail server configured (SMTP)
- [ ] Queue connection set to `redis` or `database`
- [ ] Session driver configured (`redis` recommended)
- [ ] Cache driver configured (`redis` recommended)

### Security
- [ ] All routes protected with auth middleware
- [ ] CSRF protection enabled (Laravel default)
- [ ] File upload validation in place
- [ ] SQL injection protection (using Eloquent)
- [ ] XSS protection (React escaping)
- [ ] Force HTTPS in production
- [ ] Rate limiting configured
- [ ] Backup encryption enabled
- [ ] Database connections encrypted

## Server Setup

### System Requirements
- [ ] PHP 8.2 or higher installed
- [ ] Required PHP extensions:
  - [ ] BCMath
  - [ ] Ctype
  - [ ] Fileinfo
  - [ ] JSON
  - [ ] Mbstring
  - [ ] OpenSSL
  - [ ] PDO
  - [ ] Tokenizer
  - [ ] XML
- [ ] Composer installed
- [ ] MySQL 8.0+ installed
- [ ] Redis installed (optional but recommended)
- [ ] Supervisor installed
- [ ] Nginx or Apache configured

### File Permissions
```bash
sudo chown -R www-data:www-data /path/to/contract-mvp
sudo chmod -R 755 /path/to/contract-mvp
sudo chmod -R 775 /path/to/contract-mvp/storage
sudo chmod -R 775 /path/to/contract-mvp/bootstrap/cache
```

### Web Server (Nginx)
- [ ] Nginx configuration created
- [ ] Root directory pointing to `/public`
- [ ] PHP-FPM configured
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] HTTP to HTTPS redirect enabled
- [ ] Gzip compression enabled

Example Nginx config:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    root /path/to/contract-mvp/public;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

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

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Deployment Steps

### 1. Clone Repository
```bash
cd /var/www
git clone <repository-url> contract-mvp
cd contract-mvp
```

### 2. Install Dependencies
```bash
composer install --no-dev --optimize-autoloader
npm install --production
```

### 3. Build Assets
```bash
npm run build
```

### 4. Configure Environment
```bash
cp .env.example .env
nano .env  # Edit with production values
php artisan key:generate
```

### 5. Database Setup
```bash
php artisan migrate --force
php artisan db:seed --force
```

### 6. Optimize Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### 7. Storage Link
```bash
php artisan storage:link
```

## Background Services

### Queue Worker (Supervisor)

Create `/etc/supervisor/conf.d/contract-manager-worker.conf`:
```ini
[program:contract-manager-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/contract-mvp/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/contract-manager/worker.log
stopwaitsecs=3600
```

```bash
sudo mkdir -p /var/log/contract-manager
sudo chown www-data:www-data /var/log/contract-manager
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start contract-manager-worker:*
```

### Scheduler (Cron)

Add to www-data crontab:
```bash
sudo crontab -u www-data -e
```

Add line:
```
* * * * * cd /var/www/contract-mvp && php artisan schedule:run >> /dev/null 2>&1
```

## Post-Deployment

### Testing
- [ ] Login as superadmin works
- [ ] Create company works
- [ ] User receives email with credentials
- [ ] Login as company user works
- [ ] Force password change works
- [ ] Create contract works
- [ ] File upload works (to B2)
- [ ] File download works
- [ ] Create reminder works
- [ ] Queue worker processing reminders
- [ ] Email notifications sent
- [ ] In-app notifications appear
- [ ] Mark reminder as handled works
- [ ] Dashboard stats display correctly
- [ ] Filters and pagination work
- [ ] Multi-tenancy isolation verified

### Monitoring Setup
- [ ] Error logging configured
- [ ] Application monitoring (New Relic, Datadog)
- [ ] Uptime monitoring (Pingdom, UptimeRobot)
- [ ] Log aggregation (Papertrail, Loggly)
- [ ] Exception tracking (Sentry, Bugsnag)
- [ ] Queue monitoring dashboard
- [ ] Database performance monitoring

### Backup Strategy
- [ ] Daily database backups configured
- [ ] Backup retention policy set (30 days)
- [ ] Backup restoration tested
- [ ] File storage backups (B2 versioning enabled)
- [ ] Configuration backups (.env, etc.)
- [ ] Backup monitoring alerts

### Security Hardening
- [ ] Firewall configured (UFW or iptables)
- [ ] SSH key-only authentication
- [ ] Fail2ban installed and configured
- [ ] Security updates enabled
- [ ] File permissions locked down
- [ ] Database user permissions minimal
- [ ] Redis password protected (if used)
- [ ] CORS configured if needed

## Performance Optimization

### Caching
- [ ] Redis installed and configured
- [ ] Config cached (`php artisan config:cache`)
- [ ] Routes cached (`php artisan route:cache`)
- [ ] Views cached (`php artisan view:cache`)
- [ ] OPcache enabled
- [ ] Query caching configured

### Database
- [ ] All indexes created
- [ ] Query optimization verified
- [ ] Slow query log enabled
- [ ] Connection pooling configured
- [ ] Read replicas (if needed)

### Frontend
- [ ] Assets built for production (`npm run build`)
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] CDN configured (optional)

## Maintenance

### Regular Tasks
- [ ] Weekly: Review logs for errors
- [ ] Weekly: Check queue status
- [ ] Weekly: Verify backups
- [ ] Monthly: Security updates
- [ ] Monthly: Performance review
- [ ] Quarterly: Dependency updates

### Monitoring Alerts
- [ ] Alert on queue failures
- [ ] Alert on high error rates
- [ ] Alert on disk space low
- [ ] Alert on database slow queries
- [ ] Alert on failed reminders
- [ ] Alert on email delivery failures

## Rollback Plan

### If Deployment Fails
1. Keep previous version in `/var/www/contract-mvp-previous`
2. Symlink `/var/www/contract-mvp` to active version
3. Database migrations are reversible:
   ```bash
   php artisan migrate:rollback --step=1
   ```
4. Queue workers automatically pick up old code
5. Cache can be cleared without downtime

## Documentation

- [ ] Production URLs documented
- [ ] Superadmin credentials stored securely
- [ ] Backup procedures documented
- [ ] Rollback procedures documented
- [ ] Emergency contacts listed
- [ ] Monitoring dashboards shared with team
- [ ] Runbook created for common issues

## Support Contacts

- Database Admin: [contact]
- Server Admin: [contact]
- On-Call Developer: [contact]
- Email Service: [Backblaze support]
- Hosting Provider: [support]

## Post-Launch

### Week 1
- [ ] Monitor error logs daily
- [ ] Check queue processing hourly
- [ ] Verify email delivery
- [ ] Monitor performance metrics
- [ ] Collect user feedback

### Week 2-4
- [ ] Review analytics
- [ ] Optimize slow queries
- [ ] Address user-reported issues
- [ ] Plan feature enhancements
- [ ] Scale resources if needed

---

## Quick Deployment Commands

```bash
# Pull latest code
git pull origin main

# Install/update dependencies
composer install --no-dev --optimize-autoloader
npm ci --production

# Build assets
npm run build

# Run migrations (if any)
php artisan migrate --force

# Clear and cache
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
sudo supervisorctl restart contract-manager-worker:*
sudo systemctl reload nginx
```

## Health Check Endpoint

Add to routes:
```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'database' => DB::connection()->getDatabaseName(),
        'queue' => Queue::size(),
    ]);
});
```

---

**Last Updated**: [Date]
**Deployment Version**: [Version]
**Deployed By**: [Name]
