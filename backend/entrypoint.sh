#!/bin/bash
set -e

echo "Clearing stale bootstrap cache..."
php artisan optimize:clear 2>/dev/null || rm -f bootstrap/cache/packages.php bootstrap/cache/services.php

echo "Waiting for PostgreSQL to start..."
# Simple wait loop using PHP to check connection
until php -r "try { new PDO('pgsql:host=db;port=5432;dbname=laravel', 'sail', 'password'); exit(0); } catch (PDOException \$e) { exit(1); }" > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - running migrations..."
php artisan migrate --force

echo "Seeding database..."
# Allow seeding to fail (e.g., if data already exists) without stopping container
php artisan db:seed --force || true

echo "Starting Laravel server..."
exec php artisan serve --host=0.0.0.0 --port=8000
