"use client";

import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getRemainingCredits } from "@/lib/credits";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-white">
          Pricing
        </h1>
        <p className="mt-1 text-white/60">
          You currently have{" "}
          <span className="font-semibold text-[#D4AF37]">{remaining}</span>{" "}
          credits remaining
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative border-white/10 bg-white/5 backdrop-blur-xl transition-colors hover:border-[#D4AF37]/30",
              plan.highlighted && "border-[#D4AF37]/50 shadow-lg shadow-[#D4AF37]/5"
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Recommended</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold text-white">
                  ₹{plan.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-white/40">{plan.credits} credits</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePurchase}
                className="w-full"
                variant={plan.highlighted ? "default" : "secondary"}
              >
                Purchase
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
