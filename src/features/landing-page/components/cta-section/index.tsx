import { Button } from "@/components/ui/button";
import { Check, Plus, User } from "lucide-react";
import Link from "next/link";
import { DashboardTabs } from "./dashboard-tabs";

export const CTASection = () => {
  const dashboardTabs = [
    {
      name: "Overview",
      content: (
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Welcome back, Alex
                  </p>
                  <p className="text-xs text-gray-500">
                    Last login: Today, 10:30 AM
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-100"></div>
                <div className="h-8 w-8 rounded-full bg-gray-100"></div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Subscription Summary
                </h3>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                  $78.97 / month
                </span>
              </div>

              <div className="mt-4">
                <div className="rounded-lg bg-orange-50 shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Active Subscriptions
                      </p>
                      <p className="mt-1 text-3xl font-semibold text-primary">
                        8
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">
                  Upcoming Payments
                </h4>
                <div className="mt-2 space-y-3">
                  {[
                    {
                      name: "Netflix",
                      date: "May 15",
                      price: "$15.99",
                      color: "bg-red-500",
                    },
                    {
                      name: "Spotify",
                      date: "May 18",
                      price: "$9.99",
                      color: "bg-green-500",
                    },
                    {
                      name: "Adobe CC",
                      date: "May 22",
                      price: "$52.99",
                      color: "bg-gray-800",
                    },
                  ].map((sub, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-8 w-8 rounded-full ${sub.color} flex items-center justify-center`}
                        >
                          <div className="h-4 w-4 rounded-full bg-white"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {sub.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Due {sub.date}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {sub.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Subscriptions",
      content: (
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Your Subscriptions
              </h3>
              <button className="rounded-full bg-primary p-1 text-white hover:bg-primary/90 transition-colors">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div
              className="mt-4 space-y-3 overflow-y-auto pr-2 custom-scrollbar"
              style={{ maxHeight: "320px" }}
            >
              {[
                {
                  name: "Netflix",
                  category: "Entertainment",
                  price: "$15.99",
                  cycle: "Monthly",
                  nextPayment: "May 15, 2023",
                  logo: "bg-red-500",
                },
                {
                  name: "Spotify",
                  category: "Entertainment",
                  price: "$9.99",
                  cycle: "Monthly",
                  nextPayment: "May 18, 2023",
                  logo: "bg-green-500",
                },
                {
                  name: "Adobe Creative Cloud",
                  category: "Productivity",
                  price: "$52.99",
                  cycle: "Monthly",
                  nextPayment: "May 22, 2023",
                  logo: "bg-gray-800",
                },
                {
                  name: "Microsoft 365",
                  category: "Productivity",
                  price: "$6.99",
                  cycle: "Monthly",
                  nextPayment: "May 27, 2023",
                  logo: "bg-blue-500",
                },
                {
                  name: "Amazon Prime",
                  category: "Shopping",
                  price: "$14.99",
                  cycle: "Monthly",
                  nextPayment: "June 3, 2023",
                  logo: "bg-yellow-500",
                },
                {
                  name: "Disney+",
                  category: "Entertainment",
                  price: "$7.99",
                  cycle: "Monthly",
                  nextPayment: "June 12, 2023",
                  logo: "bg-blue-700",
                },
                {
                  name: "YouTube Premium",
                  category: "Entertainment",
                  price: "$11.99",
                  cycle: "Monthly",
                  nextPayment: "June 15, 2023",
                  logo: "bg-red-600",
                },
                {
                  name: "iCloud+",
                  category: "Storage",
                  price: "$2.99",
                  cycle: "Monthly",
                  nextPayment: "June 22, 2023",
                  logo: "bg-blue-400",
                },
              ].map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${sub.logo}`}
                    >
                      <div className="h-6 w-6 rounded-full bg-white"></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {sub.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {sub.category} • {sub.cycle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {sub.price}
                    </p>
                    <p className="text-xs text-gray-500">
                      Next: {sub.nextPayment.split(",")[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Analytics",
      content: (
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Spending Analytics
              </h3>
              <div className="flex space-x-2">
                <button className="rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-primary">
                  Monthly
                </button>
                <button className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                  Yearly
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  Spending by Category
                </h4>
                <p className="text-sm font-medium text-primary">$123.92/mo</p>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                      <span className="ml-2 text-gray-700">Entertainment</span>
                    </div>
                    <span className="font-medium text-gray-900">$46.96</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: "38%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span className="ml-2 text-gray-700">Productivity</span>
                    </div>
                    <span className="font-medium text-gray-900">$59.98</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{ width: "48%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="ml-2 text-gray-700">Shopping</span>
                    </div>
                    <span className="font-medium text-gray-900">$14.99</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: "12%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="ml-2 text-gray-700">Storage</span>
                    </div>
                    <span className="font-medium text-gray-900">$2.99</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: "2%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">
                  Monthly Spending Trend
                </h4>
                <div className="mt-2 h-32 w-full rounded-lg bg-orange-50 p-4">
                  <div className="flex h-full items-end justify-between">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                      (month, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center space-y-1"
                        >
                          <div
                            className="w-8 rounded-t bg-primary transition-all duration-500 ease-in-out"
                            style={{
                              height: `${[60, 45, 70, 65, 90, 80][i] * 0.7}%`,
                            }}
                          ></div>
                          <span className="text-xs text-gray-500">{month}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Manage Subscriptions
          </h2>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Take control of your subscriptions
          </p>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
            SubscriptEase gives you a beautiful dashboard to manage all your
            subscriptions in one place. Track spending, get reminders, and never
            miss a payment again.
          </p>
        </div>

        <div className="mt-10 sm:mt-16 flow-root">
          <div className="relative rounded-xl bg-gray-900/5 p-4 sm:p-6 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-8">
            <DashboardTabs tabs={dashboardTabs} />
          </div>
        </div>

        <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 md:grid-cols-2 items-start md:items-center">
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Ready to simplify your subscription management?
            </h3>
            <p className="text-base sm:text-lg text-gray-600">
              Get lifetime access to SubscriptEase for just $10. No recurring
              fees, no hidden costs.
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/register">Get Started — Just $10</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="space-y-4 bg-gray-50 p-4 sm:p-6 rounded-xl">
            <h4 className="font-medium text-base sm:text-lg text-gray-900">
              Every purchase includes:
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="ml-3 text-sm sm:text-base text-gray-700">
                  One-time payment
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="ml-3 text-sm sm:text-base text-gray-700">
                  Lifetime updates
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="ml-3 text-sm sm:text-base text-gray-700">
                  30-day money-back guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
