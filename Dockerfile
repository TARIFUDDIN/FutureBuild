# Production Dockerfile - Prisma Binary Fix

FROM node:18-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY prisma ./prisma/
RUN ./node_modules/.bin/prisma generate

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:18-bookworm-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    openssl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY package.json package-lock.json ./
RUN npm ci --only=production --legacy-peer-deps

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# CRITICAL: Copy Prisma client from builder to ensure binaries are present
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]