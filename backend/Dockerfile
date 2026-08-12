# syntax=docker/dockerfile:1

# ---- Stage 1: build - compile TypeScript to JavaScript ----
FROM node:20-alpine AS build

WORKDIR /app

# python3/make/g++ are required to compile better-sqlite3's native addon
# when no prebuilt musl (alpine) binary is available.
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2: prod-deps - install only production dependencies ----
FROM node:20-alpine AS prod-deps

WORKDIR /app

RUN apk add --no-cache --virtual .build-deps python3 make g++

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && apk del .build-deps

# ---- Stage 3: runtime - lightweight, non-root final image ----
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=3000

# Required at runtime (no defaults are baked into the image):
#   JWT_ACCESS_SECRET, JWT_REFRESH_SECRET  - supply via `docker run -e` / secrets manager
# Optional overrides:
#   CORS_ORIGIN, JWT_ACCESS_EXPIRES_IN_SECONDS, JWT_REFRESH_EXPIRES_IN_SECONDS,
#   AUTH_RATE_LIMIT_WINDOW_MS, AUTH_RATE_LIMIT_MAX_ATTEMPTS
# The application database is an in-process SQLite instance (no external DB connection).

WORKDIR /app

RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "dist/server.js"]
