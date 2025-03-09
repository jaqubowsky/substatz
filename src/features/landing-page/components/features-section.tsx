import {
  BarChart,
  Bell,
  ClipboardList,
  Plus,
  Settings,
  Shield,
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      title: "Track All Subscriptions",
      description:
        "Keep all your subscriptions in one place with detailed information about pricing, billing cycles, and renewal dates.",
      icon: <ClipboardList className="h-6 w-6 text-primary" />,
    },
    {
      title: "Never Miss a Payment",
      description:
        "Get timely reminders about upcoming renewals so you never miss a payment or get charged for services you no longer use.",
      icon: <Bell className="h-6 w-6 text-primary" />,
    },
    {
      title: "Spending Insights",
      description:
        "Get a clear picture of your subscription spending with detailed analytics and reports on your monthly and yearly expenses.",
      icon: <BarChart className="h-6 w-6 text-primary" />,
    },
    {
      title: "Easy Management",
      description:
        "Add, update, or cancel subscriptions with just a few clicks. Keep your subscription list up-to-date effortlessly.",
      icon: <Plus className="h-6 w-6 text-primary" />,
    },
    {
      title: "Customizable Notifications",
      description:
        "Choose how and when you want to be notified about upcoming renewals with flexible notification settings.",
      icon: <Settings className="h-6 w-6 text-primary" />,
    },
    {
      title: "Secure & Private",
      description:
        "Your subscription data is encrypted and stored securely. We never share your information with third parties.",
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your subscriptions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            SubscriptEase provides all the tools you need to keep track of your
            subscriptions, manage your spending, and never miss a payment again.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                    {feature.icon}
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
