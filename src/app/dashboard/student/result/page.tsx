"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Sparkles } from "lucide-react";

interface ResultRecord {
  subject: string;
  exam: string;
  marks: string;
  grade: string;
}

const results: ResultRecord[] = [
  { subject: "Mathematics", exam: "Mid-Term", marks: "88/100", grade: "A" },
  { subject: "Biology", exam: "Mid-Term", marks: "79/100", grade: "B+" },
  { subject: "History", exam: "Mid-Term", marks: "91/100", grade: "A+" },
  { subject: "Physics", exam: "Mid-Term", marks: "74/100", grade: "B" },
  { subject: "English", exam: "Mid-Term", marks: "85/100", grade: "A-" },
  { subject: "Computer Science", exam: "Mid-Term", marks: "95/100", grade: "A+" },
];

const gradeStyles: Record<string, string> = {
  "A+": "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60",
  A: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60",
  "A-": "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/60",
  "B+": "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/60",
  B: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60",
};

export default function StudentResultsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 p-6 sm:p-8 text-slate-900 dark:text-white shadow-xs transition-colors duration-300"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-2xs shrink-0">
            <Award className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <Sparkles className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                Student Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              Results
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Your exam results across all subjects.
            </p>
          </div>
        </div>
      </motion.div>

      {/* GPA Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-colors duration-300 flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Overall GPA
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            3.7 <span className="text-base font-semibold text-slate-400 dark:text-slate-500">/ 4.0</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Class Rank
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            #4
          </p>
        </div>
      </motion.div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors duration-300 overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Mid-Term Report Card</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Subject
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Exam
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Marks
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr
                  key={`${row.subject}-${idx}`}
                  className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                >
                  <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {row.subject}
                  </td>
                  <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {row.exam}
                  </td>
                  <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {row.marks}
                  </td>
                  <td className="px-5 sm:px-6 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${gradeStyles[row.grade] ?? "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}
                    >
                      {row.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}