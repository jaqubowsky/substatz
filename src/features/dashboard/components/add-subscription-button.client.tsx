"use client";

import { PurchaseButton } from "@/components/purchase-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import { useState } from "react";

const DynamicSubscriptionForm = dynamic(() =>
  import("./subscription-form").then((mod) => mod.SubscriptionForm)
);

export const AddSubscriptionButtonClient = ({
  hasReachedLimit,
}: {
  hasReachedLimit: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {hasReachedLimit ? (
        <PurchaseButton
          size="sm"
          className="gap-1"
          aria-label="Unlock subscription limit"
        >
          Unlock Now
        </PurchaseButton>
      ) : (
        <Button
          onClick={() => setIsDialogOpen(true)}
          size="sm"
          className="gap-1"
          aria-label="Add subscription"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      )}

      {!hasReachedLimit && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new subscription to your
                dashboard.
              </DialogDescription>
            </DialogHeader>
            <DynamicSubscriptionForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
