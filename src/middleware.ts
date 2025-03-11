import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.includes("public")
  ) {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const appRoutes = ["/dashboard", "/settings"];
  const isAppRoute = appRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAppRoute) {
    const token = await getToken({ req: request });
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    const token = await getToken({ req: request });
    const isAuthenticated = !!token;

    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/login",
    "/register",
    "/api/:path*",
  ],
};
