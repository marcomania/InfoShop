#!/bin/bash

# Asegúrate de estar en el directorio del proyecto
cd /var/www/html

echo "Esperando a que la base de datos esté lista..."
# Espera hasta que Postgres esté disponible
until pg_isready -h db -p 5432 -U "$DB_USERNAME" > /dev/null 2>&1; do
  sleep 1
done

# Generar APP_KEY solo si no existe
if ! grep -q '^APP_KEY=' .env || grep -q '^APP_KEY=$' .env; then
  echo "Generando APP_KEY..."
  php artisan key:generate
else
  echo "APP_KEY ya está configurada."
fi

# Ejecutar migraciones y seeders
echo "Ejecutando migraciones y seeders..."
php artisan migrate --seed || echo "❌ Falló migrate --seed"

# Iniciar PHP-FPM
exec "$@"
