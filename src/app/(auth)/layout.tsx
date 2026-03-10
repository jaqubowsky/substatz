import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getServerAuth } from "@/hooks/get-server-auth";

export const metadata: Metadata = {
  title: "SubStatz - Authentication",
  description: "Sign in or register to manage your subscriptions",
};

async function AuthContent({ children }: { children: React.ReactNode }) {
  const session = await getServerAuth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-secondary">
      <main className="rounded-lg border border-border bg-card p-6 shadow-sm w-full max-w-md">
        {children}
      </main>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <AuthContent>{children}</AuthContent>
    </Suspense>
  );
}
