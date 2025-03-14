import { CYCLE_TO_MONTHS, calculateBillingCycles } from "@/lib/billing-utils";
import { BillingCycle } from "@prisma/client";
import { addMonths, isBefore, isSameDay } from "date-fns";

export function calculateNextPaymentDate(
  startDate: Date,
  billingCycle: BillingCycle
): Date {
  const today = new Date();
  const start = new Date(startDate);
  const periodInMonths = CYCLE_TO_MONTHS[billingCycle];

  const periodsElapsed = calculateBillingCycles(start, billingCycle, today);

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
