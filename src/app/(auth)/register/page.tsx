import { RegisterForm } from "@/features/auth/components/register-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<></>}>
      <RegisterForm />
    </Suspense>
  );
}
