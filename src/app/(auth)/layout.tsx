import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "SubscriptEase - Authentication",
  description: "Sign in or register to manage your subscriptions",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-secondary">
      <main className="rounded-lg border border-border bg-card p-6 shadow-sm w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
