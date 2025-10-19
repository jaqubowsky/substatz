import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MigrationOutputProps {
  output: string;
  onClose: () => void;
  isVisible: boolean;
}

export function MigrationOutput({ output, onClose, isVisible }: MigrationOutputProps) {
  if (!isVisible || !output) return null;

  return (
    <div className="mt-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Migration Output</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
        {output}
      </pre>
    </div>
  );
}
