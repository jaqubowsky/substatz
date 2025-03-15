import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export async function Providers({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      {children}
      <Toaster position="top-center" />
    </SessionProvider>
  );
}
