"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const RefundButton = () => {
  const router = useRouter();

  return (
    <Button variant="destructive" onClick={() => router.push("/contact")}>
      Refund
    </Button>
  );
};
