"use client";

import { useSession } from "next-auth/react";

export function useClientAuth() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
