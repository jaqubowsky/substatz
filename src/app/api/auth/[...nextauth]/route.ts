import { verifyPassword } from "@/features/auth/lib/auth";
import {
  getUserByEmail,
  updateUserLastLogin,
} from "@/features/auth/server/db/user";
import { errors } from "@/lib/errorMessages";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(errors.AUTH.EMAIL_AND_PASSWORD_REQUIRED.message);
        }

        const isValid = await verifyPassword(
          credentials.password,
          credentials.email
        );
        if (isValid) throw new Error(errors.AUTH.INVALID_CREDENTIALS.message);

        const user = await getUserByEmail(credentials.email);
        if (!user) throw new Error(errors.AUTH.INVALID_CREDENTIALS.message);
        await updateUserLastLogin(user.id);

        return {
          id: user.id,
          name: user.name || "",
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
