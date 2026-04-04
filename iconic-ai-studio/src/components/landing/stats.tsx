"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 6000, suffix: "+", label: "Images Generated" },
  { value: 300, suffix: "+", label: "Brands" },
  { value: 4, suffix: "K", label: "Max Resolution" },
  { value: 18, suffix: "s", label: "Avg Generation Time" },
];

function AnimatedCounter({
  value,
  suffix,
  label,
}: StatItem) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, motionValue, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col items-center p-6 rounded-2xl",
        "bg-white/5 backdrop-blur-sm border border-white/10"
      )}
    >
      <div className="text-4xl sm:text-5xl font-bold text-gold font-heading">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </div>
      <p className="mt-2 text-sm text-white/60">{label}</p>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <AnimatedCounter key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
