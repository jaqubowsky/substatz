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

export function PaymentVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const status = searchParams.get("status");

  const [state, setState] = useState({
    open: false,
    isVerifying: false,
    isVerified: false,
    error: null as string | null,
    cancelled: false,
  });

  const cleanupUrlParams = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("session_id");
    url.searchParams.delete("status");
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const verifyAction = useAction(verifyPaymentAction, {
    onExecute: () => {
      setState((prev) => ({
        ...prev,
        isVerifying: true,
        isVerified: false,
        error: null,
        cancelled: false,
      }));
    },
    onSuccess: async () => {
      setState((prev) => ({
        ...prev,
        isVerifying: false,
        isVerified: true,
        error: null,
      }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, open: false }));
        cleanupUrlParams();
      }, 1500);
    },
    onError: (error) => {
      const errorMessage =
        error.error.serverError || "Failed to verify payment";

      setState((prev) => ({
        ...prev,
        isVerifying: false,
        isVerified: false,
        error: errorMessage,
      }));
    },
  });

  const handleClose = () => {
    if (state.isVerifying) return;

    setState((prev) => ({ ...prev, open: false }));
    cleanupUrlParams();
  };

  useEffect(() => {
    if (sessionId) {
      setState((prev) => ({ ...prev, open: true }));

      if (status === "cancelled") {
        setState((prev) => ({
          ...prev,
          open: true,
          cancelled: true,
          isVerifying: false,
          isVerified: false,
          error: null,
        }));
      } else if (!state.isVerifying && !state.isVerified) {
        verifyAction.execute({ sessionId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, status]);

  const getDialogContent = () => {
    if (state.isVerifying) {
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
    }

    if (state.isVerified) {
      return (
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            Payment Successful!
          </DialogTitle>
          <DialogDescription>
            Your payment has been verified and your account has been upgraded to
            the paid plan. You now have access to all premium features.
          </DialogDescription>
        </DialogHeader>
      );
    }

    if (state.cancelled) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-accent-foreground">
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

    if (state.error) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Payment Verification Failed
            </DialogTitle>
            <DialogDescription>{state.error}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => verifyAction.execute({ sessionId: sessionId! })}
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
    <Dialog
      open={state.open}
      onOpenChange={(open) => {
        if (!open) handleClose();
        else setState((prev) => ({ ...prev, open: true }));
      }}
    >
      <DialogContent className="sm:max-w-md">
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
}
