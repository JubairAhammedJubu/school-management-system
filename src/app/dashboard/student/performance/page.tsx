"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Sparkles,
  CalendarCheck,
  Award,
  FileText,
  Wand2,
  Loader2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

type StudentPace = "ON_TRACK" | "BUILDING" | "GROWING" | "GETTING_STARTED";

interface PerformanceSnapshot {
  studentName: string;
  pace: StudentPace;
  attendanceRate: number | null;
  averageScorePercent: number | null;
  assignmentCompletionRate: number | null;
}

// Same numbers the teacher sees, framed as encouragement. No risk labels.
const paceStyles: Record<
  StudentPace,
  { label: string; className: string; dot: string }
> = {
  ON_TRACK: {
    label: "Going Strong",
    className:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
  },
  BUILDING: {
    label: "Keep Building",
    className:
      "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/60",
    dot: "bg-sky-500",
  },
  GROWING: {
    label: "Room to Grow",
    className:
      "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
    dot: "bg-indigo-500",
  },
  GETTING_STARTED: {
    label: "Getting Started",
    className:
      "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-3">
        <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      </div>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

export default function StudentPerformancePage() {
  const { isPending: isSessionLoading } = useSession();
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);

  const [insight, setInsight] = useState<string | null>(null);
  const [insightSource, setInsightSource] = useState<"groq" | "fallback" | null>(null);
  const [insightError, setInsightError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isSessionLoading || hasFetched.current) return;
    hasFetched.current = true;

    const fetchSnapshot = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/performance`,
          { credentials: "include" }
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load your performance snapshot.");
        }

        setSnapshot(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load your performance snapshot.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnapshot();
  }, [isSessionLoading]);

  const handleGenerateInsight = async () => {
    setIsGenerating(true);
    setInsightError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/performance/insight`,
        { method: "POST", credentials: "include" }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not generate an insight right now.");
      }

      setInsight(data.insight);
      setInsightSource(data.source ?? null);
    } catch (err: any) {
      console.error(err);
      setInsightError(err.message || "Could not generate an insight right now.");
    } finally {
      setIsGenerating(false);
    }
  };

  const status = snapshot ? paceStyles[snapshot.pace] : null;
  const canGenerate = snapshot && snapshot.pace !== "GETTING_STARTED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 p-6 sm:p-8 shadow-xs transition-colors duration-300"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs shrink-0">
            <HeartPulse className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <Sparkles className="h-3 w-3 text-slate-500 dark:text-slate-400" />
              Student Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              My Performance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              A quick read on your attendance and results, plus a personalized note — an
              assistive view, not a verdict.
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {error}
        </div>
      ) : snapshot && status ? (
        <>
          {/* Status */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Overall status
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${status.className}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              {canGenerate && (
                <button
                  type="button"
                  onClick={handleGenerateInsight}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="h-3.5 w-3.5" />
                  )}
                  {insight ? "Regenerate My Insight" : "Generate My Insight"}
                </button>
              )}
            </div>

            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              These numbers are yours. The note below is a suggestion you can use — it does not
              change a grade or your standing.
            </p>

            <AnimatePresence>
              {insight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-3.5">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5">
                      <Sparkles className="h-3 w-3" />
                      Your Personalized Note
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {insight}
                    </p>
                    {insightSource === "fallback" && (
                      <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                        Generated automatically from your numbers.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {insightError && (
              <p className="mt-2 text-[11px] text-rose-500 dark:text-rose-400">{insightError}</p>
            )}

            {!canGenerate && (
              <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
                Not enough attendance, result, or assignment history yet to generate a
                personalized note.
              </p>
            )}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={CalendarCheck}
              label="Attendance Rate"
              value={snapshot.attendanceRate !== null ? `${snapshot.attendanceRate}%` : "—"}
            />
            <StatCard
              icon={Award}
              label="Average Score"
              value={
                snapshot.averageScorePercent !== null
                  ? `${snapshot.averageScorePercent}%`
                  : "—"
              }
            />
            <StatCard
              icon={FileText}
              label="Assignment Completion"
              value={
                snapshot.assignmentCompletionRate !== null
                  ? `${snapshot.assignmentCompletionRate}%`
                  : "—"
              }
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
