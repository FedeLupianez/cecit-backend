# Endpoints - Tipos de Beneficio

En este archivo se detalla el funcionamiento interno de cada endpoint relacionado a los tipos de beneficio de la plataforma.

---

## `GET /benefit-types/all`

Obtiene todos los tipos de beneficio registrados.

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Se obtienen todas las entidades `BenefitTypeEntity`.
2. Se mapea cada una mediante `BenefitTypeMapper.toDTO()` que retorna `{ id_type, name }`.
3. Se devuelve un arreglo de `BenefitTypeDTO`.

### Respuesta

```json
[
  {
    "id_type": 1,
    "name": "Descuento"
  },
  {
    "id_type": 2,
    "name": "Promoción"
  }
]
```

---

## `POST /benefit-types`

Protegido con `@UseGuards(AuthGuard('jwt'), CecitAdminGuard)`. Crea un nuevo tipo de beneficio.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre del tipo de beneficio. |
| `active` | Boolean | Estado activo o inactivo. |

### Lógica de negocio

1. Se crea la entidad a partir del DTO mediante `benefitTypeRepository.create(benefitType)`.
2. Se guarda en base de datos.
3. Se retorna la entidad mapeada a `BenefitTypeDTO`.

### Respuesta

```json
{
  "id_type": 3,
  "name": "Cupón"
}
```

---

## `DELETE /benefit-types`

Protegido con `@UseGuards(AuthGuard('jwt'), CecitAdminGuard)`. Elimina un tipo de beneficio.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_type` | Number | ID del tipo de beneficio a eliminar. |

### Lógica de negocio

1. Se ejecuta `benefitTypeRepository.delete({ id_type })`.
2. Si falla, se lanza `NotFoundException`.
3. Se retorna `true`.

### Respuesta

```json
true
```
