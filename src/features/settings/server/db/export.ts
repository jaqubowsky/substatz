import { prisma } from "@/lib/prisma";

export async function getFilteredSubscriptions(
  userId: string,
  dateFrom: Date | null,
  dateTo: Date | null
) {
  "use cache";

  const where: {
    userId: string;
    startDate?: {
      gte?: Date;
      lte?: Date;
    };
  } = {
    userId,
  };

  if (dateFrom || dateTo) {
    where.startDate = {};
    if (dateFrom) {
      where.startDate.gte = dateFrom;
    }
    if (dateTo) {
      where.startDate.lte = dateTo;
    }
  }

  return prisma.subscription.findMany({
    where,
    orderBy: [{ startDate: "desc" }, { name: "asc" }],
  });
}
