# Módulo Negocios Asociados (Partners)

## Objetivo:
Gestionar los negocios asociados a CeCIT que ofrecen beneficios a los socios. Permite crear, consultar, actualizar y eliminar negocios, así como gestionar sus direcciones, sus empleados, sus administradores y sus categorías.

## Actores:
- Administradores de CeCIT (gestión completa)
- Administradores de negocios (actualización de datos de su negocio)

---

## Endpoints

### `GET /partners/all`
Obtiene todos los negocios.
- **Auth:** No requiere
- **Respuesta:** `PartnersDTO[]` = `[{ id_partner, name, logo, directions[], active }]`, ordenado por `name`
- **Cambio:** antes devolvía solo `{ name, logo }`.

### `POST /partners`
Crea un nuevo negocio, sus direcciones iniciales y el registro de su administrador.
- **Auth:** No requiere
- **Body:** `PartnersCreateDTO` (`partner_name`, `email`, `password`, `logo`, `directions[]`)
- **Respuesta:** `201` con la entidad `Partners` cruda
- **Efectos:** crea el partner, sus direcciones (`directions[]`) y la relación en
  `Partners_Admins` usando el `email` y `password` recibidos.
- **Nota:** el partner se crea **sin `id_owner`**, por lo que el registro de
  admin generado no corresponde a ninguna cuenta real de `Accounts`.

### `DELETE /partners/id/:id`
Elimina un negocio por ID.
- **Auth:** JWT + `CecitAdminGuard`
- **Cambio:** la ruta pasó de `DELETE /partners/:id` (sin guard) a
  `DELETE /partners/id/:id` **protegida**, para no chocar con otras rutas de
  `partners`.

### `PATCH /partners/logo`
Actualiza el logo de un negocio.
- **Auth:** JWT + `AdminGuard`
- **Body:** `PartnersUpdateLogoDTO` (`id_partner`, `new_logo`)
- **Respuesta:** `200 PartnersDTO`

### `PATCH /partners/name`
Actualiza el nombre de un negocio.
- **Auth:** JWT + `AdminGuard`
- **Body:** `PartnersUpdateNameDTO` (`id_partner`, `new_name`)
- **Respuesta:** `200 PartnersDTO`

### Ubicaciones
Un negocio puede tener **múltiples direcciones** (tabla `Directions`).

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /partners/locations?id_partner=` | JWT + `AdminGuard` | Lista las direcciones |
| `POST /partners/locations` | JWT + `AdminGuard` | Agrega una dirección |

`POST /partners/locations` recibe `{ id_partner, direction }` y devuelve `200 true`.
Los endpoints CRUD de bajo nivel están en `/directions` (ver
[`tecnical/directions.md`](../tecnical/directions.md)).

### Empleados
Los empleados son socios de CeCIT (filas de `Users`) vinculados al negocio
mediante la tabla `Employees`. **No son un rol**: su cuenta sigue en `USER`.

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /partners/employees?id_partner=` | JWT + `AdminGuard` | Lista empleados con `email`, `role` y `active` |
| `POST /partners/employees` | JWT + `AdminGuard` | Vincula un socio existente por `{ id_partner, dni }` |
| `DELETE /partners/employees?id_partner=&dni=` | JWT + `AdminGuard` | Desvincula, degrada a `USER` y da de baja la cuenta si no trabaja en ningún otro negocio |

- `POST` **no crea usuarios**: busca el socio por DNI y falla con
  `404 User does not exists` si no está registrado. `400` si ya era empleado.
- `DELETE` **no puede quitar al dueño** del negocio
  (`400 User is owner, can not delete him`) y baja el rol de la cuenta a `USER`.
- `DELETE` **no falla si el empleado no tiene cuenta**: en ese caso se omite la
  degradación de rol y la baja de cuenta.
- Para promover un empleado a `PARTNER_ADMIN`: `PATCH /accounts/role`.

---

## Autorización de modificaciones

`PartnersService.assertPartnerAccess(callerId, id_partner)` se aplica a
`updateLogo`, `updateName`, `addLocation`, `addEmployee` y `removeEmployee`:
1. `400 Caller id is required` / `400 id is empty`.
2. Si la cuenta es `CECIT_ADMIN` → permitido.
3. Si no, `PartnersAdminsService.verify_admin()` (con cache de 60 s) →
   `401` si el usuario no administra ese negocio.

`DirectionsService` tiene una copia idéntica de esta verificación.

---

## DTOs

### `PartnersCreateDTO`
| Campo | Tipo | Validación | Descripción |
|-------|------|------------|-------------|
| `partner_name` | string | Obligatorio | Nombre del negocio (se guarda en minúsculas) |
| `email` | string | Obligatorio, email | Email del admin |
| `password` | string | Obligatorio | Password del admin |
| `logo` | string | Obligatorio, URL | URL del logo |
| `directions` | string[] | Cada elemento string | Direcciones iniciales. Reemplaza al campo singular `direction` |

### `PartnersUpdateLogoDTO`
| Campo | Tipo | Validación |
|-------|------|------------|
| `id_partner` | string | Obligatorio |
| `new_logo` | string (URL) | Obligatorio, URL |

### `PartnersUpdateNameDTO`
| Campo | Tipo | Validación |
|-------|------|------------|
| `id_partner` | string | Obligatorio |
| `new_name` | string | Obligatorio, string |

### `AddLocationDTO`
| Campo | Tipo | Validación |
|-------|------|------------|
| `id_partner` | string | Obligatorio |
| `direction` | string | Obligatorio, string |

### `AddEmployeeDTO`
| Campo | Tipo | Validación |
|-------|------|------------|
| `id_partner` | string | Obligatorio, string |
| `dni` | string | Obligatorio, string |

---

## Entidad `Partners`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_partner` | VARCHAR(4) PK | ID del negocio |
| `name` | VARCHAR(50) | Nombre del negocio |
| `logo` | VARCHAR(2048) | URL del logo (era 255) |
| `id_owner` | VARCHAR(4) FK → Users | Dueño del negocio |
| `active` | BOOLEAN | Activo (default: true) |

La columna `direction` fue **eliminada**: ahora hay una relación 1:N con
`Directions`. La columna sigue presente en la base de datos (ver
[`tecnical/future.md`](../tecnical/future.md)).

Relaciones:
- `owner` → `UsersEntity` (OneToOne)
- `categories` → `CategoriesEntity` (ManyToMany, tabla `Partners_Categories`) — **nuevo**
- `directions` → `Directions` (OneToMany) — **nuevo**
- `employees` → `UsersEntity` (ManyToMany, tabla `Employees`) — **nuevo**

---

## Servicio `PartnersService`

| Método | Descripción |
|--------|-------------|
| `get_all()` | Todos los partners con `directions`, ordenados por nombre. |
| `create(dto)` | Crea el partner (nombre en minúsculas) y sus direcciones iniciales. |
| `remove(id)` | Elimina un partner por ID. |
| `get_by_id(id_partner)` | `404 Partner not found`. |
| `get_by_id_with_categories(id_partner)` | Partner con la relación `categories` cargada. **Nuevo.** |
| `get_by_name(name)` | Partner por nombre, mapeado a `PartnersDTO`. |
| `updateLogo(dto, callerId)` | Actualiza el logo. |
| `updateName(dto, callerId)` | Actualiza el nombre (minúsculas). |
| `getByOwnerId(id_owner)` | Partner cuyo dueño es el socio dado, o `null`. |
| `getLocations(id_partner)` | Direcciones del negocio. **Nuevo.** |
| `addLocation(dto, callerId)` | Agrega una dirección. **Nuevo.** |
| `getEmployees(id_partner)` | Empleados con `email` y `role` resueltos en batch. **Nuevo.** |
| `addEmployee(callerId, dto)` | Vincula un socio existente por DNI. **Nuevo.** |
| `removeEmployee(id_partner, callerId, dni)` | Desvincula y degrada a `USER`. **Nuevo.** |

## Tablas en DB

- `Partners`
- `Directions` (relación con direcciones)
- `Employees` (relación con empleados)
- `Partners_Admins` (relación con administradores)
- `Partners_Categories` (relación con categorías)

## Dependencias
- `DirectionsService` — alta masiva de direcciones al crear el partner
- `UsersService` — búsqueda de socios por DNI
- `AccountsService` / `PartnersAdminsService` — verificación de acceso
- `src/common/utils/id-generator.ts` — generación de IDs (reemplaza a `DbService`)
- `AdminGuard` — provider local para evitar dependencia circular
