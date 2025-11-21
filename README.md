# Playloggd

## Descripción del Proyecto

Playloggd es un sistema diseñado para gestionar y registrar actividades relacionadas con videojuegos, permitiendo a los usuarios organizar su colección de juegos según diferentes estados (Jugando, Terminado, Deseado, etc.) y crear reseñas detalladas de los mismos. Este proyecto utiliza principios de arquitectura limpia y desarrollo guiado por pruebas (TDD) para garantizar un código modular, escalable y fácil de mantener.

## Funcionalidades Implementadas

### 1. Autenticación y Gestión de Usuarios

- **Registro de usuarios**: Creación de cuentas con validación de datos
- **Autenticación JWT**: Login con tokens de acceso y refresh tokens
- **Gestión de contraseñas**: Cambio de contraseña con validación del password actual
- **Perfiles de usuario**: Gestión de avatar, biografía y datos personales
- **Eliminación de cuentas**: Opción para que usuarios eliminen sus cuentas

### 2. Integración con IGDB (Internet Game Database)

- **Búsqueda de juegos**: Búsqueda por nombre con resultados paginados
- **Detalles de juegos**: Información completa de cada juego desde IGDB
- **Filtros avanzados**: Búsqueda por múltiples criterios (género, plataforma, fecha, etc.)
- **Listados curados**:
  - Juegos más populares
  - Próximos lanzamientos
  - Mejor valorados
  - Lanzamientos recientes

### 3. Colección de Juegos (Game Entries)

- **Agregar juegos a la colección**: Los usuarios pueden añadir juegos a su biblioteca personal
- **Estados de juego**: 10 estados diferentes para organizar la colección
  - **Planificación**: Wishlist, Backlog
  - **Activos**: Playing, On Hold
  - **Terminados**: Completed, Fully Completed
  - **Abandonados**: Dropped, Not For Me
  - **Especiales**: Replay, Reviewing
- **Actualizar estado**: Cambiar el estado de un juego en la colección
- **Ver colección**: Obtener la colección completa o filtrada por estado
- **Eliminar de colección**: Remover juegos de la biblioteca personal

### 4. Reseñas de Juegos (Game Reviews)

- **Crear reseñas**: Escribir reseñas detalladas con calificación (0-5 estrellas)
- **Datos opcionales**: Horas jugadas y fecha de finalización
- **Actualizar reseñas**: Modificar reseñas existentes
- **Eliminar reseñas**: Borrar reseñas propias
- **Ver reseñas**: Consultar reseñas por juego o por usuario
- **Constraint único**: Un usuario solo puede tener una reseña por juego

## Estructura del Proyecto

El proyecto sigue una arquitectura de monorepo con pnpm workspaces, separando claramente el dominio (lógica de negocio) y el backend (infraestructura):

```text
playloggd/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── eslint.config.ts
├── domain/                          # Módulo de lógica de negocio
│   ├── package.json
│   ├── src/
│   │   ├── entities/                # Entidades del dominio
│   │   │   ├── user.ts
│   │   │   ├── game.ts
│   │   │   ├── game-entry.ts
│   │   │   └── game-review.ts
│   │   ├── use-cases/               # Casos de uso organizados por feature
│   │   │   ├── auth/                # Login, register, change-password, refresh-token
│   │   │   ├── user/                # Profile, delete-account
│   │   │   ├── game/                # Search, details, filters, listings
│   │   │   ├── game-entry/          # Collection management, status updates
│   │   │   └── game-review/         # Create, update, delete, get reviews
│   │   ├── services/                # Interfaces de servicios
│   │   └── errors/                  # Errores del dominio
├── apps/
│   ├── backend/                     # API REST con Express
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Esquema de base de datos
│   │   │   └── migrations/          # Migraciones de Prisma
│   │   └── src/
│   │       ├── adapters/            # Implementaciones de servicios
│   │       │   ├── bcrypt-adapter.ts
│   │       │   ├── jwt-adapter.ts
│   │       │   └── igdb/            # Cliente IGDB
│   │       ├── config/              # Configuración e inyección de dependencias
│   │       ├── controllers/         # Controladores de Express (5 módulos)
│   │       ├── middleware/          # Authenticate, error-handler, validate-schema
│   │       ├── routes/              # Definición de rutas
│   │       ├── services/            # Implementaciones de servicios del dominio
│   │       ├── validations/         # Schemas de validación con Zod
│   │       └── tests/               # Configuración de tests
│   └── frontend/                    # Planeado para el futuro
```

## Tecnologías Utilizadas

### Core

- **Node.js 22** con **TypeScript 5.7** para desarrollo type-safe
- **PNPM** como manejador de paquetes (monorepo con workspaces)

### Backend

- **Express 5.1** como framework web
- **Prisma 6.2** como ORM para PostgreSQL
- **Zod 3.24** para validación de esquemas
- **JWT (jsonwebtoken)** para autenticación
- **Bcrypt** para hashing de contraseñas
- **IGDB API** para datos de videojuegos

### Testing

- **Vitest 3.2** como framework de testing
- **vitest-mock-extended** para mocking avanzado
- **node-mocks-http** para simular requests/responses de Express
- **Cobertura del 100%** en casos de uso y controladores

### Validación y Seguridad

- **Middleware de validación**: Validación de request body y params con Zod
- **Middleware de autenticación**: Verificación de JWT tokens
- **Error handling**: Manejo centralizado de errores
- **Unique constraints**: Prevención de duplicados en la base de datos

## Metodología de Desarrollo

El proyecto sigue una arquitectura limpia con TDD (Test-Driven Development):

### 1. Capa de Dominio (domain/)

- **Entidades**: Modelos del dominio con sus reglas de negocio (`User`, `Game`, `GameEntry`, `GameReview`)
- **Casos de Uso**: Lógica de negocio pura e independiente de frameworks
- **Servicios**: Interfaces que definen contratos sin implementación
- **Testing**: Cada caso de uso tiene su test unitario correspondiente

### 2. Capa de Infraestructura (apps/backend/)

- **Adaptadores**: Implementaciones concretas de los servicios (Bcrypt, JWT, IGDB)
- **Controladores**: Manejo de requests HTTP y respuestas
- **Middleware**: Validación, autenticación y manejo de errores
- **Routes**: Definición de endpoints con sus validaciones
- **Testing**: Tests unitarios para controladores con mocks de todas las dependencias

### 3. Validación en Múltiples Capas

- **Validación de Schemas**: Zod valida estructura y tipos en la capa HTTP
- **Validación de Negocio**: Los casos de uso validan reglas del dominio
- **Validación de Datos**: Prisma valida constraints a nivel de base de datos

### 4. Patrones Implementados

- **Dependency Injection**: Todas las dependencias se inyectan via constructores
- **Repository Pattern**: Servicios abstraen el acceso a datos
- **Error Handling**: Errores tipados del dominio (`ValidationError`, `NotFoundError`, etc.)
- **Middleware Chain**: Validación → Autenticación → Controlador

## Estado Actual del Proyecto

### ✅ Completado

- **Domain Layer**:
  - 4 entidades definidas (User, Game, GameEntry, GameReview)
  - 5 módulos de casos de uso completamente testeados
  - ~25 casos de uso implementados con tests unitarios
- **Backend API**:
  - 5 controladores con tests (Auth, User, Game, GameEntry, GameReview)
  - Middleware de autenticación JWT
  - Middleware de validación con Zod
  - Manejo centralizado de errores
  - Todas las rutas con validación de schemas
- **Base de Datos**:
  - Schema de Prisma definido
  - Migraciones configuradas
  - Relaciones entre entidades establecidas
- **Testing**:
  - Cobertura del 100% en casos de uso
  - Cobertura del 100% en controladores
  - Mocking completo de dependencias

### 🚧 En Progreso

- Implementación de los filtros dentro de getCollections
- Diseño e Implementación del frontend del proyecto

### 📋 Próximos Pasos

- **Frontend**: Implementar interfaz gráfica con React/Next.js
- **Features Adicionales**:
  - Sistema de amigos y seguidores
  - Recomendaciones personalizadas de juegos
  - Actividad y feed de usuarios
  - Comentarios en reseñas
  - Filtros avanzados en colecciones
- **Optimizaciones**:
  - Cache con Redis
  - Paginación optimizada
  - Rate limiting
  - Compresión de respuestas
- **DevOps**:
  - CI/CD pipeline
  - Containerización con Docker
  - Monitoreo y logging

## Instalación y Uso

### Prerequisitos

- Node.js 22 o superior
- PNPM 9 o superior
- PostgreSQL 14 o superior
- Cuenta en IGDB (Twitch Developer)

### Configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/KenaiiDev/playloggd.git
cd playloggd
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar variables de entorno (crear archivo `.env` en `apps/backend/`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/playloggd"
JWT_SECRET="tu-secret-key"
JWT_REFRESH_SECRET="tu-refresh-secret-key"
IGDB_CLIENT_ID="tu-client-id"
IGDB_CLIENT_SECRET="tu-client-secret"
```

4. Ejecutar migraciones:

```bash
cd apps/backend
pnpm prisma migrate dev
```

5. Iniciar el servidor de desarrollo:

```bash
pnpm dev
```

### Scripts Disponibles

- `pnpm test`: Ejecutar todos los tests
- `pnpm test:watch`: Tests en modo watch
- `pnpm test:coverage`: Ejecutar tests con reporte de cobertura
- `pnpm dev`: Iniciar servidor de desarrollo
- `pnpm build`: Compilar el proyecto
- `pnpm prisma:studio`: Abrir Prisma Studio

## Contribución

Este es un proyecto personal en desarrollo activo. Si deseas contribuir o reportar issues, siéntete libre de abrir un issue o pull request.
