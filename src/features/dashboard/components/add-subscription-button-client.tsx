"use client";

import { Paywall } from "@/components/paywall";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddSubscriptionForm } from "./add-subscription-form";

export const AddSubscriptionButtonClient = ({
  isPaid,
  hasReachedLimit,
}: {
  isPaid: boolean;
  hasReachedLimit: boolean;
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    if (hasReachedLimit && !isPaid) return router.push("/pricing");

    setIsDialogOpen(true);
  };

  return (
    <>
      {hasReachedLimit ? (
        <Paywall showMessage={false}>
          <Button
            size="sm"
            className="gap-1"
            aria-label="Add subscription"
            onClick={handleOpenDialog}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </Paywall>
      ) : (
        <Button
          onClick={handleOpenDialog}
          size="sm"
          className="gap-1"
          aria-label="Add subscription"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Subscription</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new subscription to your
              dashboard.
            </DialogDescription>
          </DialogHeader>
          <AddSubscriptionForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
