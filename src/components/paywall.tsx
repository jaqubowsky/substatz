"use client";

import { useClientAuth } from "@/hooks";
import { SubscriptionPlan } from "@prisma/client";
import { LockIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface PaywallProps {
  children: React.ReactNode;
  blurContent?: boolean;
  showMessage?: boolean;
  messagePosition?: "top" | "center" | "bottom";
}

export function Paywall({
  children,
  blurContent = true,
  showMessage = true,
  messagePosition = "center",
}: PaywallProps) {
  const { user, isLoading } = useClientAuth();

  const isPaid = user?.plan === SubscriptionPlan.PAID;

  if (isLoading || isPaid) {
    return <>{children}</>;
  }

  const positionClasses = {
    top: "items-start pt-8",
    center: "items-center",
    bottom: "items-end pb-8",
  };

  return (
    <div className="relative w-full h-full">
      <div className={blurContent ? "blur-sm pointer-events-none" : ""}>
        {children}
      </div>

      {showMessage && (
        <div
          className={`absolute inset-0 flex flex-col justify-center ${positionClasses[messagePosition]} bg-background/80 backdrop-blur-sm z-10 p-6 text-center`}
        >
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <LockIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
            <p className="text-muted-foreground mb-4">
              Unlock unlimited subscriptions and full analytics with our premium
              plan. It&apos;s just $5 (one-time payment) for lifetime access!
            </p>
            <Button asChild>
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
