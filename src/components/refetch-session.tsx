"use client";

import { SubscriptionPlan } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const RefetchSession = () => {
  const { data, update } = useSession();

  const user = data?.user;
  const isPaid = user?.plan === SubscriptionPlan.PAID;

  useEffect(() => {
    if (!user || isPaid) return;

    update({
      user: {
        id: user.id,
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
