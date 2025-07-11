# Usar una imagen oficial de PHP 8.2 con FPM
FROM php:8.2-fpm-alpine

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Instalar dependencias del sistema y extensiones de PHP
RUN apk add --no-cache \
    build-base \
    nginx \
    supervisor \
    curl \
    libzip-dev \
    zip \
    postgresql-dev # Dependencia para pgsql

# Instalar extensiones de PHP
RUN docker-php-ext-install pdo pdo_pgsql pgsql zip

# Instalar Composer (Gestor de dependencias de PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar el código de la aplicación
COPY . /var/www/html

# Cambiar el propietario de los archivos para que sea el usuario de Nginx
RUN chown -R www-data:www-data /var/www/html

# Exponer el puerto 9000 para PHP-FPM
EXPOSE 9000

# Comando para iniciar PHP-FPM
CMD ["php-fpm"]
