"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
export function LogoutButton() {
  const pathname = usePathname();

  const redirectTo = pathname === "/" ? "/" : "/login";

  return (
    <DropdownMenuItem
      onClick={() => signOut({ redirectTo })}
      className="cursor-pointer"
      role="menuitem"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
