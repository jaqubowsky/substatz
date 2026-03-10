# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SubStatz is a Next.js 16 subscription management app (React 19, TypeScript, Tailwind CSS 4, ShadCN UI). Users track subscriptions, analyze spending, and manage renewals. Premium features gated via Stripe one-time payment.

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build (runs Prisma generate first)
- `npm run lint` — Biome check with auto-fix
- `npm run lint:ci` — Biome check without fix (CI)
- `npm run typecheck` — TypeScript type checking
- `npm run pre-commit` — Prisma generate + typecheck + lint:ci
- `npm run migrate:dev` — run Prisma migrations (development)
- `npm run migrate:deploy` — deploy migrations (production)
- `npm run db:studio` — open Prisma Studio

## Architecture

### Feature-based module isolation

Code is organized under `src/features/` with strict isolation:

- Features cannot import from other features
- App routes (`src/app/`) can only import from feature **index files** (public API)
- No relative imports outside the current directory — use `@/` absolute imports
- Path aliases: `@/*` → `src/*`, `@/generated/prisma/*` → `prisma/generated/*`

Each feature follows this structure:
```
src/features/<name>/
├── components/    # React components
├── lib/           # Business logic (pure functions)
├── server/
│   ├── actions/   # Server actions (mutations)
│   ├── db/        # Database operations
│   └── queries/   # Read-only data fetching
└── schemas/       # Zod validation schemas
```

Features: `auth`, `dashboard`, `settings`, `migration`, `landing-page`

### Server actions pattern

Server actions use `next-safe-action` with tiered wrappers in `src/lib/safe-action.ts`:
- `action` — base with Sentry error reporting
- `privateAction` — requires auth + rate limiting
- `publicAction` — rate limited, no auth
- `adminAction` — requires admin role
- `publicActionWithLimiter` — custom rate limiter

Throw `ActionError` for user-facing errors. Other errors get captured by Sentry and return a generic message.

### Key shared code (`src/lib/`)

- `env.ts` — environment validation via `@t3-oss/env-nextjs`
- `prisma.ts` — Prisma client singleton
- `safe-action.ts` — server action factories
- `rate-limit.ts` — IP-based rate limiting
- `errorMessages.ts` — centralized error message constants
- `stripe.ts` — Stripe client
- `currency-rates.ts` — exchange rate utilities
- `billing-utils.ts` — billing cycle calculations

### Database

MySQL with Prisma ORM. Schema at `prisma/schema.prisma`. Key models: User, Subscription, SubscriptionHistory, CurrencyRate. Generated client outputs to `prisma/generated/`.

### Authentication

NextAuth.js (beta) with JWT strategy. Providers: Credentials (email/password with bcrypt) and Google OAuth. Admin access controlled by `ADMIN_EMAIL` env var.

### Routing

- `(auth)` group — login, register, forgot/reset password
- `(app)` group — protected: dashboard, settings, admin
- API routes: `/api/stripe/webhook`, `/api/cron/currency-rates`, `/api/health`

## Conventions

- React Hook Form + Zod for all forms; schemas live in feature `schemas/` folders
- ShadCN UI components in `src/components/ui/`
- Client components use `.client.tsx` suffix
- Error messages defined in `src/lib/errorMessages.ts`, not inline strings
- Currencies: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, PLN
- Billing cycles: MONTHLY, QUARTERLY, BIANNUALLY, ANNUALLY

## Formatting (Biome)

Configured in `biome.json`: 2-space indent, double quotes, semicolons, trailing commas. Biome also handles linting (recommended rules) and import organization.
