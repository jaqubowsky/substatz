"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import * as Sentry from "@sentry/nextjs";
import { AlertCircle } from "lucide-react";
import { Component, ReactNode } from "react";
import { RefreshButton } from "./refresh-button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundaryWrapper extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    Sentry.captureException(error, {
      tags: {
        componentName: this.props.componentName || "unknown",
        origin: "component_error",
      },
      extra: {
        componentStack: error.stack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 pb-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-destructive/10 p-3 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">
                Unable to load {this.props.componentName || "component"}
              </CardTitle>
              <CardDescription className="mb-6 max-w-md mx-auto">
                We encountered an error while loading this component. Please try
                again later.
              </CardDescription>
              <RefreshButton
                onClick={() => this.setState({ hasError: false, error: null })}
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
