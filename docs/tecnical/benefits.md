# Endpoints - Beneficios

En este archivo se detalla el funcionamiento interno de cada endpoint relacionado a los beneficios de la plataforma.

---

## `GET /benefits/all`

Obtiene todos los beneficios registrados con sus relaciones completas (partner, categorías, tipo, métodos de pago).

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Se obtienen todos los `BenefitsEntity` con las relaciones: `partner`, `partner.categories`, `partner.categories.category`, `type`.
2. Si no se encuentran beneficios, se lanza `InternalServerErrorException`.
3. Por cada beneficio se mapea a un `BenefitsReturn`:
   - Se extraen los nombres de categorías desde `partner.categories[].category.name`.
   - Se consulta `PaymentBenefitEntity` con relación `payment_method` donde `id_benefit` coincida.
   - Se extraen los nombres de métodos de pago.
4. Se devuelve un arreglo de `BenefitsReturn`.

### Respuesta

```json
[
  {
    "id_benefit": "0001",
    "id_admin": "0001",
    "id_partner": "0001",
    "date_entered": "2024-01-15T00:00:00.000Z",
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": "2024-12-31T00:00:00.000Z",
    "image": "https://example.com/image.jpg",
    "title": "Descuento 20%",
    "description": "Descuento en todos los productos",
    "id_type": 1,
    "status": "ACTIVE",
    "coupons": 50,
    "max_coupons": 100,
    "partner_name": "Partner Ejemplo",
    "partner_logo": "https://example.com/logo.png",
    "direction": "Calle Falsa 123",
    "categories": ["Restaurantes", "Cafeterías"],
    "payment_methods": ["Efectivo", "Tarjeta"],
    "type_name": "Descuento"
  }
]
```

---

## `GET /benefits/popular`

Obtiene los 20 beneficios más populares según la cantidad de cupones canjeados.

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Igual que `get_all()` pero ordenado por `coupons: 'DESC'` y limitado a 20 registros.
2. El mapeo es idéntico al de `get_all()`.

### Respuesta

```json
[
  { "... mismo formato que /benefits/all ..." }
]
```

---

## `GET /benefits/news`

Obtiene los 20 beneficios más recientes según su fecha de ingreso.

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Igual que `get_all()` pero ordenado por `date_entered: 'DESC'` y limitado a 20 registros.
2. El mapeo es idéntico al de `get_all()`.

### Respuesta

```json
[
  { "... mismo formato que /benefits/all ..." }
]
```

---

## `POST /benefits`

Protegido con `@UseGuards(AuthGuard('jwt'), CecitAdminGuard)`. Crea un nuevo beneficio.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_admin` | String | ID de la cuenta administradora. |
| `id_partner` | String | ID del partner asociado. |
| `id_type` | Number | ID del tipo de beneficio. |
| `start_date` | Date | Fecha de inicio del beneficio. |
| `end_date` | Date | Fecha de fin del beneficio. |
| `image` | String | URL de la imagen del beneficio. |
| `title` | String | Título del beneficio. |
| `description` | String | Descripción del beneficio. |
| `coupons` | Number | Cantidad de cupones canjeados. |
| `max_coupons` | Number | Cantidad máxima de cupones. |

### Lógica de negocio

1. Se busca el admin por `id_admin` vía `accountService.get_by_id()`. Si no existe, `NotFoundException`.
2. Se busca el partner por `id_partner` vía `partnersService.get_by_id()`. Si no existe, `NotFoundException`.
3. Se busca el tipo de beneficio por `id_type`. Si no existe, `NotFoundException`.
4. Se genera un nuevo ID vía `dbService.getNewId('Benefits', 'id_benefit')` (procedimiento almacenado MySQL `get_new_id`).
5. Se crea la entidad con los datos y las relaciones cargadas.
6. Se guarda y retorna la entidad mapeada a `BenefitsDTO`.

### Respuesta

```json
{
  "id_benefit": "0005",
  "id_admin": "0001",
  "id_partner": "0002",
  "date_entered": "2024-06-01T00:00:00.000Z",
  "start_date": "2024-06-15T00:00:00.000Z",
  "end_date": "2024-12-31T00:00:00.000Z",
  "image": "https://example.com/benefit.jpg",
  "title": "Nuevo Descuento",
  "description": "Descripción del nuevo descuento",
  "id_type": 2,
  "status": "ACTIVE",
  "coupons": 0,
  "max_coupons": 200
}
```

---

## `DELETE /benefits`

Protegido con `@UseGuards(AuthGuard('jwt'), CecitAdminGuard)`. Elimina un beneficio existente.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_benefit` | String | ID del beneficio a eliminar. |

### Lógica de negocio

1. Se ejecuta `benefitsRepository.delete({ id_benefit })`.
2. Si no se eliminó ningún registro, se lanza `NotFoundException`.
3. Se retorna `true`.

### Respuesta

```json
true
```
