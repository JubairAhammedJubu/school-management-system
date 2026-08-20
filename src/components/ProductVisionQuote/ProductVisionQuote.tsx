"use client";
import { Quote, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductVisionQuote() {
  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans">

      {/* Pulsing Background Subtle Glow */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-600/10 dark:from-blue-600/15 dark:via-indigo-600/15 dark:to-blue-500/15 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-8 md:px-5 xl:px-15 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
          className="relative rounded-3xl p-8 sm:p-12 md:p-16 text-center border bg-white/90 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800/80 shadow-2xl shadow-blue-900/5 dark:shadow-blue-950/30 backdrop-blur-xl transition-all duration-500"
        >

          {/* Top Accent Line with scale expansion */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[3px] bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full origin-center"
          />

          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.25,
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20 mb-8 sm:mb-10"
          >
            <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
            Product Vision
          </motion.div>

          {/* Quote Mark Decorative with subtle float */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [180, 183, 180],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-8 left-8 sm:top-10 sm:left-10 text-slate-200 dark:text-slate-800/60 pointer-events-none"
          >
            <Quote className="w-12 h-12 sm:w-16 sm:h-16" />
          </motion.div>

          {/* Main Quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="relative z-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed sm:leading-snug max-w-3xl mx-auto text-slate-800 dark:text-slate-100 font-normal"
          >
            "The goal isn't another dashboard to check — it's one place where attendance, grades, and fees already agree with each other."
          </motion.blockquote>

          {/* Subtitle Line & Team Identifier */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative z-10 mt-8 sm:mt-10 flex items-center justify-center gap-3"
          >
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="h-[1px] bg-slate-300 dark:bg-slate-700/80 block"
            />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-slate-500 dark:text-slate-400 uppercase">
              BYTECODE_BREAKERS
            </span>
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="h-[1px] bg-slate-300 dark:bg-slate-700/80 block"
            />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}