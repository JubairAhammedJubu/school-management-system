"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  UserPlus,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Step {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
  highlights: string[];
  roleTarget: "Admin" | "Teacher" | "Student" | "All";
}

const steps: Step[] = [
  {
    number: "01",
    title: "Quick Institution Setup",
    subtitle: "Define your school structure in minutes",
    description:
      "Register your institution, configure academic calendars, grade levels, classes, and assign granular security roles for administrators.",
    tag: "5-Min Onboarding",
    icon: <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    highlights: ["Custom Grade & Section Setup", "Granular Admin Permissions", "Instant Branding & Logo"],
    roleTarget: "Admin",
  },
  {
    number: "02",
    title: "Bulk Onboard Users",
    subtitle: "Import teachers & students effortlessly",
    description:
      "Seamlessly import thousands of student profiles, parents, and faculty members via CSV or direct integration with zero data loss.",
    tag: "One-Click Import",
    icon: <UserPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    highlights: ["CSV & Excel Bulk Upload", "Auto Credential Generation", "Parent-Student Linking"],
    roleTarget: "Admin",
  },
  {
    number: "03",
    title: "Automate Daily Operations",
    subtitle: "Streamline classes, attendance & notices",
    description:
      "Teachers record real-time attendance, auto-generate timetables, publish exam results, and broadcast instant notices to all portals.",
    tag: "100% Automated",
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    highlights: ["1-Tap Digital Attendance", "Smart Timetable Generator", "Instant Notice Alerts"],
    roleTarget: "Teacher",
  },
  {
    number: "04",
    title: "AI Risk Prediction & Insights",
    subtitle: "Data-driven decisions for student success",
    description:
      "Our built-in AI engine analyzes attendance trends, grade fluctuations, and engagement to flag at-risk students before exams.",
    tag: "AI Powered Engine",
    icon: <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
    highlights: ["Early At-Risk Flagging", "Automated Performance Reports", "Fee & Attendance Analytics"],
    roleTarget: "All",
  },
];

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section className="relative w-full py-20 sm:py-28 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans">

      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-0">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span>SIMPLE 4-STEP WORKFLOW</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight"
          >
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">EduNexus</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Replace chaotic paperwork and fragmented spreadsheets with a seamless,
            intelligent end-to-end digital ecosystem in 4 simple steps.
          </motion.p>
        </div>

        {/* Step Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                onClick={() => setActiveStep(idx)}
                whileHover={{ y: -6 }}
                className={`group relative flex flex-col justify-between rounded-3xl border p-6 sm:p-7 transition-all duration-300 cursor-pointer backdrop-blur-xl overflow-hidden ${isSelected
                  ? "border-blue-500/80 dark:border-blue-500/80 bg-white/95 dark:bg-slate-900/95 shadow-2xl shadow-blue-500/15 ring-2 ring-blue-500/30"
                  : "border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 shadow-lg hover:shadow-xl hover:border-blue-300/60 dark:hover:border-blue-700/60"
                  }`}
              >
                {/* Top Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 shadow-xs group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>

                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-blue-500/50 transition-colors duration-300 tracking-tight">
                      {step.number}
                    </span>
                  </div>

                  {/* Badge */}
                  <span className="inline-block mb-3 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 px-2.5 py-1 rounded-full">
                    {step.tag}
                  </span>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    {step.subtitle}
                  </p>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <ul className="space-y-2">
                    {step.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Animated Bottom Gradient Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[3.5px] rounded-b-3xl overflow-hidden pointer-events-none">
                  <div
                    className={`h-full w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 transition-all duration-500 ease-out origin-left ${isSelected ? "scale-x-100 opacity-100" : "scale-x-0 group-hover:scale-x-100 opacity-90"
                      }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Preview Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 sm:mt-16 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">
                <span>Selected Step Focus: Step {steps[activeStep].number}</span>
                <span>•</span>
                <span className="text-amber-400">{steps[activeStep].tag}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {steps[activeStep].title}
              </h3>

              <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
                {steps[activeStep].description}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> Admin Secured
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-md">
                  <Users className="w-4 h-4 text-emerald-400" /> Teacher & Student Ready
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white border border-white/10 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Instant Sync
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-slate-950 hover:bg-blue-50 transition-all shadow-lg cursor-pointer active:scale-95"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;
