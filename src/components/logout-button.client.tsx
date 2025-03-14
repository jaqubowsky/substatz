"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useClientAuth } from "@/hooks/use-client-auth";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { logout } = useClientAuth();

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => logout()}
      role="menuitem"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
