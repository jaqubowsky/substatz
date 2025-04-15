import { JsonLd } from "@/components/json-ld";
import { env } from "@/lib/env";
import { FAQSection } from "./components";
import { CTASection } from "./components/cta-section";
import { FeaturesSection } from "./components/features-section";
import { HeroSection } from "./components/hero-section";
import { LandingFooter } from "./components/landing-footer";
import { LandingHeader } from "./components/landing-header";
import { PricingSection } from "./components/pricing-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { Currency } from "@prisma/client";
export const LandingPage = () => {
  const baseUrl = env.BASE_URL || "https://substatz.me";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SubStatz",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SubStatz",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://twitter.com/SubStatz",
      "https://facebook.com/SubStatz",
      "https://linkedin.com/company/SubStatz",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-555-123-4567",
        contactType: "customer service",
        availableLanguage: ["English"],
      },
    ],
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SubStatz",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: Currency.USD,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is SubStatz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SubStatz is a comprehensive subscription management platform that helps you track, manage, and optimize all your subscriptions in one place.",
        },
      },
      {
        "@type": "Question",
        name: "How does SubStatz help me save money?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SubStatz identifies unused or overlapping subscriptions, suggests alternatives, and helps you track renewal dates to avoid unwanted charges.",
        },
      },
      {
        "@type": "Question",
        name: "Is SubStatz free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, SubStatz offers a free plan with basic subscription tracking features. Premium plans with advanced features are also available.",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </>
  );
};
