# Módulo Negocios Asociados (Partners)

## Objetivo:
Gestionar los negocios asociados a CeCIT que ofrecen beneficios a los socios. Permite crear, consultar, actualizar y eliminar negocios, así como gestionar sus administradores y categorías.

## Actores:
- Administradores de CeCIT (gestión completa)
- Administradores de negocios (actualización de datos)

---

## Endpoints

### `GET /partners/all`
Obtiene todos los negocios (solo nombre y logo).
- **Auth:** No requiere
- **Respuesta:** `[{ name, logo }]`

### `POST /partners`
Crea un nuevo negocio y automáticamente crea su administrador asociado.
- **Auth:** No requiere
- **Body:** `PartnersCreateDTO`
- **Respuesta:** Datos del partner creado

### `DELETE /partners/:id`
Elimina un negocio por ID.
- **Auth:** No requiere

### `PATCH /partners/logo`
Actualiza el logo de un negocio.
- **Auth:** JWT + `AdminGuard`
- **Body:** `PartnersUpdateLogoDTO`

### `PATCH /partners/name`
Actualiza el nombre de un negocio.
- **Auth:** JWT + `AdminGuard`
- **Body:** `PartnersUpdateNameDTO`

---

## DTOs

### `PartnersCreateDTO`
| Campo | Tipo | Validación | Descripción |
|-------|------|------------|-------------|
| `partner_name` | string | Obligatorio | Nombre del negocio |
| `email` | string | Obligatorio, email | Email del admin |
| `password` | string | Obligatorio | Password del admin |
| `logo` | string | Obligatorio, URL | URL del logo |
| `direction` | string | — | Dirección del negocio |

### `PartnersUpdateLogoDTO`
| Campo | Tipo |
|-------|------|
| `id_partner` | string |
| `new_logo` | string (URL) |

### `PartnersUpdateNameDTO`
| Campo | Tipo |
|-------|------|
| `id_partner` | string |
| `new_name` | string |

---

## Entidad `Partners`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_partner` | VARCHAR(4) PK | ID del negocio |
| `name` | VARCHAR(50) | Nombre del negocio |
| `logo` | VARCHAR(255) | URL del logo |
| `direction` | VARCHAR(255) | Dirección |
| `id_owner` | VARCHAR(4) FK → Users | Dueño del negocio |
| `active` | BOOLEAN | Activo (default: true) |

Relaciones:
- `owner` → `UsersEntity` (OneToOne)
- `categories` → `PartnersCategoriesEntity` (OneToMany)

---

## Servicio `PartnersService`

| Método | Descripción |
|--------|-------------|
| `get_all()` | Obtiene todos los partners (nombre + logo) |
| `create(dto)` | Crea un nuevo partner (genera ID autoincremental) |
| `remove(id)` | Elimina un partner por ID |
| `get_by_id(id)` | Obtiene un partner por ID |
| `get_by_name(name)` | Obtiene un partner por nombre |
| `updateLogo(dto)` | Actualiza el logo |
| `updateName(dto)` | Actualiza el nombre |

## Tablas en DB

- `Partners`
- `Partners_Admins` (relación con administradores)
- `Partners_Categories` (relación con categorías)

## Dependencias
- `DbService` — generación de IDs secuenciales
- `PartnersAdminsService` — creación automática de admin al crear partner
