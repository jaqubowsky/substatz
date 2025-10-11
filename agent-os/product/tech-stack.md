# Tech Stack

## SubStatz Technical Stack

This document defines the complete technical stack for SubStatz, ensuring consistency across all development efforts.

---

## Framework & Runtime

- **Application Framework:** Next.js 14+ (App Router)
- **Language/Runtime:** TypeScript, Node.js 18+
- **Package Manager:** npm

---

## Frontend

### Core Technologies
- **JavaScript Framework:** React 18+ with Server Components
- **CSS Framework:** TailwindCSS
- **UI Components:** ShadCN UI
- **State Management:** React built-in state (useState, useReducer) + Server State

### Form & Validation
- **Form Handling:** React Hook Form
- **Schema Validation:** Zod
- **Client-Side Validation:** Zod schemas with React Hook Form integration

---

## Backend

### API Layer
- **API Routes:** Next.js API Routes
- **Server Actions:** Next.js Server Actions for mutations
- **Rate Limiting:** Client Memory (custom implementation)

### Database
- **Database:** PostgreSQL
- **ORM/Query Builder:** Prisma ORM
- **Migrations:** Prisma Migrate
- **Database Management:** Prisma Studio (development)

---

## Authentication & Security

- **Authentication Provider:** NextAuth.js
- **Email Verification:** Custom email verification flow
- **Session Management:** NextAuth.js session handling
- **Security Practices:**
  - HTTPS in production
  - Parameterized queries via Prisma (SQL injection prevention)
  - Rate limiting on API routes
  - Environment variable management

---

## Third-Party Services

### Payment Processing
- **Provider:** Stripe
- **Features:** One-time payments, webhook handling
- **Integration:** Stripe Checkout for payment flow

### Error Monitoring
- **Provider:** Sentry
- **Coverage:** Client-side and server-side error tracking
- **Configuration:** Configured in `sentry.edge.config.ts` and `sentry.server.config.ts`

### Email Service
- **Implementation:** Custom email service
- **Location:** `lib/email.ts`
- **Use Cases:** Email verification, password reset, renewal reminders

### Currency Data
- **Purpose:** Multi-currency support for subscriptions
- **Implementation:** Cron job for currency rate updates
- **Location:** `api/cron/currency-rates`

---

## Testing & Quality

- **Linting:** ESLint (configured in `eslint.config.mjs`)
- **Type Checking:** TypeScript strict mode
- **Code Quality:** Enforced through TypeScript and ESLint rules

---

## Development Tools

### Local Development
- **Development Server:** `npm run dev`
- **Database Studio:** `npm run db:studio` (Prisma Studio)
- **Environment:** Environment variables in `.env` file

### Database Migrations
- **Development:** `npm run migrate:dev`
- **Production:** `npm run migrate:deploy`
- **Schema Management:** Prisma schema in `prisma/schema.prisma`

---

## Deployment & Infrastructure

### Environment Configuration
- **Environments:** Development, Production
- **Environment Variables:**
  - `DATABASE_URL` - PostgreSQL connection string
  - `NEXTAUTH_SECRET` - Authentication secret
  - `AUTH_URL` - Application URL
  - `STRIPE_SECRET_KEY` - Stripe API key
  - `STRIPE_PRICE_ID` - Stripe product price ID
  - `STRIPE_WEBHOOK_SECRET` - Stripe webhook verification
  - `SENTRY_DSN` - Sentry project DSN

### Deployment Options
- **Recommended:** Vercel (optimized for Next.js)
- **Alternative:** Manual deployment with Node.js server
- **Database:** Managed PostgreSQL (recommended)

---

## Project Structure

### Code Organization
- **Feature-Based:** Features organized by domain (`features/auth`, `features/dashboard`, `features/settings`)
- **Shared Components:** Reusable UI components in `components/ui`
- **Server Logic:** Server actions and database operations in `server/` directories
- **Type Safety:** TypeScript types in `types/` and co-located with features

### Key Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/features/` - Feature modules (auth, dashboard, settings)
- `src/components/` - Shared UI components
- `src/lib/` - Utility functions and configurations
- `src/server/` - Server-side business logic
- `prisma/` - Database schema and migrations

---

## Additional Notes

- **Server Components First:** Use React Server Components by default, Client Components only when needed
- **Type Safety:** Strict TypeScript configuration enforced throughout
- **Validation:** Zod schemas used for both client and server-side validation
- **Error Handling:** Centralized error handling with Sentry integration
- **Performance:** Optimized with Server Components, automatic code splitting, and caching strategies
