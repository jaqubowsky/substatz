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

# Install Node.js and npm (npm needed for prisma migrate deploy)
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

# Copy Prisma generated client, adapter, CLI, schema, and migrations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder /app/node_modules/mariadb ./node_modules/mariadb

# Use the non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
