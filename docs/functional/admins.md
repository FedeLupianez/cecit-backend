# Módulo Administradores de Negocios (PartnersAdmins)

## Objetivo:
Gestionar la relación entre los administradores y los negocios (partners) a los que pertenecen. Un administrador de negocio tiene permisos para gestionar beneficios y datos de su negocio asociado.

## Actores:
- Administradores de CeCIT (gestionan la relación)
- Administradores de negocios (gestionan su negocio)

---

## Endpoints

### `POST /partners-admins/create`
Crea una relación administrador-negocio.
- **Auth:** JWT + `AdminGuard`
- **Body:** `PartnersAdminsCreateDTO` (`partner_name`, `email`, `password`)
- **Respuesta:** `201 { id_account, id_partner }`

**Nota:** `email` y `password` se reciben pero **se descartan**. El servicio
genera un `id_account` nuevo y solo escribe la fila de `Partners_Admins`; no
crea ni modifica una cuenta en `Accounts`. Para dar de alta una cuenta real
existe `POST /auth/register`, que además crea la relación automáticamente si el
socio es dueño del negocio.

### `GET /partners-admins/me`
Devuelve el primer negocio que administra el usuario autenticado.
- **Auth:** JWT
- **Respuesta:** `{ id_partner, name, logo, id_owner, active, directions[] }`
- **Errores:** `401` si no hay `request.user`, `404 Admin does not exists` si
  la relación no existe, `401 Partner not found` si el partner referenciado
  falta.

### `GET /partners-admins/me/all`
Devuelve **todos** los negocios que administra el usuario autenticado. Es lo que
permite el panel multi-negocio.
- **Auth:** JWT
- **Respuesta:** `[{ id_partner, name, logo, id_owner, active, directions[] }]`
- **Errores:** `401` si no hay `request.user`.

El `id_partner` seleccionado por el frontend se luego pasa a
`GET /benefits/partner`, `GET /vouchers/redeemed`, etc., donde `AdminGuard`
verifica que el usuario realmente administra ese negocio.

---

## DTOs

### `PartnersAdminsCreateDTO`
| Campo | Tipo | Validación | Descripción |
|-------|------|------------|-------------|
| `partner_name` | string | Obligatorio | Nombre del negocio (se busca en `Partners`) |
| `email` | string | Obligatorio, email | **Ignorado** |
| `password` | string | Obligatorio | **Ignorado** |

**Nota:** Al crear un partner via `POST /partners`, automáticamente se crea el
admin de ese partner con los mismos datos. Al registrarse un socio que ya es
dueño de un partner, también se crea la relación.

---

## Entidad `Partners_Admins`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_account` | VARCHAR(4) PK | ID de la cuenta administradora (FK → `Accounts`) |
| `id_partner` | VARCHAR(4) PK | ID del negocio (FK → `Partners`) |

Es una entidad propia (no un `@ManyToMany`) porque la fila se consulta de forma
independiente para resolver `/me` y `/me/all`.

Cambio reciente: ambas columnas se renombraron de `id_user` a `id_account`, y
la FK pasó a apuntar a `Accounts.id_account` en lugar de `Users.id_user`. Ver
[`tecnical/future.md`](../tecnical/future.md) — esta parte de la migración no
está cubierta por las migraciones.

---

## Servicio `PartnersAdminsService`

| Método | Descripción |
|--------|-------------|
| `create(dto)` | Resuelve el partner por nombre y genera un `id_account` nuevo. |
| `createByOwner(id_account, id_partner)` | Crea la relación dueño ↔ negocio. **Idempotente**: si ya existe, la devuelve sin error. |
| `get_by_id(id_admin)` | Relación con `partner`, `partner.directions` y `account`. `404` si no existe. |
| `get_all_by_account(id_account)` | Todas las relaciones del usuario, para el panel multi-negocio. |
| `verify_admin(id_admin, id_partner)` | Verificación de autorización **con cache** (60 s). Lanza `401` si la cuenta no existe, si es `USER`, o si no hay relación con ese partner. `CECIT_ADMIN` siempre pasa. |

## Tabla en DB

- `Partners_Admins`

## Dependencias
- `PartnersService` — para obtener partner por nombre
- `AccountsService` — para resolver el rol antes de autorizar
- `cache-manager` (`CACHE_MANAGER`) — cache de `verify_admin`
- `src/common/utils/id-generator.ts` — generación de IDs (reemplaza a `DbService`)
