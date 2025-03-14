import "@/app/globals.css";
import { Providers } from "@/app/providers";
import { checkDatabaseConnection } from "@/lib/db-check";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Metadata, Viewport } from "next";

if (process.env.NODE_ENV === "production") {
  checkDatabaseConnection().catch(console.error);
}

export const metadata: Metadata = {
  title: "SubscriptEase - Manage Your Subscriptions",
  description: "Track and manage all your subscriptions in one place",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
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
        style={{ scrollBehavior: "smooth" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
