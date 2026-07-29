# Endpoints - Métodos de Pago

En este archivo se detalla el funcionamiento interno de cada endpoint relacionado a los métodos de pago de la plataforma.

---

## `GET /payment-methods/all`

Obtiene todos los métodos de pago activos.

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Se obtienen todas las entidades `PaymentMethodsEntity` donde `active: true`, seleccionando solo el campo `name`.
2. Se mapea a un arreglo de strings (solo los nombres).
3. Se retorna un arreglo de nombres de métodos de pago.

### Respuesta

```json
["Efectivo", "Tarjeta de Crédito", "Transferencia"]
```
