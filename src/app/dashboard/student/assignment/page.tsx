"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Clock3, CheckCircle2, UploadCloud } from "lucide-react";

interface AssignmentRecord {
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: string;
}

const assignments: AssignmentRecord[] = [
  { title: "Algebra Problem Set 4", subject: "Mathematics", dueDate: "Aug 27, 2026", status: "pending" },
  { title: "Lab Report: Photosynthesis", subject: "Biology", dueDate: "Aug 29, 2026", status: "pending" },
  { title: "Essay: Industrial Revolution", subject: "History", dueDate: "Aug 31, 2026", status: "pending" },
  { title: "Grammar Worksheet 3", subject: "English", dueDate: "Aug 20, 2026", status: "submitted" },
  { title: "Newton's Laws Quiz Prep", subject: "Physics", dueDate: "Aug 15, 2026", status: "graded", grade: "18/20" },
  { title: "Recursion Practice Set", subject: "Computer Science", dueDate: "Aug 12, 2026", status: "graded", grade: "20/20" },
];

const statusStyles: Record<
  AssignmentRecord["status"],
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    icon: Clock3,
  },
  submitted: {
    label: "Submitted",
    className:
      "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
    icon: UploadCloud,
  },
  graded: {
    label: "Graded",
    className:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    icon: CheckCircle2,
  },
};

export default function StudentAssignmentsPage() {
  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const submittedCount = assignments.filter((a) => a.status === "submitted").length;
  const gradedCount = assignments.filter((a) => a.status === "graded").length;

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
            <FileText className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <Sparkles className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                Student Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              Assignments
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Track, submit, and review your assignments.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pendingCount, className: "text-amber-600 dark:text-amber-400" },
          { label: "Submitted", value: submittedCount, className: "text-blue-600 dark:text-blue-400" },
          { label: "Graded", value: gradedCount, className: "text-emerald-600 dark:text-emerald-400" },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.06, ease: "easeOut" }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center shadow-xs transition-colors duration-300"
          >
            <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${item.className}`}>
              {item.value}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Assignments Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors duration-300 overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">All Assignments</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Assignment
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Subject
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Due Date
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((item, idx) => {
                const style = statusStyles[item.status];
                const StatusIcon = style.icon;
                return (
                  <tr
                    key={`${item.title}-${idx}`}
                    className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                  >
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {item.title}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {item.subject}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {item.dueDate}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {style.label}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {item.grade ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}