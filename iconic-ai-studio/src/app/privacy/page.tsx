import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - IconicAI Studio",
  description: "Privacy Policy for IconicAI Studio",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1117] via-[#151922] to-[#0f1117]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-block mb-8 text-sm text-white/40 hover:text-[#22c55e] transition-colors"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-white/40 mb-10">
          Last updated: January 2025
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-white/70">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you use IconicAI Studio, we may collect the following
              information:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-white/60">
              <li>
                Account information (name, email address) when you sign up
              </li>
              <li>
                Product images you upload for AI fashion model generation
              </li>
              <li>Usage data including generation history and credit usage</li>
              <li>
                Payment information processed through our payment partners
                (Stripe, Razorpay)
              </li>
              <li>
                Technical data such as browser type, device information, and IP
                address
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>To provide and improve our AI image generation services</li>
              <li>To process your transactions and manage your account</li>
              <li>
                To communicate with you about your account, updates, and
                promotions
              </li>
              <li>To ensure the security and integrity of our platform</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. Data Storage & Security
            </h2>
            <p>
              Your data is stored securely using industry-standard encryption.
              We use Supabase for data storage and implement appropriate
              technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure,
              or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. Image Data
            </h2>
            <p>
              Product images you upload are processed solely for the purpose of
              generating AI fashion model images. We do not sell, share, or use
              your uploaded images for any purpose other than providing our
              service to you. Generated images are stored in your account for
              your access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Third-Party Services
            </h2>
            <p>We may share information with the following third parties:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-white/60">
              <li>
                Payment processors (Stripe, Razorpay) for handling transactions
              </li>
              <li>Cloud infrastructure providers for hosting and storage</li>
              <li>Analytics services to improve our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-white/60">
              <li>Access, update, or delete your personal data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
              <li>Request deletion of your account and associated data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Cookies
            </h2>
            <p>
              We use essential cookies to maintain your session and preferences.
              We do not use third-party tracking cookies without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at{" "}
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
