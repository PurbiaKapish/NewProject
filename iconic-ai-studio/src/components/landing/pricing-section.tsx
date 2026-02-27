"use client";

import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  credits: string;
  popular?: boolean;
  features: string[];
}

const individualPlans: Plan[] = [
  {
    name: "Starter",
    price: "₹999",
    credits: "40 credits",
    features: [
      "4K resolution",
      "All categories",
      "Model consistency",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "₹4,999",
    credits: "225 credits",
    popular: true,
    features: [
      "4K resolution",
      "All categories",
      "Model consistency",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    price: "₹9,999",
    credits: "500 credits",
    features: [
      "4K resolution",
      "All categories",
      "Model consistency",
      "Priority support",
    ],
  },
];

const corporatePlans: Plan[] = [
  {
    name: "Starter",
    price: "₹49,999",
    credits: "2900 credits",
    features: [
      "4K resolution",
      "All categories",
      "Model consistency",
      "Priority support",
    ],
  },
  {
    name: "Growth",
    price: "₹74,999",
    credits: "4600 credits",
    popular: true,
    features: [
      "4K resolution",
      "All categories",
      "Model consistency",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "₹99,999",
    credits: "6500 credits",
    features: [
      "4K resolution",
      "All categories",
      "Model consistency",
      "Priority support",
    ],
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      whileHover={{ y: -4 }}
      className={cn(
        "relative p-6 rounded-2xl flex flex-col",
        "bg-white/5 backdrop-blur-sm border",
        plan.popular ? "border-gold/50" : "border-white/10"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full">
          Popular
        </div>
      )}

      <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
      <div className="mb-1">
        <span className="text-3xl font-bold font-heading text-gold">
          {plan.price}
        </span>
      </div>
      <p className="text-sm text-white/60 mb-6">{plan.credits}</p>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-white/80">
            <Check className="w-4 h-4 text-gold flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        className="w-full"
        variant={plan.popular ? "default" : "outline"}
      >
        Get Started
      </Button>
    </motion.div>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Simple <span className="text-gold">Pricing</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </motion.div>

        {/* Individual plans */}
        <div className="mb-12">
          <h3 className="text-center text-lg font-semibold text-white/80 mb-6">
            Individual
          </h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {individualPlans.map((plan, i) => (
              <PlanCard key={plan.name + plan.price} plan={plan} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Corporate plans */}
        <div>
          <h3 className="text-center text-lg font-semibold text-white/80 mb-6">
            Corporate
          </h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {corporatePlans.map((plan, i) => (
              <PlanCard key={plan.name + plan.price} plan={plan} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
