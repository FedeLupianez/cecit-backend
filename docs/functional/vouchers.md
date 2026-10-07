# Módulo Vouchers (Beneficios Canjeados)

## Objetivo:
Gestionar los vouchers generados cuando un socio canjea un beneficio. Cada voucher representa un cupón canjeado por un usuario para un beneficio específico, con seguimiento de estado, control de cupones y generación de PDF.

## Actores:
- Usuarios (socios de CeCIT) — crean y consultan sus vouchers
- Administradores de negocios — validan, canjean y rechazan vouchers de su negocio
- Administradores de CeCIT — consultan todos los vouchers

---

## Estados del Voucher

| Estado | Descripción | Efecto sobre los cupones |
|--------|-------------|--------------------------|
| `PENDING` | Emitido, pendiente de entrega en el comercio | Cupón descontado |
| `DELIVERED` | Canjeado en el comercio (`action=redeem`) | Cupón consumido |
| `REJECTED` | Rechazado por el comercio (`action=reject`) | **Cupón devuelto** |
| `EXPIRED` | Superó `limit_date` (vence 7 días después de emitirse) | **Cupón devuelto** |

`REJECTED` se agregó en el rango documentado.

Cada transición de estado se hace cargo de su cupón exactamente una vez, así que
un voucher nunca devuelve dos veces:

| Transición | Devuelve el cupón |
|------------|-------------------|
| Emisión (`create`) | No — lo descuenta |
| `action=redeem` | No — el cupón se consume |
| `action=reject` | Sí |
| Cron de medianoche, solo si sigue `PENDING` | Sí |

El cron de expiración filtra por `status = PENDING`, no por `status != EXPIRED`.
Por eso un voucher rechazado o entregado que supere su `limit_date` conserva su
estado y no devuelve el cupón por segunda vez. Ver
[`tecnical/vouchers.md`](../tecnical/vouchers.md#cron-de-expiración--cron0-0--).
---

## Endpoints

### Lectura

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /vouchers/all` | No requiere | Todos, `application_date DESC`. |
| `GET /vouchers/byaccount?id_account=` | No requiere | Vouchers de una cuenta, con datos del beneficio. |
| `GET /vouchers/byuser?id_account=` | No requiere | Alias deprecado de `/byaccount`. |
| `GET /vouchers/bybenefit?id_benefit=` | No requiere | Vouchers de un beneficio. |
| `GET /vouchers/bystatus?status=` | No requiere | Vouchers por estado. `status` **no se valida**. |
| `GET /vouchers/userbenefit?id_account=&id_benefit=` | No requiere | Cantidad de vouchers de ese par. |
| `GET /vouchers/bytoken?token=` | **JWT + `AdminGuard`** | Voucher por token, para el comercio. |
| `GET /vouchers/redeemed?id_benefit=&id_partner=` | **JWT + `AdminGuard`** | Vouchers canjeados de un beneficio, para el panel del comercio. |

`GET /vouchers/bytoken` y `GET /vouchers/redeemed` se protegieron con
`AdminGuard` + verificación de que el voucher o el beneficio pertenezcan al
negocio del admin. Si no, `409`.

> `GET /vouchers/byaccount` **omite en silencio** los vouchers cuyo beneficio ya
> no está `ACTIVE` (o cuyo partner perdió todas sus categorías activas): esos
> vouchers desaparecen de la lista del usuario.

### Escritura

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `POST /vouchers/create` | JWT | Canjea un beneficio y emite un voucher. |
| `PATCH /vouchers?action=redeem&token=` | JWT + `AdminGuard` | Marca el voucher como entregado. |
| `PATCH /vouchers?action=reject&token=` | JWT + `AdminGuard` | Rechaza el voucher y devuelve el cupón. |
| `GET /vouchers/file?token=` | JWT | Descarga el PDF del voucher. |
| `DELETE /vouchers` | **No requiere** | Borra el voucher. ⚠️ Sin autenticación. |

`redeem` y `reject` se fusionaron en un único `PATCH /vouchers` que se
diferencia por el query param `action`. Cualquier otro valor → `400 Bad Action`.

Ambos aceptan **únicamente vouchers `PENDING`**; cualquier otro estado devuelve
`400`. Esto hace que las dos operaciones sean simétricas y que un rechazo no se
pueda repetir, lo que evita devolver el mismo cupón dos veces.

**Proceso de `POST /vouchers/create`:**
1. El beneficio debe estar `ACTIVE`, dentro de su ventana de fechas y con
   categoría activa; si no, `404`.
2. Se descuenta un cupón de forma atómica
   (`UPDATE ... SET coupons = coupons+1 WHERE coupons < max_coupons`).
3. Si `affected === 0` → `409 Max coupons reached`.
4. Se genera un token de 6 caracteres hexadecimales y se crea el voucher
   `PENDING` con `limit_date = hoy + 7 días`.

> `max_per_user` **no se valida en el servidor**: `GET /vouchers/userbenefit`
> solo informa el conteo y el control queda en el frontend.

---

## DTOs

> Todos los DTOs de este módulo son `interface` de TypeScript: **no tienen
> validación de entrada**.

### `VouchersCreateDTO`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_account` | string | ID de la cuenta que canjea (era `id_user`) |
| `id_benefit` | string | ID del beneficio a canjear |

### `VouchersDeleteDTO`
| Campo | Tipo |
|-------|------|
| `token` | string |
| `id_account` | string |

### `VouchersDTO`
`{ token, id_account, id_benefit, application_date, delivery_date, limit_date, status }`

`limit_date` es nuevo en la respuesta.

### `VoucherReturn`
Respuesta de `/byaccount` y `/byuser`:
`{ title, image, partner, endDate, methods[], directions[], logo, token, status }`

- `endDate` aquí es el **`end_date` del beneficio**.
- `directions` pasó de string a array.
- `token` (antes `voucherToken`) y `status` son nuevos.

### `VoucherPartnerView` — respuesta de `/bytoken`
Extiende `VoucherReturn` con:
- `user_name` — `"nombre apellido"` en un único string
- `user_dni`

⚠️ En este endpoint `endDate` es el **`limit_date` del voucher**, no el
`end_date` del beneficio. La inconsistencia viene del código.

### `VoucherRedeemedDTO` — respuesta de `/redeemed`
```json
{
  "token": "ABC123",
  "id_account": "U001",
  "id_user": "U001",
  "user_name": "Juan",
  "user_lastname": "Pérez",
  "user_dni": "12345678",
  "user_email": "juan@example.com",
  "application_date": "2024-06-15T10:30:00.000Z",
  "delivery_date": null,
  "limit_date": "2024-06-22T00:00:00.000Z",
  "status": "PENDING"
}
```

---

## Entidad `Vouchers`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `token` | VARCHAR(6) PK | Token único, generado en la app |
| `id_account` | VARCHAR(4) INDEX FK → Accounts | Cuenta que canjeó (era `id_user` → Users) |
| `id_benefit` | VARCHAR(4) INDEX FK → Benefits | Beneficio canjeado |
| `application_date` | DATE | Fecha de solicitud (se setea en `@BeforeInsert`) |
| `delivery_date` | DATE NULL | Fecha de entrega (al canjear) |
| `limit_date` | DATE | Vencimiento (7 días tras la solicitud). **Nuevo** |
| `status` | ENUM(`PENDING`, `DELIVERED`, `EXPIRED`, **`REJECTED`**) INDEX | Estado actual |

Cambio clave: la relación con el usuario pasó de `Users` a `Accounts`. El
voucher pertenece a una **cuenta**, no a un socio; los datos personales se
alcanzan por `voucher.account.user`.

---

## Servicio `VouchersService`

| Método | Descripción |
|--------|-------------|
| `get_all()` | Todos, `application_date DESC`. |
| `get_by_account(id_account)` | Vouchers de una cuenta, resueltos en batch. |
| `get_by_user(id_account)` | Deprecado, delega a `get_by_account`. |
| `get_by_benefit(id_benefit)` | Vouchers de un beneficio. |
| `get_by_token(token, id_admin)` | Voucher con verificación de pertenencia al negocio. |
| `get_redeemed_by_benefit(id_benefit, id_admin, id_partner)` | Vouchers canjeados, con datos del usuario. |
| `get_by_status(status)` | Vouchers por estado. |
| `get_by_user_benefit(dto)` | Conteo de vouchers del par usuario-beneficio. |
| `create(dto)` | Emite un voucher (descuenta un cupón). |
| `delete(dto)` | Borra un voucher. |
| `redeem_voucher(token, id_admin)` / `reject_voucher(token, id_admin)` | Cambios de estado. |
| `gen_file(token)` | Genera el `StreamableFile` PDF. |
| `update_expiration_status()` | Cron de medianoche. |

`get_by_account` usa `BenefitsService.getMappedByIds()` para resolver todos los
beneficios en **una** consulta, lo que eliminó el N+1 que tenía antes.

### Cron de expiración — `00:00` diario
```sql
SELECT * FROM Vouchers WHERE limit_date < hoy AND status = 'PENDING';
-- por cada uno, dentro de una transacción:
UPDATE Vouchers   SET status = 'EXPIRED' WHERE token = ?;
UPDATE Benefits   SET coupons = coupons - 1  WHERE id_benefit = ?;
```

---

## Generación de PDF

`GET /vouchers/file?token=xxx` devuelve un `StreamableFile`:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=cecit_voucher_<token>.pdf
Content-Length: <bytes>
```

Formato **A6**, generado con Puppeteer. Contenido:
- **Header:** logo de CeCIT (fondo oscuro).
- **Socio:** nombre, DNI y **Legajo** (ahora el `id_account`, antes el `id_user`).
- **Comercio:** logo, razón social y dirección (todas las direcciones del
  negocio, separadas por coma).
- **Detalle del beneficio:** miniatura de la imagen (provista por el frontend),
  título, descripción y vigencia.
- **Código de validación** en tipografía monoespaciada.
- **Pie:** imágenes servidas por el frontend.

### Mejoras de rendimiento

- **Navegador singleton:** se lanza **un** Chromium para toda la aplicación y se
  reutiliza entre PDFs. Antes cada request abría y cerraba un navegador entero
  (0,5–2 s y 100–200 MB por voucher). Solo se cierra la *página*.
- **Cache de imágenes (LRU):** hasta 100 imágenes, 24 h de TTL para las
  estáticas del footer y 6 h para las dinámicas (logos e imágenes de
  beneficios). Se deduplican las descargas concurrentes de la misma URL.
- Las imágenes ahora se piden al **frontend** usando `FRONT_URL`, en lugar de
  URLs fijas de WordPress.
- Validación de `content-type` y límite de 2,5 MB por imagen; si algo falla se
  omite la imagen en lugar de romper el PDF.
- Las fechas se formatean leyendo strings `'YYYY-MM-DD'` sin conversión de
  zona horaria, lo que arregló el corrimiento de un día de las fechas.

⚠️ `REJECTED` no está en los mapas de etiqueta/color del PDF: un voucher
rechazado muestra el texto crudo `REJECTED` en una etiqueta gris.

---

## Tablas en DB

- `Vouchers`
- `Benefits` (lectura y actualización del contador de cupones)
- `Accounts`, `Users`, `Partners`, `Directions` (lectura para armar el PDF)

## Dependencias
- `BenefitsService` — validación del beneficio y control de cupones
- `PartnersAdminsService` — verificación de que el admin pertenece al negocio
- `PdfService` — generación de PDFs con Puppeteer
- `DataSource` — transacción del cron de expiración
- `src/common/utils/id-generator.ts` — generación de tokens (reemplaza a `DbService`)
