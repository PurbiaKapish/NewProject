"use client";

import { motion, type Variants } from "framer-motion";
import {
  Sparkles,
  Users,
  Fingerprint,
  Image,
  Zap,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Sparkles,
    title: "4K High Quality Output",
    description:
      "Generate ultra-high-resolution images up to 4K for professional use.",
  },
  {
    icon: Users,
    title: "Women / Men / Kids",
    description:
      "Full category support for all demographics and fashion segments.",
  },
  {
    icon: Fingerprint,
    title: "Model Consistency Mode",
    description:
      "Maintain the same AI model face across multiple generations.",
  },
  {
    icon: Image,
    title: "Background Consistency Mode",
    description:
      "Keep consistent backgrounds across your entire product catalog.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Generation",
    description:
      "Get results in seconds, not hours. Average generation time under 18s.",
  },
  {
    icon: Download,
    title: "Bulk Download ZIP",
    description:
      "Download all generated images at once in a convenient ZIP file.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Powerful <span className="text-gold">Features</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Everything you need to create stunning AI fashion model imagery at
            scale.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className={cn(
                "p-6 rounded-2xl",
                "bg-white/5 backdrop-blur-sm border border-white/10",
                "hover:border-gold/30 transition-colors"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-white/60">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
