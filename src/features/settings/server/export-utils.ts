import { Subscription } from "@prisma/client";
import * as XLSX from "xlsx";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import React from "react";

export async function generateExcelFile(
  subscriptions: Subscription[]
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
  subscriptions: Subscription[]
): Promise<string> {
  const MyDocument = React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: "A4", style: styles.page, orientation: "landscape" },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          Text,
          { style: styles.title },
          "SubStatz - Subscription Export"
        ),
        React.createElement(
          Text,
          { style: styles.subtitle },
          `Export Date: ${new Date().toLocaleDateString()}`
        )
      ),
      React.createElement(
        View,
        { style: styles.table },
        React.createElement(
          View,
          { style: [styles.tableRow, styles.tableHeader] },
          React.createElement(
            Text,
            { style: [styles.tableCell, styles.nameCell] },
            "Name"
          ),
          React.createElement(
            Text,
            { style: [styles.tableCell, styles.priceCell] },
            "Price"
          ),
          React.createElement(
            Text,
            { style: [styles.tableCell, styles.smallCell] },
            "Currency"
          ),
          React.createElement(
            Text,
            { style: [styles.tableCell, styles.mediumCell] },
            "Category"
          ),
          React.createElement(
            Text,
            { style: [styles.tableCell, styles.mediumCell] },
            "Billing Cycle"
          ),
          React.createElement(
            Text,
            { style: [styles.tableCell, styles.dateCell] },
            "Start Date"
          ),
          React.createElement(
            Text,
            { style: [styles.tableCell, styles.smallCell] },
            "Status"
          )
        ),
        ...subscriptions.map((sub) =>
          React.createElement(
            View,
            { style: styles.tableRow, key: sub.id },
            React.createElement(
              Text,
              { style: [styles.tableCell, styles.nameCell] },
              sub.name
            ),
            React.createElement(
              Text,
              { style: [styles.tableCell, styles.priceCell] },
              sub.price.toFixed(2)
            ),
            React.createElement(
              Text,
              { style: [styles.tableCell, styles.smallCell] },
              sub.currency
            ),
            React.createElement(
              Text,
              { style: [styles.tableCell, styles.mediumCell] },
              sub.category
            ),
            React.createElement(
              Text,
              { style: [styles.tableCell, styles.mediumCell] },
              sub.billingCycle
            ),
            React.createElement(
              Text,
              { style: [styles.tableCell, styles.dateCell] },
              sub.startDate.toISOString().split("T")[0]
            ),
            React.createElement(
              Text,
              { style: [styles.tableCell, styles.smallCell] },
              sub.isCancelled ? "Cancelled" : "Active"
            )
          )
        )
      )
    )
  );

  const pdfBlob = await pdf(MyDocument).toBlob();
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer.toString("base64");
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
  },
  table: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #ddd",
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    borderBottom: "2 solid #000",
    paddingVertical: 8,
  },
  tableCell: {
    padding: 4,
    fontSize: 8,
  },
  nameCell: {
    width: "20%",
  },
  priceCell: {
    width: "10%",
  },
  smallCell: {
    width: "10%",
  },
  mediumCell: {
    width: "15%",
  },
  dateCell: {
    width: "12%",
  },
});
