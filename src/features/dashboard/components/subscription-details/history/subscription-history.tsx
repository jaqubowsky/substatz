"use client";

import { SubscriptionHistoryCard } from "./subscription-history-card";
import { SubscriptionHistory as SubscriptionHistoryType } from "@prisma/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditHistoricalPeriodForm } from "./edit-historical-period-form";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AlertTriangle } from "lucide-react";
import { deleteHistoricalPeriodAction } from "@/features/dashboard/server/actions/subscription-history";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface SubscriptionHistoryProps {
  history: SubscriptionHistoryType[];
}

export const SubscriptionHistory = ({ history }: SubscriptionHistoryProps) => {
  const [editingPeriod, setEditingPeriod] =
    useState<SubscriptionHistoryType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteAction = useAction(deleteHistoricalPeriodAction, {
    onSuccess: () => {
      toast.success("Period deleted successfully");
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Failed to delete period");
    },
  });

  return (
    <>
      <div className="max-h-[60vh] overflow-y-auto space-y-4 p-1">
        {history.length > 0 ? (
          history.map((item) => (
            <SubscriptionHistoryCard
              key={item.id}
              history={item}
              onEdit={setEditingPeriod}
              onDelete={setDeletingId}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No history found for this subscription.
          </p>
        )}
      </div>

      <Dialog
        open={!!editingPeriod}
        onOpenChange={(open) => !open && setEditingPeriod(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Historical Period</DialogTitle>
            <DialogDescription>
              Update the pricing information for this period
            </DialogDescription>
          </DialogHeader>
          {editingPeriod && (
            <EditHistoricalPeriodForm
              history={editingPeriod}
              onSuccess={() => setEditingPeriod(null)}
              onCancel={() => setEditingPeriod(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={!!deletingId}
        onOpenChange={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteAction.execute({ id: deletingId });
          }
        }}
        title="Delete Historical Period"
        description="Are you sure you want to delete this period? This will affect your statistics and cannot be undone."
        icon={<AlertTriangle className="h-12 w-12 text-destructive" />}
        isProcessing={deleteAction.status === "executing"}
        confirmText="Delete"
        processingText="Deleting..."
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};
