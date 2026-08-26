"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Pencil,
  Home,
  Users,
  Award,
  Bus,
  Ruler,
  School,
  Clock,
} from "lucide-react";

export default function NotFound() {
  // Container stagger and spring entrance animation variants for card loading
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.88, y: 35 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 240,
        damping: 22,
        staggerChildren: 0.09,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 22, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Floating school elements overlay configurations (positioned over card edges)
  const floatingSchoolItems = [
    {
      icon: GraduationCap,
      color: "text-blue-500 dark:text-blue-400 bg-white/90 dark:bg-slate-900/90 border-blue-200 dark:border-blue-700/80 shadow-blue-500/15",
      size: "w-10 h-10 sm:w-13 sm:h-13 p-2 sm:p-2.5",
      position: "-top-6 -left-3 sm:-top-7 sm:-left-6",
      animate: { y: [0, -10, 0], rotate: [-8, 8, -8] },
      duration: 5,
    },
    {
      icon: BookOpen,
      color: "text-emerald-500 dark:text-emerald-400 bg-white/90 dark:bg-slate-900/90 border-emerald-200 dark:border-emerald-700/80 shadow-emerald-500/15",
      size: "w-11 h-11 sm:w-14 sm:h-14 p-2.5 sm:p-3",
      position: "-top-6 -right-3 sm:-top-7 sm:-right-6",
      animate: { y: [0, -12, 0], rotate: [10, -10, 10] },
      duration: 6,
    },
    {
      icon: Pencil,
      color: "text-amber-500 dark:text-amber-400 bg-white/90 dark:bg-slate-900/90 border-amber-200 dark:border-amber-700/80 shadow-amber-500/15",
      size: "w-10 h-10 sm:w-12 sm:h-12 p-2 sm:p-2.5",
      position: "-bottom-5 -left-3 sm:-bottom-6 sm:-left-5",
      animate: { y: [0, -8, 0], rotate: [-12, 12, -12] },
      duration: 4.5,
    },
    {
      icon: Award,
      color: "text-purple-500 dark:text-purple-400 bg-white/90 dark:bg-slate-900/90 border-purple-200 dark:border-purple-700/80 shadow-purple-500/15",
      size: "w-10 h-10 sm:w-13 sm:h-13 p-2 sm:p-2.5",
      position: "-bottom-6 -right-3 sm:-bottom-7 sm:-right-5",
      animate: { y: [0, -10, 0], rotate: [10, -10, 10] },
      duration: 5.5,
    },
    {
      icon: Bus,
      color: "text-indigo-500 dark:text-indigo-400 bg-white/90 dark:bg-slate-900/90 border-indigo-200 dark:border-indigo-700/80 shadow-indigo-500/15",
      size: "w-9 h-9 sm:w-11 sm:h-11 p-2",
      position: "top-1/3 -left-4 sm:top-1/3 sm:-left-7",
      animate: { y: [0, -8, 0], x: [0, 6, 0] },
      duration: 7,
    },
    {
      icon: Ruler,
      color: "text-rose-500 dark:text-rose-400 bg-white/90 dark:bg-slate-900/90 border-rose-200 dark:border-rose-700/80 shadow-rose-500/15",
      size: "w-9 h-9 sm:w-11 sm:h-11 p-2",
      position: "bottom-1/3 -right-4 sm:bottom-1/3 sm:-right-7",
      animate: { y: [0, -10, 0], rotate: [-14, 14, -14] },
      duration: 6.5,
    },
  ];

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 pt-20 pb-12 sm:px-6 sm:pt-24 sm:pb-16 lg:px-8 lg:pt-28 lg:pb-20 transition-colors duration-500 selection:bg-blue-500 selection:text-white">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Ambient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/15 dark:bg-blue-600/15 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-400/15 dark:bg-indigo-600/15 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl"
        />
      </div>

      {/* Central Card Wrapper with Floating Overlays */}
      <div className="relative w-full max-w-xl mx-auto mt-4 sm:mt-6 mb-4">
        {/* Floating School Items (Layered OVER the Card Container at z-30) */}
        {floatingSchoolItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0, y: 15 }}
              animate={{
                opacity: [0.85, 1, 0.85],
                scale: 1,
                ...item.animate,
              }}
              transition={{
                scale: { type: "spring", stiffness: 300, damping: 20, delay: 0.25 + index * 0.08 },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                y: { duration: item.duration, repeat: Infinity, ease: "easeInOut" },
                x: item.animate.x
                  ? { duration: item.duration, repeat: Infinity, ease: "easeInOut" }
                  : undefined,
                rotate: item.animate.rotate
                  ? { duration: item.duration, repeat: Infinity, ease: "easeInOut" }
                  : undefined,
              }}
              className={`absolute flex items-center justify-center rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-125 z-30 pointer-events-auto cursor-pointer ${item.color} ${item.position} ${item.size}`}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          );
        })}

        {/* Central Card Container */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -3 }}
          className="relative z-20 w-full rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 sm:p-7 lg:p-8 shadow-xl shadow-slate-200/60 dark:shadow-black/50 text-center transition-shadow hover:shadow-blue-500/10 dark:hover:shadow-blue-500/15"
        >
        {/* Top Status Pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wide uppercase mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <School className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Status 404 • Classroom Not Found</span>
        </motion.div>

        {/* School Blackboard / Digital Smartboard 404 Display */}
        <motion.div
          variants={itemVariants}
          className="relative my-2 py-2 flex items-center justify-center gap-2 sm:gap-4 select-none"
        >
          {/* First "4" Digit */}
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-slate-900 dark:text-white drop-shadow-sm"
          >
            4
          </motion.span>

          {/* Animated Central "0" represented as a School Clock / Smart Ring */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-dashed border-blue-500/40 dark:border-blue-400/40 flex items-center justify-center p-1.5"
            >
              <div className="w-full h-full rounded-full border-2 border-indigo-500/30 dark:border-indigo-400/30 flex items-center justify-center" />
            </motion.div>

            {/* Inner Clock / Globe Icon */}
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
            >
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </motion.div>
          </div>

          {/* Second "4" Digit */}
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-slate-900 dark:text-white drop-shadow-sm"
          >
            4
          </motion.span>
        </motion.div>

        {/* Heading Copywriter */}
        <motion.h1
          variants={itemVariants}
          className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
        >
          Oops! This Page Skipped Class Today
        </motion.h1>

        {/* Description Paragraph */}
        <motion.p
          variants={itemVariants}
          className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed"
        >
          The page or lesson you are looking for has snuck out for recess or moved to another classroom. Don&apos;t worry, let&apos;s guide you back to the main campus!
        </motion.p>

        {/* Primary & Secondary Action Hub */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5"
        >
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/25 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 group"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to School Home</span>
          </Link>

          <Link
            href="/students"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Students Directory</span>
          </Link>
        </motion.div>

        {/* Footer Hint */}
        <motion.div variants={itemVariants} className="mt-4 text-[11px] text-slate-400 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>EduNexus System • Error Code HTTP_404_NOT_FOUND</span>
        </motion.div>
      </motion.div>
    </div>
  </main>
);
}
