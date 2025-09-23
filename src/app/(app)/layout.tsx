import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/navigation";
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
      <header className="sticky top-0 inset-x-0 z-40 w-full border-b border-border bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <Header />
      </header>
      <main className="flex-1 flex flex-col bg-secondary/30">{children}</main>
      <footer className="bg-background border-t border-border">
        <Footer />
      </footer>
    </div>
  );
}
