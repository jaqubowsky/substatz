"use client";

import { MobileMenu } from "@/components/mobile-menu";
import { UserNav } from "@/components/user-nav";
import { useClientAuth } from "@/hooks/use-client-auth";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const { isLoading } = useClientAuth();

  const isAuthPage =
    pathname?.includes("/login") || pathname?.includes("/register");
  if (isAuthPage) return null;

  const isLandingPage = pathname === "/";

  return (
    <header
      className={`${
        isLandingPage ? "absolute" : "sticky top-0"
      } inset-x-0 z-40 w-full border-b border-border bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95`}
    >
      <div className="container px-4 sm:px-8 mx-auto">
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Global"
        >
          <div className="flex items-center flex-shrink-0">
            <Link
              href={isLandingPage ? "/" : "/dashboard"}
              className="flex items-center space-x-2"
            >
              <ClipboardList className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">
                SubscriptEase
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
            <div className="flex space-x-8">
              {isLandingPage ? (
                <>
                  <Link
                    href="#features"
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#pricing"
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#faq"
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors"
                  >
                    FAQ
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                <div className="w-12 h-3 bg-gray-200 rounded-md animate-pulse hidden md:block" />
                <div className="w-12 h-3 bg-gray-200 rounded-md animate-pulse hidden md:block" />
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse hidden md:block" />
              </>
            ) : (
              <div className="hidden md:block">
                <UserNav />
              </div>
            )}
            <MobileMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}
