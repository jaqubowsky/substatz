import "@/app/globals.css";
import { auth } from "@/auth";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { setSentryUserContext } from "@/lib/auth-sentry";
import { User } from "@prisma/client";
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
  const session = await auth();
  if (!session?.user) redirect("/login");

  await setSentryUserContext(session.user as Partial<User>);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 flex flex-col bg-secondary/30">{children}</main>
      <AppFooter />
    </div>
  );
}
