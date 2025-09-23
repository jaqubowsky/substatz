"use client";

import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeSubscriptionAction } from "@/features/dashboard/server/actions";
import { Subscription } from "@prisma/client";
import { AlertTriangle, Edit, MoreVertical, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionCardActionsProps {
  subscription: Subscription;
}

const DynamicSubscriptionForm = dynamic(
  () => import("../subscription-form").then((mod) => mod.SubscriptionForm),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    ),
  }
);

export const SubscriptionCardActions = ({
  subscription,
}: SubscriptionCardActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteAction = useAction(removeSubscriptionAction, {
    onSuccess: () => {
      toast.success("Subscription deleted successfully.");
    },
    onError: (data) => {
      toast.error(data.error.serverError || "Failed to delete subscription.");
    },
    onSettled: () => {
      setIsDeleteDialogOpen(false);
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => deleteAction.execute({ id: subscription.id })}
        title="Delete Subscription"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{subscription.name}</span>? This
            action cannot be undone.
          </>
        }
        icon={<AlertTriangle className="h-12 w-12 text-destructive" />}
        isProcessing={deleteAction.status === "executing"}
        confirmText="Delete"
        processingText="Deleting..."
        cancelText="Cancel"
        variant="destructive"
      />

      {isEditDialogOpen && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Subscription</DialogTitle>
              <DialogDescription>
                Make changes to your subscription details below.
              </DialogDescription>
            </DialogHeader>
            <DynamicSubscriptionForm
              initialSubscription={subscription}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
