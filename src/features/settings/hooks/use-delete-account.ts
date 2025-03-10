"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteAccountAction } from "../server/actions/settings";

export function useDeleteAccount() {
  const mutation = useMutation({
    mutationFn: async () => {
      return await deleteAccountAction();
    },
  });

  return {
    deleteAccount: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error
      ? "An unexpected error occurred"
      : mutation.data?.error || null,
    success: mutation.data?.success || false,
    reset: mutation.reset,
  };
}
