"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  }, [router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
}
