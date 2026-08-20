"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserCheck, GraduationCap } from "lucide-react";

interface RoleDetail {
  id: string;
  title: string;
  summary: string;
  scopeSubtitle: string;
  icon: React.ReactNode;
  features: string[];
}

const roleDetails: RoleDetail[] = [
  {
    id: "01",
    title: "Admin",
    summary: "Runs the school end to end — students, staff, fees, and analytics.",
    scopeSubtitle: "Complete operational, financial, and administrative control over the entire institution.",
    icon: <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    features: [
      "Manage all students & staff",
      "System analytics & reports",
      "Fee structure & payments",
      "Role & permission management",
      "Institution branding setup",
      "AI at-risk predictions",
      "Global campus notices",
    ],
  },
  {
    id: "02",
    title: "Teacher",
    summary: "Attendance, exams, results, and assignments for assigned classes.",
    scopeSubtitle: "Academic control for assigned classes and subjects only.",
    icon: <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    features: [
      "Assigned classes",
      "Record attendance",
      "Enter results",
      "Create assignments",
      "Review submissions",
      "Publish notices",
      "View performance",
    ],
  },
  {
    id: "03",
    title: "Student",
    summary: "Their own results, attendance, fees, and notices — nothing more.",
    scopeSubtitle: "Personalized dashboard for individual academic tracking and class updates.",
    icon: <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    features: [
      "Personal attendance log",
      "View exam results & GPA",
      "Download assignments",
      "Submit homework online",
      "Track fee dues & receipts",
      "Class timetables & schedule",
      "Campus notice board",
    ],
  },
];

const AUTO_ROTATE_INTERVAL_MS = 4000;

const RoleBasedAccess: React.FC = () => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-switch role every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSelectedRoleIndex((prev) => (prev + 1) % roleDetails.length);
    }, AUTO_ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeRole = roleDetails[selectedRoleIndex];

  const handleSelectRole = (idx: number) => {
    setSelectedRoleIndex(idx);
  };

  return (
    <section className="relative w-full py-20 sm:py-28 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-0">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span>ROLE-BASED ACCESS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight font-sans"
          >
            Three roles.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              One source of truth.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl"
          >
            Each person sees exactly what their role needs — nothing borrowed from a generic
            admin template.
          </motion.p>
        </div>

        {/* Interactive Main Box Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Role Tabs List */}
            <div className="lg:col-span-5 space-y-3">
              {roleDetails.map((role, idx) => {
                const isSelected = selectedRoleIndex === idx;
                return (
                  <motion.div
                    key={role.id}
                    onClick={() => handleSelectRole(idx)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative rounded-2xl p-5 transition-all duration-300 cursor-pointer overflow-hidden ${
                      isSelected
                        ? "bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 shadow-md"
                        : "bg-transparent border border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">
                          {role.id}
                        </span>
                        <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                          {role.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                          {role.summary}
                        </p>
                      </div>
                    </div>

                    {/* Active Left Indicator Bar */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeRoleBar"
                        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Auto-Rotation Progress Bar */}
                    {isSelected && !isPaused && (
                      <motion.div
                        key={`progress-${selectedRoleIndex}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: AUTO_ROTATE_INTERVAL_MS / 1000, ease: "linear" }}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 origin-left"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Active Role Feature Details */}
            <div className="lg:col-span-7 lg:pl-6 lg:border-l border-slate-200 dark:border-slate-800/80 pt-4 lg:pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {/* Role Title & Scope */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40">
                      {activeRole.icon}
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                      {activeRole.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    {activeRole.scopeSubtitle}
                  </p>

                  {/* Feature Pills Grid */}
                  <div className="flex flex-wrap gap-3">
                    {activeRole.features.map((feature, fIdx) => (
                      <motion.div
                        key={fIdx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: fIdx * 0.05 }}
                        className="group flex items-center gap-2.5 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/70 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500/40 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-default"
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 group-hover:scale-125 transition-transform" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default RoleBasedAccess;
