import { MobileMenuClient } from "@/components/mobile-menu.client";
import { UserNav } from "@/components/user-nav";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

export function LandingHeader() {
  return (
    <>
      <div className="h-16"></div>

      <header className="fixed top-0 inset-x-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur shadow-sm supports-[backdrop-filter]:bg-background/80">
        <div className="container px-4 sm:px-8 mx-auto">
          <nav className="relative flex items-center h-16" aria-label="Global">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ClipboardList className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-gray-900">
                  SubStatz
                </span>
              </Link>
            </div>

            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-10">
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
            </div>

            <div className="ml-auto flex items-center">
              <div className="hidden md:block">
                <UserNav />
              </div>
              <div className="md:hidden">
                <MobileMenuClient />
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
