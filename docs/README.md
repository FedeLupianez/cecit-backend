# Documentación

Documentación del backend **CeCIT** — sistema de beneficios para socios de un
centro de comercio y sus negocios asociados.

## Índice

### Funcional
Visión general de cada módulo: qué hace, quién lo usa, qué expone y qué
tablas toca. Cada módulo tiene su equivalente en [`tecnical/`](#técnico) con
el detalle endpoint por endpoint.

| Documento | Módulo |
|-----------|--------|
| [`functional/general.md`](./functional/general.md) | Panorama general del sistema |
| [`functional/auth.md`](./functional/auth.md) | Autenticación, tokens y guards |
| [`functional/accounts.md`](./functional/accounts.md) | Cuentas de acceso y roles |
| [`functional/admins.md`](./functional/admins.md) | Administradores de negocios |
| [`functional/partners.md`](./functional/partners.md) | Negocios asociados, direcciones y empleados |
| [`functional/benefits.md`](./functional/benefits.md) | Beneficios, tipos, categorías y métodos de pago |
| [`functional/vouchers.md`](./functional/vouchers.md) | Vouchers (cupones canjeados) |

### Técnico
Detalle interno: parámetros, flujos (mermaid), lógica de negocio, códigos de
error y ejemplos de respuesta.

| Documento | Contenido |
|-----------|-----------|
| [`tecnical/auth.md`](./tecnical/auth.md) | `register`, `login`, `refresh`, `logout`, `update`, guards |
| [`tecnical/accounts.md`](./tecnical/accounts.md) | Cuentas, roles y `changeRole` |
| [`tecnical/users.md`](./tecnical/users.md) | Socios de CeCIT |
| [`tecnical/partners.md`](./tecnical/partners.md) | Partners, ubicaciones y empleados |
| [`tecnical/directions.md`](./tecnical/directions.md) | Direcciones (múltiples por partner) |
| [`tecnical/partners-admins.md`](./tecnical/partners-admins.md) | Relación admin ↔ partner y panel multi-negocio |
| [`tecnical/partners-categories.md`](./tecnical/partners-categories.md) | Relación partner ↔ categoría |
| [`tecnical/benefits.md`](./tecnical/benefits.md) | Beneficios: alta, búsqueda, estados |
| [`tecnical/benefit-types.md`](./tecnical/benefit-types.md) | Tipos de beneficio |
| [`tecnical/categories.md`](./tecnical/categories.md) | Categorías y su panel de administración |
| [`tecnical/payment-methods.md`](./tecnical/payment-methods.md) | Métodos de pago |
| [`tecnical/payment-benefit.md`](./tecnical/payment-benefit.md) | Relación beneficio ↔ método de pago |
| [`tecnical/vouchers.md`](./tecnical/vouchers.md) | Ciclo de vida del voucher y PDF |
| [`tecnical/infra.md`](./tecnical/infra.md) | Logging, scheduler, pool de DB, túnel SSH, migraciones |
| [`tecnical/future.md`](./tecnical/future.md) | Pendientes conocidos |

### Referencia
- [`conventions.md`](./conventions.md) — convenciones de nombres, tablas y JSON.
- [`img/CECIT_DB_DER.png`](./img/CECIT_DB_DER.png) — diagrama de la base de
  datos. **Desactualizado**: no incluye las tablas `Directions` y `Employees`,
  ni el `id_account` de `Accounts` / `Vouchers`.

## Roles

| Rol | Alcance |
|-----|---------|
| `USER` | Socio de CeCIT. Canjea beneficios y consulta sus vouchers. |
| `PARTNER_ADMIN` | Administrador de uno o varios negocios. Gestiona datos, categorías y vouchers de sus negocios. |
| `CECIT_ADMIN` | Administrador de CeCIT. Acceso total; puede operar sobre cualquier partner. |

## Cross-cutting

Valores aplicados a **todos** los endpoints salvo que se indique lo contrario.

| Aspecto | Comportamiento |
|---------|----------------|
| Prefijo de rutas | Ninguno |
| Autenticación | `Authorization: Bearer <access_token>` (JWT) |
| Refresh token | Cookie httpOnly `refresh_token_cecit` |
| Rate limit | 20 req/min global. `POST /auth/login` baja a 3/min |
| Validación | `ValidationPipe({ transform: true })` global. Sin `whitelist` |
| CORS | Origin único `FRONT_URL`, `credentials: true` |
| Compresión | `compression()` (gzip) |
| Cache | Header `Cache-Control: no-transform` en todas las respuestas |

> Los endpoints marcados como **públicos** (sin guard) son de solo lectura en
> su mayoría, pero `DELETE /vouchers` es una excepción: no requiere
> autenticación. Ver [`tecnical/vouchers.md`](./tecnical/vouchers.md).
