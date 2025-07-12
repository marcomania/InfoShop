#!/bin/bash

# Entrar al directorio del proyecto
cd /var/www/html

echo "🔁 Esperando a que la base de datos esté lista..."

# Espera a que MySQL esté disponible (puerto 3306)
until mysqladmin ping -h db -P 3306 -u "$DB_USERNAME" -p"$DB_PASSWORD" --silent; do
  sleep 1
done

echo "✅ Base de datos disponible."

# Generar APP_KEY si no existe
if ! grep -q '^APP_KEY=' .env || grep -q '^APP_KEY=$' .env; then
  echo "🔑 Generando APP_KEY..."
  php artisan key:generate
else
  echo "✔️ APP_KEY ya está configurada."
fi

# Ejecutar migraciones y seeders
echo "📦 Ejecutando migraciones y seeders..."
php artisan migrate --seed || echo "❌ Falló migrate --seed"

# Ejecutar el comando final (php-fpm)
exec "$@"
