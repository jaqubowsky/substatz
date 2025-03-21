# Stage 1: Dependencies and Build
FROM alpine:3.19 AS build

# Install Node.js and npm with minimal additional packages
RUN apk add --no-cache nodejs~=20 npm~=10 python3 make g++ curl

WORKDIR /app

# Copy package files and prisma schema
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install only production dependencies
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Install dev dependencies
COPY --chown=node:node .npmrc* ./
RUN npm ci --no-audit --no-fund && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client explicitly with minimal output
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 2: Production runtime - using minimal Alpine
FROM alpine:3.19 AS production

# Install only Node.js runtime with no extra packages
RUN apk add --no-cache nodejs~=20 && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy the entire standalone directory (which is already optimized by Next.js)
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# Copy only the necessary Prisma files - using a safer approach
COPY --from=build --chown=nextjs:nodejs /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build --chown=nextjs:nodejs /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=build --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expose the port the app will run on
EXPOSE 3000

# Start the application - optimized for lower memory usage
CMD ["node", "server.js"]
