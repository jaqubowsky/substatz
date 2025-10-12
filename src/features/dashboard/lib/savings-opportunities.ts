import { SavingsOpportunity } from "@/features/dashboard/components/subscription-details/savings-opportunity-card";
import { BillingCycle, Currency, Subscription } from "@prisma/client";

import { SubscriptionWithFinancials } from "./subscription-utils";

export type OpportunityType =
  | "annual_discount"
  | "alternative_service"
  | "usage_analysis"
  | "bundle_discount"
  | "family_plan"
  | "student_discount"
  | "seasonal_pause"
  | "loyalty_discount"
  | "duplicate_services"
  | "free_tier"
  | "price_increase"
  | "unused_service"
  | "promotional_offer"
  | "referral_credit"
  | "corporate_discount"
  | "downgrade_plan"
  | "cancel_unused"
  | "negotiate_price"
  | "prepay_discount"
  | "competitor_offer"
  | "holiday_deals"
  | "credit_card_offer"
  | "tax_deduction"
  | "account_sharing"
  | "free_trial_rotation"
  | "cashback_apps"
  | "vpn_regional_pricing"
  | "group_buy"
  | "lifetime_deal"
  | "freemium_tier"
  | "app_store_switch"
  | "direct_billing"
  | "currency_optimization"
  | "subscription_manager"
  | "seasonal_discount"
  | "educational_content"
  | "community_alternatives"
  | "feature_comparison"
  | "usage_reminder"
  | "auto_renewal_check"
  | "price_tracking"
  | "subscription_audit"
  | "gift_card_discount"
  | "reward_points"
  | "free_month_request"
  | "insurance_reimbursement"
  | "employer_reimbursement"
  | "scholarship_application"
  | "subscription_comparison"
  | "direct_ordering"
  | "renewal_negotiation";

const entertainmentOpportunities: SavingsOpportunity[] = [
  {
    type: "bundle_discount",
    title: "Bundle entertainment services",
    description:
      "Services like Disney+, Hulu, and ESPN+ offer bundle discounts that can save up to 30%. Check if your service has bundle partners.",
    potentialSavings: null,
  },
  {
    type: "seasonal_pause",
    title: "Rotate subscriptions seasonally",
    description:
      "Subscribe to one streaming service at a time based on show release schedules. Watch Netflix for a month, then switch to HBO, etc.",
    potentialSavings: null,
  },
  {
    type: "family_plan",
    title: "Switch to family/group plan",
    description:
      "Share costs with up to 6 people on family plans to reduce your individual cost by 50-80%.",
    potentialSavings: null,
  },
  {
    type: "free_trial_rotation",
    title: "Strategic free trial usage",
    description:
      "Use a calendar to track free trial periods across different services to binge content without paying.",
    potentialSavings: null,
  },
  {
    type: "account_sharing",
    title: "Legitimate account sharing",
    description:
      "Many services allow household sharing. Split costs with roommates or family members within terms of service.",
    potentialSavings: null,
  },
  {
    type: "vpn_regional_pricing",
    title: "Check international pricing",
    description:
      "Some streaming services charge less in different regions. A VPN might help you access better rates.",
    potentialSavings: null,
  },
  {
    type: "gift_card_discount",
    title: "Purchase discounted gift cards",
    description:
      "Buy gift cards for your streaming service at a discount through sites like Raise or during promotional periods.",
    potentialSavings: null,
  },
  {
    type: "app_store_switch",
    title: "Change billing platform",
    description:
      "Some services charge less when billed directly vs. through Apple/Google. Check both pricing options.",
    potentialSavings: null,
  },
  {
    type: "free_month_request",
    title: "Request a free month",
    description:
      "If you experience service issues, contact support and request a free month as compensation.",
    potentialSavings: null,
  },
  {
    type: "seasonal_discount",
    title: "Wait for seasonal promotions",
    description:
      "Entertainment services often offer Black Friday, holiday, or summer specials with significant discounts.",
    potentialSavings: null,
  },
];

const productivityOpportunities: SavingsOpportunity[] = [
  {
    type: "free_tier",
    title: "Evaluate free alternatives",
    description:
      "Consider open-source alternatives like LibreOffice instead of Microsoft Office, or Notion's free tier vs. paid plans.",
    potentialSavings: null,
  },
  {
    type: "corporate_discount",
    title: "Use employer benefits",
    description:
      "Many companies provide free licenses for productivity tools. Check your workplace benefits portal.",
    potentialSavings: null,
  },
  {
    type: "student_discount",
    title: "Academic discounts",
    description:
      "Tools like Microsoft 365, Adobe Creative Cloud, and Notion offer 50-70% off for students and educators.",
    potentialSavings: null,
  },
  {
    type: "tax_deduction",
    title: "Business expense deduction",
    description:
      "If you're self-employed, this productivity tool may qualify as a tax-deductible business expense.",
    potentialSavings: null,
  },
  {
    type: "lifetime_deal",
    title: "Look for lifetime deals",
    description:
      "Sites like AppSumo regularly offer lifetime access to productivity tools for a one-time payment.",
    potentialSavings: null,
  },
  {
    type: "feature_comparison",
    title: "Feature usage audit",
    description:
      "List the features you actually use and check if a cheaper alternative provides just those features.",
    potentialSavings: null,
  },
  {
    type: "community_alternatives",
    title: "Community-maintained alternatives",
    description:
      "Check GitHub for open-source alternatives to popular productivity tools with similar functionality.",
    potentialSavings: null,
  },
  {
    type: "group_buy",
    title: "Organize a group purchase",
    description:
      "Some productivity tools offer volume licensing. Organize friends or colleagues to qualify for bulk discounts.",
    potentialSavings: null,
  },
  {
    type: "direct_billing",
    title: "Switch to direct billing",
    description:
      "Some productivity tools charge less when you pay them directly instead of through app stores.",
    potentialSavings: null,
  },
  {
    type: "freemium_tier",
    title: "Downgrade to freemium",
    description:
      "Evaluate if the free tier meets your needs. Many productivity tools offer robust free versions.",
    potentialSavings: null,
  },
];

const utilitiesOpportunities: SavingsOpportunity[] = [
  {
    type: "bundle_discount",
    title: "Bundle utility services",
    description:
      "Combine internet, phone, security, or cloud storage services from the same provider for bundle discounts of 10-25%.",
    potentialSavings: null,
  },
  {
    type: "negotiate_price",
    title: "Annual price negotiation",
    description:
      "Call your provider yearly and mention competitor offers to negotiate a lower rate. Success rate is over 70%.",
    potentialSavings: null,
  },
  {
    type: "competitor_offer",
    title: "Leverage competitor promotions",
    description:
      "Research competitor new-customer offers and ask your current provider to match them or switch.",
    potentialSavings: null,
  },
  {
    type: "loyalty_discount",
    title: "Request loyalty pricing",
    description:
      "Ask for long-term customer discounts. Many utility providers have unpublicized loyalty rates.",
    potentialSavings: null,
  },
  {
    type: "auto_renewal_check",
    title: "Disable auto-renewal for negotiation",
    description:
      "Turn off auto-renewal and wait for 'win-back' offers that are often better than regular pricing.",
    potentialSavings: null,
  },
  {
    type: "subscription_audit",
    title: "Service level audit",
    description:
      "Review if you're paying for more capacity than you need (internet speed, cloud storage, etc.).",
    potentialSavings: null,
  },
  {
    type: "corporate_discount",
    title: "Check for employer perks",
    description:
      "Many employers offer discounts on phone plans, internet, and other utility services.",
    potentialSavings: null,
  },
  {
    type: "seasonal_discount",
    title: "Time your contract renewal",
    description:
      "Utility companies often offer their best deals during end-of-quarter or holiday periods.",
    potentialSavings: null,
  },
  {
    type: "currency_optimization",
    title: "Check multi-currency options",
    description:
      "Some global utilities offer better rates when paid in different currencies.",
    potentialSavings: null,
  },
  {
    type: "referral_credit",
    title: "Maximize referral bonuses",
    description:
      "Utility services often have generous referral programs. Share your code with friends and family.",
    potentialSavings: null,
  },
];

const healthFitnessOpportunities: SavingsOpportunity[] = [
  {
    type: "seasonal_pause",
    title: "Use seasonal pause options",
    description:
      "Most fitness subscriptions allow 1-3 month pauses annually. Schedule these during vacation or low-usage periods.",
    potentialSavings: null,
  },
  {
    type: "corporate_discount",
    title: "Utilize wellness benefits",
    description:
      "Many employers reimburse fitness expenses up to $300-500/year through wellness programs.",
    potentialSavings: null,
  },
  {
    type: "family_plan",
    title: "Convert to family membership",
    description:
      "Adding family members to your fitness subscription can reduce per-person cost by 30-60%.",
    potentialSavings: null,
  },
  {
    type: "prepay_discount",
    title: "Prepay for maximum savings",
    description:
      "Annual prepayment for fitness services typically saves 20-40% compared to monthly billing.",
    potentialSavings: null,
  },
  {
    type: "insurance_reimbursement",
    title: "Check insurance benefits",
    description:
      "Many health insurance plans offer $100-500 annual reimbursement for fitness programs.",
    potentialSavings: null,
  },
  {
    type: "free_trial_rotation",
    title: "Try before committing",
    description:
      "Most fitness apps offer 7-30 day trials. Test several before committing to find the best fit.",
    potentialSavings: null,
  },
  {
    type: "community_alternatives",
    title: "Explore free communities",
    description:
      "Consider free alternatives like Nike Training Club or YouTube fitness channels with similar workouts.",
    potentialSavings: null,
  },
  {
    type: "seasonal_discount",
    title: "Time your purchase strategically",
    description:
      "January and September typically offer the best fitness subscription deals with up to 50% off.",
    potentialSavings: null,
  },
  {
    type: "referral_credit",
    title: "Leverage referral programs",
    description:
      "Fitness apps often offer 1-3 months free for both referrer and new member.",
    potentialSavings: null,
  },
  {
    type: "feature_comparison",
    title: "Feature needs assessment",
    description:
      "List the features you actually use and check if a cheaper alternative provides just those features.",
    potentialSavings: null,
  },
];

const educationOpportunities: SavingsOpportunity[] = [
  {
    type: "student_discount",
    title: "Verify student discount eligibility",
    description:
      "Educational platforms offer 50-80% discounts with valid student ID. Check if alumni status qualifies too.",
    potentialSavings: null,
  },
  {
    type: "tax_deduction",
    title: "Education tax benefits",
    description:
      "Educational expenses may qualify for tax credits like the Lifetime Learning Credit (up to $2,000).",
    potentialSavings: null,
  },
  {
    type: "free_tier",
    title: "Explore free alternatives",
    description:
      "Check library access to LinkedIn Learning, Coursera, or edX through your local library card.",
    potentialSavings: null,
  },
  {
    type: "promotional_offer",
    title: "Bundle courses strategically",
    description:
      "Platforms like Udemy offer course bundles at 70-90% off regular pricing during frequent sales.",
    potentialSavings: null,
  },
  {
    type: "employer_reimbursement",
    title: "Request employer reimbursement",
    description:
      "Many employers offer $1,000-5,000 annually for professional development. Submit for reimbursement.",
    potentialSavings: null,
  },
  {
    type: "lifetime_deal",
    title: "Look for lifetime access",
    description:
      "Some educational platforms offer one-time payments for lifetime access instead of subscriptions.",
    potentialSavings: null,
  },
  {
    type: "seasonal_discount",
    title: "Wait for educational sales",
    description:
      "Educational platforms offer major discounts during back-to-school season and holidays (60-90% off).",
    potentialSavings: null,
  },
  {
    type: "group_buy",
    title: "Organize group enrollment",
    description:
      "Many platforms offer 20-50% discounts for group enrollments of 5+ people.",
    potentialSavings: null,
  },
  {
    type: "scholarship_application",
    title: "Apply for scholarships",
    description:
      "Platforms like Coursera and edX offer financial aid that covers 50-100% of course costs.",
    potentialSavings: null,
  },
  {
    type: "educational_content",
    title: "Audit courses for free",
    description:
      "Many platforms allow free auditing of courses without certificates. Consider if certification is necessary.",
    potentialSavings: null,
  },
];

const foodDrinkOpportunities: SavingsOpportunity[] = [
  {
    type: "credit_card_offer",
    title: "Optimize payment method",
    description:
      "Cards like Chase Sapphire Reserve and Amex Gold offer $120-240 annual credits for food delivery services.",
    potentialSavings: null,
  },
  {
    type: "promotional_offer",
    title: "Strategic promo code usage",
    description:
      "Use browser extensions like Honey to automatically apply the best available promo codes at checkout.",
    potentialSavings: null,
  },
  {
    type: "referral_credit",
    title: "Maximize referral bonuses",
    description:
      "Food delivery services offer $10-30 per referral. Share your code with friends and family.",
    potentialSavings: null,
  },
  {
    type: "bundle_discount",
    title: "Combine orders with others",
    description:
      "Coordinate with neighbors or coworkers to meet minimum order thresholds and share delivery fees.",
    potentialSavings: null,
  },
  {
    type: "subscription_comparison",
    title: "Compare membership benefits",
    description:
      "Calculate if subscription fees (like DashPass or Uber One) are worth it based on your order frequency.",
    potentialSavings: null,
  },
  {
    type: "direct_ordering",
    title: "Order directly from restaurants",
    description:
      "Many restaurants offer 10-30% discounts when ordering directly instead of through delivery apps.",
    potentialSavings: null,
  },
  {
    type: "cashback_apps",
    title: "Stack cashback rewards",
    description:
      "Use apps like Rakuten or Ibotta for additional 1-10% cashback on food delivery or meal kit services.",
    potentialSavings: null,
  },
  {
    type: "seasonal_discount",
    title: "Look for seasonal promotions",
    description:
      "Food services offer major discounts during holidays and sports events (30-50% off).",
    potentialSavings: null,
  },
  {
    type: "subscription_audit",
    title: "Usage frequency analysis",
    description:
      "Calculate your per-order savings to determine if subscription fees are justified by your usage patterns.",
    potentialSavings: null,
  },
  {
    type: "reward_points",
    title: "Maximize loyalty points",
    description:
      "Concentrate orders on one platform to reach higher reward tiers faster (5-15% back in points).",
    potentialSavings: null,
  },
];

const shoppingOpportunities: SavingsOpportunity[] = [
  {
    type: "credit_card_offer",
    title: "Optimize payment card",
    description:
      "Cards like Amazon Prime Visa offer 5% cashback on Amazon purchases, effectively reducing Prime costs.",
    potentialSavings: null,
  },
  {
    type: "promotional_offer",
    title: "Time membership purchases",
    description:
      "Services like Amazon Prime offer discounted rates during Prime Day or Black Friday (up to 40% off).",
    potentialSavings: null,
  },
  {
    type: "family_plan",
    title: "Share membership benefits",
    description:
      "Amazon Household allows sharing Prime benefits with up to 5 family members at no extra cost.",
    potentialSavings: null,
  },
  {
    type: "student_discount",
    title: "Student membership rates",
    description:
      "Amazon Prime Student and similar programs offer 50% off regular membership prices.",
    potentialSavings: null,
  },
  {
    type: "subscription_audit",
    title: "Benefit utilization check",
    description:
      "Track which membership benefits you actually use to determine if the full cost is justified.",
    potentialSavings: null,
  },
  {
    type: "cashback_apps",
    title: "Layer cashback services",
    description:
      "Use cashback portals like TopCashback before shopping to earn an additional 1-15% back on purchases.",
    potentialSavings: null,
  },
  {
    type: "gift_card_discount",
    title: "Purchase discounted gift cards",
    description:
      "Buy gift cards for your favorite retailers at 2-20% off through sites like Raise or during promotions.",
    potentialSavings: null,
  },
  {
    type: "price_tracking",
    title: "Use price tracking tools",
    description:
      "Tools like CamelCamelCamel or Honey track price history to ensure you buy at the lowest price point.",
    potentialSavings: null,
  },
  {
    type: "reward_points",
    title: "Strategic rewards redemption",
    description:
      "Save reward points for high-value redemptions rather than small purchases for 20-30% better value.",
    potentialSavings: null,
  },
  {
    type: "alternative_service",
    title: "Compare membership benefits",
    description:
      "Evaluate if Walmart+, Target Circle, or other programs offer better value for your shopping habits.",
    potentialSavings: null,
  },
];

const otherOpportunities: SavingsOpportunity[] = [
  {
    type: "subscription_manager",
    title: "Audit all subscriptions",
    description:
      "Use a subscription tracker to identify and eliminate overlapping or forgotten subscriptions.",
    potentialSavings: null,
  },
  {
    type: "usage_reminder",
    title: "Set usage reminders",
    description:
      "Create calendar reminders to use this service regularly to maximize its value.",
    potentialSavings: null,
  },
  {
    type: "price_increase",
    title: "Monitor price changes",
    description:
      "Check if the price has increased since you subscribed. Many services grandfather old rates if you ask.",
    potentialSavings: null,
  },
  {
    type: "currency_optimization",
    title: "Check international pricing",
    description:
      "Some services charge significantly less in different regions or currencies.",
    potentialSavings: null,
  },
  {
    type: "free_month_request",
    title: "Request a loyalty bonus",
    description:
      "Contact customer service and ask for a free month or discount as a loyal customer.",
    potentialSavings: null,
  },
  {
    type: "competitor_offer",
    title: "Leverage competitor offers",
    description:
      "Research competitor pricing and ask your provider to match or beat their rates.",
    potentialSavings: null,
  },
  {
    type: "seasonal_discount",
    title: "Time renewals strategically",
    description:
      "Many services offer their best deals during end-of-quarter or holiday periods.",
    potentialSavings: null,
  },
  {
    type: "group_buy",
    title: "Organize group access",
    description:
      "Find friends or colleagues interested in sharing the subscription cost within terms of service.",
    potentialSavings: null,
  },
  {
    type: "direct_billing",
    title: "Optimize billing method",
    description:
      "Some services charge less when billed directly vs. through third parties or app stores.",
    potentialSavings: null,
  },
  {
    type: "gift_card_discount",
    title: "Use discounted gift cards",
    description:
      "Purchase service gift cards at 5-20% off through discount gift card marketplaces.",
    potentialSavings: null,
  },
];

const monthlyOpportunities: SavingsOpportunity[] = [
  {
    type: "annual_discount",
    title: "Switch to annual billing",
    description:
      "Save up to 20% by switching to annual billing instead of monthly payments.",
    potentialSavings: null,
  },
  {
    type: "prepay_discount",
    title: "Look for multi-month discounts",
    description:
      "Many services offer 10-30% off when prepaying for 3, 6, or 12 months at once.",
    potentialSavings: null,
  },
];

const annualOpportunities: SavingsOpportunity[] = [
  {
    type: "prepay_discount",
    title: "Explore multi-year discounts",
    description:
      "Some services offer additional 10-30% off for 2-3 year commitments compared to annual plans.",
    potentialSavings: null,
  },
  {
    type: "renewal_negotiation",
    title: "Negotiate renewal pricing",
    description:
      "Contact customer service 30 days before renewal to request special retention pricing.",
    potentialSavings: null,
  },
];

const highPriceOpportunities: SavingsOpportunity[] = [
  {
    type: "duplicate_services",
    title: "Check for service overlap",
    description:
      "You might be paying for features available in other subscriptions you already have.",
    potentialSavings: null,
  },
  {
    type: "feature_comparison",
    title: "Downgrade to essentials",
    description:
      "Analyze which premium features you actually use and consider downgrading to a basic plan.",
    potentialSavings: null,
  },
];

export function generateSavingsOpportunities(
  subscription: SubscriptionWithFinancials
): SavingsOpportunity[] {
  const allOpportunities: SavingsOpportunity[] = [];
  const price = subscription.price;
  const category = subscription.category;

  if (subscription.billingCycle === BillingCycle.MONTHLY) {
    const annualOpportunity = {
      type: "annual_discount" as OpportunityType,
      title: "Switch to annual billing",
      description: `Save up to 20% on ${subscription.name} by switching to annual billing`,
      potentialSavings: price * 12 * 0.2,
    };
    allOpportunities.push(annualOpportunity);
    allOpportunities.push(...monthlyOpportunities);
  } else if (subscription.billingCycle === BillingCycle.ANNUALLY) {
    allOpportunities.push(...annualOpportunities);
  }

  if (price > 20) {
    allOpportunities.push(...highPriceOpportunities);
  }

  switch (category) {
    case "Entertainment":
      allOpportunities.push(...entertainmentOpportunities);
      break;
    case "Productivity":
      allOpportunities.push(...productivityOpportunities);
      break;
    case "Utilities":
      allOpportunities.push(...utilitiesOpportunities);
      break;
    case "Health & Fitness":
      allOpportunities.push(...healthFitnessOpportunities);
      break;
    case "Education":
      allOpportunities.push(...educationOpportunities);
      break;
    case "Food & Drink":
      allOpportunities.push(...foodDrinkOpportunities);
      break;
    case "Shopping":
      allOpportunities.push(...shoppingOpportunities);
      break;
    default:
      allOpportunities.push(...otherOpportunities);
      break;
  }

  const customizedOpportunities = allOpportunities.map((opportunity) => {
    const description = opportunity.description.replace(
      /this service/g,
      subscription.name
    );

    return {
      ...opportunity,
      description,
    };
  });

  return customizedOpportunities
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .map((opportunity) => ({
      ...opportunity,
      potentialSavings:
        opportunity.type === "annual_discount" ? price * 12 * 0.2 : null,
    }));
}
