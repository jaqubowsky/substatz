## SubStatz validation best practices

- **Zod Schema-First**: Define Zod schemas for all data validation; use the same schemas on client and server
- **React Hook Form Integration**: Use React Hook Form with Zod resolver for form validation and error handling
- **Server Actions Validation**: Always validate input in server actions using Zod schemas before database operations
- **Prisma Schema Alignment**: Keep Zod schemas aligned with Prisma schema for type safety
- **Subscription Validation**: Validate subscription data (costs, dates, categories) with business rules
- **Authentication Validation**: Use Zod for email format, password strength, and user input validation
- **Stripe Data Validation**: Validate Stripe webhook payloads and payment data with appropriate schemas
- **Database Constraint Validation**: Handle Prisma unique constraints and foreign key violations gracefully
- **Currency and Date Validation**: Validate currency amounts (positive numbers) and date ranges for subscriptions
- **Email Verification**: Validate email addresses and handle verification token validation
- **Rate Limiting Validation**: Validate rate limit parameters and user input for API endpoints
- **Type-Safe Validation**: Leverage TypeScript with Zod for compile-time and runtime type safety
