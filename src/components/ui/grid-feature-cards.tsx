import React from "react";
import { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export interface FeatureItem {
  title: string;
  icon: LucideIcon;
  description: string;
}

export function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  return (
    <div className="group relative p-6 md:p-8 hover:bg-[#83db28]/10 dark:hover:bg-[#83db28]/10 transition-all duration-300 flex flex-col justify-between cursor-pointer rounded-xl backdrop-blur-sm">
      <div>
        <div className="mb-4 inline-flex p-3.5 rounded-2xl bg-[#f2faeb] dark:bg-[#28381e] text-[#121910] dark:text-[#83db28] border border-[#dff5cf] dark:border-[#2d3a29] group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#83db28]/25 transition-all duration-300 shadow-sm">
          <Icon className="w-6 h-6 stroke-[2]" />
        </div>
        <h3 className="text-lg font-bold text-[#121910] dark:text-white mb-2 tracking-tight group-hover:text-[#2c5213] dark:group-hover:text-[#83db28] transition-colors">
          {feature.title}
        </h3>
        <p className="text-xs md:text-sm text-[#5e6d56] dark:text-[#a0b396] leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

export function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
