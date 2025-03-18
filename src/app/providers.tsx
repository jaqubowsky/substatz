"use client";

import { SentryUserProvider } from "@/app/sentry-user-provider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SentryUserProvider>
        {children}
        <Toaster position="top-center" />
      </SentryUserProvider>
    </SessionProvider>
  );
}
