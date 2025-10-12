import * as XLSX from "xlsx";
import { pdf } from "@react-pdf/renderer";
import { SubscriptionPdfDocument } from "@/features/settings/components/export-modal";
import { SubscriptionWithFinancials } from "@/features/dashboard/lib/subscription-utils";

export async function generateExcelFile(
  subscriptions: SubscriptionWithFinancials[]
): Promise<string> {
  const rows = subscriptions.map((sub) => ({
    Name: sub.name,
    Price: sub.price,
    Currency: sub.currency,
    Category: sub.category,
    "Billing Cycle": sub.billingCycle,
    "Start Date": sub.startDate.toISOString().split("T")[0],
    Status: sub.isCancelled ? "Cancelled" : "Active",
    "Created Date": sub.createdAt.toISOString().split("T")[0],
    "Updated Date": sub.updatedAt.toISOString().split("T")[0],
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Subscriptions");

  worksheet["!cols"] = [
    { wch: 25 }, // Name
    { wch: 10 }, // Price
    { wch: 10 }, // Currency
    { wch: 15 }, // Category
    { wch: 15 }, // Billing Cycle
    { wch: 12 }, // Start Date
    { wch: 10 }, // Status
    { wch: 12 }, // Created Date
    { wch: 12 }, // Updated Date
  ];

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return Buffer.from(buffer).toString("base64");
}

export async function generatePdfFile(
  subscriptions: SubscriptionWithFinancials[]
): Promise<string> {
  const pdfBlob = await pdf(
    SubscriptionPdfDocument({ subscriptions })
  ).toBlob();
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer.toString("base64");
}
