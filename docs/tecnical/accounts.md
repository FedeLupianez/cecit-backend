# Endpoints - Cuentas

En este archivo se detalla el funcionamiento interno de los endpoints relacionados a las cuentas de usuario en la plataforma.

---

## Módulo de Cuentas

El controlador de `Accounts` no expone endpoints públicos. Todas las operaciones sobre cuentas se realizan internamente a través del módulo de autenticación (`AuthModule`).

### Servicios internos

| Método | Descripción |
|--------|-------------|
| `create(account: AccountCreateDTO)` | Crea una nueva cuenta. La contraseña se hashea automáticamente con argon2 mediante el hook `@BeforeInsert` de TypeORM. |
| `get_by_email(email: string)` | Busca una cuenta por email. Lanza `NotFoundException` si no existe. |
| `get_by_id(id_user: string)` | Busca una cuenta por `id_user`. Lanza `NotFoundException` si no existe. |
| `has_account(email: string)` | Retorna `true` si ya existe una cuenta con ese email, `false` en caso contrario. |

### Estructura de la entidad

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_user` | varchar(4) | Primary Key. Código de socio CeCIT. |
| `email` | varchar(50) | Único, indexado. Correo electrónico. |
| `password` | varchar(255) | Hash de contraseña con argon2. |
| `role` | enum | `USER`, `CECIT_ADMIN` o `PARTNER_ADMIN`. Por defecto `USER`. |
| `last_activity` | timestamp | Última actividad. Default `CURRENT_TIMESTAMP`. |
| `active` | boolean | Si la cuenta está activa. Default `true`. |

### Relaciones

- `@OneToOne(() => UsersEntity)` via `id_user`.

---

Ver documentación de endpoints de autenticación en [`auth.md`](./auth.md) para las operaciones que involucran cuentas (`register`, `login`, `refresh`, `logout`).
