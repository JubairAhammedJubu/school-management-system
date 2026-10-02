"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealDirection = "up" | "left" | "right";

type HomeRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  amount?: number;
};

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 18 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
};

export default function HomeReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  amount = 0.2,
}: HomeRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion ? false : { opacity: 0, ...offsets[direction] }
      }
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.6, delay, ease: "easeOut" }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
