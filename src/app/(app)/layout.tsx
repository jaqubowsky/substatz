import "@/app/globals.css";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getServerAuth } from "@/hooks/get-server-auth";
import { setSentryUserContext } from "@/lib/auth-sentry";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "SubStatz - Dashboard",
  description: "Track and manage all your subscriptions in one place",
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuth();
  if (!session) redirect("/login");

  await setSentryUserContext({
    id: session.user.id,
    email: session.user.email,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 flex flex-col bg-secondary/30">{children}</main>
      <AppFooter />
    </div>
  );
}
