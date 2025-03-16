"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

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
import { Separator } from "@/components/ui/separator";
import { LoginFormValues, loginSchema } from "@/features/auth/schemas";
import {
  loginAction,
  resendVerificationAction,
} from "@/features/auth/server/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GoogleSignInButton } from "./google-sign-in-button";
import { VerificationMessages } from "./login-verification-messages";

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearUrlParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (
      params.has("verification") ||
      params.has("error") ||
      params.has("success")
    ) {
      router.replace("/login", { scroll: false });
    }
  }, [router, searchParams]);

  const resendVerification = useAction(resendVerificationAction, {
    onSuccess: (result) => {
      toast.success(result.data?.message || "Verification email sent!");
    },
    onError: (error) => {
      toast.error(
        error.error.serverError || "Failed to send verification email"
      );
    },
  });

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    loginAction,
    zodResolver(loginSchema),
    {
      actionProps: {
        onSuccess: async () => {
          router.push("/dashboard");
          router.refresh();
        },
        onError: (err) => {
          const errorMessage = err.error.serverError || "An error occurred";
          toast.error(errorMessage);

          if (!errorMessage.includes("Email not verified")) return;

          toast.info("Need a new verification email?", {
            action: {
              label: "Resend",
              onClick: () =>
                resendVerification.execute({
                  email: form.getValues().email,
                }),
            },
          });
        },
      },
      formProps: {
        defaultValues,
      },
    }
  );

  return (
    <div className="space-y-6">
      <VerificationMessages />

      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-card-foreground">Sign in</h1>
        <p className="text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@example.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearUrlParams();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearUrlParams();
                    }}
                  />
                </FormControl>
                <FormMessage />
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/90"
                  >
                    Forgot password?
                  </Link>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={action.isPending}>
            {action.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleSignInButton />

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary hover:text-primary/90 font-medium"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
