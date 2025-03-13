"use client";

import { AppHeader } from "@/components/app-header";
import { LandingHeader } from "@/components/landing-header";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // For auth pages, don't render any header
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  if (isAuthPage) {
    return null;
  }

  if (isLandingPage) {
    return <LandingHeader />;
  }

  return <AppHeader />;
}
