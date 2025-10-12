export function calculateDayBefore(date: Date): Date {
  const boundary = new Date(date);
  boundary.setUTCHours(0, 0, 0, 0);
  boundary.setDate(boundary.getDate() - 1);
  return boundary;
}

export function calculateDayAfter(date: Date): Date {
  const boundary = new Date(date);
  boundary.setUTCHours(0, 0, 0, 0);
  boundary.setDate(boundary.getDate() + 1);
  return boundary;
}

export function normalizeDateToMidnight(date: Date): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}
