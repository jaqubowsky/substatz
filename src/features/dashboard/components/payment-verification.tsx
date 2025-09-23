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
import { verifyPaymentAction } from "@/features/dashboard/server/actions";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type PaymentVerificationState =
  | { status: "idle" }
  | { status: "verifying" }
  | { status: "verified" }
  | { status: "cancelled" }
  | { status: "error"; message: string };

export function PaymentVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const paymentStatus = searchParams.get("status");

  const [open, setOpen] = useState(false);
  const [state, setState] = useState<PaymentVerificationState>({
    status: "idle",
  });

  const cleanupUrlParams = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("session_id");
    url.searchParams.delete("status");
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const verifyAction = useAction(verifyPaymentAction, {
    onExecute: () => {
      setState({ status: "verifying" });
    },
    onSuccess: async () => {
      setState({ status: "verified" });

      setTimeout(() => {
        setOpen(false);
        cleanupUrlParams();
      }, 1500);
    },
    onError: (error) => {
      const errorMessage =
        error.error.serverError || "Failed to verify payment";

      setState({ status: "error", message: errorMessage });
    },
  });

  const handleClose = () => {
    if (state.status === "verifying") return;

    setOpen(false);
    cleanupUrlParams();
  };

  useEffect(() => {
    if (!sessionId) return;

    setOpen(true);

    if (paymentStatus === "cancelled") {
      setState({ status: "cancelled" });
    } else if (state.status === "idle") {
      verifyAction.execute({ sessionId });
    } else {
      setState({ status: "verifying" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, paymentStatus, state.status]);

  const getDialogContent = () => {
    switch (state.status) {
      case "verifying":
        return (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Verifying your payment
            </DialogTitle>
            <DialogDescription>
              Please wait while we verify your payment with Stripe...
            </DialogDescription>
          </DialogHeader>
        );
      case "verified":
        return (
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
        );
      case "cancelled":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-accent-foreground">
                <XCircle className="h-5 w-5" />
                Payment Cancelled
              </DialogTitle>
              <DialogDescription>
                You&apos;ve cancelled the payment process. You can upgrade to
                the paid plan anytime to access premium features.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="default" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        );
      case "error":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                Payment Verification Failed
              </DialogTitle>
              <DialogDescription>{state.message}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => verifyAction.execute({ sessionId: sessionId! })}
                disabled={verifyAction.isExecuting}
              >
                {verifyAction.isExecuting
                  ? "Retrying..."
                  : "Retry Verification"}
              </Button>
              <Button variant="default" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        );
      default:
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
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
        else setOpen(true);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
}
