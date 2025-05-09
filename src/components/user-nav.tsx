"use client";

import { LogoutButton } from "@/components/logout-button.client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClientAuth } from "@/hooks";
import { cn } from "@/lib/cn";
import { Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

export function UserNav() {
  const { user, isAuthenticated, isLoading } = useClientAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
      </div>
    );
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign up</Link>
        </Button>
      </div>
    );
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true;
    if (path === "/settings" && pathname.startsWith("/settings")) return true;
    return false;
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant={isActive("/dashboard") ? "default" : "ghost"}
        asChild
        className={cn(
          "flex items-center",
          isActive("/dashboard") && "bg-primary text-primary-foreground"
        )}
      >
        <Link href="/dashboard">
          <User className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </Button>

      <Button
        variant={isActive("/settings") ? "default" : "ghost"}
        asChild
        className={cn(
          "flex items-center",
          isActive("/settings") && "bg-primary text-primary-foreground"
        )}
      >
        <Link href="/settings">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-accent-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
