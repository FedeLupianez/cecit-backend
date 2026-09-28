# Endpoints - Usuarios (Socios CeCIT)

En este archivo se detalla el funcionamiento interno de cada endpoint relacionado a los usuarios (socios de CeCIT) de la plataforma.

Los `Users` son los socios dados de alta por CeCIT. La **cuenta de acceso** que
permite iniciar sesión vive en `Accounts` y se referencia por `id_account`; ver
[`accounts.md`](./accounts.md).

---

## `GET /users/all`

Protegido con `@UseGuards(AuthGuard('jwt'), CecitAdminGuard)`. Obtiene todos los
usuarios registrados.

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Se obtienen todas las entidades `UsersEntity` mediante `userRepository.find()`.
2. Si no hay usuarios, se lanza `InternalServerErrorException`.
3. Se mapea cada usuario mediante `UsersMapper.toDTO()` que retorna
   `{ id_user, dni, name, last_name }` — la entidad expone `lastname` y el
   mapper lo renombra a `last_name`.
4. Se retorna un arreglo de `UsersDTO`.

### Respuesta

```json
[
  {
    "id_user": "U001",
    "dni": "30111222",
    "name": "Juan",
    "last_name": "Pérez"
  }
]
```

---

## `DELETE /users`

Protegido con `@UseGuards(AuthGuard('jwt'))`. Elimina un usuario del sistema.

> ⚠️ Solo requiere JWT, **no** `CecitAdminGuard`: cualquier usuario
> autenticado puede borrar el `id_user` que quiera. Requiere corrección.

### Parámetros de entrada

| Campo | Tipo | Origen | Descripción |
|-------|------|--------|-------------|
| `id_user` | String | Body | ID del usuario a eliminar. |

`UsersDeleteDTO` es una `interface` de TypeScript, por lo que el `ValidationPipe`
**no la valida**.

### Lógica de negocio

1. Se ejecuta `userRepository.delete({ id_user })`.
2. El servicio devuelve `true` incondicionalmente.
3. El controlador compara contra `false` y, si no coincide, lanza `NotFoundException('User does not exists')`.

> ⚠️ La comprobación es **inalcanzable**: `Repository.delete()` de TypeORM
> devuelve un objeto `DeleteResult` (`{ raw, affected }`), que siempre es truthy.
> Para detectar que no había fila hay que mirar `affected`.

### Errores

| Código | Mensaje |
|--------|---------|
| `404` | `User does not exists` |

### Respuesta

```json
{ "result": "ok" }
```

---

## Servicio `UsersService`

| Método | Descripción |
|--------|-------------|
| `get_by_user_id(id_user)` | `404 User does not exists`. |
| `get_all()` | Todos los socios mapeados a `UsersDTO`. `500 Users is empty`. |
| `delete(dto)` | Borrado duro. Devuelve `true` siempre; el `404` del controlador es inalcanzable. |
| `create(user: UsersCreateNew)` | **Nuevo.** Alta idempotente por DNI. |
| `get_by_dni(dni)` | **Nuevo.** `404 User does not exists`. |

### `create()` — alta idempotente por DNI

Se agregó en el commit `6e978e5` y luego se ajustó en `94d5539`:

1. Busca un usuario con el mismo `dni`.
2. **Si existe, lo devuelve tal cual** — no actualiza `name` ni `lastname`, aunque
   hayan cambiado.
3. Si no existe, genera el `id_user` con `generateUniqueId(userRepository, 'id_user')`
   y lo guarda. `500 Error creating User` si falla.

### `get_by_dni()` — usado por `addEmployee`

`PartnersService.addEmployee()` la usa para **buscar** socios ya registrados en
lugar de crearlos (cambio del commit `94d5539`). Por eso
`POST /partners/employees` responde `404 User does not exists` si el DNI no está
en `Users`.

---

## Estructura de la entidad

`@Entity('Users')`

| Campo | Columna | Tipo | Null | Notas |
|-------|---------|------|------|-------|
| `id_user` | `id_user` | `varchar(4)` | no | `@PrimaryColumn`. Generado en la app (4 hex mayúsculas) |
| `name` | `name` | `varchar(50)` | no | |
| `lastname` | `lastname` | `varchar(50)` | no | |
| `dni` | `dni` | `varchar(11)` | no | `@Index()`. **Ampliado** de 8 a 11 para admitir prefijo |
| `partners` | — | `@ManyToMany(() => PartnersEntity, p => p.employees)` | — | **Nuevo.** Lado inverso; tabla `Employees` |

### Relaciones

- `partners` → `PartnersEntity.employees`, tabla intermedia **`Employees`**
  (`id_partner`, `id_user`).

> La tabla `Employees` **no tiene migración ni datos seed**. Hay que crearla a
> mano. Ver [`future.md`](./future.md).

### Observación sobre el nombre de la columna

La entidad declara `lastname` (una sola palabra). La migración
`1782477643088-change-accounts-system.ts` creó la columna como `last_name`, y
`1788216129258-all-db.ts` la renombró a `lastname`, lo que sí coincide con la
entidad. Pero `seed/load_data.sql` carga `last_name` explícitamente, así que el
seed queda desalineado.

---

## DTOs

### `UsersCreateNew` (uso interno)

```typescript
export class UsersCreateNew {
    @IsNotEmpty() @IsString() name: string;
    @IsNotEmpty() @IsString() lastname: string;
    @IsNotEmpty() @IsString() dni: string;
}
```

Lo usan `UsersService.create()` y —antes del commit `94d5539`—
`POST /partners/employees`.

### `UsersDeleteDTO`

```typescript
export interface UsersDeleteDTO {
    id_user: string; // sin decoradores de validación
}
```

### `UsersCreateDTO`

```typescript
export class UsersCreateDTO {
    @IsNotEmpty() id_user: string;
    @IsEmail() email: string;
    @IsNotEmpty() @IsString() password: string;
}
```

Quedó **sin uso** tras la migración del sistema de cuentas: el alta de socios
con cuenta se hace por `POST /auth/register`.

---

## Tablas en DB

- `Users`
- `Employees` (relación con los negocios donde el socio trabaja)

## Dependencias
- `UsersMapper` — mapeo a `UsersDTO`
- `src/common/utils/id-generator.ts` — generación de `id_user`
- `PartnersEntity` — relación `ManyToMany` de empleados
- `AccountsModule` — registrado en el módulo, sin uso

---

## Pendiente

`GET /users/all` y `DELETE /users` no exponen la relación `partners`, así que
el frontend no puede saber desde acá en qué negocios trabaja un socio. Esa
información solo existe vía `GET /partners/employees?id_partner=`.
