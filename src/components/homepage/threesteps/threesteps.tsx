"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Clock3,
  GraduationCap,
  SlidersHorizontal,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Features",
    description:
      "Uncover the Breadth and Depth of EduNexus ' Powerful Tools and Capabilities",
    active: true,
  },
  {
    number: "02",
    title: "Navigate Dashboard",
    description:
      "Effortlessly Maneuver through the Intuitive Interface for Seamless Operations",
    active: false,
  },
  {
    number: "03",
    title: "Optimize Workflow",
    description:
      "Maximize Efficiency and Effectiveness with Streamlined Processes and Automation",
    active: false,
  },
];

export default function ThreeSteps() {
  return (
    <section id="how-it-works" className="w-full scroll-mt-20 bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 px-4 sm:px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.045em] text-slate-900 dark:text-white sm:text-[36px] lg:text-[39px]">
            Simplify School Management in 3 Steps
          </h2>

          <p className="mt-3 max-w-[680px] text-[10px] leading-[1.6] text-slate-600 dark:text-slate-400 sm:text-[11px]">
            Streamline Operations, Enhance Engagement, and Empower Educators,
            Discover Seamless Efficiency and Innovation in Education Management.
          </p>
        </motion.div>

        {/* Content */}
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_1.08fr] lg:gap-12">
          {/* Left illustration */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="relative h-[325px] w-full overflow-hidden rounded-[15px] bg-gradient-to-br from-indigo-100/70 via-purple-50/40 to-slate-100 dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-950 border border-slate-200/60 dark:border-slate-800"
          >
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-40 dark:opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Decorative glow */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

            {/* Main white card */}
            <div className="absolute left-[16%] top-[11%] w-[76%] rounded-[12px] bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 p-5 shadow-lg dark:shadow-black/50 text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">
                  My assignment
                </h3>

                <SlidersHorizontal className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="mt-4 flex items-center gap-8 border-b border-slate-200 dark:border-slate-800 pb-3 text-[9px] font-semibold text-slate-600 dark:text-slate-400">
                <span className="text-indigo-600 dark:text-indigo-400">☷</span>
                <span>TASK</span>
              </div>

              {/* Fake rows */}
              <div className="mt-5 space-y-3">
                <div className="h-2 w-[58%] rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-2 w-[75%] rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-2 w-[45%] rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>

            {/* Statistics floating card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="absolute bottom-[17px] left-[8%] w-[73%] rounded-[9px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 shadow-xl dark:shadow-black/60"
            >
              <div className="grid grid-cols-2">
                {/* Pending */}
                <div className="flex items-center gap-3 border-b border-r border-slate-200 dark:border-slate-800 pb-3 pr-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
                    <BookOpen className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-[16px] font-bold leading-none text-slate-900 dark:text-white">
                      04
                    </p>
                    <p className="mt-1 text-[7px] font-medium text-slate-500 dark:text-slate-400">
                      Pending courses
                    </p>
                  </div>
                </div>

                {/* Complete */}
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 pl-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-[16px] font-bold leading-none text-slate-900 dark:text-white">
                      08
                    </p>
                    <p className="mt-1 text-[7px] font-medium text-slate-500 dark:text-slate-400">
                      Complete Courses
                    </p>
                  </div>
                </div>

                {/* Watch time */}
                <div className="flex items-center gap-3 border-r border-slate-200 dark:border-slate-800 pt-3 pr-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Clock3 className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-[16px] font-bold leading-none text-slate-900 dark:text-white">
                      2.5h
                    </p>
                    <p className="mt-1 text-[7px] font-medium text-slate-500 dark:text-slate-400">
                      Watch time
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right steps list */}
          <div className="space-y-4 sm:space-y-5">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-5 rounded-2xl border transition-all duration-300 ${step.active
                    ? "bg-slate-50 dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-md shadow-indigo-500/5"
                    : "bg-white dark:bg-slate-950 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${step.active
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                  >
                    {step.number}
                  </span>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}