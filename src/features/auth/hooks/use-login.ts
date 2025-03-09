"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { LoginFormValues } from "../schemas/auth";

export function useLogin(callbackUrl: string = "/dashboard") {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      router.push(callbackUrl);
      router.refresh();
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to sign in");
    },
  });

  const login = useCallback(
    (data: LoginFormValues) => {
      setError(null);
      mutation.mutate(data);
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setError(null);
    mutation.reset();
  }, [mutation]);

  return {
    login,
    isLoading: mutation.isPending,
    error,
    setError,
    reset,
  };
}
