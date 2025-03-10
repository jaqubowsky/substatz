"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
export const MobileMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const isLandingPage = pathname === "/";

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

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

      {createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />

              <motion.div
                className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white px-6 py-6 shadow-xl"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-center justify-between">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2">
                      <ClipboardList className="h-8 w-8 text-primary" />
                      <span className="text-xl font-bold text-gray-900">
                        SubscriptEase
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
                  <motion.div className="py-6 space-y-1">
                    {isLandingPage && (
                      <>
                        <MenuLink
                          href="#features"
                          onClick={() => setMobileMenuOpen(false)}
                          delay={0.1}
                        >
                          Features
                        </MenuLink>
                        <MenuLink
                          href="#pricing"
                          onClick={() => setMobileMenuOpen(false)}
                          delay={0.2}
                        >
                          Pricing
                        </MenuLink>
                        <MenuLink
                          href="#faq"
                          onClick={() => setMobileMenuOpen(false)}
                          delay={0.3}
                        >
                          FAQ
                        </MenuLink>
                      </>
                    )}

                    {!isLandingPage && (
                      <MenuLink
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        delay={0.1}
                      >
                        Home
                      </MenuLink>
                    )}

                    {isAuthenticated && (
                      <>
                        <MenuLink
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          delay={isLandingPage ? 0.4 : 0.2}
                        >
                          Dashboard
                        </MenuLink>
                        <MenuLink
                          href="/settings"
                          onClick={() => setMobileMenuOpen(false)}
                          delay={isLandingPage ? 0.5 : 0.3}
                        >
                          Settings
                        </MenuLink>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: isLandingPage ? 0.6 : 0.4,
                            duration: 0.3,
                          }}
                        >
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left py-3 px-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                          >
                            Log out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </motion.div>

                  {!isAuthenticated && (
                    <div className="py-6 space-y-3">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: isLandingPage ? 0.4 : 0.2,
                          duration: 0.3,
                        }}
                      >
                        <Link
                          href="/login"
                          className="block w-full py-3 px-4 rounded-lg text-center font-medium text-gray-900 bg-gray-50 hover:bg-gray-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Log in
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: isLandingPage ? 0.5 : 0.3,
                          duration: 0.3,
                        }}
                      >
                        <Link
                          href="/register"
                          className="block w-full py-3 px-4 rounded-lg text-center font-medium text-white bg-primary hover:bg-primary/90"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign up
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document?.body
      )}
    </>
  );
};

const MenuLink = ({
  href,
  onClick,
  delay,
  children,
}: {
  href: string;
  onClick: () => void;
  delay: number;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <Link
      href={href}
      className="block py-3 px-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
      onClick={onClick}
    >
      {children}
    </Link>
  </motion.div>
);
