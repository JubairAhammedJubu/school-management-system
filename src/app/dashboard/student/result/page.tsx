"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  FileText,
  Award,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface Result {
  id: string;
  exam: string;
  score: number;
  total: number;
  grade: string;
  status: string;
  assignmentId?: string | null;
  studentClass: string;
  createdAt: string;
}

const getGradeColor = (grade: string) => {
  const g = grade.toUpperCase();
  if (["A+", "A"].includes(g))
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";
  if (["B+", "B"].includes(g))
    return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800";
  if (["C+", "C"].includes(g))
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
  return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800";
};

function ResultSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 animate-pulse"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-6 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div className="space-y-1.5">
              <div className="h-3 w-10 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-1.5 flex flex-col items-end">
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-14 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          <div className="mt-4 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800" />

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/70 dark:border-slate-800">
            <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StudentResultsPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);

  const fetchResults = async (refresh = false) => {
    try {
      setIsLoading(true);
      if (refresh) setIsRefreshing(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/results`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load results");
      }

      setResults(data.results || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load results");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isSessionLoading || hasFetched.current) return;
    hasFetched.current = true;
    fetchResults();
  }, [isSessionLoading]);

  // Summary calculations
  const totalExams = results.length;
  const averagePercentage =
    totalExams > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) /
            totalExams,
        )
      : 0;
  const highestScore =
    totalExams > 0
      ? Math.max(...results.map((r) => Math.round((r.score / r.total) * 100)))
      : 0;

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-amber-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50/80 text-amber-600 shadow-2xs dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
              <Trophy className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Student Workspace
                </span>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                My Results & Grade Reports
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                View your published examination marksheets, letter grades, and academic performance history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => fetchResults(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing
                    ? "animate-spin text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* High-Contrast Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Published Results",
            value: isLoading || isRefreshing ? null : String(totalExams),
            icon: FileText,
            detail: "Recorded marksheets",
          },
          {
            label: "Average Score Rate",
            value: isLoading || isRefreshing ? null : `${averagePercentage}%`,
            icon: TrendingUp,
            detail: "Overall percentage",
          },
          {
            label: "Highest Score Achieved",
            value: isLoading || isRefreshing ? null : `${highestScore}%`,
            icon: Award,
            detail: "Peak score record",
          },
          {
            label: "Passed Examinations",
            value:
              isLoading || isRefreshing
                ? null
                : String(
                    results.filter(
                      (r) => r.grade !== "F" && r.score / r.total >= 0.33,
                    ).length,
                  ),
            icon: CheckCircle2,
            detail: "Qualified subjects",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl hover:border-indigo-500/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
                <item.icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {item.label}
            </p>

            {item.value === null ? (
              <div className="mt-1 h-7 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {item.value}
              </p>
            )}

            <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Results List */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Published Results
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Only published results are visible here
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {isLoading || isRefreshing ? (
            <ResultSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mb-4 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Unable to load results
              </h3>
              <p className="max-w-md text-xs text-slate-500 dark:text-slate-400 mb-4">
                {error}
              </p>
              <button
                onClick={() => fetchResults(true)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Trophy className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                No results published yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Your results will appear here once your teacher publishes them.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map((result, index) => {
                const percentage = Math.round(
                  (result.score / result.total) * 100,
                );

                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {result.exam}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {result.studentClass}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getGradeColor(
                          result.grade,
                        )}`}
                      >
                        {result.grade}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Score
                        </p>
                        <p className="mt-0.5 text-xl font-extrabold text-slate-900 dark:text-white">
                          {result.score}
                          <span className="text-sm font-medium text-slate-400">
                            /{result.total}
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Percentage
                        </p>
                        <p className="mt-0.5 text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                          {percentage}%
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/70 dark:border-slate-800">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Published
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
