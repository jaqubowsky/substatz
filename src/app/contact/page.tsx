import { LandingFooter } from "@/features/landing-page/components/landing-footer";
import { LandingHeader } from "@/features/landing-page/components/landing-header";
import { Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - SubStatz",
  description: "Contact SubStatz team - Get in touch with our support team",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />

      <main className="flex-1 container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 p-3 rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-3">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>

        <div className="mx-auto max-w-2xl bg-card p-8 rounded-lg shadow-sm border">
          <div className="space-y-8">
            <section>
              <div className="mb-6 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Email Us
                </h2>
                <p className="text-muted-foreground mb-4">
                  The fastest way to get in touch with our support team is via
                  email.
                </p>
                <div className="mt-3">
                  <a
                    href="mailto:support@substatz.com"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    support@substatz.com
                  </a>
                </div>
              </div>
            </section>

            <hr className="my-8 border-border" />

            <section>
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground mb-4">
                  You might find the answer to your question in our FAQ section.
                </p>
                <div className="mt-3">
                  <Link
                    href="/#faq"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-primary bg-transparent text-primary hover:bg-primary/5 transition-colors"
                  >
                    View FAQ Section
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
