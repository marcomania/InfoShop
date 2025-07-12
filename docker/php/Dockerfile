# Etapa 1: base PHP con FPM
FROM php:8.2-fpm-alpine

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Instalar dependencias necesarias
RUN apk add --no-cache \
    bash \
    curl \
    mysql-client \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        zip \
        mbstring

# Copiar Composer desde imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar todos los archivos del proyecto
COPY . .

# Dar permisos correctos
RUN chown -R www-data:www-data /var/www/html

# Copiar el entrypoint al contenedor
COPY ./docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Establecer el ENTRYPOINT personalizado
ENTRYPOINT ["entrypoint.sh"]

# Comando por defecto
CMD ["php-fpm"]

EXPOSE 9000
