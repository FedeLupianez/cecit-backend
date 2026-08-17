# Endpoints - Métodos de Pago por Beneficio

En este archivo se detalla el funcionamiento interno de los endpoints relacionados a la relación entre métodos de pago y beneficios.

---

## Módulo Payment-Benefit

El controlador de `PaymentBenefit` no expone endpoints públicos. La relación entre métodos de pago y beneficios se utiliza internamente desde el servicio de `Benefits` para obtener los métodos de pago disponibles para cada beneficio.

### Estructura de la entidad

Tabla: `PaymentMethods_Benefits`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_payment_method` | int | Primary Key. ID del método de pago. |
| `id_benefit` | varchar(4) | Primary Key. ID del beneficio. |

### Relaciones

- `@ManyToOne(() => PaymentMethodsEntity)` via `id_payment_method`.
- `@ManyToOne(() => BenefitsEntity)` via `id_benefit`.

### Uso

La relación se consulta desde `BenefitsService` al mapear beneficios para los endpoints `GET /benefits/all`, `GET /benefits/popular` y `GET /benefits/news`, donde se obtienen los nombres de los métodos de pago asociados a cada beneficio.
