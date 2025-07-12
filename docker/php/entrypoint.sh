#!/bin/sh

echo "⏳ Esperando a que la base de datos MySQL esté disponible..."

while ! nc -z db 3306; do
  sleep 1
done

echo "✅ Base de datos disponible."

cd /var/www/html

if ! grep -q '^APP_KEY=' .env || grep -q '^APP_KEY=$' .env; then
  echo "🔑 Generando APP_KEY..."
  php artisan key:generate
else
  echo "✔️ APP_KEY ya está configurada."
fi

echo "📦 Ejecutando migraciones y seeders..."
php artisan migrate --seed || echo "❌ Falló migrate --seed"

exec "$@"
