import { LoginForm } from "@/features/auth/components/login-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<></>}>
      <LoginForm />
    </Suspense>
  );
}
