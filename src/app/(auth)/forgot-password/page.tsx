import { AuthFormLoading } from "@/components/auth-form-loading";
import { ForgotPasswordForm } from "@/features/auth";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<AuthFormLoading className="max-h-[300px]" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
