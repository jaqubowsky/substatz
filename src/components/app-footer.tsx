import Link from "next/link";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto container flex flex-col items-center justify-between gap-4 py-6 md:flex-row px-4 sm:px-8 w-full">
        <p className="text-center text-sm text-accent-foreground md:text-left">
          &copy; {currentYear} SubStatz. All rights reserved.
        </p>
        <nav className="flex gap-4 text-sm text-accent-foreground">
          <Link
            href="/terms"
            className="hover:underline hover:text-foreground transition-colors"
            role="link"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="hover:underline hover:text-foreground transition-colors"
            role="link"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="hover:underline hover:text-foreground transition-colors"
            role="link"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
