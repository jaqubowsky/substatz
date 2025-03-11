import { BillingCycle } from "@prisma/client";
import { addMonths, isBefore, isSameDay } from "date-fns";

export function calculateNextPaymentDate(
  startDate: Date,
  billingCycle: BillingCycle
): Date {
  const today = new Date();
  const start = new Date(startDate);

  const cycleToMonths = {
    MONTHLY: 1,
    QUARTERLY: 3,
    BIANNUALLY: 6,
    ANNUALLY: 12,
  };

  const periodInMonths = cycleToMonths[billingCycle];

  let monthsSinceStart =
    (today.getFullYear() - start.getFullYear()) * 12 +
    (today.getMonth() - start.getMonth());

  if (today.getDate() < start.getDate()) {
    monthsSinceStart--;
  }

  const periodsElapsed = Math.max(
    0,
    Math.floor(monthsSinceStart / periodInMonths)
  );

  let nextPaymentDate = new Date(start);
  nextPaymentDate.setMonth(
    start.getMonth() + (periodsElapsed + 1) * periodInMonths
  );

  const originalDay = start.getDate();
  const lastDayOfMonth = new Date(
    nextPaymentDate.getFullYear(),
    nextPaymentDate.getMonth() + 1,
    0
  ).getDate();

  nextPaymentDate.setDate(Math.min(originalDay, lastDayOfMonth));

  if (isBefore(nextPaymentDate, today) || isSameDay(nextPaymentDate, today)) {
    nextPaymentDate = addMonths(nextPaymentDate, periodInMonths);
  }

  return nextPaymentDate;
}
