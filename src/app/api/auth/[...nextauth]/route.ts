import { verifyPassword } from "@/features/auth/lib/auth";
import {
  createUserFromOAuth,
  getUserByEmail,
  linkAccount,
  updateUserLastLogin,
  verifyUserEmail,
} from "@/features/auth/server/db/user";
import { errors } from "@/lib/errorMessages";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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

        const user = await getUserByEmail(credentials.email);
        if (!user) throw new Error(errors.AUTH.INVALID_CREDENTIALS.message);

        const isValid = await verifyPassword(
          credentials.password,
          user.password || ""
        );
        if (!isValid) throw new Error(errors.AUTH.INVALID_CREDENTIALS.message);

        if (!user.emailVerified) {
          throw new Error(errors.AUTH.EMAIL_NOT_VERIFIED.message);
        }

        await updateUserLastLogin(user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }

      const dbUser = await getUserByEmail(user.email!);
      return !!dbUser?.emailVerified;
    },
    async jwt({ token, user, account }) {
      if (user) token.id = user.id;

      if (!account || !user) return token;

      const existingUser = await getUserByEmail(user.email!);

      if (!existingUser) {
        const newUser = await createUserFromOAuth({
          email: user.email!,
          name: user.name || "",
          image: user.image || "",
          emailVerified: new Date(),
        });

        await linkAccount(
          newUser.id,
          account.provider,
          account.providerAccountId,
          account.access_token!,
          account.refresh_token,
          account.expires_at
        );

        token.id = newUser.id;
        return token;
      }

      const hasLinkedAccount = existingUser.accounts?.some(
        (acc: { provider: string; providerAccountId: string }) =>
          acc.provider === account.provider &&
          acc.providerAccountId === account.providerAccountId
      );

      if (hasLinkedAccount) return token;

      await linkAccount(
        existingUser.id,
        account.provider,
        account.providerAccountId,
        account.access_token!,
        account.refresh_token,
        account.expires_at
      );

      if (existingUser.emailVerified) return token;

      await verifyUserEmail(token.id);

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
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
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
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
