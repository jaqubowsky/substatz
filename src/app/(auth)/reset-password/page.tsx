import { ResetPasswordForm } from "@/features/auth/components";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<></>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
