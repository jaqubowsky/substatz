"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const RefundButton = () => {
  const router = useRouter();

  return (
    <Button variant="destructive" onClick={() => router.push("/contact")}>
      Refund
    </Button>
  );
};
