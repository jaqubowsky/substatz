import { MobileMenuClient } from "@/components/mobile-menu-client";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { UserNav } from "./user-nav";

export function AppHeader() {
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

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <UserNav />
            </div>
            <MobileMenuClient />
          </div>
        </nav>
      </div>
    </header>
  );
}
