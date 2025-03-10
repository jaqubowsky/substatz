"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { useConfirm } from "@/hooks/use-confirm";
import { Calendar, CreditCard, Edit, Tag, Trash } from "lucide-react";
import { useState } from "react";
import { useDeleteSubscription } from "../hooks/use-delete-subscription";
import { formatCurrency } from "../lib/format-currency";
import { formatDate } from "../lib/format-date";
import { Subscription } from "../schemas/subscription";
import { EditSubscriptionForm } from "./edit-subscription-form";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const { deleteSubscription } = useDeleteSubscription();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { isOpen, isLoading, open, close, confirm } = useConfirm({
    onConfirm: async () => {
      await deleteSubscription(subscription.id);
    },
  });

  const formattedDate = formatDate(
    subscription.nextPaymentDate instanceof Date
      ? subscription.nextPaymentDate.toISOString()
      : subscription.nextPaymentDate
  );

  const getBadge = () => {
    if (subscription.isCancelled) {
      return (
        <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
          Cancelled
        </span>
      );
    }

    const nextPayment = new Date(subscription.nextPaymentDate);
    const today = new Date();
    const daysUntilPayment = Math.ceil(
      (nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilPayment < 0) return null;

    if (daysUntilPayment === 0) {
      return (
        <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
          Due today
        </span>
      );
    }

    if (daysUntilPayment <= 3) {
      return (
        <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
          Due soon
        </span>
      );
    }

    if (daysUntilPayment <= 7) {
      return (
        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
          Upcoming
        </span>
      );
    }

    return null;
  };

  return (
    <>
      <div className="bg-card rounded-lg shadow-sm p-6 border border-border hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold text-foreground">
                {subscription.name}
              </h3>
              {getBadge()}
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Tag className="h-3.5 w-3.5 mr-1" />
              {subscription.category}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(subscription.price)}
            </p>
            <p className="text-sm text-muted-foreground flex items-center justify-end">
              <CreditCard className="h-3.5 w-3.5 mr-1" />
              {subscription.billingCycle.charAt(0) +
                subscription.billingCycle.slice(1).toLowerCase()}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Next payment
              </p>
              <p className="font-medium text-foreground">{formattedDate}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={open}>
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={close}
        onConfirm={confirm}
        title="Delete Subscription"
        description={`Are you sure you want to delete ${subscription.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isLoading}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Subscription"
      >
        <EditSubscriptionForm
          subscription={subscription}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </>
  );
};
