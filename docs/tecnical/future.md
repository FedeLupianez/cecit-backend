# Pendientes y problemas conocidos

Consolidado de los defectos, desalineaciones y decisiones pendientes que
aparecieron al documentar el estado actual (commit `43265f7`).

Ordenado por severidad.

---

## 🔴 Crítico — El esquema no es reproducible

Con `synchronize: false`, el esquema lo gobiernan exclusivamente las
migraciones. **Una base creada únicamente con `npm run migration:run` no coincide
con el esquema que espera el código.**

### Desalineaciones entidad ↔ migraciones

| Cambio en la entidad | Estado en las migraciones |
|----------------------|--------------------------|
| `Accounts.id_user` → **`id_account`** | ❌ Ninguna. `1788216129258` y `1788216335821` renombran `Partners_Admins.id_account` **a** `id_user`, en dirección contraria |
| `Accounts.last_activity` eliminada | ❌ La columna sigue existiendo |
| `Vouchers.id_user` → **`id_account`** | ❌ Ninguna |
| `Partners.direction` eliminada | ❌ `1788211952493` la **vuelve a agregar** |
| `Partners.logo` 255 → 2048 | ❌ Sigue en 255 |
| `Benefits.image` 500 → 2048 | ❌ Sigue en 500 |
| `Benefits.refund_limit` agregada | ❌ Ninguna. La columna no existe |
| Tabla `Employees` | ❌ **No existe.** Sin migración ni seed |
| `Users.dni` 8 → 11 | ❌ Sigue en 8 |
| `RefreshTokens` → PK `binary(32)`, sin `id_token` | ❌ Sigue con `id_token` uuid y `token_hash` varchar |
| `Directions.id_direction` | ⚠️ Parcial, con churn entre las 3 migraciones |

### Migraciones solapadas

`1788211952493`, `1788216129258` y `1788216335821` son tres "all-db"
consecutivas y parcialmente contradictorias: la segunda revierte parte de lo que
la primera hizo, y la tercera es un ~95 % duplicado de la segunda con
sentencias aplicadas dos veces en el mismo `up()` y **dos columnas
AUTO_INCREMENT** en `Directions`.

Ver [`infra.md`](./infra.md#migraciones--srcmigration).

---

## 🔴 Crítico — Seguridad

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| `JWT_SECRET` cae a `'secret'` | `auth.module.ts:25`, `jwt.strategy.ts:13` | Sin la variable, cualquiera puede firmar tokens válidos con cualquier rol |
| `DELETE /vouchers` sin autenticación | `vouchers.controller.ts` | Cualquiera con el token puede borrar vouchers |
| `DELETE /users` solo con JWT, sin `CecitAdminGuard` | `users.controller.ts` | Cualquier usuario autenticado puede borrar el `id_user` que quiera |
| `POST /partners` sin guard | `partners.controller.ts` | Cualquiera puede crear partners |
| `POST /partners` genera admins sin cuenta real | `partners.service.ts` + `partnersadmins.service.ts` | El `id_account` aleatorio no existe en `Accounts` |
| `POST /partners-admins/create` acepta y descarta `email`/`password` | `partnersadmins.service.ts` | Crea filas de relación huérfanas |
| `pino-pretty` como `devDependency` en el camino de producción | `logger.config.ts` | Un deploy con `--omit=dev` no arranca |
| `JWT_SECRET` sin validación al arrancar | `auth.module.ts` | El misconfiguration es silencioso |
| `SSH_PASS` en texto plano en el env | `ssh-tunnel.service.ts` | Sin soporte de autenticación por clave |

---

## 🟠 Alto — Contabilidad de cupones

`Benefits.coupons` es un contador incremental. Cada transición de estado de un
voucher debe devolver el cupón exactamente una vez; estos casos no lo cumplen.

| Defecto | Dónde | Efecto |
|---------|-------|--------|
| `DELETE /vouchers` no devuelve el cupón | `vouchers.service.ts` `delete` | El cupón desaparece del sistema sin devolverse al beneficio |
| Sin piso en `0` | `benefits.service.ts` `decrementCoupons` | No tiene `GREATEST(coupons - 1, 0)`, así que `coupons` puede quedar negativo |
| Lectura fuera de la transacción | `vouchers.service.ts` cron | El `SELECT` usa `vouchersRepository` y los `UPDATE` usan `manager`. Un canje concurrente no está protegido |

---

## 🟠 Alto — Lógica de beneficios

| Problema | Consecuencia |
|----------|--------------|
| No hay cron que reactive beneficios | Un beneficio creado con `start_date` futura nace `INACTIVE` y **queda invisible e incanjable para siempre**, hasta que alguien llame manualmente a `PATCH /benefits/activate` |
| `PATCH /benefits` solo edita `ACTIVE` y en ventana | No se puede corregir un beneficio futuro ni uno vencido |
| `PATCH /benefits` puede responder `404` **después** de escribir | La relectura final usa `findOneActive()`; si el patch cambió `status` a algo no activo, el error es engañoso |
| `BenefitsUpdateDTO.status` acepta cualquier string | No valida contra el enum. Un typo persiste un valor inválido |
| `POST /benefits` sin validación de entrada | Es una `interface`. El cliente elige `coupons`, `max_coupons`, `max_per_user` |
| `max_per_user` no se valida en el servidor | Solo se informa vía `GET /vouchers/userbenefit`; la aplicación del límite queda en el frontend |
| `get_all()` no filtra nada | Devuelve beneficios `INACTIVE` y `PENDING` en el listado público |
| `/benefits/search` no filtra por fechas | Un beneficio vencido en `ACTIVE` aparece |
| `/benefits/search` devuelve siempre `payment_methods: []` | El join no incluye `PaymentMethods_Benefits` |
| Métodos de pago se resuelven por nombre, en silencio | Un nombre inexistente se descarta sin error ni warning |
| `GET /benefits/benefit` toma el ID en el body de un GET | Rompe proxies y CDNs; el `ValidationPipe` responde `400` si no hay body |

---

## 🟠 Alto — Vouchers y visibilidad

| Problema | Consecuencia |
|----------|--------------|
| Vouchers de beneficios no activos **desaparecen** de `/vouchers/byaccount` | El usuario pierde de vista vouchers que ya emitió. `getMappedByIds` no los encuentra y se omiten en silencio |
| `endDate` significa dos cosas distintas | En `/byaccount` es el `end_date` del **beneficio**; en `/bytoken` es el `limit_date` del **voucher**. La misma clave, dos significados |
| `user_name` con dos formatos | `/bytoken` devuelve `"Juan Pérez"` (string único); `/redeemed` devuelve `user_name` y `user_lastname` separados |
| `GET /vouchers/bystatus` no valida el enum | Un string arbitrario llega a la columna `enum` y produce un error de base, no un `400` |
| `REJECTED` ausente en el PDF | El mapa de etiquetas del `PdfService` no lo incluye: muestra el texto crudo `REJECTED` sobre un badge gris |
| `GET /partners-admins/me` no es determinista | `findOne` sin `order` sobre varias filas; con varios negocios devuelve cualquiera |

---

## 🟡 Medio — Autorización y cache

| Problema | Detalle |
|----------|---------|
| La verificación de admin cachea **solo positivos**, 60 s, sin invalidación | Quitar a un admin de un negocio tarda hasta 60 s en surtir efecto |
| `verify_admin` está **duplicado** | `AccountsService` (sin cache) y `PartnersAdminsService` (con cache). El `POST /partners-categories` verifica dos veces |
| `PASSWORD` no cambia los refresh tokens | `AccountsService.update()` con `password` no borra tokens. Solo `AuthService.updateEmail()` lo hace |
| `PATCH /auth/update` sin `default` en el `switch` | Un `process` distinto de `PASSWD`/`EMAIL` devuelve `200` con body `undefined` |
| Mensaje de error equivocado | `updatePasswd()` lanza `'Error changing email'` |
| Cache en memoria, no compartida | Con más de una réplica, cada una tiene su propia cache de autorización |

---

## 🟡 Medio — Cache sin invalidación

| Clave | Problema |
|-------|----------|
| `categories:actives` | **Lee una clave y escribe otra** (`categories:active`). Nunca acierta, nunca se lee. Cada request vuelve a la base |
| `payment-methods:active` | No hay ninguna ruta que la invalide (no hay endpoints de escritura). Queda cacheada de por vida del proceso |
| `benefit-types:all` | Se cachea sin TTL explícito, así que hereda los 60 s del `CacheModule` global. Solo se invalida desde este mismo módulo |
| `categories:all` | `create()` solo borra esta clave, no las de activas |

**Alternativa:** quitar la cache de `payment-methods` y `benefit-types`. Son
consultas `SELECT` triviales sobre tablas de 4-5 filas; el costo de la cache sin
invalidación supera el beneficio.

---

## 🟡 Medio — Datos de entrada sin validar

Varios DTOs no tienen decoradores de validación, así que el `ValidationPipe`
global los acepta sin comprobar nada:

| DTO | Endpoint | Consecuencia |
|-----|----------|--------------|
| `BenefitsCreateDTO` | `POST /benefits` | `interface`. El cliente controla el stock de cupones |
| `VouchersCreateDTO` | `POST /vouchers/create` | `interface`. Sin validación de tipos |
| `VouchersDeleteDTO` | `DELETE /vouchers` | `interface`. Sin validación |
| `UsersDeleteDTO` | `DELETE /users` | `interface`. Sin validación |
| `BenefitTypeCreateDTO` | `POST /benefit-types` | `interface`. Sin validación |
| `BenefitTypeDeleteDTO` | `DELETE /benefit-types` | `interface`. Sin validación |
| `PartnersCategoriesDto` | `POST /partners-categories` | `class` sin decoradores |
| `CategoriesDTO` | `POST /categories/create` | `class` sin decoradores |

Además, `UsersDeleteDTO` al ser `interface` **no** admite ni siquiera
decoradores, así que ni declarándolos se validaría.

---

## 🟡 Medio — Endpoints sin protección

Públicos y de solo lectura (aceptable, pero documentado):

```
GET  /benefits/all|actives|popular|news|search|benefit
GET  /benefit-types/all
GET  /categories/all|actives
GET  /partners/all
GET  /partners-categories
GET  /payment-methods/all
GET  /vouchers/all|byuser|byaccount|bybenefit|bystatus|userbenefit
```

Públicos y **con efecto**: `DELETE /vouchers`.

Además, el throttle global de **20 req/min** aplica a todos los endpoints,
incluidos los listados públicos. Un frontend que carga la home con varios
listados en paralelo puede recibir `429`.

---

## 🟡 Medio — Generación de IDs

`src/common/utils/id-generator.ts` no es segura ante concurrencia:

- No captura violaciones de índice único ni reintenta.
- Dos requests concurrentes pueden generar el mismo candidato, pasar ambos el
  `SELECT COUNT`, y uno fallar en el `INSERT`.
- 4 caracteres hex = 65.536 combinaciones. El bucle de reintento hace la
  colisión despreciable en volumen bajo, pero degrada si el espacio se llena.

Un `INSERT ... ON DUPLICATE KEY` con reintento, o volver a una secuencia de base
de datos (que además sería transaccional), resolvería esto.

---

## 🟡 Medio — Migración de código pendiente

| Elemento | Ubicación | Problema |
|----------|-----------|----------|
| `isProd` | `main.ts:8` | Declarado, nunca leído. Residuo del `ConsoleLogger` eliminado |
| `mapVoucher` | `vouchers.service.ts` | Método completo sin uso (el N+1 fue reemplazado por `get_by_account`) |
| `get_coupons` | `benefits.service.ts` | Retorna `CouponsReturn`, sin endpoint |
| `get_categories` | `benefits.service.ts` | Retorna `PartnersCategoriesReturn`, sin endpoint |
| `generateVoucherPDF` | `pdf.service.ts` | Autocontenido y sin uso; `VouchersService` hace el lookup |
| `mapBenefit` singular vs array | `benefits.service.ts` | El singular solo se usa por paths que ya no se alcanzan |
| `hashToken` en la entidad | `refresh-token.entity.ts` | Método helper sin uso; el hasheo vive en el servicio |
| `change_token` | `refresh-token.entity.ts` | Sin uso desde la rotación por `AuthService` |
| `change_email` | `accounts.entity.ts` | Sin uso; `update()` asigna el campo directamente |
| `Employee`, `PartnerLogo` | `partners.dto.ts` | Interfaces sin uso |
| `getRefreshDays()` | `auth.service.ts` | Exportado y sin uso dentro del archivo |
| `VoucherFileDTO`, `ReturnCouponsUser` | `vouchers.dto.ts` | Sin uso |
| `PaymentBenefitModule` completo | `app.module.ts` | Registrado pero ningún módulo lo importa. Código muerto |
| `AccountsModule` en `BenefitTypeModule` | — | Importado y sin uso |
| `UsersCreateNew` | `users.controller.ts` | Import sin uso |
| `Post` | `users.controller.ts` | Import sin uso |
| `PartnerLogo` return type | `partners.dto.ts` | Obsoleto desde que `get_all()` devuelve `PartnersDTO` |

---

## 🟢 Bajo — Cosmético

| Problema | Detalle |
|----------|---------|
| `POST /auth/register` no persiste el rol calculado | `AccountsService.create()` mapea solo `id_account`/`email`/`password`. El JWT dice `PARTNER_ADMIN` y la base dice `USER` |
| `PASSWORD` en el body de `DELETE /directions` | Un `id` en body de un DELETE es inusual |
| `DirectionsDeleteDTO` sin `@IsInt()`/`@Type()` | Un `id` no numérico pasa la validación |
| Mensajes de error inconsistentes | `Partner not exists` vs `Partner not found`; `User is not logued` vs `User is not logged in` |
| `change_psswd` con doble `s` | Nombre del método de la entidad |
| `AccountCreateDTO.role` aceptado e ignorado | Confuso: sugiere que se puede elegir el rol |
| `PartnersAdminsMapper.toDTO` no se usa | El controlador devuelve la entidad cruda |
| `CategoryMapper.toDTO` retorna la entidad | El tipo de retorno declarado no coincide |
| `NotFoundException` inalcanzable | `PATCH /benefits/activate` y `/deactivate` chequean `if (!result)` sobre un `repository.update()` que siempre es truthy |
| `User is the owner` vs `User is owner, can not delete him` | Dos mensajes para el mismo concepto en módulos distintos |
| `envFilePath: '.env.development'` hardcodeado | En producción el archivo debe existir con ese nombre |

---

## Ideas de mejora sueltas

- **Endpoint para agregar/quitar categorías de un partner.** Hoy solo existe el
  alta (`POST /partners-categories`) y no hay desasignación. La única vía es
  desactivar la categoría, que además oculta los beneficios del partner.
- **Endpoint para cambiar los métodos de pago de un beneficio existente.**
  `PaymentBenefitService.make_relation()` existe pero no está expuesto.
- **Endpoint para cambiar los IDs de los vouchers de un usuario.** El DTO
  `VouchersDeleteDTO` declara `id_account` pero `delete()` solo usa `token`.
- **Devolver el perfil en login y register.** `POST /auth/refresh` ya lo hace
  (`{ access_token, profile }`); login y register no. Unificar.
- **Healthcheck.** No hay endpoint de salud. `compose.yaml` tampoco define uno,
  así que la app puede intentar conectar antes de que MariaDB esté listo.
- **`.env.example`.** No existe. Con `.env.development` hardcodeado y
  `envFilePath` fijo, descubrir las variables de entorno requiere leer el
  código.
- **Rate limiting más fino.** Un límite único de 20/min no distingue entre un
  login (que tiene su propio límite) y el browsing público.
- **Separar la configuración del logger para producción.** Hoy `pino-pretty`
  corre siempre; falta un modo JSON a stdout cuando `NODE_ENV=production`.

---

## Bugs duplicados de documentación

> No son bugs del código, sino del texto de `seed/load_data.sql`. Se listan acá
> para que no se confundan con los de la aplicación.

| Archivo | Problema |
|---------|----------|
| `seed/load_data.sql` | **`02_accounts.csv` tiene 7 campos por fila** (el hash argon2 lleva comas sin escapar) contra los 5 declarados: `role` carga `t=3` y `active` carga `p=4$...`. Ninguna cuenta queda con un rol válido |
| `seed/load_data.sql` | Las rutas de los CSV son absolutas y específicas de una máquina |
| `seed/load_data.sql` | `08_benefits.csv` referencia partners `P006`–`P015` que no existen |
| `seed/load_data.sql` | Usa `last_name`, `id_user` — los nombres anteriores a la migración de cuentas |
| `seed/12_partners_admins.csv` | Header `id_user,id_partner` contra los `id_account, id_partner` que pide el SQL |
| `seed/10_refresh_tokens.csv` | Nunca se carga, y su esquema corresponde al anterior a `binary(32)` |
| `seed/07_directions.csv` | Una sola dirección por partner: no ejercita la relación 1:N que la entidad vino a reemplazar |
| `seed/` | No hay seed para la tabla `Employees` |
| `seed/load.sh` vs `.env.development` | `mi_base`/`imdf` vs `cecit`/`cecit_user` |
| `compose.yaml` | Credenciales en el repositorio, `mariadb:latest` sin fijar versión, sin healthcheck |
| `docs/img/CECIT_DB_DER.png` | Desactualizado: sin `Directions` ni `Employees`, y con `id_user` en `Accounts`/`Vouchers` |

---

Ver también: [`infra.md`](./infra.md) para el detalle de cada área.
