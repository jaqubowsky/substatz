"use client";

import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string | ReactNode;
  icon?: ReactNode;
  isProcessing?: boolean;
  cancelText?: string;
  confirmText?: string;
  variant?: "default" | "destructive";
  processingText?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  icon,
  isProcessing = false,
  cancelText = "Cancel",
  confirmText = "Confirm",
  variant = "default",
  processingText,
}: ConfirmationDialogProps) {
  const buttonClasses =
    variant === "destructive"
      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      : "";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {icon && (
            <div className="flex flex-col items-center mb-4">
              {icon}
              <AlertDialogTitle className="mt-2">{title}</AlertDialogTitle>
            </div>
          )}
          {!icon && <AlertDialogTitle>{title}</AlertDialogTitle>}
          <AlertDialogDescription className={icon ? "" : "mt-2"}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={buttonClasses}
            disabled={isProcessing}
          >
            {isProcessing
              ? processingText || `${confirmText}ing...`
              : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
