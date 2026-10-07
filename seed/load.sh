#!/usr/bin/env bash
#
# Ejecuta el bulk load de los .csv seed en la base de datos mi_base.
# Uso: ./seed/load.sh
# Requiere credenciales por variable de entorno o usa las del compose.yaml por defecto.
#
set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-mi_base}"
DB_USER="${DB_USER:-imdf}"
DB_PASS="${DB_PASS:-1234}"

cd "$(dirname "$0")/.."

echo "Cargando datos en ${DB_NAME} (${DB_HOST}:${DB_PORT}) como ${DB_USER}..."

MYSQL_PWD="$DB_PASS" mariadb \
  -h "$DB_HOST" \
  -P "$DB_PORT" \
  -u "$DB_USER" \
  --local-infile=1 \
  "$DB_NAME" < "seed/load_data.sql"

echo "Bulk load finalizado correctamente."
