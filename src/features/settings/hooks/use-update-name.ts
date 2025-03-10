"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateNameFormValues } from "../schemas/settings";
import { updateNameAction } from "../server/actions/settings";

export function useUpdateName() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateNameFormValues) => {
      return await updateNameAction(data);
    },
    onSuccess: () => {
      // Invalidate any queries that might be affected by this update
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    updateName: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error
      ? "An unexpected error occurred"
      : mutation.data?.error || null,
    success: mutation.data?.success || false,
    reset: mutation.reset,
  };
}
