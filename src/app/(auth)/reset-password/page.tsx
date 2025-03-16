import { AuthFormLoading } from "@/components/auth-form-loading";
import { ResetPasswordForm } from "@/features/auth";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthFormLoading className="max-h-[300px]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
