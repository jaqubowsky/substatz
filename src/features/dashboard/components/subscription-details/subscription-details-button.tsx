"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { ReactNode, useState } from "react";

interface SubscriptionDetailsButtonProps {
  children: ReactNode;
}

export function SubscriptionDetailsButton({
  children,
}: SubscriptionDetailsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
          <Info className="h-3.5 w-3.5" />
          Details
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {children}
        </DialogContent>
      )}
    </Dialog>
  );
}
