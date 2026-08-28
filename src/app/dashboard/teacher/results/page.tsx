"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  Sparkles,
  Users,
  TrendingUp,
  FileCheck2,
  Clock3,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Send,
} from "lucide-react";

const results = [
  {
    student: "Aarav Sharma",
    initials: "AS",
    className: "Grade 8 A",
    exam: "Mid-Term Examination",
    score: 92,
    total: 100,
    grade: "A",
    status: "Published",
  },
  {
    student: "Emma Wilson",
    initials: "EW",
    className: "Grade 8 A",
    exam: "Mid-Term Examination",
    score: 87,
    total: 100,
    grade: "A",
    status: "Published",
  },
  {
    student: "Noah Williams",
    initials: "NW",
    className: "Grade 8 B",
    exam: "Mid-Term Examination",
    score: 78,
    total: 100,
    grade: "B+",
    status: "Published",
  },
  {
    student: "Olivia Brown",
    initials: "OB",
    className: "Grade 9 A",
    exam: "Unit Test 03",
    score: 95,
    total: 100,
    grade: "A+",
    status: "Published",
  },
  {
    student: "Liam Davis",
    initials: "LD",
    className: "Grade 9 A",
    exam: "Unit Test 03",
    score: 71,
    total: 100,
    grade: "B",
    status: "Draft",
  },
  {
    student: "Sophia Miller",
    initials: "SM",
    className: "Grade 10 A",
    exam: "Unit Test 03",
    score: 89,
    total: 100,
    grade: "A",
    status: "Draft",
  },
];

const gradeDistribution = [
  { grade: "A+", count: 12 },
  { grade: "A", count: 24 },
  { grade: "B+", count: 18 },
  { grade: "B", count: 9 },
  { grade: "C", count: 4 },
];

export default function TeacherResultsPage() {
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
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-blue-600 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-blue-400">
              <Award className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                  <Sparkles className="h-3 w-3" />
                  Teacher Workspace
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Results
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Record and publish student examination results and grades.
              </p>
            </div>
          </div>

          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700">
            <Pencil className="h-3.5 w-3.5" />
            Enter Results
          </button>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* STAT CARDS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Students Graded"
          value="67"
          detail="This term"
          delay={0}
        />

        <SummaryCard
          icon={TrendingUp}
          label="Average Score"
          value="86.4%"
          detail="+4.2% from last exam"
          delay={0.05}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />

        <SummaryCard
          icon={FileCheck2}
          label="Published"
          value="58"
          detail="Results available"
          delay={0.1}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />

        <SummaryCard
          icon={Clock3}
          label="Draft Results"
          value="09"
          detail="Need your review"
          delay={0.15}
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
        />
      </div>

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Recent Results */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Results
              </h2>

              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Latest student examination records
              </p>
            </div>

            <button className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              All Classes
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Student
                  </th>

                  <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Examination
                  </th>

                  <th className="px-4 py-3 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Score
                  </th>

                  <th className="px-4 py-3 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Grade
                  </th>

                  <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>

              <tbody>
                {results.map((result, index) => (
                  <ResultRow
                    key={`${result.student}-${result.exam}`}
                    result={result}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 sm:hidden">
            {results.map((result, index) => (
              <MobileResultCard
                key={`${result.student}-${result.exam}`}
                result={result}
                index={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Grade Distribution */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Grade Distribution
            </h2>

            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Current term performance
            </p>
          </div>

          <div className="mt-7 space-y-5">
            {gradeDistribution.map((item, index) => {
              const percentage = Math.round((item.count / 67) * 100);

              return (
                <motion.div
                  key={item.grade}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.35 + index * 0.06,
                  }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-extrabold ${
                          item.grade === "A+"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                            : item.grade === "A"
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                              : item.grade === "B+"
                                ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
                                : item.grade === "B"
                                  ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {item.grade}
                      </span>

                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {item.count} students
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400">
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.4 + index * 0.06,
                      }}
                      className="h-full rounded-full bg-blue-500"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom summary */}
          <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-500/10 dark:bg-blue-500/[0.06]">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />

              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">
                Strong performance
              </span>
            </div>

            <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
              80.6% of your students achieved a B+ or higher this term.
            </p>
          </div>
        </motion.section>
      </div>

      {/* ===================================================== */}
      {/* DRAFT RESULTS */}
      {/* ===================================================== */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 dark:border-amber-500/10 dark:bg-amber-500/[0.05] sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                9 results are waiting for review
              </h3>

              <p className="mt-1 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                Review your draft grades before publishing them to students.
              </p>
            </div>
          </div>

          <button className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-[10px] font-bold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            <Send className="h-3.5 w-3.5" />
            Review Drafts
          </button>
        </div>
      </motion.section>
    </div>
  );
}

/* ========================================================= */
/* RESULT ROW */
/* ========================================================= */

function ResultRow({
  result,
  index,
}: {
  result: (typeof results)[number];
  index: number;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.22 + index * 0.04 }}
      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/30"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[9px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {result.initials}
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {result.student}
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              {result.className}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
          {result.exam}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
          {result.score}
        </span>

        <span className="text-[9px] text-slate-400">
          /{result.total}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <GradeBadge grade={result.grade} />
      </td>

      <td className="px-4 py-4 text-right">
        <StatusBadge status={result.status} />
      </td>

      <td className="px-4 py-4">
        <button
          aria-label={`More options for ${result.student}`}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </motion.tr>
  );
}

/* ========================================================= */
/* MOBILE RESULT CARD */
/* ========================================================= */

function MobileResultCard({
  result,
  index,
}: {
  result: (typeof results)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.04 }}
      className="p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[9px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {result.initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {result.student}
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              {result.className}
            </p>
          </div>
        </div>

        <StatusBadge status={result.status} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <p className="text-[8px] uppercase tracking-wider text-slate-400">
            Exam
          </p>

          <p className="mt-1 truncate text-[9px] font-semibold text-slate-600 dark:text-slate-300">
            {result.exam}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <p className="text-[8px] uppercase tracking-wider text-slate-400">
            Score
          </p>

          <p className="mt-1 text-[10px] font-bold text-slate-700 dark:text-slate-200">
            {result.score}/{result.total}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <p className="text-[8px] uppercase tracking-wider text-slate-400">
            Grade
          </p>

          <div className="mt-1">
            <GradeBadge grade={result.grade} />
          </div>
        </div>
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[9px] font-bold text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <Eye className="h-3 w-3" />
        View Result
      </button>
    </motion.div>
  );
}

/* ========================================================= */
/* GRADE BADGE */
/* ========================================================= */

function GradeBadge({ grade }: { grade: string }) {
  const styles =
    grade === "A+"
      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
      : grade === "A"
        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
        : grade === "B+"
          ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-[9px] font-extrabold ${styles}`}
    >
      {grade}
    </span>
  );
}

/* ========================================================= */
/* STATUS BADGE */
/* ========================================================= */

function StatusBadge({ status }: { status: string }) {
  const published = status === "Published";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-bold ${
        published
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {status}
    </span>
  );
}

/* ========================================================= */
/* SUMMARY CARD */
/* ========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
  iconClass = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-50 dark:bg-blue-500/10",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
  iconClass?: string;
  iconBg?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-4 text-[10px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500">
        {detail}
      </p>
    </motion.div>
  );
}