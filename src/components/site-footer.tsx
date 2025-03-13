"use client";

import { AppFooter } from "@/components/app-footer";
import { LandingFooter } from "@/components/landing-footer";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // For auth pages, don't render any footer
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  if (isAuthPage) {
    return null;
  }

  if (isLandingPage) {
    return <LandingFooter />;
  }

  return <AppFooter />;
}
