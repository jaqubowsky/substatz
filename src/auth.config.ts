import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      const isOnSettings = request.nextUrl.pathname.startsWith("/settings");

      if (isOnDashboard || isOnSettings) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
