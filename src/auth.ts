import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { verifyPassword } from "./features/auth/lib/auth";
import { getUserByEmail } from "./features/auth/server/db";
import prisma from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  providers: [
    ...authConfig.providers.map((provider) => {
      if (provider.id === "credentials") {
        return {
          ...provider,
          async authorize(
            credentials: { email?: string; password?: string } | undefined
          ) {
            if (!credentials?.email || !credentials?.password) {
              return null;
            }

            const user = await getUserByEmail(credentials.email);

            if (!user || !user.password) {
              return null;
            }

            const isPasswordValid = await verifyPassword(
              credentials.password,
              user.password
            );

            if (!isPasswordValid) {
              return null;
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          },
        };
      }
      return provider;
    }),
  ],
});
