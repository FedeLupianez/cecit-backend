# Módulo Beneficios

## Objetivo:
Gestionar los beneficios publicados por los negocios asociados a CeCIT. Incluye la creación, consulta, edición, activación y baja de beneficios, así como la gestión de tipos de beneficio, categorías y métodos de pago asociados.

## Actores:
- Administradores de CeCIT (crean, editan y dan de baja beneficios y tipos)
- Administradores de negocios (consultan los beneficios de su negocio)
- Usuarios (consultan beneficios disponibles)

---

## Visibilidad de un beneficio

Un beneficio solo aparece en los listados públicos, y solo se puede canjear, si
cumple **las cuatro** condiciones:

1. `status === ACTIVE`
2. `start_date < hoy < end_date` (comparaciones **excluyentes**: un beneficio
   cuyo límite sea exactamente "ahora" queda fuera)
3. El partner tiene al menos una categoría `active`
4. La fecha de expiration no lo dejó `INACTIVE` el cron de las 00:00

`GET /benefits/all` es la **excepción**: no aplica ningún filtro y devuelve
también beneficios `INACTIVE` y `PENDING`.

---

## Endpoints — Benefits

### Lectura

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /benefits/all` | No requiere | Todos los beneficios, `date_entered DESC`. **Sin filtros.** |
| `GET /benefits/actives` | No requiere | Solo los que cumplen la visibilidad. |
| `GET /benefits/popular` | No requiere | 20 activos ordenados por `coupons DESC`. |
| `GET /benefits/news` | No requiere | 20 activos ordenados por `date_entered DESC`. |
| `GET /benefits/search?text=` | No requiere | Búsqueda por título o descripción (case-insensitive, `%texto%`). |
| `GET /benefits/benefit` | No requiere | Un beneficio por `id_benefit`. **El ID va en el body de un GET.** |
| `GET /benefits/partner?id_partner=` | JWT + `AdminGuard` | Beneficios activos de un negocio. |

### Escritura

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `POST /benefits` | JWT + `CecitAdminGuard` | Crea un beneficio. |
| `PATCH /benefits` | JWT + `CecitAdminGuard` | Actualiza un beneficio. |
| `PATCH /benefits/activate` | JWT + `CecitAdminGuard` | Pasa el beneficio a `ACTIVE`. |
| `PATCH /benefits/deactivate` | JWT + `CecitAdminGuard` | Baja lógica a `INACTIVE`. **Reemplaza al `DELETE /benefits` eliminado.** |

**Alta (`POST /benefits`)**
- El `id_benefit` se genera en la aplicación (4 hex mayúsculas).
- `payment_methods` se recibe como **array de nombres** y se resuelve en una
  sola consulta; los nombres desconocidos se descartan en silencio. Enviar un
  array vacío es válido (beneficio sin métodos de pago).
- Si `end_date` ya pasó: `400 Invalid end date`.
- Si `start_date` es futura: el beneficio nace **`INACTIVE`**. No hay cron que
  lo reactive, hay que llamar a `PATCH /benefits/activate` manualmente.
- `image` es opcional: si falta, `@BeforeInsert` genera un placeholder
  `https://placehold.co/600x400?text=<title>`.
- El cliente controla `coupons`, `max_coupons` y `max_per_user`: el body no
  tiene validación (es una `interface`).

**Edición (`PATCH /benefits`)**
- Solo funciona sobre beneficios `ACTIVE` y dentro de la ventana de fechas,
  porque arranca con `findOneActive()`. No se puede editar un beneficio futuro
  ni uno vencido.
- Como la relectura final también usa `findOneActive()`, si el propio patch
  cambia `status` a algo no activo, la respuesta puede ser `404` **después** de
  haber escrito correctamente.

**Baja (`PATCH /benefits/deactivate`)**
Baja lógica: `UPDATE Benefits SET status = 'INACTIVE'`. Se cambió desde el
borrado físico porque había foreign keys dependientes que rompían la
eliminación.

---

## Endpoints — Benefit Types

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /benefit-types/all` | No requiere | Todos los tipos (`{ id_type, name }`), cacheados. |
| `POST /benefit-types` | JWT + `CecitAdminGuard` | Crea un tipo. |
| `DELETE /benefit-types` | JWT + `CecitAdminGuard` | Elimina un tipo. |

> `GET /benefit-types/all` **no** filtra por `active` y no ordena; devuelve
> todo, con el TTL global de 60 s, hasta que venza la cache o este mismo módulo
> cree o borre un tipo.

---

## Endpoints — Categorías

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /categories/all` | No requiere | Todas, ordenadas por nombre, cacheadas. |
| `GET /categories/actives` | No requiere | Solo `active = true`, ordenadas por nombre. |
| `POST /categories/create` | JWT + `CecitAdminGuard` | Crea una categoría. |
| `PATCH /categories/:id_category` | JWT + `CecitAdminGuard` | Activa/desactiva una categoría (body: `{ active }`). **Nuevo.** |

Al desactivar una categoría, los beneficios de los partners que solo tienen esa
categoría desaparecen de todos los listados públicos de inmediato, porque el
filtro se aplica en el `WHERE` del join, no como post-proceso.

---

## Endpoints — Métodos de Pago

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /payment-methods/all` | No requiere | Nombres de los métodos `active = true`. |

El resultado se cachea y **no hay ninguna ruta de invalidación** (nada crea ni
borra métodos de pago por la API), así que la lista queda cacheada de por vida
del proceso.

---

## Endpoints — Partners-Categories

| Endpoint | Auth | Descripción |
|----------|------|-------------|
| `GET /partners-categories` | No requiere | Todas las relaciones, aplanadas. |
| `POST /partners-categories` | JWT + `AdminGuard` | Asigna una categoría a un partner. Idempotente. |

El guard pasó de `CecitAdminGuard` a `AdminGuard`: un admin de negocio puede
asignar categorías a su propio negocio, y `CECIT_ADMIN` sigue teniendo acceso
por el camino rápido del guard.

**No existe endpoint de desasignación.** Para quitar una categoría de un
negocio hay que desactivarla.

---

## Endpoints — Benefits: cron

| Horario | Acción |
|---------|--------|
| `00:00` | `UPDATE Benefits SET status = 'INACTIVE' WHERE end_date < hoy` |

No filtra por `status` previo (es idempotente) y **no existe el job inverso**
que reactive beneficios cuya `start_date` ya llegó.

---

## Entidades

### `Benefits`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_benefit` | VARCHAR(4) PK | ID del beneficio, generado en la app |
| `id_admin` | VARCHAR(4) FK → Accounts | Admin que creó el beneficio |
| `id_partner` | VARCHAR(4) FK → Partners | Negocio asociado |
| `date_entered` | DATE INDEX | Fecha de creación (default: `CURRENT_DATE`) |
| `start_date` | **DATETIME** INDEX | Inicio de la vigencia (era `DATE`) |
| `end_date` | **DATETIME** INDEX | Fin de la vigencia (era `DATE`) |
| `image` | VARCHAR(2048) | URL de la imagen, provista por el frontend (era 500) |
| `title` | VARCHAR(100) | Título del beneficio |
| `description` | VARCHAR(500) | Descripción |
| `status` | ENUM(`ACTIVE`, `INACTIVE`, `PENDING`) INDEX | Estado |
| `id_type` | INT FK → BenefitTypes | Tipo de beneficio |
| `max_coupons` | INT | Cupones máximos |
| `coupons` | INT INDEX | Cupones canjeados |
| `max_per_user` | INT | Máximo por usuario (default: 3) |
| `refund_limit` | FLOAT NULL | **Nuevo**, sin migración asociada |

`start_date` / `end_date` pasaron a `datetime` para permitir definir la hora
del día en la que el beneficio empieza y termina.

### `BenefitTypes`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_type` | INT PK (autogenerado) | ID del tipo |
| `name` | VARCHAR(50) | Nombre del tipo |
| `active` | BOOLEAN | Activo (default: true) |

### `Categories`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_category` | INT PK (autogenerado) | ID de categoría |
| `name` | VARCHAR(50) | Nombre |
| `icon_url` | VARCHAR(255) | URL del ícono |
| `active` | BOOLEAN | Activo |

### `PaymentMethods`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_payment_method` | INT PK (autogenerado) | ID del método |
| `name` | VARCHAR(50) | Nombre |
| `active` | BOOLEAN | Activo |

---

## Tablas intermedias

Ahora se modelan con `@ManyToMany` de TypeORM en lugar de entidades propias.

### `Partners_Categories` (Partners ↔ Categories)
| Columna | Tipo |
|---------|------|
| `id_partner` | VARCHAR(4) PK, FK → Partners |
| `id_category` | INT PK, FK → Categories |

Lado propietario: `PartnersEntity.categories`. El lado inverso es
`CategoriesEntity.partners`.

### `PaymentMethods_Benefits` (PaymentMethods ↔ Benefits)
| Columna | Tipo |
|---------|------|
| `id_benefit` | VARCHAR(4) PK, FK → Benefits |
| `id_payment_method` | INT PK, FK → PaymentMethods |

Lado propietario: `BenefitsEntity.payment_methods`. La entidad
`PaymentBenefitEntity` se eliminó; el servicio `PaymentBenefitService` que quedó
ya no lo usa nadie y es código muerto.

---

## DTOs

### `BenefitsCreateDTO`
> `interface` de TypeScript: **sin validación de entrada**.

| Campo | Descripción |
|-------|-------------|
| `id_admin` | ID de la cuenta administradora |
| `id_partner` | ID del negocio |
| `id_type` | ID del tipo de beneficio |
| `start_date` | Inicio de la vigencia (datetime) |
| `end_date` | Fin de la vigencia (datetime) |
| `image` | URL de imagen (si no se provee, se genera placeholder) |
| `title` | Título |
| `description` | Descripción |
| `coupons` | Cupones iniciales |
| `max_coupons` | Cupones máximos |
| `max_per_user` | Máximo por usuario |
| `payment_methods` | **Nuevo**: array de **nombres** de métodos de pago |

### `BenefitsUpdateDTO`
> Todos los campos opcionales; solo se aplican los definidos.

| Campo | Validación |
|-------|------------|
| `id_benefit` | Obligatorio |
| `title`, `description` | Opcional, string |
| `image` | Opcional, URL |
| `start_date`, `end_date` | Opcional (sin validador de tipo) |
| `coupons`, `max_coupons`, `max_per_user` | Opcional, number |
| `status` | Opcional, **string** — no valida contra el enum, acepta cualquier valor |

### `BenefitsSearchDTO`
| Campo | Validación |
|-------|------------|
| `text` | Obligatorio, string |

### `BenefitsReturn`
```json
{
  "id_benefit": "0001",
  "id_admin": "0001",
  "id_partner": "0001",
  "partner": "Restaurante El Buen Sabor",
  "type": "Descuento",
  "categories": ["Gastronomía"],
  "payment_methods": ["Efectivo", "Mercado Pago"],
  "logo": "https://placehold.co/200x200?text=...",
  "directions": ["Av. Mitre 1450", "Bv. San Juan 200"],
  "start_date": "2024-01-01T00:00:00.000Z",
  "end_date": "2024-12-31T00:00:00.000Z",
  "image": "https://placehold.co/600x400?text=...",
  "title": "Descuento 20%",
  "description": "Descuento en todos los productos",
  "coupons": 50,
  "max_coupons": 100,
  "max_per_user": 3,
  "status": "ACTIVE",
  "refund_limit": null
}
```

`directions` pasó de ser un string a un array, y `categories` se aplana desde
la relación del partner.

---

## Servicios

| Servicio | Métodos principales |
|----------|-------------------|
| `BenefitsService` | `get_all()`, `get_actives()`, `get_popular()`, `get_news()`, `get_by_partner()`, `get_benefit()`, `get_coupons()`, `search()`, `create()`, `update()`, `activate()`, `delete()`, `incrementCoupons()`, `decrementCoupons()`, `findOneActive()`, `getMappedByIds()`, `getPaymentMethodNames()` |
| `BenefitTypeService` | `get_all()`, `create()`, `delete()`, `get_by_id()` |
| `CategoriesService` | `create()`, `findAll()`, `findActives()`, `get_by_id()`, `toggleActive()` |
| `PaymentMethodsService` | `getMethods()` |
| `PartnersCategoriesService` | `create()`, `findAll()`, `findByPartner()` |

## Tablas en DB

- `Benefits`
- `BenefitTypes`
- `Categories`
- `PaymentMethods`
- `Partners_Categories`
- `PaymentMethods_Benefits`
