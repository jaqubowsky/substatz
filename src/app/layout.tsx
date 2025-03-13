import "@/app/globals.css";
import { Providers } from "@/app/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkDatabaseConnection } from "@/lib/db-check";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";

if (process.env.NODE_ENV === "production") {
  checkDatabaseConnection().catch(console.error);
}

export const metadata: Metadata = {
  title: "SubscriptEase - Manage Your Subscriptions",
  description: "Track and manage all your subscriptions in one place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 flex flex-col bg-secondary/30">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
