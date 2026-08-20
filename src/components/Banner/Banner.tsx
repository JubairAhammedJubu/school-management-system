"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  TrendingUp,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

const Banner = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">

      {/* Background Ambient Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 dark:bg-blue-600/25 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 dark:bg-indigo-600/25 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto w-full container overflow-hidden px-5 pt-28 sm:pt-32 pb-20 lg:pb-24">
        <div className="grid w-full items-center gap-12 lg:gap-14 lg:grid-cols-2">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              Smart School Management System
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-slate-950 dark:text-white">
              One school.
              <br />
              One platform.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Smarter management.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">EduNexus</span> replaces paper registers, scattered spreadsheets and disconnected notices with a single role-based system — for admins, teachers and students alike.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer active:scale-95 text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Started →</span>
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer active:scale-95 text-sm sm:text-base backdrop-blur-md"
              >
                Explore Features
              </Link>
            </div>

            {/* Badges Info */}
            <div className="mt-8 flex flex-wrap gap-4 sm:gap-5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Admin Portal</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Teacher Portal</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Student Portal</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-500" /> AI-Powered</span>
            </div>
          </motion.div>

          {/* Right Illustration with ALL 4 Non-Overlapping Animated Floating Bars */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex items-center justify-center mt-6 lg:mt-0 w-full max-w-full py-4"
          >
            {/* Outer Ambient Glow */}
            <div className="absolute inset-0 rounded-full bg-blue-500/15 dark:bg-blue-600/25 blur-3xl pointer-events-none" />

            {/* Main Container Frame with Extra Height for All 4 Cards on Mobile */}
            <div className="relative mx-auto flex h-[410px] w-[330px] sm:h-[440px] sm:w-[460px] items-center justify-center transition-transform origin-center">

              {/* Outer Decorative Circles */}
              <div className="absolute h-[290px] w-[290px] sm:h-[380px] sm:w-[380px] rounded-full border border-blue-200/60 dark:border-blue-900/50 bg-white/40 dark:bg-slate-900/40 shadow-2xl backdrop-blur-md pointer-events-none" />
              <div className="absolute h-[210px] w-[210px] sm:h-[280px] sm:w-[280px] rounded-full bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-slate-800/50 pointer-events-none" />

              {/* Central Card Building Hub */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative z-20 w-48 sm:w-60 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 sm:p-5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex justify-center">
                  <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
                    <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>

                <div className="mt-2.5 sm:mt-3 text-center">
                  <h3 className="text-base sm:text-xl font-black tracking-tight">
                    <span className="text-slate-900 dark:text-white">Edu</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-300">Nexus</span>
                  </h3>
                  <p className="mt-0.5 text-[8px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    School Management System
                  </p>
                </div>

                <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1 sm:gap-2">
                  <div className="rounded-xl bg-blue-50 dark:bg-blue-950/60 p-1 sm:p-2 text-center border border-blue-100 dark:border-blue-900/40">
                    <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 mx-auto" />
                    <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Admin
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 p-1 sm:p-2 text-center border border-emerald-100 dark:border-emerald-900/40">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Teacher
                    </p>
                  </div>

                  <div className="rounded-xl bg-purple-50 dark:bg-purple-950/60 p-1 sm:p-2 text-center border border-purple-100 dark:border-purple-900/40">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 mx-auto" />
                    <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Student
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 1. FLOATING BAR: Top Left - Performance Analytics */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="absolute top-0 left-0 sm:top-4 sm:-left-6 z-30 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 shadow-xl backdrop-blur-xl cursor-pointer"
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-[8px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400">Performance</p>
                      <span className="text-[7px] sm:text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.2 rounded-full">+98.4%</span>
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white">
                      Analytics Engine
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 2. FLOATING BAR: Top Right - Academic Management */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                whileHover={{ scale: 1.05, y: -9 }}
                className="absolute top-10 right-0 sm:top-4 sm:-right-6 z-30 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 shadow-xl backdrop-blur-xl cursor-pointer"
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400">Academic</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white">
                      Management System
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 3. FLOATING BAR: Bottom Left - Attendance & Timetable */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -9 }}
                className="absolute bottom-10 left-0 sm:bottom-6 sm:-left-6 z-30 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 shadow-xl backdrop-blur-xl cursor-pointer"
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400">Timetable & Attendance</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white">
                      Real-time Automation
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 4. FLOATING BAR: Bottom Right - Powered by AI Insights */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="absolute bottom-0 right-0 sm:bottom-6 sm:-right-6 z-30 rounded-2xl border border-blue-500/30 dark:border-blue-500/40 bg-white/95 dark:bg-slate-900/95 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 shadow-xl backdrop-blur-xl cursor-pointer"
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <p className="text-[8px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400">Powered by</p>
                    </div>
                    <p className="text-[10px] sm:text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      AI At-Risk Prediction
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
