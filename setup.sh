#!/bin/bash

echo "=========================================="
echo "Contract Management MVP - Setup Script"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
else
    echo "✓ .env file already exists"
fi

# Install Composer dependencies
echo ""
echo "Installing PHP dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

# Generate application key
echo ""
echo "Generating application key..."
php artisan key:generate --ansi

# Install NPM dependencies
echo ""
echo "Installing Node dependencies..."
npm install

# Create database (optional - requires manual DB creation)
echo ""
read -p "Have you created the MySQL database? (y/n): " db_created
if [ "$db_created" != "y" ]; then
    echo ""
    echo "Please create your database first:"
    echo "  mysql -u root -p"
    echo "  CREATE DATABASE contract_manager;"
    echo "  EXIT;"
    echo ""
    read -p "Press enter when done..."
fi

# Run migrations
echo ""
echo "Running database migrations..."
php artisan migrate --force

# Run seeders
echo ""
echo "Seeding database..."
php artisan db:seed --force

# Create storage link
echo ""
echo "Creating storage link..."
php artisan storage:link

# Clear and cache config
echo ""
echo "Optimizing application..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Build assets
echo ""
echo "Building frontend assets..."
npm run build

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Default Login Credentials:"
echo "  Superadmin:"
echo "    Email: admin@contractmanager.com"
echo "    Password: password"
echo ""
echo "  Demo Admin (local only):"
echo "    Email: demo@demo.com"
echo "    Password: password"
echo ""
echo "Next Steps:"
echo "  1. Update .env with your database and B2 credentials"
echo "  2. Start the application:"
echo "     Terminal 1: php artisan serve"
echo "     Terminal 2: php artisan queue:work"
echo "     Terminal 3: npm run dev (for development)"
echo ""
echo "  3. Setup cron job for reminders:"
echo "     * * * * * cd $(pwd) && php artisan schedule:run >> /dev/null 2>&1"
echo ""
echo "  4. Visit: http://localhost:8000"
echo ""
echo "For full documentation, see:"
echo "  - QUICKSTART.md"
echo "  - README_COMPLETE.md"
echo "  - IMPLEMENTATION_SUMMARY.md"
echo ""
echo "=========================================="
