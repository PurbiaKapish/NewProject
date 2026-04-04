"use client";

import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getRemainingCredits } from "@/lib/credits";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import type { PricingPlan } from "@/types";
import { cn } from "@/lib/utils";

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 10,
    price: 499,
    currency: "INR",
    features: ["10 AI generations", "2K resolution", "Standard backgrounds", "Email support"],
  },
  {
    id: "basic",
    name: "Basic",
    credits: 50,
    price: 1999,
    currency: "INR",
    features: ["50 AI generations", "2K resolution", "All backgrounds", "Priority support"],
  },
  {
    id: "pro",
    name: "Pro",
    credits: 150,
    price: 4999,
    currency: "INR",
    features: [
      "150 AI generations",
      "4K resolution",
      "All backgrounds",
      "Model consistency",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    credits: 500,
    price: 14999,
    currency: "INR",
    features: [
      "500 AI generations",
      "4K resolution",
      "Custom backgrounds",
      "Model consistency",
      "API access",
      "Dedicated support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 2000,
    price: 49999,
    currency: "INR",
    features: [
      "2000 AI generations",
      "4K resolution",
      "Custom backgrounds",
      "Model consistency",
      "API access",
      "White-label option",
      "Dedicated account manager",
    ],
  },
  {
    id: "unlimited",
    name: "Unlimited",
    credits: 9999,
    price: 99999,
    currency: "INR",
    features: [
      "Unlimited generations",
      "4K resolution",
      "Everything in Enterprise",
      "Custom AI training",
      "SLA guarantee",
    ],
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) return null;

  const remaining = getRemainingCredits(user.total_credits, user.used_credits);

  const handlePurchase = () => {
    toast({
      title: "Payment Integration",
      description:
        "Payment integration requires Razorpay/Stripe configuration",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Pricing</h1>
        <p className="mt-1 text-sm text-white/40">
          You currently have{" "}
          <span className="font-semibold text-[#22c55e]">{remaining}</span>{" "}
          credits remaining
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative overflow-visible rounded-2xl border border-white/[0.06] bg-[#151922] p-5 transition-all hover:border-white/10",
              plan.highlighted && "border-[#22c55e]/30 glow-green-sm"
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                <span className="inline-block whitespace-nowrap rounded-full bg-[#22c55e] px-4 py-1 text-[10px] font-semibold text-white shadow-lg">
                  Recommended
                </span>
              </div>
            )}
            <h3 className={cn("text-sm font-medium text-white/60", plan.highlighted && "mt-1")}>{plan.name}</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold text-white">
                ₹{plan.price.toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/20">{plan.credits} credits</p>

            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-xs text-white/40"
                >
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#22c55e]" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={handlePurchase}
              className={cn(
                "mt-5 w-full text-xs",
                !plan.highlighted && "bg-white/5 text-white/60 hover:bg-white/10 shadow-none"
              )}
              variant={plan.highlighted ? "default" : "secondary"}
            >
              Purchase
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
