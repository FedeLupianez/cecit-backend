# Endpoints - Partners (Comercios)

En este archivo se detalla el funcionamiento interno de cada endpoint relacionado a los partners (comercios afiliados) de la plataforma.

---

## `GET /partners/all`

Obtiene todos los partners registrados con su nombre y logo.

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Se obtienen todos los partners seleccionando solo los campos `name` y `logo`.
2. Si no hay partners, se lanza `NotFoundException`.
3. Se retorna un arreglo de `{ name, logo }`.

### Respuesta

```json
[
  {
    "name": "partner ejemplo",
    "logo": "https://example.com/logo.png"
  }
]
```

---

## `POST /partners`

Crea un nuevo partner y automáticamente crea un administrador asociado.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `partner_name` | String | Nombre del partner. |
| `email` | String | Correo electrónico del admin. |
| `password` | String | Contraseña del admin. |
| `logo` | String | URL del logo. |
| `direction` | String | Dirección del comercio. |

### Lógica de negocio

1. **Creación del partner** (`partnersService.create()`):
   - Se genera un nuevo ID vía `dbService.getNewId('Partners', 'id_partner')`.
   - Se crea la entidad con `id_partner`, `name` (en minúsculas), `direction`, `logo`.
   - Se guarda. Si falla, `InternalServerErrorException`.
2. **Creación del admin** (`adminsService.create()`):
   - Se busca el partner por nombre vía `partnersService.get_by_name(partner_name)` (en minúsculas).
   - Se genera un nuevo ID vía `dbService.getNewId('Partners_Admins', 'id_user')`.
   - Se crea `PartnersAdminsEntity` con `id_user` e `id_partner`.
   - Se guarda. Si falla, `InternalServerErrorException`.

**Nota:** A diferencia de otros endpoints de creación, `POST /partners` también se encarga de crear el registro del administrador en `Partners_Admins`, estableciendo la relación entre el partner y su cuenta administradora.

### Respuesta

```json
{
  "id_partner": "0003",
  "name": "nuevo comercio",
  "logo": "https://example.com/logo.png",
  "direction": "Av. Principal 456",
  "active": true
}
```

---

## `DELETE /partners/:id`

Elimina un partner por su ID.

### Parámetros de entrada

| Campo | Tipo | Origen | Descripción |
|-------|------|--------|-------------|
| `id` | String | URL param | ID del partner a eliminar. |

### Lógica de negocio

1. Se valida que `id` no esté vacío.
2. Se busca el partner por `id_partner`. Si no existe, `NotFoundException`.
3. Se elimina el partner. Si falla, `InternalServerErrorException`.
4. Se retorna `true`.

### Respuesta

```json
true
```

---

## `PATCH /partners/logo`

Protegido con `@UseGuards(AuthGuard('jwt'), AdminGuard)`. Actualiza el logo de un partner.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_partner` | String | ID del partner. |
| `new_logo` | String | Nueva URL del logo. |

### Lógica de negocio

1. Se busca el partner por `id_partner`. Si no existe, `BadRequestException`.
2. Se actualiza `partner.logo = data.new_logo`.
3. Se guarda el partner.
4. Se retorna el partner mapeado a `PartnersDTO`.

### Respuesta

```json
{
  "id_partner": "0001",
  "name": "partner ejemplo",
  "logo": "https://example.com/nuevo-logo.png",
  "direction": "Calle Falsa 123",
  "active": true
}
```

---

## `PATCH /partners/name`

Protegido con `@UseGuards(AuthGuard('jwt'), AdminGuard)`. Actualiza el nombre de un partner.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_partner` | String | ID del partner. |
| `new_name` | String | Nuevo nombre del partner. |

### Lógica de negocio

1. Se busca el partner por `id_partner`. Si no existe, `BadRequestException`.
2. Se actualiza `partner.name = data.new_name.toLowerCase()`.
3. Se guarda el partner.
4. Se retorna el partner mapeado a `PartnersDTO`.

### Respuesta

```json
{
  "id_partner": "0001",
  "name": "nuevo nombre",
  "logo": "https://example.com/logo.png",
  "direction": "Calle Falsa 123",
  "active": true
}
```
