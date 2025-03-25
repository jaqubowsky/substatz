import { ClipboardList } from "lucide-react";
import Link from "next/link";

export function LandingFooter() {
  const navigation = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-6 pt-10 sm:pb-8 sm:pt-16 lg:px-8 lg:pt-24">
        <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-10 md:flex-row md:justify-between md:space-y-0 xl:gap-8">
          <div className="space-y-6 max-w-xs">
            <div className="flex items-center justify-center md:justify-start">
              <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                SubStatz
              </span>
            </div>
            <p className="text-sm leading-6 text-accent-foreground">
              Making subscription management simple and stress-free.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <div className="grid grid-cols-2 gap-y-10 gap-x-8 sm:grid-cols-3 sm:gap-6">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Product
                </h3>
                <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-accent-foreground hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Legal
                </h3>
                <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-accent-foreground hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1 mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Support
                </h3>
                <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm leading-6 text-accent-foreground hover:text-primary"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 border-t border-gray-900/10 pt-6 sm:pt-8">
          <p className="text-xs leading-5 text-gray-500 text-center">
            &copy; {currentYear} SubStatz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
