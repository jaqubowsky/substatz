"use client";

import { Currency } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

type UpdateSessionData = {
  defaultCurrency: Currency;
};

export function useClientAuth() {
  const { data: session, status, update: updateSession } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.refresh();
    router.push(pathname === "/" ? "/" : "/login");
  }, [router, pathname]);

  const update = useCallback(
    async (data: UpdateSessionData) => {
      await updateSession({
        user: {
          ...session?.user,
          ...data,
        },
      });
      router.refresh();
    },
    [updateSession, session, router]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    update,
  };
}
