# Stage 1: Dependencies
FROM alpine:3.19 AS deps

RUN apk add --no-cache nodejs~=20 npm~=10

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install production dependencies only
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Stage 2: Build
FROM alpine:3.19 AS build

RUN apk add --no-cache nodejs~=20 npm~=10 python3 make g++ curl

WORKDIR /app

# Copy .env.example to .env for build time only
COPY .env.example .env

# Copy package files
COPY package.json package-lock.json ./
COPY .npmrc* ./
COPY prisma ./prisma

# Install ALL dependencies (including dev dependencies)
RUN npm ci --no-audit --no-fund && npm cache clean --force

# Copy the rest of the source code
COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 3: Production runtime
FROM alpine:3.19 AS production

RUN apk add --no-cache nodejs~=20 && \
    rm -rf /var/cache/apk/*

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Set empty values for runtime environment variables
ENV DATABASE_URL=""
ENV AUTH_SECRET=""
ENV AUTH_URL=""
ENV GOOGLE_CLIENT_ID=""
ENV GOOGLE_CLIENT_SECRET=""
ENV STRIPE_SECRET_KEY=""
ENV STRIPE_PRICE_ID=""
ENV STRIPE_WEBHOOK_SECRET=""
ENV EMAIL_SERVER_HOST=""
ENV EMAIL_SERVER_PORT=""
ENV EMAIL_SERVER_USER=""
ENV EMAIL_SERVER_PASSWORD=""
ENV EMAIL_FROM=""
ENV CRON_SECRET=""
ENV EXCHANGE_RATES_API_KEY=""
ENV EXCHANGE_RATES_API_URL=""
ENV UPSTASH_REDIS_REST_URL=""
ENV UPSTASH_REDIS_REST_TOKEN=""

EXPOSE 3000

CMD ["node", "server.js"]
