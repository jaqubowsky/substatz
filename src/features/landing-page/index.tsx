import { CTASection } from "./components/cta-section/index";
import { FAQSection } from "./components/faq-section/index";
import { FeaturesSection } from "./components/features-section";
import { HeroSection } from "./components/hero-section";
import { PricingSection } from "./components/pricing-section";
import { TestimonialsSection } from "./components/testimonials-section";

export const LandingPage = () => {
  return (
    <div className="relative">
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
};
