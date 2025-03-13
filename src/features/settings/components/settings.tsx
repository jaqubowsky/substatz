"use client";

import { Separator } from "@/components/ui/separator";
import { useClientAuth } from "@/hooks";
import { Billing } from "./billing";
import { ChangePasswordForm } from "./change-password-form";
import { DeleteAccount } from "./delete-account";

export function Settings() {
  const { user, isLoading } = useClientAuth();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and billing information
        </p>
      </div>

      <div className="space-y-6">
        <Billing />

        {user?.provider === "credentials" && !isLoading ? (
          <>
            <ChangePasswordForm />
            <Separator />
          </>
        ) : null}

        <DeleteAccount />
      </div>
    </div>
  );
}
