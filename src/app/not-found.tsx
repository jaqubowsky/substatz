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
    <div className="flex flex-1 items-center justify-center p-4 bg-secondary/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            <CardTitle>Page Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We couldn&apos;t find the page you were looking for. It might have
            been moved, deleted, or never existed.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
