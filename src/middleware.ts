import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Separate Auth.js instance for middleware without the adapter
// This ensures edge compatibility
export const { auth: middleware } = NextAuth(authConfig);

// Define which routes should be handled by middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
