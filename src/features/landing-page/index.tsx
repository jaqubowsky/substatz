import { CTASection } from "./components/cta-section/index";
import { FAQSection } from "./components/faq-section/index";
import { FeaturesSection } from "./components/features-section";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { HeroSection } from "./components/hero-section";
import { PricingSection } from "./components/pricing-section";
import { TestimonialsSection } from "./components/testimonials-section";

export const LandingPage = () => {
  return (
    <div className="relative">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
