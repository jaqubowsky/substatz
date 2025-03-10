"use client";

import { UserNav } from "@/components/user-nav";
import { LayoutDashboard } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center border-b border-border pb-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-md">
          <LayoutDashboard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscriptions in one place
          </p>
        </div>
      </div>
      <UserNav />
    </div>
  );
};
