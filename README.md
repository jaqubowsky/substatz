# SubscriptEase

A subscription management application to help users track and manage their subscriptions in one place.

## Features

- User authentication (login/register)
- Dashboard to view all subscriptions
- Add, edit, and delete subscriptions
- Track subscription costs and renewal dates
- Categorize subscriptions
- View upcoming payments
- Analyze subscription spending by category

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, ShadCN UI
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/subscript.it.git
   cd subscript.it
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` (if not already present)
   - Update the `DATABASE_URL` with your PostgreSQL connection string
   - Generate a secure random string for `NEXTAUTH_SECRET` using:
     ```bash
     openssl rand -base64 32
     ```
   - Set `NEXTAUTH_URL` to your application URL (e.g., `http://localhost:3000` for development)

4. Run database migrations:

   ```bash
   npm run migrate:dev
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Deployment

#### Option 1: Manual Deployment

1. Set up your production environment variables:

   - `DATABASE_URL`: Your production PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure random string (use `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-domain.com`)
   - `NODE_ENV`: Set to `production`

2. Run the deployment script:

   ```bash
   npm run deploy
   ```

3. Start the production server:
   ```bash
   npm run start
   ```

#### Option 2: Vercel Deployment

1. Push your code to a GitHub repository.

2. Connect your repository to Vercel.

3. Configure the environment variables in the Vercel dashboard:

   - `DATABASE_URL`: Your production PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure random string
   - `NEXTAUTH_URL`: Your Vercel deployment URL

4. Deploy your application.

## Database Management

- Run migrations in development: `npm run migrate:dev`
- Apply migrations in production: `npm run migrate:deploy`
- View and edit database with Prisma Studio: `npm run db:studio`

## Security Considerations

- Always use HTTPS in production
- Keep your `NEXTAUTH_SECRET` secure and unique per environment
- Regularly update dependencies to patch security vulnerabilities
- Use parameterized queries (handled by Prisma) to prevent SQL injection

## Performance Optimization

- The application uses React Server Components where possible
- API routes are protected with rate limiting
- Database queries are optimized for performance
- Static assets are cached and optimized

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
