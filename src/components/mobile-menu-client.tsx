"use client";

import { Button } from "@/components/ui/button";
import { useClientAuth } from "@/hooks";
import { ClipboardList, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function MobileMenuClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { isAuthenticated } = useClientAuth();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen, isClient]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
        className="md:hidden rounded-full p-2 text-gray-700 hover:bg-gray-100"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isClient &&
        createPortal(
          <>
            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white px-6 py-6 shadow-xl transition-transform duration-300 ease-in-out"
                  style={{
                    transform: mobileMenuOpen
                      ? "translateX(0)"
                      : "translateX(100%)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center space-x-2">
                        <ClipboardList className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-gray-900">
                          SubStatz
                        </span>
                      </div>
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="mt-6 border-t border-gray-200">
                    <div className="py-6 space-y-1">
                      {isLandingPage && (
                        <>
                          <MenuLink
                            href="#features"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Features
                          </MenuLink>
                          <MenuLink
                            href="#pricing"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Pricing
                          </MenuLink>
                          <MenuLink
                            href="#faq"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            FAQ
                          </MenuLink>
                        </>
                      )}

                      {!isLandingPage && (
                        <MenuLink
                          href="/"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Home
                        </MenuLink>
                      )}

                      {isAuthenticated && (
                        <>
                          <MenuLink
                            href="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </MenuLink>
                          <MenuLink
                            href="/settings"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Settings
                          </MenuLink>
                          <div className="menu-item">
                            <button
                              className="block w-full text-left py-3 px-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                              onClick={() => signOut({ redirectTo: "/login" })}
                            >
                              Log out
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {!isAuthenticated && (
                      <div className="py-6 space-y-3">
                        <div className="menu-item">
                          <Link
                            href="/login"
                            className="block w-full py-3 px-4 rounded-lg text-center font-medium text-gray-900 bg-gray-50 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Log in
                          </Link>
                        </div>
                        <div className="menu-item">
                          <Link
                            href="/register"
                            className="block w-full py-3 px-4 rounded-lg text-center font-medium text-white bg-primary hover:bg-primary/90"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sign up
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>,
          document?.body
        )}

      <style jsx global>{`
        .menu-item {
          opacity: 0;
          transform: translateY(10px);
          animation: fadeIn 0.3s forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-item:nth-child(1) {
          animation-delay: 0.1s;
        }
        .menu-item:nth-child(2) {
          animation-delay: 0.2s;
        }
        .menu-item:nth-child(3) {
          animation-delay: 0.3s;
        }
        .menu-item:nth-child(4) {
          animation-delay: 0.4s;
        }
        .menu-item:nth-child(5) {
          animation-delay: 0.5s;
        }
      `}</style>
    </>
  );
}

const MenuLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <div className="menu-item">
    <Link
      href={href}
      className="block py-3 px-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
      onClick={onClick}
    >
      {children}
    </Link>
  </div>
);
