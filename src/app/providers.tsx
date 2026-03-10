"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { SentryUserProvider } from "@/app/sentry-user-provider";
import { Toaster } from "@/components/ui/sonner";

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
