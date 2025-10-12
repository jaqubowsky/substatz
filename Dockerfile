# Start with a minimal Alpine Linux
FROM alpine:3.19 AS base

# Install Node.js and only essential dependencies
RUN apk add --no-cache nodejs-current icu-data-full npm libc6-compat

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./

# Install ALL dependencies (including dev dependencies) since we need them for building
RUN npm ci

# Build stage for compiling the application
FROM base AS builder
WORKDIR /app

# Copy example env variables
COPY .env.example .env

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_NODE_ENV
ARG NEXT_PUBLIC_SENTRY_DSN

ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_NODE_ENV=${NEXT_PUBLIC_NODE_ENV}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client and build the application
RUN npx prisma generate && npm run build

# Final production stage with absolute minimal footprint
FROM alpine:3.19 AS runner

# Install Node.js + npm (npm adds ~40MB but needed for admin panel migrations)
RUN apk add --no-cache nodejs-current icu-data-full npm

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the standalone Next.js build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma essentials (client + CLI from builder, reusing what we already have)
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin

# Copy schema and migrations for admin panel
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Use the non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
