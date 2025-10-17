# Dockerfile - Using Debian for better compatibility

# ---------------------------------------------
# Stage 1: Dependency Installation (Used by Runner)
# We keep this lightweight, only installing production dependencies.
FROM node:18-bookworm-slim AS deps
WORKDIR /app

# Install canvas dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

# Install ONLY production dependencies here
RUN npm ci --only=production

# 🛑 REMOVED: COPY prisma/ and RUN npx prisma generate from here.
# These will now run in the 'builder' stage.
# ---------------------------------------------


# ---------------------------------------------
# Stage 2: Builder (Where Dev Dependencies and Build Steps Run)
FROM node:18-bookworm-slim AS builder
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

# 1. Install ALL dependencies (including dev dependencies like Prisma CLI)
RUN npm install

# 2. Copy Prisma files
COPY prisma ./prisma/

# 3. Generate the Prisma client (Should now work as Prisma is installed)
RUN npx prisma generate

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build
# ---------------------------------------------


# ---------------------------------------------
# Stage 3: Runner (Final Image)
FROM node:18-bookworm-slim AS runner
WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# 🛑 UPDATED: Copy node_modules from 'deps' (prod-only)
COPY --from=deps /app/node_modules ./node_modules

# Copy built app and necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 🛑 UPDATED: Copy the generated Prisma directory from the 'builder' stage
COPY --from=builder /app/prisma ./prisma

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
# ---------------------------------------------