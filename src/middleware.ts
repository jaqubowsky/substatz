import * as Sentry from "@sentry/nextjs";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";
import { getIp, publicApiRateLimiter } from "./lib/rate-limit";

export const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api/auth/session")) return NextResponse.next();

  const ip = await getIp();
  const { success, headers } = await publicApiRateLimiter.limit(`auth:${ip}`);

  if (!success) {
    Sentry.captureMessage("Too many requests", {
      level: "warning",
      tags: {
        origin: "auth_middleware",
      },
    });

    return new NextResponse(
      JSON.stringify({
        error: "Too many requests",
        message: "Please try again later",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }
    );
  }

  return NextResponse.next({
    headers: headers,
  });
});

export const config = {
  matcher: ["/api/auth/:path*"],
};
