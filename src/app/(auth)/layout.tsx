import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "SubStatz - Authentication",
  description: "Sign in or register to manage your subscriptions",
};

export const revalidate = 3600;

async function AuthCheck() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  return null;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-secondary">
      <AuthCheck />
      <main className="rounded-lg border border-border bg-card p-6 shadow-sm w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
