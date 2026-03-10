import { pdf } from "@react-pdf/renderer";
import ExcelJS from "exceljs";
import type { SubscriptionWithFinancials } from "@/features/dashboard/lib/subscription-utils";
import { SubscriptionPdfDocument } from "@/features/settings/components/export-modal";

export async function generateExcelFile(
  subscriptions: SubscriptionWithFinancials[],
): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Subscriptions");

  worksheet.columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Price", key: "price", width: 10 },
    { header: "Currency", key: "currency", width: 10 },
    { header: "Category", key: "category", width: 15 },
    { header: "Billing Cycle", key: "billingCycle", width: 15 },
    { header: "Start Date", key: "startDate", width: 12 },
    { header: "Status", key: "status", width: 10 },
    { header: "Created Date", key: "createdDate", width: 12 },
    { header: "Updated Date", key: "updatedDate", width: 12 },
  ];

  for (const sub of subscriptions) {
    worksheet.addRow({
      name: sub.name,
      price: sub.price,
      currency: sub.currency,
      category: sub.category,
      billingCycle: sub.billingCycle,
      startDate: sub.startDate.toISOString().split("T")[0],
      status: sub.isCancelled ? "Cancelled" : "Active",
      createdDate: sub.createdAt.toISOString().split("T")[0],
      updatedDate: sub.updatedAt.toISOString().split("T")[0],
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer).toString("base64");
}

export async function generatePdfFile(
  subscriptions: SubscriptionWithFinancials[],
): Promise<string> {
  const pdfBlob = await pdf(
    SubscriptionPdfDocument({ subscriptions }),
  ).toBlob();
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer.toString("base64");
}
