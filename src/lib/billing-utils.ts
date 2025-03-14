import { BillingCycle } from "@prisma/client";

export const CYCLE_TO_MONTHS: Record<BillingCycle, number> = {
  MONTHLY: 1,
  QUARTERLY: 3,
  BIANNUALLY: 6,
  ANNUALLY: 12,
};

export function calculateMonthsDifference(
  startDate: Date,
  endDate: Date = new Date()
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let monthsDiff =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (end.getDate() < start.getDate()) {
    monthsDiff--;
  }

  return Math.max(0, monthsDiff);
}

export function calculateBillingCycles(
  startDate: Date,
  billingCycle: BillingCycle,
  endDate: Date = new Date()
): number {
  const monthsDiff = calculateMonthsDifference(startDate, endDate);
  const periodInMonths = CYCLE_TO_MONTHS[billingCycle];
  return Math.max(0, Math.floor(monthsDiff / periodInMonths));
}

export function formatDuration(
  days: number,
  months: number,
  years: number
): string {
  let formattedDuration = "";

  if (years > 0) {
    formattedDuration += `${years} year${years > 1 ? "s" : ""} `;
  }

  if (months > 0 || years === 0) {
    formattedDuration += `${months} month${months !== 1 ? "s" : ""} `;
  }

  if (days < 30 && months === 0 && years === 0) {
    formattedDuration = `${days} day${days !== 1 ? "s" : ""}`;
  }

  return formattedDuration.trim();
}

export function calculateAnnualCost(
  price: number,
  billingCycle: BillingCycle
): number {
  switch (billingCycle) {
    case "MONTHLY":
      return price * 12;
    case "QUARTERLY":
      return price * 4;
    case "BIANNUALLY":
      return price * 2;
    case "ANNUALLY":
      return price;
    default:
      return price * 12;
  }
}

export function calculateMonthlyCost(
  price: number,
  billingCycle: BillingCycle
): number {
  switch (billingCycle) {
    case "MONTHLY":
      return price;
    case "QUARTERLY":
      return price / 3;
    case "BIANNUALLY":
      return price / 6;
    case "ANNUALLY":
      return price / 12;
    default:
      return price;
  }
}
