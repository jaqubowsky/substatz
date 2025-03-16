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
import { EmailFormValues, emailSchema } from "@/features/auth/schemas";
import { forgotPasswordAction } from "@/features/auth/server/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
const defaultValues: EmailFormValues = {
  email: "",
};

export function ForgotPasswordForm() {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    forgotPasswordAction,
    zodResolver(emailSchema),
    {
      actionProps: {
        onSuccess: (data) => {
          toast.success(data.data?.message || "Password reset email sent!");
          form.reset();
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

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-card-foreground">
          Forgot Password
        </h1>
        <p className="text-muted-foreground">
          Enter your email to receive a password reset link
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
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
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
