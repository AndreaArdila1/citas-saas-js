<p align="center">
  <h1 align="center"> Agenda Fácil</h1>
  <p align="center">SaaS multi-tenant de agendamiento de citas para pequeños negocios de servicios</p>
  <p align="center">
    <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-11-red?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://stripe.com/"><img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe" /></a>
  </p>
</p>

---

## Objetivo

**Agenda Fácil** es una plataforma SaaS multi-tenant diseñada para pequeños negocios de servicios que necesitan digitalizar la reserva de citas sin complicaciones. 

## Características principales

- **Multi-tenant** — Cada negocio opera de forma aislada con sus propios servicios, profesionales, configuración y agenda.
- **Reserva en línea** — Cualquier usuario registrado puede reservar citas verificando antes que el profesional ofrece el servicio solicitado.
- **Control de solapamientos** — El sistema valida automáticamente que un profesional no tenga dos citas que se crucen en el mismo rango horario (responde `409 Conflict` si hay cruce).
- **Autenticación JWT** — Registro e inicio de sesión con contraseñas cifradas (bcrypt) y tokens que expiran en 1 hora.
- **Roles de usuario** — `CLIENTE` (rol por defecto) y `DUENO` (se obtiene automáticamente al crear el primer negocio).
- **Monetización con Stripe** — Plan FREE incluido; upgrade a plan PRO mediante Stripe Checkout y activación automática vía Webhook verificado por firma.
- **Asistente de IA con Google Gemini** — Genera mensajes de confirmación de citas listos para enviar por WhatsApp (exclusivo del plan PRO; con clave API ausente funciona en modo simulado).
- **Documentación interactiva** — Swagger/OpenAPI disponible en `/docs` con autenticación Bearer.
- **Seguridad** — Helmet, validación global de DTOs (`whitelist` + `transform`), filtro global de excepciones y autorización por propiedad en cada operación sensible.

## Stack tecnológico

### Backend

| Tecnología | Propósito |
|---|---|
| [NestJS 11](https://nestjs.com/) | Framework backend con arquitectura modular (TypeScript) |
| [Prisma 7](https://www.prisma.io/) | ORM con driver adapter `@prisma/adapter-pg` |
| [PostgreSQL](https://www.postgresql.org/) | Base de datos relacional |
| [@nestjs/jwt](https://docs.nestjs.com/security/jwt) + [Passport](https://www.passportjs.org/) | Autenticación basada en tokens JWT |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Cifrado de contraseñas |
| [Stripe](https://stripe.com/) | Suscripciones y pagos (Checkout + Webhooks) |
| [Google Gemini](https://ai.google.dev/) | Generación de mensajes con IA |
| [Helmet](https://www.npmjs.com/package/helmet) | Cabeceras de seguridad HTTP |
| [class-validator](https://github.com/typestack/class-validator) / [class-transformer](https://github.com/typestack/class-transformer) | Validación y transformación de DTOs |
| [Swagger](https://docs.nestjs.com/openapi/introduction) | Documentación OpenAPI interactiva |

### Frontend

| Tecnología | Propósito |
|---|---|
| HTML5 / CSS3 / JavaScript (vanilla) | Panel de pruebas que consume la API (`frontend/index.html`) |


## Estructura del proyecto

```
citas-saas/
├── prisma/
│   ├── schema.prisma            # Modelos del dominio
│   └── migrations/              # Migraciones de base de datos
├── src/
│   ├── main.ts                  # Bootstrap (Helmet, CORS, ValidationPipe, Swagger)
│   ├── app.module.ts            # Registro de todos los módulos
│   ├── prisma/                  # PrismaService (driver adapter pg)
│   ├── auth/                    # Registro, login, JWT guards y decoradores
│   ├── negocios/                # CRUD de negocios (entidad tenant)
│   ├── perfiles/                # Perfil extendido del usuario
│   ├── configuracion/           # Horarios y zona horaria por negocio
│   ├── servicios/               # Catálogo de servicios
│   ├── profesionales/           # Profesionales y asignación a servicios (N:M)
│   ├── citas/                   # Reserva y agenda (núcleo del sistema)
│   ├── suscripciones/           # Stripe: estado, checkout y webhook
│   ├── asistente-ia/            # Gemini: mensajes de confirmación (plan PRO)
│   ├── common/filters/          # Filtro global de excepciones HTTP
│   └── generated/prisma/        # Cliente Prisma generado (no editar)
├── frontend/
│   └── index.html               # Panel de pruebas
├── test/                        # Tests e2e
├── prisma.config.ts             # Configuración de Prisma 7
├── .env.example                 # Plantilla de variables de entorno
└── package.json
```

## Requisitos previos

- **Node.js** 20 o superior
- **PostgreSQL** 14 o superior
- **npm** (incluido con Node.js)
- Cuenta en **[Stripe](https://stripe.com/)** en modo prueba *(opcional — solo para el plan PRO)*
- Clave API de **[Google Gemini](https://ai.google.dev/)** *(opcional — sin ella el asistente de IA funciona en modo simulado)*

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd citas-saas
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Edita `.env` con tus valores (ver sección [Variables de entorno](#-variables-de-entorno)).

4. **Crear la base de datos y ejecutar migraciones**

   Crea una base de datos en PostgreSQL (por ejemplo, `citas_saas`) y luego:

   ```bash
   npx prisma migrate deploy
   ```

   > En desarrollo puedes usar `npx prisma migrate dev` para crear y aplicar migraciones en caliente.

5. **Generar el cliente de Prisma** *(se ejecuta automáticamente con `migrate`, pero puedes regenerarlo manualmente)*

   ```bash
   npx prisma generate
   ```

## Variables de entorno

| Variable | Descripción | Ejemplo / Notas |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://usuario:clave@localhost:5432/citas_saas?schema=public` |
| `JWT_SECRET` | Secreto para firmar y verificar tokens JWT | Valor aleatorio largo y seguro en producción |
| `PORT` | Puerto del servidor API | `3000` (por defecto) |
| `APP_URL` | URL base del frontend para redirecciones de Stripe Checkout | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (modo prueba) | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Secreto para verificar la firma de los webhooks de Stripe | `whsec_...` |
| `GEMINI_API_KEY` | Clave de Google Gemini para el asistente de IA | *Vacío activa el modo simulado* |
| `GEMINI_MODEL` | Modelo de Gemini a utilizar | `gemini-flash-latest` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:3000` |


## Ejecución

### Backend

```bash
# Modo desarrollo (watch mode)
npm run start:dev

# Modo debug
npm run start:debug

# Modo producción (requiere build previo con npm run build)
npm run start:prod
```

El servidor queda disponible en `http://localhost:3000`.

### Documentación Swagger

Con el servidor corriendo, abre:

```
http://localhost:3000/docs
```

### Frontend (panel de pruebas)

Abre directamente el archivo `frontend/index.html` en tu navegador, o sírvelo con cualquier servidor estático:

```bash
npx serve frontend
```

> El panel incluye un campo para apuntar la URL de la API en caso de que no corra en `localhost:3000`.

## Tests y calidad de código

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de código
npm run test:cov

# Lint (ESLint + Prettier)
npm run lint

# Formateo
npm run format
```

## Planes

| Plan | Precio | Incluye |
|---|---|---|
| **FREE** | Gratis | Crear negocio, servicios, profesionales, configuración y recibir citas |
| **PRO** | $9 USD/mes | Todo lo del plan FREE + asistente de IA para mensajes de confirmación por WhatsApp |

## Licencia

Proyecto privado. Todos los derechos reservados.
