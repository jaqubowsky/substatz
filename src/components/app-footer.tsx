"use client";

import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto container flex flex-col items-center justify-between gap-4 py-6 md:flex-row px-4 sm:px-8 w-full">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} SubscriptEase. All rights
          reserved.
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link
            href="/terms"
            className="hover:underline hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="hover:underline hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="hover:underline hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
