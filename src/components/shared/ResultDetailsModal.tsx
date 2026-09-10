"use client";

import { motion } from "framer-motion";
import {
  X,
  UserRound,
  Mail,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Result } from "@/components/shared/ResultList";

type ResultDetailsModalProps = {
  result: Result | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ResultDetailsModal({
  result,
  isOpen,
  onClose,
}: ResultDetailsModalProps) {
  if (!isOpen || !result) {
    return null;
  }

  const percentage =
    result.total > 0
      ? ((result.score / result.total) * 100).toFixed(1)
      : "0.0";

  const formattedDate = result.createdAt
    ? new Date(result.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-details-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6 sm:py-5">
          <div className="min-w-0 pr-4">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Result Details
            </p>

            <h2
              id="result-details-title"
              className="mt-1 truncate text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl"
            >
              {result.studentName}
            </h2>

            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {result.exam}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close result details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {/* Student Information */}
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={<UserRound className="h-5 w-5" />}
              label="Student"
              value={result.studentName}
            />

            <InfoCard
              icon={<GraduationCap className="h-5 w-5" />}
              label="Class"
              value={result.studentClass}
            />

            <InfoCard
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={result.studentEmail}
            />

            <InfoCard
              icon={<BookOpen className="h-5 w-5" />}
              label="Examination"
              value={result.exam}
            />
          </div>

          {/* Score Overview */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <ResultMetric
                label="Score"
                value={`${result.score}/${result.total}`}
              />

              <ResultMetric
                label="Percentage"
                value={`${percentage}%`}
              />

              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
                  Grade
                </p>

                <div className="mt-2 flex justify-center">
                  <GradeBadge grade={result.grade} />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
                  Status
                </p>

                <div className="mt-2 flex justify-center">
                  <StatusBadge status={result.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Recorded Date */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-400">
              Recorded
            </span>

            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 sm:w-auto dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ========================================================= */
/* INFO CARD */
/* ========================================================= */

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
    <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-sm font-medium uppercase tracking-wider">
          {label}
        </p>
      </div>

      <p className="mt-2 break-words text-base font-bold text-slate-800 dark:text-slate-200">
        {value || "—"}
      </p>
    </div>
  );
}

/* ========================================================= */
/* RESULT METRIC */
/* ========================================================= */

function ResultMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* GRADE BADGE */
/* ========================================================= */

function GradeBadge({ grade }: { grade: string }) {
  const normalizedGrade = grade?.toUpperCase() || "";

  const styles =
    normalizedGrade === "A+"
      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
      : normalizedGrade === "A"
        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
        : normalizedGrade === "B+"
          ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
          : normalizedGrade === "B"
            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            : normalizedGrade === "C"
              ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
              : normalizedGrade === "D"
                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";

  return (
    <span
      className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-extrabold ${styles}`}
    >
      {normalizedGrade || "—"}
    </span>
  );
}

/* ========================================================= */
/* STATUS BADGE */
/* ========================================================= */

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status?.toUpperCase() || "";
  const published = normalizedStatus === "PUBLISHED";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold ${
        published
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          published ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />

      {published ? "Published" : "Draft"}
    </span>
  );
}