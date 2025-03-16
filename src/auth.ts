import { PrismaAdapter } from "@auth/prisma-adapter";
import { Currency, SubscriptionPlan } from "@prisma/client";
import { randomUUID } from "crypto";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
import { verifyPassword } from "./lib/auth";
import { sendWelcomeEmail } from "./lib/email";
import prisma from "./lib/prisma";
import { getUserByEmail } from "./server/db/user";

const adapter = PrismaAdapter(prisma) as Adapter;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
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
            plan: user.plan,
            defaultCurrency: user.defaultCurrency,
            provider: "credentials",
          };
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, account, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        if (session.user.plan) {
          token.plan = session.user.plan;
        }

        if (session.user.defaultCurrency) {
          token.defaultCurrency = session.user.defaultCurrency;
        }

        if (session.user.id) {
          const updatedUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { plan: true, defaultCurrency: true },
          });

          if (updatedUser) {
            token.plan = updatedUser.plan;
            token.defaultCurrency = updatedUser.defaultCurrency;
          }
        }
      }

      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.plan = user.plan;
        token.defaultCurrency = user.defaultCurrency;
        token.provider = account?.provider || "credentials";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.plan = token.plan as SubscriptionPlan;
        session.user.defaultCurrency = token.defaultCurrency as Currency;
        session.user.provider = token.provider as "google" | "credentials";
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
