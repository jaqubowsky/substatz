import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SubscriptEase - Authentication",
  description: "Sign in or register to manage your subscriptions",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-secondary">
      <main className="rounded-lg border border-border bg-card p-6 shadow-sm w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
