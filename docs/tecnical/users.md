# Endpoints - Usuarios (Socios CeCIT)

En este archivo se detalla el funcionamiento interno de cada endpoint relacionado a los usuarios (socios de CeCIT) de la plataforma.

---

## `GET /users/all`

Protegido con `@UseGuards(AuthGuard('jwt'), CecitAdminGuard)`. Obtiene todos los usuarios registrados.

### Parámetros de entrada

Ninguno.

### Lógica de negocio

1. Se obtienen todas las entidades `UsersEntity` mediante `userRepository.find()`.
2. Si no hay usuarios, se lanza `InternalServerErrorException`.
3. Se mapea cada usuario mediante `UsersMapper.toDTO()` que retorna `{ id_user, name, dni, last_name }`.
4. Se retorna un arreglo de `UsersDTO`.

### Respuesta

```json
[
  {
    "id_user": "0001",
    "name": "Juan",
    "dni": "12345678",
    "last_name": "Pérez"
  }
]
```

---

## `DELETE /users`

Protegido con `@UseGuards(AuthGuard('jwt'))`. Elimina un usuario del sistema.

### Parámetros de entrada

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_user` | String | ID del usuario a eliminar. |

### Lógica de negocio

1. Se ejecuta `userRepository.delete({ id_user })`.
2. Si no se eliminó ningún registro, se lanza `NotFoundException`.
3. Se retorna `{ result: 'ok' }` en caso de éxito.

### Respuesta

```json
{
  "result": "ok"
}
```
