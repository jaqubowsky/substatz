import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import Link from "next/link";

const SubscriptionCards = () => {
  const subscriptions = [
    {
      name: "Netflix",
      price: "$15.99",
      date: "May 15",
      totalSpent: "$191.88",
      logo: "bg-primary",
      color: "bg-primary",
    },
    {
      name: "Spotify",
      price: "$9.99",
      date: "May 18",
      totalSpent: "$119.88",
      logo: "bg-chart-2",
      color: "bg-chart-2",
    },
    {
      name: "Adobe CC",
      price: "$52.99",
      date: "May 22",
      totalSpent: "$635.88",
      logo: "bg-chart-3",
      color: "bg-chart-3",
    },
  ];

  return (
    <>
      {subscriptions.map((sub, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-soft hover:border-primary/30 transition-all"
        >
          <div className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${sub.color}`}
            >
              <div className="h-6 w-6 rounded-full bg-background"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-card-foreground">
                {sub.name}
              </p>
              <p className="text-xs text-accent-foreground">
                Renews {sub.date}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-card-foreground">
              {sub.price}
            </span>
            <p className="text-xs text-accent-foreground">
              Total: {sub.totalSpent}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 z-0 h-[500px] bg-gradient-to-b from-primary/10 via-chart-2/5 to-transparent"></div>
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/10 to-chart-5/10 blur-3xl animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-chart-5/10 to-primary/10 blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
          <div className="flex-1 space-y-8">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <svg
                  className="mr-1.5 h-2 w-2 fill-primary"
                  viewBox="0 0 6 6"
                  aria-hidden="true"
                >
                  <circle cx="3" cy="3" r="3" />
                </svg>
                New Product
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block">Manage all your</span>
              <span className="block text-primary">subscriptions easily</span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
              Never miss a payment again. SubStatz helps you track all your
              subscriptions in one place, with detailed insights on your
              spending.
            </p>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/register" prefetch={true}>
                  Get Started — Just $5
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-start">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary" />
                <span className="ml-2 text-accent-foreground">
                  Lifetime access for $5
                </span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary" />
                <span className="ml-2 text-accent-foreground">
                  One-time payment
                </span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary" />
                <span className="ml-2 text-accent-foreground">
                  No recurring fees
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-md">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:shadow-medium">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-card to-primary/5"></div>
                <div className="relative p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-card-foreground">
                        Your Subscriptions
                      </h4>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        3 upcoming
                      </span>
                    </div>

                    <SubscriptionCards />

                    <Button variant="outline" className="w-full group" asChild>
                      <Link
                        href="/register"
                        className="flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 mr-2 text-primary transition-transform group-hover:scale-110" />
                        Add Subscription
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
