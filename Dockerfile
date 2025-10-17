# Dockerfile - Production-Ready for Elastic Beanstalk
# Fixed for Prisma Client generation in final image

# =====================================================
# Stage 1: Dependencies (Production only)
# =====================================================
FROM node:18-bookworm-slim AS deps
WORKDIR /app

# Install system dependencies for native modules (canvas, etc.)
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# =====================================================
# Stage 2: Builder (All dependencies + build)
# =====================================================
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

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies like Prisma CLI)
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client in builder stage
RUN ./node_modules/.bin/prisma generate

# Copy entire application
COPY . .

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
RUN npm run build

# =====================================================
# Stage 3: Runner (Final lightweight image)
# =====================================================
FROM node:18-bookworm-slim AS runner
WORKDIR /app

# Install ONLY runtime dependencies (not build tools)
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

# Set runtime environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy built Next.js application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy Prisma directory (schema + generated client)
COPY --from=builder /app/prisma ./prisma

# CRITICAL FIX: Regenerate Prisma Client in final image
# This ensures all binaries are present even after copying
RUN ./node_modules/.bin/prisma generate

# Set proper file ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
# Using 'npm start' which runs 'next start' from package.json
# This is more stable than standalone mode
CMD ["npm", "start"]