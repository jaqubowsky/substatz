"use client";

import * as Sentry from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function SentryUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email || undefined,
        username: session.user.name || undefined,
      });
    } else {
      Sentry.setUser(null);
    }

    return () => {
      Sentry.setUser(null);
    };
  }, [session]);

  return <>{children}</>;
}
