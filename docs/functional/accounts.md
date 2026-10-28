# Módulo Accounts

## Objetivo:
Gestionar las cuentas de acceso al sistema, vinculadas a usuarios (socios de CeCIT). Cada cuenta tiene un rol que determina los permisos dentro del sistema.

## Actores:
- Socios de CeCIT (rol `USER`)
- Administradores de CeCIT (rol `CECIT_ADMIN`)
- Administradores de negocios (rol `PARTNER_ADMIN`)

---

## Endpoints

### `GET /accounts/all`
Lista todas las cuentas del sistema.
- **Auth:** JWT + `CecitAdminGuard`
- **Respuesta:** `AccountsDTO[]`

### `PATCH /accounts/role`
Cambia el rol de una cuenta.
- **Auth:** JWT + `AdminGuard`
- **Body:** `UpdateRoleDTO` (`id_account`, `newRole`, `id_partner?`)

| `newRole` | Comportamiento |
|-----------|----------------|
| `PARTNER_ADMIN` | `id_partner` es obligatorio. Crea la fila en `Partners_Admins` si no existe y actualiza el rol. Es la forma de promover un empleado a administrador del negocio. |
| `USER` | Baja el rol a `USER` solo si la cuenta administra **a lo sumo un** negocio. Si administra varios, el rol se conserva para que no pierda el acceso a los demás. |

**Restricción:** no se puede cambiar el rol del dueño de un partner
(`400 User is the owner`). La comprobación se limita al `id_partner` enviado en
el body: no protege contra degradar al dueño desde otro negocio. Para
reemplazarlo hay que dar de baja el negocio primero.

### Edición propia de la cuenta
El usuario cambia su email o su contraseña mediante
`PATCH /auth/update` y `PATCH /auth/update-profile-admin`. El detalle está en
[`auth.md`](./auth.md). `AccountsService.update()` no está expuesto
directamente.

---

## Roles

| Rol | Descripción |
|-----|-------------|
| `USER` | Socio de CeCIT, puede canjear beneficios |
| `CECIT_ADMIN` | Administrador del sistema CeCIT |
| `PARTNER_ADMIN` | Administrador de uno o varios negocios asociados |

> Un **empleado** no es un rol: es un socio vinculado a un negocio mediante la
> tabla `Employees`. Su cuenta permanece en `USER` hasta que un administrador
> lo promueva con `PATCH /accounts/role`.

---

## DTOs

### `AccountCreateDTO`
| Campo | Tipo | Validación |
|-------|------|------------|
| `id_account` | string | Obligatorio |
| `email` | string | Obligatorio, email válido |
| `password` | string | Obligatorio |
| `role` | `AccountRole` | Aceptado pero **ignorado**: el rol lo determina el registro |

### `LoginDTO`
| Campo | Tipo | Validación |
|-------|------|------------|
| `email` | string | Obligatorio, email válido |
| `password` | string | Obligatorio |

### `UpdateRoleDTO`
| Campo | Tipo | Validación | Descripción |
|-------|------|------------|-------------|
| `id_account` | string | Obligatorio, string | Cuenta a modificar |
| `newRole` | `AccountRole` | Obligatorio, enum | Rol destino |
| `id_partner` | string | Opcional, string | Obligatorio en la práctica si `newRole` es `PARTNER_ADMIN` |

### `AccountsDTO` (respuesta)
| Campo | Tipo | Origen |
|-------|------|--------|
| `id_account` | string | `Accounts.id_account` |
| `email` | string \| null | `Accounts.email` |
| `role` | `AccountRole` | `Accounts.role` |
| `active` | boolean | `Accounts.active` |
| `name` | string | `Users.name` (join) |
| `lastname` | string | `Users.lastname` (join) |
| `dni` | string | `Users.dni` (join) |

---

## Entidad `Accounts`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_account` | VARCHAR(4) PK | ID de la cuenta, FK → `Users.id_user` |
| `email` | VARCHAR(50) UNIQUE, INDEX | Email de la cuenta |
| `password` | VARCHAR(255) NULL | Password hasheada con argon2 |
| `role` | ENUM(`USER`, `CECIT_ADMIN`, `PARTNER_ADMIN`) INDEX | Rol del usuario (default: `USER`) |
| `active` | BOOLEAN | Cuenta activa (default: true) |

Cambios recientes:
- La PK se renombró de `id_user` a `id_account`. La columna `last_activity`
  se eliminó de la entidad (**pero sigue existiendo en la base**, ver
  [`tecnical/future.md`](../tecnical/future.md)).
- `email` y `password` pasaron a ser nullable.
- Se agregaron los métodos `change_psswd()` (hash argon2) y `change_email()`.

---

## Servicio `AccountsService`

| Método | Descripción |
|--------|-------------|
| `create(dto)` | Crea una cuenta. El hash lo aplica `@BeforeInsert`. |
| `get_by_email(email)` | Busca por email. `400` si está vacío o no es válido, `404` si no existe. |
| `get_by_id(id_account)` | Busca por `id_account`. `400` si está vacío, `404` si no existe. |
| `has_account(email)` | `true` si ya existe una cuenta con ese email. |
| `get_all()` | Todas las cuentas, ordenadas por `id_account`, con el join a `Users`. |
| `update(dto)` | Actualiza email (normalizado a minúsculas, con validación de unicidad), password o `active`. |
| `deactivate(id_account)` | Baja lógica: `Accounts.active = false`. Devuelve `false` si la cuenta no existe, `true` si quedó (o ya estaba) inactiva. No borra la fila. |
| `changeRole(user)` | Lógica del `PATCH /accounts/role` (ver arriba). |
| `verify_admin(id_admin, id_partner)` | Verificación de admin de partner **sin cache** (usada por `AdminGuard` para evitar dependencia circular con `PartnersAdminsService`). |
| `get_all_by_account(id_account)` | Relaciones `Partners_Admins` de la cuenta. |

## Tabla en DB

- `Accounts`
- `Partners_Admins` (leída para resolver roles y admins de partner)

## Dependencias
- `argon2` — hasheo automático de contraseñas vía `@BeforeInsert`
- `TypeORM` — repositorio de entidad
- `PartnersAdminsEntity` — registro para resolver la relación admin ↔ partner
- `AdminGuard` — provider registrado en el módulo para evitar dependencia circular
