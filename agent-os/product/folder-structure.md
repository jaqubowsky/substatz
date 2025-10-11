## SubStatz folder structure and feature-based development

### Core Architecture Principles
- **Feature-Based Architecture**: Organize code by business features rather than technical layers (`src/features/`)
- **Feature Isolation**: Each feature should be self-contained with minimal dependencies on other features
- **Separation of Concerns**: Keep UI components, business logic, data access, and validation separate within each feature

### Feature Directory Structure
Each feature follows this consistent pattern:
```
src/features/[feature-name]/
├── components/           # UI components specific to this feature
├── schemas/             # Zod validation schemas
├── server/
│   ├── actions/         # Server Actions for mutations
│   ├── db/             # Database operations and queries
│   └── queries/        # Read-only database queries
└── index.ts            # Feature exports
```

### Current Feature Organization
- **`src/features/auth/`**: Authentication (login, register, password reset)
- **`src/features/dashboard/`**: Subscription management and analytics
- **`src/features/settings/`**: User settings and preferences
- **`src/features/landing-page/`**: Marketing and public pages

### Shared Resources Structure
- **`src/components/`**: Truly shared UI components (navigation, footer, error boundaries)
- **`src/components/ui/`**: ShadCN UI components and custom UI primitives
- **`src/lib/`**: Shared utilities (auth, database, email, validation helpers)
- **`src/server/`**: Shared server-side utilities and database operations
- **`src/hooks/`**: Custom React hooks for shared logic
- **`src/types/`**: Global TypeScript type definitions

### Next.js App Router Structure
```
src/app/
├── (app)/              # Protected routes (requires authentication)
│   ├── dashboard/      # Main dashboard
│   └── settings/       # User settings
├── (auth)/             # Authentication routes
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── api/                # API routes
│   ├── auth/           # NextAuth.js routes
│   ├── stripe/         # Stripe webhook handling
│   └── cron/           # Scheduled tasks
└── [public-pages]/     # Public pages (contact, privacy, terms)
```

### API Route Organization
- **`/api/auth/`**: NextAuth.js authentication endpoints
- **`/api/stripe/`**: Stripe webhook and payment processing
- **`/api/cron/`**: Scheduled tasks (currency rates, cleanup)
- **`/api/health/`**: Health check endpoints

### Database Layer Structure
```
src/server/db/
├── user.ts             # User-related database operations
├── subscription-plan.ts # Subscription plan queries
└── currency-rates.ts   # Currency rate management
```

### Configuration Files
- **Root level**: `auth.config.ts`, `auth.ts`, `middleware.ts`
- **Database**: `prisma/schema.prisma`, `prisma/migrations/`
- **Build**: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`

### Import Path Conventions
- **Feature imports**: `@/features/[feature]/components/[component]`
- **Shared components**: `@/components/[component]`
- **Utilities**: `@/lib/[utility]`
- **Types**: `@/types/[type]` or within feature directories
- **Server utilities**: `@/server/[utility]`

### File Naming Conventions
- **Components**: PascalCase (`SubscriptionCard.tsx`)
- **Client components**: Suffix with `.client.tsx`
- **Server actions**: `actions.ts` or descriptive names
- **Schemas**: `[domain].ts` (e.g., `auth.ts`, `subscription.ts`)
- **Utilities**: camelCase (`auth-utils.ts`, `currency-rates.ts`)

### Scalability Guidelines
- **New features**: Create new directories under `src/features/`
- **Shared logic**: Extract to `src/lib/` when used by multiple features
- **Database operations**: Add to `src/server/db/` for shared queries
- **API routes**: Group by domain under `src/app/api/`
- **Types**: Keep feature-specific types within features, shared types in `src/types/`
