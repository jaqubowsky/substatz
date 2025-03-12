"use client";

import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useClientAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.refresh();
    router.push("/login");
  }, [router]);

  const updateSession = useCallback(
    async (data: Partial<Session["user"]>) => {
      await update({
        ...session,
        user: {
          ...session?.user,
          ...data,
        },
      });

      router.refresh();
    },
    [update, session, router]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    updateSession,
  };
}
