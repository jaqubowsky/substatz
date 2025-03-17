import { ClipboardList, Github, Linkedin, Twitter } from "lucide-react";
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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="flex justify-between xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                SubStatz
              </span>
            </div>
            <p className="text-sm leading-6 text-accent-foreground">
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
          <div className="mt-16 flex flex-col gap-8 xl:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Product
                </h3>
                <ul className="mt-6 space-y-4">
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
                <ul className="mt-6 space-y-4">
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
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Support
                </h3>
                <ul className="mt-6 space-y-4">
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
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; {currentYear} SubStatz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
