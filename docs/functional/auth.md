# Módulo Auth

## Objetivo:
Gestionar la autenticación y autorización de los usuarios del sistema mediante JWT (access token) y refresh tokens.

## Actores:
- Usuarios (socios de CeCIT)
- Administradores de CeCIT
- Administradores de negocios

---

## Endpoints

### `GET /auth/profile`
Obtiene el perfil del usuario autenticado.
- **Auth:** JWT (Bearer token)
- **Respuesta:** payload del token `{ user_id, email, role }`

### `POST /auth/register`
Registra una nueva cuenta de socio.
- **Auth:** No requiere
- **Body:** `AccountCreateDTO` (`id_user`, `email`, `password`)
- **Respuesta:** `{ access_token }` + setea cookie `refresh_token_cecit` (httpOnly)

### `POST /auth/login`
Inicia sesión con credenciales.
- **Auth:** No requiere
- **Throttle:** 3 intentos por minuto
- **Body:** `LoginDTO` (`email`, `password`)
- **Respuesta:** `{ access_token }` + setea cookie `refresh_token_cecit` (httpOnly)

### `POST /auth/refresh`
Refresca el access token usando el refresh token almacenado en cookie.
- **Auth:** Cookie `refresh_token_cecit`
- **Respuesta:** `{ access_token }` + renueva cookie

### `POST /auth/logout`
Cierra sesión y elimina el refresh token de la base de datos.
- **Auth:** Cookie `refresh_token_cecit`

---

## Guards

### `JwtAuthGuard` (`@nestjs/passport`)
Protege rutas que requieren un JWT válido. Extrae el token del header `Authorization: Bearer <token>`.

### `AdminGuard`
Verifica que el usuario autenticado sea admin del negocio indicado en la request.
- Requiere: `id_partner` y `id_user` en params o body.
- Valida que exista la relación en `Partners_Admins`.

### `CecitAdminGuard`
Verifica que el usuario autenticado tenga rol `CECIT_ADMIN`.
- Consulta el rol desde la tabla `Accounts`.

---

## Flujo de autenticación

1. El usuario se registra o inicia sesión.
2. El servidor genera un par de tokens: **access_token** (JWT, expiración corta) y **refresh_token** (UUID, almacenado hasheado en DB).
3. El refresh_token se guarda en una cookie httpOnly y el access_token se devuelve en el body.
4. Cuando el access_token expira, el frontend usa `POST /auth/refresh` para obtener uno nuevo.
5. Al cerrar sesión, se elimina el refresh_token de la base de datos.

---

## Entidades relacionadas

- `AccountsEntity` — datos de la cuenta (email, password, rol)
- `RefreshTokenEntity` — tokens de refresco hasheados con SHA-256

## Tablas en DB

- `Accounts` — cuentas de usuario
- `RefreshTokens` — tokens de refresco

## Dependencias
- `@nestjs/jwt` — generación y validación de JWT
- `@nestjs/passport` + `passport-jwt` — estrategia JWT
- `argon2` — hasheo de contraseñas
- `@nestjs/throttler` — rate limiting en login
