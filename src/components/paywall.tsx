import { auth } from "@/auth";
import { SubscriptionPlan } from "@prisma/client";
import { LockIcon } from "lucide-react";
import { Suspense } from "react";
import { PurchaseButton } from "./purchase-button";

interface PaywallProps {
  children: React.ReactNode;
  blurContent?: boolean;
  showMessage?: boolean;
  messagePosition?: "top" | "center" | "bottom";
  className?: string;
}

async function PaywallContent({ children }: PaywallProps) {
  const session = await auth();
  const user = session?.user;

  const isPaid = user?.plan === SubscriptionPlan.PAID;
  if (isPaid) return <>{children}</>;

  return (
    <div className="relative w-full h-full">
      <div className="blur-lg rounded-lg pointer-events-none">{children}</div>

      <div
        className={`absolute inset-0 flex flex-col justify-center items-center bg-background/80 backdrop-blur-sm z-10 p-6 text-center`}
      >
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <LockIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
          <p className="text-accent-foreground mb-4">
            Unlock unlimited subscriptions and full analytics with our premium
            plan. It&apos;s just $5 for lifetime access!
          </p>
          <PurchaseButton className="w-full">Unlock Now</PurchaseButton>
        </div>
      </div>
    </div>
  );
}

export async function Paywall({ children }: PaywallProps) {
  return (
    <Suspense fallback={children}>
      <PaywallContent>{children}</PaywallContent>
    </Suspense>
  );
}
