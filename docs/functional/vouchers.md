# Módulo Vouchers (Beneficios Canjeados)

## Objetivo:
Gestionar los vouchers generados cuando un socio canjea un beneficio. Cada voucher representa un cupón canjeado por un usuario para un beneficio específico, con seguimiento de estado y generación de PDF.

## Actores:
- Usuarios (socios de CeCIT) — crean y consultan sus vouchers
- Administradores de CeCIT — consultan todos los vouchers

---

## Endpoints

### `GET /vouchers/all`
Obtiene todos los vouchers del sistema.
- **Auth:** No requiere

### `GET /vouchers/byuser?id_user=xxx`
Obtiene los vouchers de un usuario específico.
- **Auth:** No requiere

### `GET /vouchers/bybenefit?id_benefit=xxx`
Obtiene los vouchers de un beneficio específico.
- **Auth:** No requiere

### `GET /vouchers/bytoken?token=xxx`
Obtiene un voucher por su token único.
- **Auth:** No requiere

### `GET /vouchers/bystatus?status=xxx`
Obtiene vouchers filtrados por estado (`PENDING`, `DELIVERED`, `EXPIRED`).
- **Auth:** No requiere

### `POST /vouchers/create`
Crea un nuevo voucher (canjea un beneficio).
- **Auth:** JWT
- **Body:** `VouchersCreateDTO` (`id_user`, `id_benefit`)
- **Proceso:**
  1. Verifica que el beneficio exista
  2. Incrementa el contador de cupones del beneficio
  3. Si se alcanzó el máximo de cupones, rechaza la operación
  4. Genera un token único y crea el voucher

### `DELETE /vouchers`
Elimina un voucher.
- **Auth:** No requiere
- **Body:** `VouchersDeleteDTO` (`token`, `id_user`)

### `GET /vouchers/file?token=xxx`
Genera y descarga un archivo PDF del voucher.
- **Auth:** JWT
- **Respuesta:** PDF (Content-Type: application/pdf)

---

## Estados del Voucher

| Estado | Descripción |
|--------|-------------|
| `PENDING` | Voucher pendiente de entrega |
| `DELIVERED` | Voucher entregado al usuario |
| `EXPIRED` | Voucher expirado |

---

## DTOs

### `VouchersCreateDTO`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_user` | string | ID del usuario que canjea |
| `id_benefit` | string | ID del beneficio a canjear |

### `VouchersDeleteDTO`
| Campo | Tipo |
|-------|------|
| `token` | string |
| `id_user` | string |

---

## Entidad `Vouchers`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `token` | VARCHAR(6) PK | Token único del voucher |
| `id_user` | VARCHAR(4) FK → Users | Usuario que canjeó |
| `id_benefit` | VARCHAR(4) FK → Benefits | Beneficio canjeado |
| `application_date` | DATE | Fecha de solicitud (se setea automáticamente) |
| `delivery_date` | DATE | Fecha de entrega |
| `status` | ENUM(`PENDING`, `DELIVERED`, `EXPIRED`) | Estado actual |

---

## Servicio `VouchersService`

| Método | Descripción |
|--------|-------------|
| `get_all()` | Obtiene todos los vouchers |
| `get_by_user(id_user)` | Vouchers por usuario |
| `get_by_benefit(id_benefit)` | Vouchers por beneficio |
| `get_by_token(token)` | Voucher por token |
| `get_by_status(status)` | Vouchers por estado |
| `create(dto)` | Crea un voucher (incrementa cupón del beneficio) |
| `delete(dto)` | Elimina un voucher |
| `gen_file(token)` | Genera PDF del voucher |

---

## Generación de PDF

El voucher se exporta como PDF (formato A6) usando Puppeteer. El PDF incluye:
- **Header:** Logo de CeCIT
- **Body:** Token del voucher
- **Footer:** Logos de "Paseo Libertador y Paseo del Centro" + "CAME y FEDECOM"

## Tablas en DB

- `Vouchers`

## Dependencias
- `DbService` — generación de tokens únicos vía función SQL `get_new_token()`
- `PdfService` — generación de PDFs con Puppeteer
- `BenefitsEntity` — validación de existencia y control de cupones máximos
