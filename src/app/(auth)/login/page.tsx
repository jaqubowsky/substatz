import { AuthFormLoading } from "@/components/auth-form-loading";
import { LoginForm } from "@/features/auth";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormLoading className="max-h-[300px]" />}>
      <LoginForm />
    </Suspense>
  );
}
