import { BillingCycle } from "@prisma/client";

export function calculateNextPaymentDate(
  startDate: Date,
  billingCycle: BillingCycle
): Date {
  const today = new Date();
  const start = new Date(startDate);
  const result = new Date(start);

  let periodInMonths = 1;
  switch (billingCycle) {
    case "MONTHLY":
      periodInMonths = 1;
      break;
    case "QUARTERLY":
      periodInMonths = 3;
      break;
    case "BIANNUALLY":
      periodInMonths = 6;
      break;
    case "ANNUALLY":
      periodInMonths = 12;
      break;
  }

  const monthsSinceStart =
    (today.getFullYear() - start.getFullYear()) * 12 +
    (today.getMonth() - start.getMonth());

  const periodsElapsed = Math.floor(monthsSinceStart / periodInMonths);

  result.setMonth(start.getMonth() + (periodsElapsed + 1) * periodInMonths);

  if (result < today) {
    result.setMonth(result.getMonth() + periodInMonths);
  }

  return result;
}
