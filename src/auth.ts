import { PrismaAdapter } from "@auth/prisma-adapter";
import { Provider } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import { randomUUID } from "crypto";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { SignOutParams } from "next-auth/react";
import authConfig from "./auth.config";
import { verifyPassword } from "./lib/auth";
import { clearSentryUser, setSentryUserContext } from "./lib/auth-sentry";
import { sendWelcomeEmail } from "./lib/email";
import { env } from "./lib/env";
import prisma from "./lib/prisma";
import { getUserByEmail } from "./server/db/user";
const adapter = PrismaAdapter(prisma) as Adapter;

export const {
  handlers,
  auth,
  signIn,
  signOut: nextAuthSignOut,
} = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  secret: env.AUTH_SECRET,
  trustHost: true,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const isValid = await verifyPassword(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            provider: Provider.CREDENTIALS,
          };
        } catch (error) {
          Sentry.captureException(error, {
            level: "error",
            tags: {
              origin: "auth_authorize",
            },
          });

          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, account, user }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.provider =
          account?.provider?.toUpperCase() || Provider.CREDENTIALS;

        setSentryUserContext({
          id: user.id as string,
          email: user.email as string,
        });
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.provider = token.provider as Provider;
      }

      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = randomUUID();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email && user.name) {
        await sendWelcomeEmail(user.email as string, user.name as string);
      }
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    newUser: "/dashboard",
  },
});

export const signOut = async (options?: SignOutParams) => {
  clearSentryUser();
  return nextAuthSignOut(options);
};
