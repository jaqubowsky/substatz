"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { SubscriptionPlan } from "@prisma/client";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { verifyPaymentAction } from "../server/actions/payment-verification";

export function PaymentVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentStatus = searchParams.get("payment");

  const [open, setOpen] = useState(false);

  const { update } = useSession();

  const [verificationState, setVerificationState] = useState<{
    isVerifying: boolean;
    isVerified: boolean;
    error: string | null;
    cancelled: boolean;
  }>({
    isVerifying: false,
    isVerified: false,
    error: null,
    cancelled: false,
  });

  const verifyAction = useAction(verifyPaymentAction, {
    onExecute: () => {
      setVerificationState({
        isVerifying: true,
        isVerified: false,
        error: null,
        cancelled: false,
      });
    },
    onSuccess: async () => {
      setVerificationState({
        isVerifying: false,
        isVerified: true,
        error: null,
        cancelled: false,
      });

      await update({
        user: {
          plan: SubscriptionPlan.PAID,
        },
      });
      router.refresh();

      setTimeout(() => {
        setOpen(false);

        setTimeout(() => {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("payment");
          router.replace(newUrl.pathname);
        }, 300);
      }, 3000);
    },
    onError: (error) => {
      setVerificationState({
        isVerifying: false,
        isVerified: false,
        error: error.error.serverError || "Failed to verify payment",
        cancelled: false,
      });
      toast.error(error.error.serverError || "Failed to verify payment");
    },
  });

  useEffect(() => {
    if (paymentStatus === "success") {
      setOpen(true);
      if (!verificationState.isVerifying && !verificationState.isVerified) {
        verifyAction.execute();
      }
    } else if (paymentStatus === "cancelled" && !verificationState.cancelled) {
      setVerificationState({
        isVerifying: false,
        isVerified: false,
        error: null,
        cancelled: true,
      });
      setOpen(true);
    } else if (!paymentStatus) {
      setOpen(false);
    }
  }, [
    paymentStatus,
    verificationState.isVerifying,
    verificationState.isVerified,
    verificationState.cancelled,
    verifyAction,
  ]);

  const handleClose = () => {
    if (!verificationState.isVerifying) {
      setOpen(false);

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("payment");
      router.replace(newUrl.pathname);
    }
  };

  const getDialogContent = () => {
    if (verificationState.isVerifying) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Verifying your payment
            </DialogTitle>
            <DialogDescription>
              Please wait while we verify your payment with Stripe...
            </DialogDescription>
          </DialogHeader>
        </>
      );
    }

    if (verificationState.isVerified) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Payment Successful!
            </DialogTitle>
            <DialogDescription>
              Your payment has been verified and your account has been upgraded
              to the paid plan. You now have access to all premium features.
            </DialogDescription>
          </DialogHeader>
        </>
      );
    }

    if (verificationState.cancelled) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-muted-foreground">
              <XCircle className="h-5 w-5" />
              Payment Cancelled
            </DialogTitle>
            <DialogDescription>
              You&apos;ve cancelled the payment process. You can upgrade to the
              paid plan anytime to access premium features.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="default" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </>
      );
    }

    if (verificationState.error) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Payment Verification Failed
            </DialogTitle>
            <DialogDescription>{verificationState.error}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => verifyAction.execute()}
              disabled={verifyAction.isExecuting}
            >
              {verifyAction.isExecuting ? "Retrying..." : "Retry Verification"}
            </Button>
            <Button variant="default" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </>
      );
    }

    return (
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>Payment Verification</DialogTitle>
        </VisuallyHidden>
        <DialogDescription>
          Processing your payment information...
        </DialogDescription>
      </DialogHeader>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
}
