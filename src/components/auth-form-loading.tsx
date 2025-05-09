import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";
export const AuthFormLoading = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex h-full items-center justify-center", className)}>
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};
