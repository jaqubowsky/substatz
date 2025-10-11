## SubStatz UI component best practices

- **Server Components First**: Use React Server Components by default; only use Client Components when necessary (interactivity, browser APIs)
- **ShadCN UI Foundation**: Build on ShadCN UI components; extend and customize rather than creating from scratch
- **Feature-Based Components**: Organize components within feature directories (`src/features/*/components/`)
- **TypeScript Props**: Define explicit TypeScript interfaces for all component props with proper typing
- **Form Components**: Use React Hook Form with Zod validation for all form components
- **Authentication Components**: Follow NextAuth.js patterns for auth-related components (login, register, etc.)
- **Subscription Components**: Create reusable components for subscription management (cards, forms, lists)
- **Loading States**: Implement proper loading states using Next.js `loading.tsx` files and skeleton components
- **Error Boundaries**: Wrap components with error boundaries for graceful error handling
- **Client/Server Separation**: Clearly separate client components (`.client.tsx`) from server components
- **Accessibility**: Ensure all components meet accessibility standards with proper ARIA attributes
