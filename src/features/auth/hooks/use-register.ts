"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";
import { registerSchema } from "../schemas/auth";
import { registerAction } from "../server/actions/auth";

export function useRegister() {
  return useHookFormAction(registerAction, zodResolver(registerSchema), {
    actionProps: {
      onSuccess: () => {
        toast.success("Account created successfully.");
      },
      onError: (error) => {
        toast.error(error.error.serverError);
      },
    },
  });
}
