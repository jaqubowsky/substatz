"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { ResetPasswordFormValues, resetPasswordSchema } from "../schemas/auth";
import { resetPasswordAction } from "../server/actions/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      router.push("/forgot-password");
    }
  }, [token, router]);

  const defaultValues: ResetPasswordFormValues = {
    token: token || "",
    password: "",
    confirmPassword: "",
  };

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    resetPasswordAction,
    zodResolver(resetPasswordSchema),
    {
      actionProps: {
        onSuccess: (data) => {
          toast.success(data.data?.message || "Password reset successfully!");
          router.push("/login");
        },
        onError: (error) => {
          toast.error(error.error.serverError || "An error occurred");
        },
      },
      formProps: {
        defaultValues,
      },
    }
  );

  if (!token) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-card-foreground">
          Reset Password
        </h1>
        <p className="text-muted-foreground">Enter your new password below</p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <input type="hidden" name="token" value={token} />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={action.isPending}>
            {action.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-primary/90 font-medium"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
