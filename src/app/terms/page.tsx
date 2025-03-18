import { LandingFooter } from "@/features/landing-page/components/landing-footer";
import { LandingHeader } from "@/features/landing-page/components/landing-header";
import { FileText } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - SubStatz",
  description:
    "Terms of Service for SubStatz - Track and manage all your subscriptions in one place",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />

      <main className="flex-1 container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 p-3 rounded-full bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-3">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: March 17, 2025</p>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6 sm:p-8 md:p-10">
          <article className="prose prose-sm sm:prose lg:prose-lg mx-auto dark:prose-invert">
            <div className="space-y-8">
              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="definitions"
                >
                  1. Definitions
                </h2>
                <ul className="mt-4 space-y-3">
                  <li className="flex gap-3">
                    <span className="text-primary font-medium">Service</span>
                    <span>–</span>
                    <span>The SubStatz platform.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-medium">User</span>
                    <span>–</span>
                    <span>Any individual or business accessing SubStatz.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-medium">Paid Plan</span>
                    <span>–</span>
                    <span>
                      A subscription with additional features requiring a
                      one-time payment.
                    </span>
                  </li>
                </ul>
              </section>

              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="account-registration"
                >
                  2. Account Registration
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    To use SubStatz, you must create an account and provide your
                    email, first name, and last name. You are responsible for
                    maintaining the security of your account.
                  </p>
                  <p>
                    You must provide accurate and complete information when
                    creating your account. You are responsible for all
                    activities that occur under your account.
                  </p>
                </div>
              </section>

              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="payment-refund"
                >
                  3. Payment & Refund Policy
                </h2>
                <div className="mt-4 space-y-3">
                  <p>SubStatz offers both free and paid plans:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Free Plan:</span> Provides
                      basic functionality at no cost.
                    </li>
                    <li>
                      <span className="font-medium">Paid Plan:</span> Offers
                      advanced features for a one-time payment.
                    </li>
                  </ul>
                  <p>
                    You may request a refund within 30 days of purchase if you
                    are not satisfied with the service. Refund requests should
                    be sent to our support email.
                  </p>
                </div>
              </section>

              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="user-content"
                >
                  4. User Content
                </h2>
                <p className="mt-4">
                  SubStatz does not allow users to upload content to the
                  platform.
                </p>
              </section>

              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="prohibited-activities"
                >
                  5. Prohibited Activities
                </h2>
                <div className="mt-4 space-y-3">
                  <p>Users may not:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Use SubStatz for illegal activities.</li>
                    <li>Attempt to hack, disrupt, or misuse the platform.</li>
                    <li>
                      Sell, resell, or lease access to the service without
                      explicit permission.
                    </li>
                    <li>
                      Use the service to transmit any viruses, malware, or other
                      harmful code.
                    </li>
                    <li>
                      Attempt to gain unauthorized access to any part of the
                      service or its related systems.
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="data-privacy"
                >
                  6. Data Privacy & GDPR Compliance
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    We collect email, first name, and last name for account
                    creation.
                  </p>
                  <p>
                    Your data is processed in accordance with applicable data
                    protection laws, including the General Data Protection
                    Regulation (GDPR) where applicable.
                  </p>
                  <p>
                    You may request data deletion by contacting us. Your data is
                    stored securely and not shared with third parties except as
                    necessary to provide the service.
                  </p>
                  <p>
                    For more information about how we collect, use, and protect
                    your personal information, please see our
                    <a
                      href="/privacy"
                      className="text-primary hover:text-primary/80 font-medium px-1"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </section>

              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="liability"
                >
                  7. Limitation of Liability
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    SubStatz is provided &quot;as is&quot; without warranties of
                    any kind, either express or implied.
                  </p>
                  <p>
                    To the maximum extent permitted by applicable law, we are
                    not liable for any indirect, incidental, special,
                    consequential, or punitive damages, or any loss of profits
                    or revenues, whether incurred directly or indirectly, or any
                    loss of data, use, goodwill, or other intangible losses
                    resulting from:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Your use or inability to use the service</li>
                    <li>
                      Any unauthorized access to or use of our servers and/or
                      any personal information stored therein
                    </li>
                    <li>
                      Any interruption or cessation of transmission to or from
                      the service
                    </li>
                    <li>
                      Any bugs, viruses, trojan horses, or the like that may be
                      transmitted to or through the service
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="changes"
                >
                  8. Changes to Terms
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    We may update these Terms at any time. Continued use of the
                    service after changes constitutes acceptance of the new
                    Terms.
                  </p>
                  <p>
                    We will make reasonable efforts to notify you of significant
                    changes to these Terms, such as by posting a notice on our
                    website or sending an email.
                  </p>
                </div>
              </section>

              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="termination"
                >
                  9. Account Termination
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    We may terminate or suspend your account at any time for any
                    reason without notice or liability.
                  </p>
                  <p>You may discontinue using the service at any time.</p>
                </div>
              </section>

              <section>
                <h2
                  className="text-xl font-bold text-foreground tracking-tight"
                  id="contact"
                >
                  10. Contact
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    If you have any questions about these Terms of Service,
                    please contact us:
                  </p>
                  <p className="font-medium">
                    By email:{" "}
                    <a
                      href="mailto:support@substatz.com"
                      className="text-primary hover:text-primary/80"
                    >
                      support@substatz.com
                    </a>
                  </p>
                </div>
              </section>
            </div>

            <div className="not-prose mt-10 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center">
                By using SubStatz, you confirm that you have read, understood,
                and agree to these Terms of Service.
              </p>
            </div>
          </article>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
