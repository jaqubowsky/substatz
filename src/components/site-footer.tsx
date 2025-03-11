"use client";

import { useClientAuth } from "@/hooks";
import { ClipboardList, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const { isLoading } = useClientAuth();

  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage || isLoading) return null;

  const navigation = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Careers", href: "#" },
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Cookie Policy", href: "#" },
    ],
    social: [
      {
        name: "Twitter",
        href: "#",
        icon: <Twitter className="h-6 w-6 text-gray-500 hover:text-primary" />,
      },
      {
        name: "GitHub",
        href: "#",
        icon: <Github className="h-6 w-6 text-gray-500 hover:text-primary" />,
      },
      {
        name: "LinkedIn",
        href: "#",
        icon: <Linkedin className="h-6 w-6 text-gray-500 hover:text-primary" />,
      },
    ],
  };

  const isLandingPage = pathname === "/";

  if (!isLandingPage) {
    return (
      <footer className="bg-background border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row px-4 sm:px-8">
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

  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                SubscriptEase
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              Making subscription management simple and stress-free.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-primary"
                >
                  <span className="sr-only">{item.name}</span>
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Product
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Company
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Legal
                </h3>
                <ul className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Support
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm leading-6 text-gray-600 hover:text-primary"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} SubscriptEase. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
