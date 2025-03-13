"use client";

import { MobileMenu } from "@/components/mobile-menu";
import { UserNav } from "@/components/user-nav";
import { useClientAuth } from "@/hooks/use-client-auth";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

export function AppHeader() {
  const { isLoading } = useClientAuth();

  return (
    <header className="sticky top-0 inset-x-0 z-40 w-full border-b border-border bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="container px-4 sm:px-8 mx-auto">
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Global"
        >
          <div className="flex items-center flex-shrink-0">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ClipboardList className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">
                SubscriptEase
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
            {/* App navigation can be added here if needed */}
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
