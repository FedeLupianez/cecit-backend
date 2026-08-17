# Módulo Administradores de Negocios (PartnersAdmins)

## Objetivo:
Gestionar la relación entre los administradores y los negocios (partners) a los que pertenecen. Un administrador de negocio tiene permisos para gestionar beneficios y datos de su negocio asociado.

## Actores:
- Administradores de CeCIT (crean la relación)
- Administradores de negocios (gestionan su negocio)

---

## Endpoints

### `POST /partners-admins/create`
Crea una relación administrador-negocio.
- **Auth:** JWT + `AdminGuard`
- **Body:** `PartnersAdminsCreateDTO`
- **Respuesta:** `{ id_admin, id_partner }`

---

## DTOs

### `PartnersAdminsCreateDTO`
| Campo | Tipo | Validación | Descripción |
|-------|------|------------|-------------|
| `partner_name` | string | Obligatorio | Nombre del negocio (se busca en `Partners`) |
| `email` | string | Obligatorio, email | Email del admin |
| `password` | string | Obligatorio | Password del admin |

**Nota:** Al crear un partner via `POST /partners`, automáticamente se crea el admin de ese partner con los mismos datos.

---

## Entidad `Partners_Admins`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_user` | VARCHAR(4) PK | ID del administrador (FK → Accounts) |
| `id_partner` | VARCHAR(4) PK | ID del negocio (FK → Partners) |

- Tabla intermedia (relación muchos a muchos entre Accounts y Partners).

---

## Servicio `PartnersAdminsService`

| Método | Descripción |
|--------|-------------|
| `create(dto)` | Crea una nueva relación admin-partner (genera ID autoincremental) |
| `get_by_id(id_admin)` | Obtiene la relación por ID del admin |

## Tabla en DB

- `Partners_Admins`

## Dependencias
- `PartnersService` — para obtener partner por nombre
- `DbService` — para generar IDs secuenciales
