"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/lib/env";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        origin: "global_error_boundary",
      },
      extra: {
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-accent-foreground mb-4">
            We&apos;re sorry, but we encountered an unexpected error.
          </p>
          {env.NODE_ENV !== "production" && (
            <div className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-[200px]">
              <p className="font-mono">{error.message}</p>
              {error.stack && (
                <pre className="mt-2 text-xs text-accent-foreground">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            role="button"
          >
            Go Home
          </Button>
          <Button onClick={reset} role="button">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
