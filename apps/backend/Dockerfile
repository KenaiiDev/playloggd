# Multi-stage build para optimizar el tamaño de la imagen

# Stage 1: Build
FROM node:22-alpine AS builder

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.18.0 --activate

WORKDIR /app

# Copiar archivos de configuración del monorepo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copiar configuración de los paquetes
COPY apps/backend/package.json ./apps/backend/
COPY domain/package.json ./domain/

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY domain ./domain
COPY apps/backend ./apps/backend

# Build del paquete domain
WORKDIR /app/domain
RUN pnpm run build

# Build del backend
WORKDIR /app/apps/backend
RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine AS runner

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.18.0 --activate

WORKDIR /app

# Copiar solo lo necesario desde el builder
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/domain/package.json ./domain/

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar archivos compilados
COPY --from=builder /app/domain/dist ./domain/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

WORKDIR /app/apps/backend

# Generar Prisma Client (prisma ahora está en dependencies)
RUN pnpm prisma generate

# Exponer el puerto
EXPOSE 3001

# Usuario no-root para seguridad
USER node

# Comando de inicio
CMD ["node", "dist/server.js"]