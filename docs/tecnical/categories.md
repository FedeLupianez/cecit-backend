# Endpoints - Categorías

En este archivo se detalla el funcionamiento interno de cada endpoint relacionado a las categorías de la plataforma.

---

## `POST /categories/create`

Protegido con `@UseGuards(AuthGuard('jwt'), CecitAdminGuard)`. Crea una nueva categoría.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre de la categoría. |
| `icon_url` | String | URL del ícono representativo. |
| `active` | Boolean (opcional) | Estado activo o inactivo. |

### Lógica de negocio

1. Se crea la entidad a partir del DTO mediante `repo.create(data)`.
2. Se guarda en base de datos.
3. Si falla el guardado, se lanza `InternalServerErrorException`.
4. Se retorna la entidad mapeada a `CategoriesDTO`.

### Respuesta

```json
{
  "name": "Restaurantes",
  "icon_url": "https://example.com/icons/restaurant.png",
  "active": true
}
```

---

## `GET /categories/all`

Obtiene todas las categorías registradas.

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Se obtienen todas las entidades `CategoriesEntity` mediante `repo.find()`.
2. Si no hay categorías, se lanza `NotFoundException`.
3. Se mapea cada una mediante `CategoriesMapper.toDTO()`.
4. Se devuelve un arreglo de `CategoriesDTO`.

### Respuesta

```json
[
  {
    "name": "Restaurantes",
    "icon_url": "https://example.com/icons/restaurant.png",
    "active": true
  },
  {
    "name": "Cafeterías",
    "icon_url": "https://example.com/icons/coffee.png",
    "active": true
  }
]
```
