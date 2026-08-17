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

## 📌 Objetivo

Promover el comercio local mediante una plataforma digital que conecte a los socios del CeCIT con los beneficios ofrecidos por los comercios adheridos, simplificando su administración y utilización.

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
