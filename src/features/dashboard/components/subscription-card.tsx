"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  calculateNextPaymentDate,
  formatCurrency,
  formatDate,
} from "@/features/dashboard/lib";
import { BillingCycle } from "@/features/dashboard/schemas";
import { removeSubscriptionAction } from "@/features/dashboard/server/actions";
import { Subscription } from "@prisma/client";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  Edit,
  MoreVertical,
  Tag,
  Trash,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { EditSubscriptionForm } from "./edit-subscription-form";
import { SubscriptionDetails } from "./subscription-details";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
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
      setIsEditDialogOpen(false);
    },
  });

  const nextPaymentDate = calculateNextPaymentDate(
    new Date(subscription.startDate),
    subscription.billingCycle as BillingCycle
  );

  const formattedDate = formatDate(nextPaymentDate.toISOString());

  const getBadge = () => {
    if (subscription.isCancelled) {
      return <Badge variant="destructive">Cancelled</Badge>;
    }

    const today = new Date();
    const daysUntilPayment = Math.ceil(
      (nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilPayment < 0) return null;

    if (daysUntilPayment === 0) {
      return <Badge variant="destructive">Due today</Badge>;
    }

    if (daysUntilPayment <= 3) {
      return <Badge variant="destructive">Due soon</Badge>;
    }

    if (daysUntilPayment <= 7) {
      return <Badge variant="secondary">Upcoming</Badge>;
    }

    return null;
  };

  return (
    <>
      <Card className="hover:border-primary/50 transition-all hover:shadow-md group">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {subscription.name}
              </h3>
              {getBadge()}
            </div>
            <div className="flex items-center gap-1">
              <SubscriptionDetails subscription={subscription} />
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
            </div>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Tag className="h-3.5 w-3.5 mr-1" />
            {subscription.category}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Next payment
              </p>
              <p className="font-medium text-foreground">{formattedDate}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(subscription.price, subscription.currency)}
              </p>
              <p className="text-sm text-muted-foreground flex items-center justify-end">
                <CreditCard className="h-3.5 w-3.5 mr-1" />
                {subscription.billingCycle.charAt(0) +
                  subscription.billingCycle.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
        confirmText={
          deleteAction.status === "executing" ? "Deleting..." : "Delete"
        }
        cancelText="Cancel"
        variant="destructive"
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Make changes to your subscription details below.
            </DialogDescription>
          </DialogHeader>
          <EditSubscriptionForm
            subscription={subscription}
            onSuccess={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
