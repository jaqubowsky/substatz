"use client";

import { FAQItem } from "./faq-item";

export const FAQSection = () => {
  const faqs = [
    {
      question: "Is SubStatz really a one-time payment?",
      answer:
        "Yes! We believe a subscription tracker shouldn't be another subscription. Pay once and get lifetime access to all features and future updates.",
    },
    {
      question: "Can I track both monthly and annual subscriptions?",
      answer:
        "Absolutely! SubStatz supports all billing cycles including monthly, quarterly, annual, and even custom periods.",
    },
    {
      question: "Is my subscription data secure?",
      answer:
        "Yes, we take security seriously. Your data is encrypted and stored securely. We never share your information with third parties.",
    },
    {
      question: "Can I use SubStatz on my mobile device?",
      answer:
        "Yes, SubStatz is fully responsive and works great on mobile devices, tablets, and desktops.",
    },
    {
      question: "What happens if I need help or have questions?",
      answer:
        "We offer email support to all users. Simply reach out to our support team, and we'll get back to you as soon as possible.",
    },
  ];

  return (
    <div
      id="faq"
      className="relative bg-gray-50 py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute -top-40 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-orange-100/20 to-amber-100/20 blur-3xl animate-blob animation-delay-700"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-fade-in">
          <h2 className="text-base font-semibold leading-7 text-primary">
            FAQ
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </p>
          <p className="mt-6 text-lg leading-8 text-accent-foreground">
            Can&apos;t find the answer you&apos;re looking for? Reach out to our
            customer support team.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl animate-fade-in animation-delay-300">
          <div className="divide-y divide-gray-200 rounded-xl overflow-hidden shadow-soft">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
