# Start with a minimal Alpine Linux
FROM alpine:3.19 AS base

# Install Node.js and only essential dependencies
RUN apk add --no-cache nodejs npm libc6-compat

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

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client and build the application
RUN npx prisma generate && npm run build

# Final production stage with absolute minimal footprint
FROM alpine:3.19 AS runner

# Install only Node.js runtime - no npm needed for running
RUN apk add --no-cache nodejs

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

# Copy only what's needed from Prisma
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Use the non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
