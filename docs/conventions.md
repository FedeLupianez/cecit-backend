# Convenciones del proyecto

## Nombres de Clases:
PascalCase

## Variables:
camelCase

## Endpoints:
Plural

No se define prefijo global de rutas: los paths documentados son absolutos
(ej. `GET /benefits/all`, no `GET /api/benefits/all`).

## Tablas:
- Plural y PascalCase
- Las tablas intermedias tendrán el nombre de la primera seguido de un guión bajo y el nombre de la segunda. Ej: `Partners_Admins`.

Las relaciones muchos a muchos se modelan con decoradores `@ManyToMany` de
TypeORM en lugar de entidades intermedias. La tabla física se sigue llamando
`<Tabla1>_<Tabla2>` y se declara con `@JoinTable` en el lado propietario:

| Relación | Lado propietario (`@JoinTable`) | Tabla | Columnas |
|----------|---------------------------------|-------|----------|
| Partners ↔ Categories | `PartnersEntity.categories` | `Partners_Categories` | `id_partner`, `id_category` |
| Benefits ↔ PaymentMethods | `BenefitsEntity.payment_methods` | `PaymentMethods_Benefits` | `id_benefit`, `id_payment_method` |
| Partners ↔ Users (empleados) | `PartnersEntity.employees` | `Employees` | `id_partner`, `id_user` |

Excepción: la relación **administradores ↔ partners** mantiene su entidad
propia `PartnersAdminsEntity` sobre la tabla `Partners_Admins` porque cada fila
es un recurso consultable de forma independiente (`GET /partners-admins/me`).

## Nombres de columnas:
- snake_case
- Claves foráneas explícitas y con el prefijo de la tabla destino:
  `id_partner`, `id_account`, `id_benefit`, `id_category`, `id_user`,
  `id_type`, `id_payment_method`, `id_direction`.
- Las cuentas se identifican con `id_account` (PK de `Accounts`), no con
  `id_user`. Antes de la migración del sistema de cuentas (commit
  `5d881c8`) era al revés; el nombre histórico `id_user` en
  `Partners_Admins` es residual.

## Json:
snake_case

## Identificadores
Los PK de negocio son `varchar(4)` y se generan en la aplicación con
`src/common/utils/id-generator.ts` (4 caracteres hexadecimales en mayúscula,
con verificación de colisión). Los tokens de voucher son `varchar(6)`.

Ya no se usan procedimientos almacenados de MySQL (`get_new_id`,
`get_new_token`): el servicio `DbService` fue eliminado.

## Enums
Se persisten por nombre (`enum('USER','CECIT_ADMIN','PARTNER_ADMIN')`), no por
valor numérico, para que las migraciones sean legibles en el dump de la base.
