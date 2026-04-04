import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import PricingSection from "@/components/landing/pricing-section";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-surface to-dark">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <PricingSection />
      <Footer />
    </div>
  );
}
