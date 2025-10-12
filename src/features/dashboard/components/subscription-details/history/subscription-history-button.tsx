"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History, Plus } from "lucide-react";
import { useState } from "react";
import { AddHistoricalPeriodForm } from "./add-historical-period-form";
import { Subscription } from "@prisma/client";

interface SubscriptionHistoryButtonProps {
  children: React.ReactNode;
  subscription: Subscription;
}

export const SubscriptionHistoryButton = ({
  children,
  subscription,
}: SubscriptionHistoryButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            <History className="h-3.5 w-3.5" />
            History
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subscription History</DialogTitle>
            <DialogDescription className="flex items-center justify-between">
              <span>
                View and manage pricing history for {subscription.name}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingPeriod(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Period
              </Button>
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingPeriod} onOpenChange={setIsAddingPeriod}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Historical Period</DialogTitle>
            <DialogDescription>
              Add a past pricing period to track historical costs accurately
            </DialogDescription>
          </DialogHeader>
          <AddHistoricalPeriodForm
            subscriptionId={subscription.id}
            onSuccess={() => {
              setIsAddingPeriod(false);
              setIsOpen(false);
            }}
            onCancel={() => setIsAddingPeriod(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
