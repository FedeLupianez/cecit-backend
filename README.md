# CeCIT Beneficios

Sistema de gestión de beneficios para los socios del **Centro de Comercio, Industria y Turismo de Alta Gracia (CeCIT)**.

## 📖 Descripción

Esta aplicación permite a los socios adheridos al CeCIT acceder a beneficios exclusivos ofrecidos por los comercios asociados.

El objetivo del sistema es fortalecer la red comercial local, facilitando la administración, consulta y utilización de promociones, descuentos y otros beneficios disponibles para los miembros de la institución.

## ✨ Características

- Autenticación de socios.
- Consulta de beneficios disponibles.
- Visualización de comercios adheridos.
- Gestión de promociones y descuentos.
- Administración de socios.
- Panel de administración para la gestión de beneficios.
- Historial de beneficios utilizados (opcional).
- Diseño responsive para dispositivos móviles.

## 👥 Tipos de usuarios

### Socios
- Iniciar sesión.
- Consultar beneficios vigentes.
- Utilizar promociones disponibles.
- Obtener Cupones de los beneficios vigentes.

### Administradores de Negocios
- Tienen todas las capacidades de un Socio.
- Crear, modificar y eliminar beneficios.
- Consultar estadísticas de uso.
- Gestionar el perfil del negocio.

## 🚀 Tecnologías

- Frontend: Svelte
- Backend: NestJS.
- ORM: TypeORM.
- Base de datos: MySQL.
- Autenticación: JWT.


## 📂 Estructura del proyecto

```text
src
├── auth
├── common
├── entities
│   ├── accounts
│   ├── benefits
│   ├── benefit-types
│   ├── categories
│   ├── partners
│   ├── partnersadmins
│   ├── partners_categories
│   ├── payment_benefit
│   ├── payment-methods
│   ├── refresh-token.entity.ts
│   ├── users
│   └── vouchers
├── pdf
    └── pdf.service.ts
└── ssh
    ├── ssh-tunnel.module.ts
    └── ssh-tunnel.service.ts
```

## Branchs
```text
Branchs
├── dev
│   └── Desarrollo
│       ├── Nuevas funcionalidades
│       ├── Correcciones
│       └── Cambios en desarrollo
│
├── test
│   └── Testing / QA
│       ├── Integración de cambios desde dev
│       ├── Pruebas funcionales
│       └── Validación antes de producción
│
└── main
    └── Producción
        ├── Código estable
        ├── Versiones aprobadas
        └── Deploy a producción
```

## 📌 Objetivo

Promover el comercio local mediante una plataforma digital que conecte a los socios del CeCIT con los beneficios ofrecidos por los comercios adheridos, simplificando su administración y utilización.

## Instalación

### Requisitos
- bun >= 1.3.14
- node >= v26.7.0
- git

### Clonar repositorio
```bash
    git clone https://github.com/FedeLupianez/cecit-backend
    cd cecit-backend
```

### Instalar dependencias
¡Tener en cuenta la rama en la que se está trabajando!
```bash
    bun install
```
o
```bash
    npm install
```

### Configurar variables de entorno
En un archivo .env.development poner las siguientes variables:
```env
SSH_HOST=
SSH_USER=
SSH_PASS=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
COOKIE_KEY=
JWT_SECRET=
JWT_ACCESS_EXPIRATION=
REFRESH_TOKEN_EXPIRES=
NODE_ENV=
```

## Correr el Proyecto
```bash
    bun run start:dev
```
o
```bash
    npm run start:dev
```

## 🔒 Seguridad

- Autenticación mediante JWT.
- Control de acceso por roles.
- Protección de rutas privadas.
- Validación de datos de entrada.

## 📈 Futuras mejoras

- Integración con QR para validar beneficios.
- Estadísticas avanzadas.

## 📄 Licencia

Este proyecto fue desarrollado para el **Centro de Comercio, Industria y Turismo de Alta Gracia (CeCIT)** por alumnos de la especialidad de programación del **Instituto Manuel de Falla**.
