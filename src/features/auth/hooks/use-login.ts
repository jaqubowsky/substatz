"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema } from "../schemas/auth";
import { loginAction } from "../server/actions/auth";

export function useLogin(callbackUrl: string = "/dashboard") {
  const router = useRouter();

  return useHookFormAction(loginAction, zodResolver(loginSchema), {
    actionProps: {
      onSuccess: async ({ data }) => {
        await signIn("credentials", {
          email: data?.email,
          password: data?.password,
          redirect: false,
        });

        router.push(callbackUrl);
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.error.serverError);
      },
    },
  });
}
