import { Button } from "@/components/ui/button";
import Link from "next/link";

export const PricingSection = () => {
  const features = [
    "Unlimited subscription tracking",
    "Spending insights & analytics",
    "Categorize subscriptions",
    "Secure data storage",
    "Mobile-friendly interface",
    "Lifetime updates",
  ];

  return (
    <div id="pricing" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-accent-foreground">
            No subscriptions for a subscription tracker! Pay once and use
            SubStatz forever.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-lg rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Lifetime Access
            </h3>
            <p className="mt-6 text-base leading-7 text-accent-foreground">
              Get full access to SubStatz with a one-time payment. No recurring
              fees, no hidden costs.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-primary">
                What&apos;s included
              </h4>
              <div className="h-px flex-auto bg-gray-100"></div>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-accent-foreground sm:grid-cols-2 sm:gap-6">
              {features.map((feature, index) => (
                <li key={index} className="flex gap-x-3">
                  <svg
                    className="h-6 w-5 flex-none text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="h-full rounded-2xl bg-white py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-accent-foreground">
                  Pay once, use forever
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    $5
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-accent-foreground">
                    USD
                  </span>
                </p>
                <div className="mt-2">
                  <p className="text-xs text-gray-500 line-through">$10</p>
                  <p className="text-sm text-primary font-medium">
                    50% off - Limited time offer
                  </p>
                </div>
                <Button className="mt-10 w-full" size="lg" asChild>
                  <Link href="/register">Get Access Now</Link>
                </Button>
                <p className="mt-6 text-xs leading-5 text-accent-foreground">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
