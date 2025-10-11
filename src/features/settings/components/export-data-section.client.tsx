"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExportModal } from "./export-modal";
import { useCheckoutRedirect } from "@/features/settings/hooks";
import { SubscriptionPlan } from "@prisma/client";
import { Download, Loader2, Crown } from "lucide-react";

interface ExportDataSectionProps {
  userPlan: SubscriptionPlan;
}

export function ExportDataSection({ userPlan }: ExportDataSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { redirectToCheckout, isRedirecting } = useCheckoutRedirect();

  const isPaidUser = userPlan === SubscriptionPlan.PAID;

  const handleExportClick = () => {
    if (isPaidUser) {
      setModalOpen(true);
    } else {
      redirectToCheckout();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>
            {isPaidUser
              ? "Download your subscription data in Excel or PDF format"
              : "Upgrade to premium to export your subscription data"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleExportClick}
            disabled={isRedirecting}
            variant={isPaidUser ? "default" : "outline"}
            className="w-full sm:w-auto"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : isPaidUser ? (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Subscriptions
              </>
            ) : (
              <>
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Export
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isPaidUser && (
        <ExportModal open={modalOpen} onOpenChange={setModalOpen} />
      )}
    </>
  );
}
