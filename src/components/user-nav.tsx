"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClientAuth } from "@/hooks";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export function UserNav() {
  const { user, isAuthenticated, logout } = useClientAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button
            variant="ghost"
            size="sm"
            className="font-medium hover:bg-primary/10 transition-colors"
          >
            Log in
          </Button>
        </Link>
        <Link href="/register">
          <Button
            size="sm"
            className="font-medium bg-primary hover:bg-primary/90 transition-colors"
          >
            Sign up
          </Button>
        </Link>
      </div>
    );
  }

  const userInitials = (
    user?.name?.slice(0, 2) ||
    user?.email?.slice(0, 2) ||
    "U"
  ).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-11 w-11 rounded-full border-2 border-primary/20 hover:bg-primary/5 transition-all duration-200"
        >
          <span className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent text-primary font-semibold text-sm">
            {userInitials}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 p-2"
        align="end"
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-semibold leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="flex w-full cursor-pointer items-center p-2 rounded-md transition-colors hover:bg-primary/5"
            >
              <User className="mr-3 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="flex w-full cursor-pointer items-center p-2 rounded-md transition-colors hover:bg-primary/5"
            >
              <Settings className="mr-3 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          className="cursor-pointer p-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
