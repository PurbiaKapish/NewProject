"use client";

import { motion, type Variants } from "framer-motion";
import { Upload, Settings, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Upload",
    description: "Upload front and back clothing image",
  },
  {
    number: 2,
    icon: Settings,
    title: "Customize",
    description: "Choose category, background, resolution, model type",
  },
  {
    number: 3,
    icon: Download,
    title: "Generate",
    description: "Generate and download your AI fashion model",
  },
];

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" as const },
  }),
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="text-gold">Works</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Three simple steps to transform your clothing into professional
            model imagery.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20" />

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {steps.map(({ number, icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                {/* Numbered circle */}
                <div
                  className={cn(
                    "relative w-32 h-32 rounded-full flex items-center justify-center mb-6",
                    "bg-white/5 backdrop-blur-sm border border-white/10"
                  )}
                >
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold text-black text-sm font-bold flex items-center justify-center">
                    {number}
                  </div>
                  <Icon className="w-10 h-10 text-gold" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-white/60 max-w-[250px]">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
