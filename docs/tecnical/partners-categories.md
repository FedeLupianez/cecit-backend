# Endpoints - Categorías de Partners

En este archivo se detalla el funcionamiento interno de cada endpoint relacionado a la asignación de categorías a partners.

---

## `POST /partners-categories`

Protegido con `@UseGuards(AuthGuard('jwt'), CecitAdminGuard)`. Asigna una categoría a un partner.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_partner` | String | ID del partner. |
| `id_category` | Number | ID de la categoría. |

### Lógica de negocio

1. Se crea la entidad `PartnersCategoriesEntity` a partir del DTO mediante `repo.create(data)`.
2. Se guarda en base de datos.
3. Se retorna la entidad creada.

### Respuesta

```json
{
  "id_partner": "0001",
  "id_category": 2
}
```

---

## `GET /partners-categories`

Obtiene todas las relaciones partner-categoría con sus datos completos.

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Se obtienen todas las entidades `PartnersCategoriesEntity` con las relaciones `partner` y `category`.
2. Se retorna el arreglo completo con los objetos `partner` y `category` embebidos.

### Respuesta

```json
[
  {
    "id_partner": "0001",
    "id_category": 2,
    "partner": {
      "id_partner": "0001",
      "name": "partner ejemplo",
      "logo": "https://example.com/logo.png",
      "direction": "Calle Falsa 123",
      "active": true
    },
    "category": {
      "id_category": 2,
      "name": "Restaurantes",
      "icon_url": "https://example.com/icons/restaurant.png",
      "active": true
    }
  }
]
```
