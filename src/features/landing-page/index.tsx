import { JsonLd } from "@/components/json-ld";
import { FAQSection } from "./components";
import { CTASection } from "./components/cta-section";
import { FeaturesSection } from "./components/features-section";
import { HeroSection } from "./components/hero-section";
import { LandingFooter } from "./components/landing-footer";
import { LandingHeader } from "./components/landing-header";
import { PricingSection } from "./components/pricing-section";
import { TestimonialsSection } from "./components/testimonials-section";

export const LandingPage = () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SubStatz",
    url: "https://substatz.me",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://substatz.me/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SubStatz",
    url: "https://substatz.me",
    logo: "https://substatz.me/logo.png",
    sameAs: [
      "https://twitter.com/SubStatz",
      "https://facebook.com/SubStatz",
      "https://linkedin.com/company/SubStatz",
    ],
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />

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
