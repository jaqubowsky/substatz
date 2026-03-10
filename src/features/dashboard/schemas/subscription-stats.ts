export interface SubscriptionStats {
  totalSpent: number;
  activeFor: {
    days: number;
    months: number;
    years: number;
    formatted: string;
  };
  renewalCount: number;
  averageCostPerMonth: number;
  nextPaymentDate: Date;
}
