import { verifyEmailAction } from "@/server/actions/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=VERIFICATION_TOKEN_INVALID", request.url)
    );
  }

  try {
    const response = await verifyEmailAction({ token });

    if (response && response.data && response.data.success) {
      return NextResponse.redirect(
        new URL("/login?success=EMAIL_VERIFIED", request.url)
      );
    } else {
      const errorMessage =
        response?.data?.error || "VERIFICATION_TOKEN_EXPIRED";
      return NextResponse.redirect(
        new URL(`/login?error=${errorMessage}`, request.url)
      );
    }
  } catch (error) {
    console.error("Error verifying email:", error);

    return NextResponse.redirect(
      new URL("/login?error=SERVER_ERROR", request.url)
    );
  }
}
