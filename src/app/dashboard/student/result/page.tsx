"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  FileText,
  Loader2,
  Award,
  TrendingUp,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

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

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("better-auth.session_token");
  }
  return null;
};

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

export default function StudentResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const token = getAuthToken();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/results`,
          {
            credentials: "include",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
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
      }
    };

    fetchResults();
  }, []);

  // Summary calculations
  const totalExams = results.length;
  const averagePercentage =
    totalExams > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) /
            totalExams
        )
      : 0;
  const highestScore =
    totalExams > 0
      ? Math.max(...results.map((r) => Math.round((r.score / r.total) * 100)))
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 p-6 sm:p-8 shadow-xs"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <Trophy className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                Student Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              My Results
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              View your published exam and assignment results.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Results",
            value: isLoading ? "..." : String(totalExams),
            icon: FileText,
            color: "text-indigo-600 dark:text-indigo-400",
          },
          {
            label: "Average Score",
            value: isLoading ? "..." : `${averagePercentage}%`,
            icon: TrendingUp,
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Highest Score",
            value: isLoading ? "..." : `${highestScore}%`,
            icon: Award,
            color: "text-amber-600 dark:text-amber-400",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.06 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className={`mt-1 text-2xl font-extrabold ${item.color}`}>
                  {item.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Results List */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="mt-3 text-sm text-slate-500">Loading results...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
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
                  (result.score / result.total) * 100
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
                          result.grade
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