# Módulo Accounts

## Objetivo:
Gestionar las cuentas de acceso al sistema, vinculadas a usuarios (socios de CeCIT). Cada account tiene un rol que determina los permisos dentro del sistema.

## Actores:
- Socios de CeCIT (rol `USER`)
- Administradores de CeCIT (rol `CECIT_ADMIN`)
- Administradores de negocios (rol `PARTNER_ADMIN`)

---

## Endpoints

### `GET /accounts`
- **Nota:** Controlador definido pero sin endpoints públicos implementados actualmente.
- La gestión de cuentas se realiza principalmente a través del módulo `Auth`.

---

## Roles

| Rol | Descripción |
|-----|-------------|
| `USER` | Socio de CeCIT, puede canjear beneficios |
| `CECIT_ADMIN` | Administrador del sistema CeCIT |
| `PARTNER_ADMIN` | Administrador de un negocio asociado, puede hacer lo mismo que un usuario|

---

## DTOs

### `AccountCreateDTO`
| Campo | Tipo | Validación |
|-------|------|------------|
| `id_user` | string | Obligatorio |
| `email` | string | Obligatorio, email válido |
| `password` | string | Obligatorio |

### `LoginDTO`
| Campo | Tipo | Validación |
|-------|------|------------|
| `email` | string | Obligatorio, email válido |
| `password` | string | Obligatorio |

---

## Entidad `Accounts`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_user` | VARCHAR(4) PK | ID del usuario (FK → Users) |
| `email` | VARCHAR(50) UNIQUE | Email de la cuenta |
| `password` | VARCHAR(255) | Password hasheada con argon2 |
| `role` | ENUM(`USER`, `CECIT_ADMIN`, `PARTNER_ADMIN`) | Rol del usuario |
| `last_activity` | TIMESTAMP | Última actividad |
| `active` | BOOLEAN | Cuenta activa (default: true) |

---

## Servicio `AccountsService`

| Método | Descripción |
|--------|-------------|
| `create(dto)` | Crea una nueva cuenta |
| `get_by_email(email)` | Busca cuenta por email |
| `get_by_id(id_user)` | Busca cuenta por ID |
| `has_account(email)` | Verifica si existe una cuenta con ese email |

## Tabla en DB

- `Accounts`

## Dependencias
- `argon2` — hasheo automático de contraseñas via `@BeforeInsert`
- `TypeORM` — repositorio de entidad
