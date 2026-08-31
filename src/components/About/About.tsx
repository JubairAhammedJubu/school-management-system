"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const roles = [
  {
    icon: ShieldCheck,
    title: "Admins",
    description: "Manage the school structure, records, fees, notices, and reports from one place.",
    color: "text-blue-600 dark:text-blue-400",
    surface: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    icon: BookOpenCheck,
    title: "Teachers",
    description: "Handle attendance, assignments, marks, and student progress with less manual work.",
    color: "text-indigo-600 dark:text-indigo-400",
    surface: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Stay connected to classes, results, attendance, assignments, and important updates.",
    color: "text-cyan-600 dark:text-cyan-400",
    surface: "bg-cyan-50 dark:bg-cyan-500/10",
  },
];

const capabilities = [
  "Student and teacher management",
  "Attendance, examinations, and results",
  "Fees, notices, assignments, and reports",
  "Performance analytics and early insights",
];

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 blur-[130px] dark:from-blue-600/15 dark:via-indigo-600/15 dark:to-cyan-500/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            About EduNexus
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            One connected platform for the
            <span className="block text-blue-600 dark:text-blue-500">whole school community.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            EduNexus is a school management system built to replace scattered records and disconnected workflows with one clear digital ecosystem for administrators, teachers, and students.
          </p>
        </motion.div>

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <motion.div
            className="relative h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:bg-slate-900/90 p-7 shadow-2xl shadow-blue-900/5 backdrop-blur-xl dark:border-slate-800 dark:shadow-black/40 sm:p-10 lg:col-span-5"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <UsersRound className="h-6 w-6" />
            </div>

            <h2 className="mt-7 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built around real school work
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              From daily attendance to long-term academic planning, EduNexus keeps essential information organized, accessible, and ready for the people who need it.
            </p>

            <div className="mt-8 space-y-3">
              {capabilities.map((capability) => (
                <div key={capability} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  {capability}
                </div>
              ))}
            </div>

            <Link
              href="/#how-it-works"
              className="group mt-9 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-indigo-600 dark:text-blue-400 dark:hover:text-indigo-400"
            >
              Explore how it works
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            className="flex h-full flex-col lg:col-span-7"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="grid flex-1 gap-4 sm:grid-cols-3 lg:gap-5">
              {roles.map((role, index) => {
                const Icon = role.icon;

                return (
                  <motion.div
                    key={role.title}
                    className="rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/80 hover:shadow-blue-900/10 dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-black/20 dark:hover:border-blue-700/70"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.45, delay: 0.3 + index * 0.1 }}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${role.surface} ${role.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{role.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{role.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-blue-200/80 bg-blue-50/70 p-5 dark:border-blue-500/20 dark:bg-blue-500/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <BarChart3 className="h-5 w-5" />
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 sm:text-sm">
                <strong className="font-bold text-blue-700 dark:text-blue-300">Better visibility, earlier support.</strong> EduNexus turns attendance, results, and assignments into useful signals for more informed educational decisions.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
