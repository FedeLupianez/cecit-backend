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
- **Body:** `AccountCreateDTO` (`id_account`, `email`, `password`)
- **Respuesta:** `{ access_token }` + setea cookie `refresh_token_cecit` (httpOnly)
- **Rol inicial:** `PARTNER_ADMIN` si el socio es dueño de algún partner
  (`Partners.id_owner`), `USER` en caso contrario. Si es dueño, además se crea
  la relación en `Partners_Admins`.

### `POST /auth/login`
Inicia sesión con credenciales.
- **Auth:** No requiere
- **Throttle:** 3 intentos por minuto
- **Body:** `LoginDTO` (`email`, `password`)
- **Respuesta:** `{ access_token }` + setea cookie `refresh_token_cecit` (httpOnly)

### `POST /auth/refresh`
Refresca el access token usando el refresh token almacenado en cookie.
- **Auth:** Cookie `refresh_token_cecit`
- **Respuesta:** `{ access_token, profile }` + renueva cookie
- **Nota:** es la única respuesta que incluye `profile`; el frontend lo usa
  para rehidratarse sin un `GET /auth/profile` extra.

### `POST /auth/logout`
Cierra sesión, elimina el refresh token de la base de datos y limpia la cookie.
- **Auth:** Cookie `refresh_token_cecit`
- **Idempotente:** siempre responde `201 { ok: true }`, exista o no el token.

### `PATCH /auth/update`
El usuario edita su propia cuenta. El campo `process` decide la operación.
- **Auth:** JWT (Bearer token)
- **Body:** `UpdateProfileDTO` (`process`, `email`, `current_password`, y `new_email` o `new_password`)
- **Comportamiento:**
  - `process: "EMAIL"` → cambia el email y **borra todos los refresh tokens
    del email anterior**, obligando a re-autenticarse.
  - `process: "PASSWD"` → cambia la contraseña (hash argon2).
- **Respuesta:** `200 true` en el caso de contraseña; el `AccountsDTO`
  actualizado en el caso de email.

### `PATCH /auth/update-profile-admin`
Un `CECIT_ADMIN` cambia el email de cualquier cuenta.
- **Auth:** JWT + `CecitAdminGuard`
- **Body:** `UpdateProfileAdminDTO` (`id_account`, `email`, `new_email`)
- **Respuesta:** `200 AccountsDTO`

---

## Guards

### `JwtAuthGuard` (`@nestjs/passport`)
Protege rutas que requieren un JWT válido. Extrae el token del header `Authorization: Bearer <token>`. `JwtStrategy.validate()` devuelve `{ user_id, email, role }`.

### `AdminGuard`
Verifica que el usuario autenticado pueda operar sobre el negocio indicado.
- Resuelve el `id_partner` desde **params → query → body** (acepta
  `id_partner` o `idPartner`).
- **Camino rápido** (sin consulta a la base) usando el `role` del JWT:
  - `CECIT_ADMIN` → permitido sobre cualquier partner.
  - `PARTNER_ADMIN` → si hay `id_partner`, verifica la relación en
    `Partners_Admins`; si no hay, permite sin consultar.
  - Cualquier otro rol → `401`.
- **Fallback** (JWT sin `role`, por ejemplo tokens emitidos antes de que el
  campo existiera): consulta `Accounts` y aplica las mismas reglas.
- El id del usuario sale **siempre del JWT**, nunca de la request.

### `CecitAdminGuard`
Verifica que el usuario autenticado tenga rol `CECIT_ADMIN`.
- Camino rápido con el `role` del JWT; si no está, consulta `Accounts` por
  email.

### Verificación cacheada
`PartnersAdminsService.verify_admin(id_admin, id_partner)` cachea el resultado
positivo en memoria durante 60 s bajo la clave `admin-partner:<id>_<id_partner>`.
Consecuencia: quitar a un admin de un negocio surte efecto, como máximo, a los
60 s. Solo se cachean los resultados `true`.

---

## Flujo de autenticación

1. El usuario se registra o inicia sesión.
2. El servidor genera un par de tokens: **access_token** (JWT, 15 min por
   defecto) y **refresh_token** (doble UUID).
3. El refresh_token se hashea con SHA-256 y se guarda como `binary(32)` — la
   **clave primaria** de `RefreshTokens` —; el access_token se devuelve en el
   body con los claims `sub`, `email`, `role` y `jti`.
4. El refresh_token viaja en una cookie httpOnly `refresh_token_cecit`
   (7 días, `sameSite=strict` en producción, `lax` en desarrollo).
5. Cuando el access_token expira, el frontend usa `POST /auth/refresh`.
6. Al refrescar, el token anterior no se borra: se le acorta la expiración a
   60 s (ventana de gracia) para que navegaciones concurrentes del frontend no
   se pisen.
7. Al cerrar sesión, se elimina el refresh token de la base de datos.
8. Diariamente a las 03:00 un cron purga los refresh tokens ya vencidos.

---

## Entidades relacionadas

- `AccountsEntity` — datos de la cuenta (`id_account`, email, password, rol)
- `RefreshTokenEntity` — tokens de refresco hasheados con SHA-256

## Tablas en DB

- `Accounts` — cuentas de usuario
- `RefreshTokens` — tokens de refresco

## Dependencias
- `@nestjs/jwt` — generación y validación de JWT
- `@nestjs/passport` + `passport-jwt` — estrategia JWT
- `@nestjs/throttler` — rate limiting
- `@nestjs/schedule` — purga diaria de refresh tokens
- `argon2` — hasheo de contraseñas
- `cache-manager` — cache de la verificación de admin de partner
