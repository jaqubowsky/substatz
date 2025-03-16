import { AuthFormLoading } from "@/components/auth-form-loading";
import { RegisterForm } from "@/features/auth";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthFormLoading className="max-h-[300px]" />}>
      <RegisterForm />
    </Suspense>
  );
}
