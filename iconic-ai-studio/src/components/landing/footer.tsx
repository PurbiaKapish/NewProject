import Link from "next/link";
import { cn } from "@/lib/utils";

const quickLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Login", href: "/login" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer
      className={cn(
        "border-t border-white/10 py-14 px-4",
        "bg-dark-surface"
      )}
    >
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-heading text-xl font-bold text-gold"
          >
            IconicAI Studio
          </Link>
          <p className="mt-3 text-sm text-white/50">
            AI-powered fashion model image generation for modern brands.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-white/60 hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
            Legal
          </h4>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/60 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
            Contact
          </h4>
          <p className="text-sm text-white/60">support@iconicai.studio</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-white/40">
          © 2024 IconicAI Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
