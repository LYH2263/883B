FROM php:8.4-fpm

WORKDIR /var/www/html

# System deps
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer config -g repo.packagist composer https://php.cnpkg.org

# Copy project files
COPY . .

# Install PHP dependencies
RUN rm -f bootstrap/cache/packages.php bootstrap/cache/services.php
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

# Optional: Laravel 优化
RUN php artisan optimize || true

# Entrypoint
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["entrypoint.sh"]
