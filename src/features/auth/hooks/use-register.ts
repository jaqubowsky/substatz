"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { RegisterFormValues } from "../schemas/auth";
import { registerAction } from "../server/actions";

export function useRegister() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const result = await registerAction(data);

      if (!result.success) {
        throw new Error(result.error || "Registration failed");
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        console.error("Auto sign-in failed:", signInResult.error);
      }

      return result.user;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      setError(error.message || "Registration failed");
    },
  });

  const register = useCallback(
    (data: RegisterFormValues) => {
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
    register,
    isLoading: mutation.isPending,
    error,
    setError,
    reset,
  };
}
