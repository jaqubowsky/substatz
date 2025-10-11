## SubStatz development conventions

- **Feature-Based Architecture**: Organize code by features (`src/features/`) with clear separation of concerns (components, schemas, server actions, db queries)
- **Next.js App Router Structure**: Follow Next.js 14+ conventions with proper route groups `(app)`, `(auth)` and file-based routing
- **TypeScript First**: All new code must be TypeScript with strict type checking enabled
- **Server Components Priority**: Use React Server Components by default, only use Client Components when necessary (interactivity, browser APIs)
- **Environment Configuration**: Use `.env` files for configuration; never commit secrets. Required env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_URL`
- **Database Migrations**: Always use Prisma migrations (`npm run migrate:dev`) for schema changes; never edit database directly
- **Authentication Flow**: Use NextAuth.js patterns with proper session handling and email verification
- **Form Validation**: Use React Hook Form + Zod schemas for all forms; validate on both client and server
- **Error Boundaries**: Implement proper error boundaries for graceful error handling
- **Rate Limiting**: Apply rate limiting to all API routes to prevent abuse
- **Stripe Integration**: Follow webhook patterns for payment processing; test locally with Stripe CLI
- **Performance**: Optimize for production with proper caching, image optimization, and minimal bundle sizes
