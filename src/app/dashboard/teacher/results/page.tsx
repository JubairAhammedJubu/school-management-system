"use client";

import { useState } from "react";
import EnterResultButton from "@/components/shared/EnterResultButton";
import SubmitResultModal from "@/components/shared/SubmitResultModal";
import ResultList, {
  type Result,
} from "@/components/shared/ResultList";
import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  Sparkles,
  Users,
  TrendingUp,
  FileCheck2,
  Clock3,
  MoreHorizontal,
  Eye,
  Send,
} from "lucide-react";



const gradeDistribution = [
  { grade: "A+", count: 12 },
  { grade: "A", count: 24 },
  { grade: "B+", count: 18 },
  { grade: "B", count: 9 },
  { grade: "C", count: 4 },
];

export default function TeacherResultsPage() {
  const [isSubmitResultModalOpen, setIsSubmitResultModalOpen] =
    useState(false);
    const [resultsRefreshKey, setResultsRefreshKey] = useState(0);
    const [results, setResults] = useState<Result[]>([]);
  return (
    <div className="space-y-6 pb-8">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-7"
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

          <EnterResultButton
  onClick={() => setIsSubmitResultModalOpen(true)}
/>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* STAT CARDS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Students Graded"
          value={String(results.length)}
          detail="This term"
          delay={0}
        />

        <SummaryCard
          icon={TrendingUp}
          label="Average Score"
          value={
    results.length > 0
      ? `${(
          results.reduce(
            (sum, result) => sum + (result.score / result.total) * 100,
            0
          ) / results.length
        ).toFixed(1)}%`
      : "0.0%"
  }
          detail="+4.2% from last exam"
          delay={0.05}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />

        <SummaryCard
          icon={FileCheck2}
          label="Published"
          value={String(
    results.filter((result) => result.status === "PUBLISHED").length
  )}
          detail="Results available"
          delay={0.1}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />

        <SummaryCard
          icon={Clock3}
          label="Draft Results"
          value={String(
    results.filter((result) => result.status === "DRAFT").length
  )}
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
       <ResultList
  refreshKey={resultsRefreshKey}
  onResultsChange={setResults}
/>

        {/* Grade Distribution */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/60 sm:p-6"
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
        className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/60 sm:p-6"
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
    <SubmitResultModal
  isOpen={isSubmitResultModalOpen}
  onClose={() => setIsSubmitResultModalOpen(false)}
  onSuccess={() => {
    setResultsRefreshKey((current) => current + 1);
  }}
/>
    </div>
  );
}
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
      className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/50 sm:p-5"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
        {detail}
      </p>
    </motion.div>
  );
}