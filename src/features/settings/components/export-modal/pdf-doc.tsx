import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { SubscriptionWithFinancials } from "@/features/dashboard/lib/subscription-utils";

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

export const SubscriptionPdfDocument = ({
  subscriptions,
}: {
  subscriptions: SubscriptionWithFinancials[];
}) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header}>
        <Text style={styles.title}>SubStatz - Subscription Export</Text>
        <Text style={styles.subtitle}>
          Export Date: {new Date().toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.nameCell]}>Name</Text>
          <Text style={[styles.tableCell, styles.priceCell]}>Price</Text>
          <Text style={[styles.tableCell, styles.smallCell]}>Currency</Text>
          <Text style={[styles.tableCell, styles.mediumCell]}>Category</Text>
          <Text style={[styles.tableCell, styles.mediumCell]}>
            Billing Cycle
          </Text>
          <Text style={[styles.tableCell, styles.dateCell]}>Start Date</Text>
          <Text style={[styles.tableCell, styles.smallCell]}>Status</Text>
        </View>
        {subscriptions.map((sub) => (
          <View style={styles.tableRow} key={sub.id}>
            <Text style={[styles.tableCell, styles.nameCell]}>{sub.name}</Text>
            <Text style={[styles.tableCell, styles.priceCell]}>
              {sub.price.toFixed(2)}
            </Text>
            <Text style={[styles.tableCell, styles.smallCell]}>
              {sub.currency}
            </Text>
            <Text style={[styles.tableCell, styles.mediumCell]}>
              {sub.category}
            </Text>
            <Text style={[styles.tableCell, styles.mediumCell]}>
              {sub.billingCycle}
            </Text>
            <Text style={[styles.tableCell, styles.dateCell]}>
              {sub.startDate.toISOString().split("T")[0]}
            </Text>
            <Text style={[styles.tableCell, styles.smallCell]}>
              {sub.isCancelled ? "Cancelled" : "Active"}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
