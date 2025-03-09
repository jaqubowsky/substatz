import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";

export const Header = () => {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">SubscriptEase</span>
            <div className="flex items-center">
              <ClipboardList className="w-8 h-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                SubscriptEase
              </span>
            </div>
          </Link>
        </div>

        <MobileMenu />

        <div className="hidden lg:flex lg:gap-x-12">
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
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};
