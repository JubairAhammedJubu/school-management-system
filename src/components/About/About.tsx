"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, HeartHandshake, Layers3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const principles = [
  {
    icon: Layers3,
    title: "One connected system",
    description: "Bring attendance, academics, communication, and operations into one calm workspace.",
    accent: "text-blue-600 dark:text-blue-400",
    surface: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    icon: HeartHandshake,
    title: "Built around people",
    description: "Give every role the right information and the confidence to act on it quickly.",
    accent: "text-indigo-600 dark:text-indigo-400",
    surface: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    icon: Sparkles,
    title: "Ready for what is next",
    description: "Turn everyday school data into clearer decisions with thoughtful automation and insight.",
    accent: "text-cyan-600 dark:text-cyan-400",
    surface: "bg-cyan-50 dark:bg-cyan-500/10",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-white px-4 py-20 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="absolute left-1/2 top-1/3 h-80 w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 blur-[130px] dark:from-blue-600/15 dark:via-indigo-600/15 dark:to-cyan-500/10" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              About EduNexus
            </div>

            <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
              Less scattered work.
              <span className="block text-blue-600 dark:text-blue-500">More connected schools.</span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              EduNexus is a modern school management platform designed to make busy school days feel simpler. We connect the people, processes, and information that help a school move forward.
            </p>

            <Link
              href="/#how-it-works"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-indigo-600 dark:text-blue-400 dark:hover:text-indigo-400"
            >
              See how it works
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.div
            className="relative lg:col-span-7"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          >
            <div className="relative rounded-3xl border border-slate-200/90 bg-slate-50/80 p-5 shadow-2xl shadow-blue-900/5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-blue-950/25 sm:p-7">
              <div className="absolute left-1/2 top-0 h-[3px] w-28 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-blue-600 to-transparent" />

              <div className="mb-6 flex items-center justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800/80">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Our approach</p>
                  <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Designed for the full school day</p>
                </div>
                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 sm:flex">
                  <Layers3 className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3">
                {principles.map((principle, index) => {
                  const Icon = principle.icon;

                  return (
                    <motion.div
                      key={principle.title}
                      className="group flex gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/80 hover:shadow-lg hover:shadow-blue-900/5 dark:border-slate-800/80 dark:bg-slate-950/40 dark:hover:border-blue-700/70"
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.45, delay: 0.2 + index * 0.1 }}
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${principle.surface} ${principle.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{principle.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{principle.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
