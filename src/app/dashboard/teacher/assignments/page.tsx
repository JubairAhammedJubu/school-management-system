"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MoreHorizontal,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

const assignments = [
  {
    title: "Algebraic Expressions",
    subject: "Mathematics",
    className: "Grade 8 · Section A",
    due: "Sep 02, 2026",
    submitted: 26,
    total: 32,
    status: "Active",
  },
  {
    title: "The Solar System",
    subject: "Science",
    className: "Grade 7 · Section B",
    due: "Sep 04, 2026",
    submitted: 18,
    total: 28,
    status: "Active",
  },
  {
    title: "Essay: My Future Career",
    subject: "English",
    className: "Grade 9 · Section A",
    due: "Aug 30, 2026",
    submitted: 31,
    total: 31,
    status: "Completed",
  },
  {
    title: "World War II Timeline",
    subject: "History",
    className: "Grade 10 · Section A",
    due: "Sep 08, 2026",
    submitted: 7,
    total: 24,
    status: "Active",
  },
];

export default function TeacherAssignmentsPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/90 p-6 shadow-xs transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-7"
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                  <Sparkles className="h-3 w-3" />
                  Teacher Workspace
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Assignments
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Create, grade, and review student assignments.
              </p>
            </div>
          </div>

          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto">
            <Plus className="h-4 w-4" />
            New Assignment
          </button>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Total Assignments"
          value="24"
          detail="This semester"
          delay={0}
        />

        <StatCard
          icon={Clock3}
          label="Active"
          value="08"
          detail="Currently running"
          delay={0.05}
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value="16"
          detail="Fully graded"
          delay={0.1}
        />

        <StatCard
          icon={Users}
          label="Submissions"
          value="182"
          detail="Awaiting review"
          delay={0.15}
        />
      </div>

      {/* ===================================================== */}
      {/* ASSIGNMENTS */}
      {/* ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Section header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Assignments
            </h2>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Track your latest assignments and student submissions.
            </p>
          </div>

          <button className="inline-flex items-center gap-1.5 self-start text-[11px] font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400">
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Assignment list */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {assignments.map((assignment, index) => {
            const percentage = Math.round(
              (assignment.submitted / assignment.total) * 100
            );

            return (
              <motion.div
                key={assignment.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.2 + index * 0.06,
                }}
                className="group px-5 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30 sm:px-6"
              >
                <div className="flex items-start gap-3.5">
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <FileText className="h-[18px] w-[18px]" />
                  </div>

                  {/* Main */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {assignment.title}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <span>{assignment.subject}</span>
                          <span className="text-slate-300 dark:text-slate-700">
                            •
                          </span>
                          <span>{assignment.className}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                            assignment.status === "Completed"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                          }`}
                        >
                          {assignment.status}
                        </span>

                        <button
                          aria-label={`More options for ${assignment.title}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-100 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom row */}
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>Due {assignment.due}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <span className="whitespace-nowrap text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {assignment.submitted}/{assignment.total} submitted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-4 text-[10px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {value}
        </p>
      </div>

      <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500">
        {detail}
      </p>
    </motion.div>
  );
}