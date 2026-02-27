"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const previewCards = [
  "Saree",
  "Kurti",
  "Blazer",
  "Shirt",
  "Lehenga",
  "Dress",
  "Jacket",
  "Suit",
  "Ethnic Wear",
  "Western",
  "Kids",
  "Accessories",
];

const cardColors = [
  "from-rose-900/40 to-pink-900/40",
  "from-amber-900/40 to-orange-900/40",
  "from-slate-800/40 to-gray-900/40",
  "from-sky-900/40 to-blue-900/40",
  "from-fuchsia-900/40 to-purple-900/40",
  "from-emerald-900/40 to-teal-900/40",
  "from-stone-800/40 to-zinc-900/40",
  "from-indigo-900/40 to-violet-900/40",
  "from-red-900/40 to-rose-900/40",
  "from-cyan-900/40 to-sky-900/40",
  "from-yellow-900/40 to-amber-900/40",
  "from-lime-900/40 to-green-900/40",
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-24 pb-16 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Transform Fashion & Modeling{" "}
            <span className="text-gold">Visions Into Reality</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Generate editorial-quality fashion model images from your clothing
            photos — without studio costs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Start Generating Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
        </motion.div>

        {/* Preview cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {previewCards.map((label, i) => (
            <motion.div
              key={label}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer",
                "bg-gradient-to-br border border-white/10",
                "backdrop-blur-sm",
                cardColors[i]
              )}
            >
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-sm font-medium text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  {label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
