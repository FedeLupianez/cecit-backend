# Endpoints - Administradores de Partners

En este archivo se detalla el funcionamiento interno de cada endpoint relacionado a los administradores de partners de la plataforma.

---

## `POST /partners-admins/create`

Protegido con `@UseGuards(AuthGuard('jwt'), AdminGuard)`. Crea un nuevo administrador para un partner.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `partner_name` | String | Nombre del partner al que se asociará el admin. |
| `email` | String | Correo electrónico del administrador. |
| `password` | String | Contraseña del administrador. |

### Lógica de negocio

1. Se busca el partner por nombre mediante `partnersService.get_by_name(admin.partner_name)` (búsqueda en minúsculas).
2. Se genera un nuevo ID vía `dbService.getNewId('Partners_Admins', 'id_user')`.
3. Se crea la entidad `PartnersAdminsEntity` con el `id_user` generado y el `id_partner` obtenido.
4. Se guarda la entidad. Si falla, `InternalServerErrorException`.
5. Se retorna la entidad creada.

**Nota:** Este endpoint solo crea el registro de relación en `Partners_Admins`. No crea una cuenta en `Accounts`; la cuenta debe existir previamente con el `id_user` que se genera aquí.

### Respuesta

```json
{
  "id_user": "0005",
  "id_partner": "0002"
}
```
