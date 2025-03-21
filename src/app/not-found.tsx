import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4 bg-secondary/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-primary" />
              <CardTitle>Page Not Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-accent-foreground mb-4">
              We couldn&apos;t find the page you were looking for. It might have
              been moved, deleted, or never existed.
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
