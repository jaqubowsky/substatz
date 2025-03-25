import { env } from "@/lib/env";
import { verifyEmailAction } from "@/server/actions/user";
import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=VERIFICATION_TOKEN_INVALID", env.BASE_URL)
    );
  }

  try {
    const response = await verifyEmailAction({ token });

    if (response && response.data && response.data.success) {
      return NextResponse.redirect(
        new URL("/login?success=EMAIL_VERIFIED", env.BASE_URL)
      );
    } else {
      const errorMessage =
        response?.data?.error || "VERIFICATION_TOKEN_EXPIRED";
      return NextResponse.redirect(
        new URL(`/login?error=${errorMessage}`, env.BASE_URL)
      );
    }
  } catch (error) {
    Sentry.captureException(error, {
      level: "error",
      tags: {
        origin: "verify_email",
      },
    });

    return NextResponse.redirect(
      new URL("/login?error=SERVER_ERROR", env.BASE_URL)
    );
  }
}
