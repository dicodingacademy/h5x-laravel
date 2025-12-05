FROM dunglas/frankenphp

# Install PHP extensions
RUN install-php-extensions \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    pdo_mysql \
    pdo_pgsql \
    opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js (for building assets)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

# Allow superuser for composer
ENV COMPOSER_ALLOW_SUPERUSER=1

# Expose port 8000 (standard Laravel) or 80 (standard HTTP)
# FrankenPHP default is 80 and 443
EXPOSE 80
