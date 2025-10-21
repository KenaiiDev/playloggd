# Playloggd

## Descripción del Proyecto

Playloggd es un sistema diseñado para gestionar y registrar actividades relacionadas con videojuegos tales como el estado en el que se encuentra (Jugando, terminado, deseado, etc.) como reviews de los mismos. Este proyecto utiliza principios de arquitectura limpia y desarrollo guiado por pruebas (TDD) para garantizar un código modular, escalable y fácil de mantener.

## Funcionalidades Principales

### 1. Gestión de Usuarios

- Registro y autenticación de usuarios.
- Gestión de perfiles, incluyendo avatar y biografía.
- Roles y permisos para usuarios.

### 2. Gestión de Juegos

- Registro de juegos en la base de datos.
- Gestión de reseñas y entradas relacionadas con los juegos.
- Búsqueda y filtrado de juegos.

### 3. Funcionalidades Específicas

- Seguimiento de entradas de juegos (game entries).
- Creación y gestión de reseñas de juegos.

## Estructura del Proyecto

El proyecto sigue una estructura modular para separar claramente el dominio, el backend y el frontend:

```
playloggd/
├── README.md
├── package.json
├── tsconfig.json
├── domain/
│   ├── package.json
│   ├── src/
│   │   ├── entities/
│   │   ├── use-cases/
│   │   └── services/
├── apps/
│   ├── backend/
│   │   ├── package.json
│   │   └── src/
│   └── frontend/ # Planeado para el futuro
```

## Tecnologías Utilizadas

- **Node.js** con **TypeScript** para el desarrollo del dominio y backend.
- **PNPM** como manejador de paquetes.
- **Vitest** para pruebas unitarias.
- **Vitest-mock-extended** para el mock de distintas funcionalidades.
- **Express** como framework para el backend.
- **Prisma** para la gestión de la base de datos.

## Metodología de Desarrollo

El desarrollo sigue los principios de arquitectura limpia y TDD:

1. **Modelado del Dominio**:

   - Definición de entidades como `User`, `Game`, `GameEntry` y `GameReview`.
   - Identificación de relaciones entre entidades.

2. **Casos de Uso**:

   - Implementación de funcionalidades específicas como registro de usuarios, gestión de juegos y reseñas.
   - Desarrollo guiado por pruebas para garantizar la calidad del código.

3. **Backend**:
   - Construcción de una API REST para exponer las funcionalidades del dominio.
   - Pruebas de integración utilizando Bruno para realizar las peticiones a los endpoints

## Próximos Pasos

- Finalizar el backend con todos sus endpoints.
- Implementar la interfaz gráfica para interactuar con el sistema.
- Integrar funcionalidades avanzadas como recomendaciones de juegos, sistemas de amigos, mejorar sistema de filtros, etc.
- Optimizar el rendimiento del backend para manejar grandes volúmenes de datos.
