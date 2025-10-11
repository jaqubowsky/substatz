import { z } from "zod";

export const exportFormatEnum = z.enum(["excel", "pdf"]);

export const exportSubscriptionSchema = z
  .object({
    dateFrom: z.date().nullable(),
    dateTo: z.date().nullable(),
    format: exportFormatEnum,
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return data.dateFrom < data.dateTo;
      }
      return true;
    },
    {
      message: "Start date must be before end date",
      path: ["dateTo"],
    }
  );

export type ExportSubscriptionInput = z.infer<typeof exportSubscriptionSchema>;
