import { ResetPasswordForm } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
