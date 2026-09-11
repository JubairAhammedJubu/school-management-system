"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserRound,
  Mail,
  GraduationCap,
  Award,
  Hash,
  Calendar,
  CheckCircle2,
  Pencil,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Result } from "@/components/shared/ResultList";

type ResultDetailsModalProps = {
  result: Result | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (result: Result) => void;
};

export default function ResultDetailsModal({
  result,
  isOpen,
  onClose,
  onEdit,
}: ResultDetailsModalProps) {
  const numericScore = result?.score ?? 0;
  const numericTotal = result?.total && result.total > 0 ? result.total : 100;
  const percentage = Number(((numericScore / numericTotal) * 100).toFixed(1));
  const isPassed = percentage >= 40;

  const formattedDate = result?.createdAt
    ? new Date(result.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const initials = result?.studentName
    ? result.studentName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n.charAt(0).toUpperCase())
        .join("")
    : "ST";

  return (
    <AnimatePresence>
      {isOpen && result && (
        <motion.div
          key="result-details-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex min-h-full items-center justify-center overflow-y-auto bg-black/60 p-3.5 sm:p-6 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-details-title"
        >
          <motion.div
            key="result-details-container"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative my-auto flex max-h-[88vh] sm:max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-black text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 text-sm shadow-sm">
                  {initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Student Result Record
                    </span>
                    <StatusBadge status={result.status} />
                  </div>

                  <h2
                    id="result-details-title"
                    className="truncate text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5"
                  >
                    {result.studentName}
                  </h2>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                aria-label="Close result details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-5">
              {/* Performance Score Summary Card */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 p-4 sm:p-5 dark:border-indigo-950/60 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-950 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100/80 pb-3 dark:border-indigo-900/40">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                      Academic Performance
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {result.exam}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-black uppercase border ${
                        isPassed
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20"
                      }`}
                    >
                      {isPassed ? "PASS" : "FAIL"}
                    </span>

                    <GradeBadge grade={result.grade} />
                  </div>
                </div>

                {/* Score Big Display */}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Obtained Marks
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      {result.score}{" "}
                      <span className="text-xs text-slate-400 font-semibold">
                        / {result.total}
                      </span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Percentage
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {percentage}%
                    </p>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Grade Allocation
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      Grade {result.grade || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Animated Score Progress Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-400">
                    <span>Score Growth</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isPassed
                          ? "bg-gradient-to-r from-indigo-500 to-emerald-500"
                          : "bg-gradient-to-r from-amber-500 to-red-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Student & Exam Metadata Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard
                  icon={<UserRound className="h-4 w-4 text-indigo-500" />}
                  label="Student Name"
                  value={result.studentName}
                />

                <InfoCard
                  icon={<Hash className="h-4 w-4 text-indigo-500" />}
                  label="Student Roll"
                  value={result.studentId || "N/A"}
                />

                <InfoCard
                  icon={<Mail className="h-4 w-4 text-indigo-500" />}
                  label="Email Address"
                  value={result.studentEmail}
                />

                <InfoCard
                  icon={<GraduationCap className="h-4 w-4 text-indigo-500" />}
                  label="Class / Grade"
                  value={result.studentClass}
                />

                <InfoCard
                  icon={<Award className="h-4 w-4 text-indigo-500" />}
                  label="Examination Title"
                  value={result.exam}
                />

                <InfoCard
                  icon={<Calendar className="h-4 w-4 text-indigo-500" />}
                  label="Recorded Date"
                  value={formattedDate}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex shrink-0 flex-col-reverse gap-2.5 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:justify-end sm:px-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </motion.button>

              {onEdit && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onClose();
                    onEdit(result);
                  }}
                  className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-700 sm:w-auto cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit Result</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/60 flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xs font-bold text-slate-900 dark:text-white">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function GradeBadge({ grade }: { grade: string }) {
  const normalizedGrade = grade?.toUpperCase() || "";

  const styles =
    normalizedGrade === "A+"
      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40"
      : normalizedGrade === "A"
        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
        : normalizedGrade === "B+"
          ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20"
          : normalizedGrade === "B"
            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
            : normalizedGrade === "C"
              ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20"
              : normalizedGrade === "D"
                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20";

  return (
    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-black uppercase border ${styles}`}>
      Grade {normalizedGrade || "N/A"}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status?.toUpperCase() || "";
  const published = normalizedStatus === "PUBLISHED";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-[10px] font-bold border ${
        published
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
          : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
        }`}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}