"use client";

import { useMutation } from "@tanstack/react-query";
import { ChangePasswordFormValues } from "../schemas/settings";
import { changePasswordAction } from "../server/actions/settings";

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: async (data: ChangePasswordFormValues) => {
      return await changePasswordAction(data);
    },
  });

  return {
    changePassword: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error
      ? "An unexpected error occurred"
      : mutation.data?.error || null,
    success: mutation.data?.success || false,
    reset: mutation.reset,
  };
}
