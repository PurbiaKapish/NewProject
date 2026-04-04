import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - IconicAI Studio",
  description: "Terms of Service for IconicAI Studio",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1117] via-[#151922] to-[#0f1117]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-block mb-8 text-sm text-white/40 hover:text-[#22c55e] transition-colors"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-white/40 mb-10">
          Last updated: January 2025
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-white/70">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using IconicAI Studio, you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please
              do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. Service Description
            </h2>
            <p>
              IconicAI Studio provides AI-powered fashion model image generation
              services. Users can upload product images and generate
              professional fashion model photographs using our AI technology.
              The service operates on a credit-based system.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. Credit System
            </h2>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>Credits are required to generate images</li>
              <li>2K resolution generation costs 2 credits per image</li>
              <li>4K resolution generation costs 3 credits per image</li>
              <li>Credits are non-refundable once used</li>
              <li>
                Purchased credits do not expire as long as your account is
                active
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>
                You must provide accurate information when creating an account
              </li>
              <li>
                You are responsible for maintaining the security of your account
              </li>
              <li>
                You must not upload images that infringe on third-party rights
              </li>
              <li>
                You must not use the service for illegal or unauthorized
                purposes
              </li>
              <li>
                You must not attempt to reverse-engineer or exploit the AI
                system
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Intellectual Property
            </h2>
            <p>
              You retain ownership of the product images you upload. Generated
              AI images are licensed to you for commercial and personal use upon
              generation. IconicAI Studio retains rights to the underlying AI
              technology and platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Payment Terms
            </h2>
            <p>
              Payments are processed through Stripe and Razorpay. All prices are
              listed in INR. Refunds may be issued at our discretion for unused
              credit packages within 7 days of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              IconicAI Studio is provided &quot;as is&quot; without warranties
              of any kind. We are not liable for any indirect, incidental, or
              consequential damages arising from your use of the service. Our
              total liability is limited to the amount you paid for the service
              in the preceding 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account if you
              violate these terms. You may delete your account at any time.
              Upon termination, unused credits are forfeited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              9. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify you of
              significant changes via email or through the platform. Continued
              use of the service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              10. Contact
            </h2>
            <p>
              For questions about these Terms of Service, contact us at{" "}
              <a
                href="mailto:support@iconicai.studio"
                className="text-[#22c55e] hover:underline"
              >
                support@iconicai.studio
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
