# Módulo Beneficios

## Objetivo:
Gestionar los beneficios publicados por los negocios asociados a CeCIT. Incluye la creación, consulta y eliminación de beneficios, así como la gestión de tipos de beneficio, categorías y métodos de pago asociados.

## Actores:
- Administradores de CeCIT (crean/eliminan beneficios y tipos)
- Usuarios (consultan beneficios disponibles)

---

## Endpoints — Benefits

### `GET /benefits/all`
Obtiene todos los beneficios activos con información completa (partner, tipo, categorías, métodos de pago).
- **Auth:** No requiere

### `GET /benefits/popular`
Obtiene los 20 beneficios más populares (ordenados por cupones canjeados).
- **Auth:** No requiere

### `GET /benefits/news`
Obtiene los 20 beneficios más recientes (ordenados por fecha de ingreso).
- **Auth:** No requiere

### `POST /benefits`
Crea un nuevo beneficio.
- **Auth:** JWT + `CecitAdminGuard`
- **Body:** `BenefitsCreateDTO`

### `DELETE /benefits`
Elimina un beneficio por ID.
- **Auth:** JWT + `CecitAdminGuard`
- **Body:** `BenefitsDeleteDTO`

---

## Endpoints — Benefit Types

### `GET /benefit-types/all`
Obtiene todos los tipos de beneficio disponibles.
- **Auth:** No requiere

### `POST /benefit-types`
Crea un nuevo tipo de beneficio.
- **Auth:** JWT + `CecitAdminGuard`

### `DELETE /benefit-types`
Elimina un tipo de beneficio.
- **Auth:** JWT + `CecitAdminGuard`

---

## Endpoints — Categorías

### `GET /categories/all`
Obtiene todas las categorías.
- **Auth:** No requiere

### `POST /categories/create`
Crea una nueva categoría.
- **Auth:** JWT + `CecitAdminGuard`

---

## Endpoints — Métodos de Pago

### `GET /payment-methods/all`
Obtiene los métodos de pago activos.
- **Auth:** No requiere

---

## Endpoints — Partners-Categories

### `GET /partners-categories`
Obtiene todas las relaciones partner-categoría.
- **Auth:** No requiere

### `POST /partners-categories`
Crea una relación partner-categoría.
- **Auth:** JWT + `CecitAdminGuard`

---

## Entidades

### `Benefits`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_benefit` | VARCHAR(4) PK | ID del beneficio |
| `id_admin` | VARCHAR(4) FK → Accounts | Admin que creó el beneficio |
| `id_partner` | VARCHAR(4) FK → Partners | Negocio asociado |
| `date_entered` | DATE | Fecha de creación |
| `start_date` | DATE | Fecha de inicio del beneficio |
| `end_date` | DATE | Fecha de fin del beneficio |
| `image` | VARCHAR(500) | URL de la imagen |
| `title` | VARCHAR(100) | Título del beneficio |
| `description` | VARCHAR(500) | Descripción |
| `status` | ENUM(`ACTIVE`, `INACTIVE`, `PENDING`) | Estado |
| `id_type` | INT FK → BenefitTypes | Tipo de beneficio |
| `coupons` | INT | Cupones canjeados |
| `max_coupons` | INT | Cupones máximos |

### `BenefitTypes`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_type` | INT PK (autogenerado) | ID del tipo |
| `name` | VARCHAR(50) | Nombre del tipo |
| `active` | BOOLEAN | Activo (default: true) |

### `Categories`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_category` | INT PK (autogenerado) | ID de categoría |
| `name` | VARCHAR(50) | Nombre |
| `icon_url` | VARCHAR(255) | URL del ícono |
| `active` | BOOLEAN | Activo |

### `PaymentMethods`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_payment_method` | INT PK (autogenerado) | ID del método |
| `name` | VARCHAR(50) | Nombre |
| `active` | BOOLEAN | Activo |

### `Partners_Categories`
Tabla intermedia entre Partners y Categories.
| Columna | Tipo |
|---------|------|
| `id_partner` | VARCHAR(4) PK, FK → Partners |
| `id_category` | INT PK, FK → Categories |

### `PaymentMethods_Benefits`
Tabla intermedia entre PaymentMethods y Benefits.
| Columna | Tipo |
|---------|------|
| `id_payment_method` | INT PK, FK → PaymentMethods |
| `id_benefit` | VARCHAR(4) PK, FK → Benefits |

---

## DTOs

### `BenefitsCreateDTO`
| Campo | Descripción |
|-------|-------------|
| `id_admin` | ID del admin creador |
| `id_partner` | ID del negocio |
| `id_type` | ID del tipo de beneficio |
| `start_date` | Fecha de inicio |
| `end_date` | Fecha de fin |
| `image` | URL de imagen (si no se provee, se genera placeholder) |
| `title` | Título |
| `description` | Descripción |
| `coupons` | Cupones iniciales |
| `max_coupons` | Cupones máximos |

### `BenefitsReturn`
Incluye datos completos del beneficio más información del partner (nombre, logo, dirección), categorías, tipo y métodos de pago.

---

## Servicios

| Servicio | Métodos principales |
|----------|-------------------|
| `BenefitsService` | `get_all()`, `get_popular()`, `get_news()`, `create()`, `delete()` |
| `BenefitTypeService` | `get_all()`, `create()`, `delete()`, `get_by_id()` |
| `CategoriesService` | `create()`, `findAll()`, `get_by_id()` |
| `PaymentMethodsService` | `getMethods()` |

## Tablas en DB

- `Benefits`
- `BenefitTypes`
- `Categories`
- `PaymentMethods`
- `Partners_Categories`
- `PaymentMethods_Benefits`
