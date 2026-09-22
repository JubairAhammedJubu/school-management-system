"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Sparkles,
  AlertTriangle,
  CalendarCheck,
  Award,
  FileText,
  Wand2,
  Loader2,
  ChevronDown,
} from "lucide-react";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "INSUFFICIENT_DATA";

interface AtRiskStudent {
  id: string;
  name: string;
  email: string;
  grade: string | null;
  section: string | null;
  riskLevel: RiskLevel;
  attendanceRate: number | null;
  averageScorePercent: number | null;
  assignmentCompletionRate: number | null;
  reasons: string[];
}

const GRADES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTIONS = ["Section A", "Section B"];

const riskStyles: Record<
  RiskLevel,
  { label: string; className: string; dot: string }
> = {
  HIGH: {
    label: "High Risk",
    className:
      "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
    dot: "bg-rose-500",
  },
  MEDIUM: {
    label: "Medium Risk",
    className:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    dot: "bg-amber-500",
  },
  LOW: {
    label: "Low Risk",
    className:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
  },
  INSUFFICIENT_DATA: {
    label: "Not Enough Data",
    className:
      "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("better-auth.session_token");
  }
  return null;
};

const parseJsonResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  const rawText = await response.text();
  throw new Error(
    `Server returned non-JSON response (${response.status}): ${rawText.slice(0, 100)}...`
  );
};

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-2.5 py-1.5">
      <Icon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">{label}</p>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AtRiskStudentsPage() {
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const [insights, setInsights] = useState<Record<string, string>>({});
  const [insightErrors, setInsightErrors] = useState<Record<string, string>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const loadStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authToken = getAuthToken();
      const headers: Record<string, string> = authToken
        ? { Authorization: `Bearer ${authToken}` }
        : {};

      const params = new URLSearchParams();
      if (gradeFilter) params.set("grade", gradeFilter);
      if (sectionFilter) params.set("section", sectionFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teacher/at-risk?${params.toString()}`,
        { credentials: "include", headers }
      );
      const data = await parseJsonResponse(response);

      if (data.success) {
        setStudents(data.students || []);
      } else {
        setError(data.error || "Failed to load at-risk students.");
      }
    } catch (err) {
      console.error("Failed to load at-risk students:", err);
      setError("Failed to load at-risk students.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeFilter, sectionFilter]);

  const handleGenerateInsight = async (student: AtRiskStudent) => {
    setGeneratingId(student.id);
    setInsightErrors((prev) => ({ ...prev, [student.id]: "" }));
    try {
      const authToken = getAuthToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teacher/at-risk/${student.id}/insight`,
        { method: "POST", credentials: "include", headers }
      );
      const data = await parseJsonResponse(response);

      if (data.success) {
        setInsights((prev) => ({ ...prev, [student.id]: data.insight }));
      } else {
        setInsightErrors((prev) => ({
          ...prev,
          [student.id]: data.error || "Could not generate an insight.",
        }));
      }
    } catch (err) {
      console.error("Failed to generate insight:", err);
      setInsightErrors((prev) => ({
        ...prev,
        [student.id]: "Could not generate an insight.",
      }));
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 p-6 sm:p-8 text-slate-900 dark:text-white shadow-xs transition-colors duration-300"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-2xs shrink-0">
            <HeartPulse className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <Sparkles className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                Teacher Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              At-Risk Students
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Attendance, exam, and assignment signals — an assistive view, not a verdict. Use your own judgment alongside it.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-3.5 pr-9 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="">All Classes</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>

        <div className="relative">
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-3.5 pr-9 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="">All Sections</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {error}
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          No students found for this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((student, idx) => {
            const style = riskStyles[student.riskLevel];
            const canGenerate =
              student.riskLevel === "HIGH" || student.riskLevel === "MEDIUM";

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx, 8) * 0.04, ease: "easeOut" }}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors duration-300 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {student.name}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${style.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {student.email} · {student.grade} · {student.section}
                    </p>
                  </div>

                  {canGenerate && (
                    <button
                      type="button"
                      onClick={() => handleGenerateInsight(student)}
                      disabled={generatingId === student.id}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer shrink-0"
                    >
                      {generatingId === student.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="h-3.5 w-3.5" />
                      )}
                      {insights[student.id] ? "Regenerate Insight" : "Generate Insight"}
                    </button>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <StatPill
                    icon={CalendarCheck}
                    label="Attendance"
                    value={student.attendanceRate !== null ? `${student.attendanceRate}%` : "—"}
                  />
                  <StatPill
                    icon={Award}
                    label="Avg. Score"
                    value={
                      student.averageScorePercent !== null
                        ? `${student.averageScorePercent}%`
                        : "—"
                    }
                  />
                  <StatPill
                    icon={FileText}
                    label="Assignments"
                    value={
                      student.assignmentCompletionRate !== null
                        ? `${student.assignmentCompletionRate}%`
                        : "—"
                    }
                  />
                </div>

                {student.reasons.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {student.reasons.map((reason, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400"
                      >
                        <AlertTriangle className="h-3 w-3 mt-0.5 text-slate-400 dark:text-slate-500 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                )}

                <AnimatePresence>
                  {insights[student.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-3.5">
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5">
                          <Sparkles className="h-3 w-3" />
                          Suggested Insight
                        </p>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                          {insights[student.id]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {insightErrors[student.id] && (
                  <p className="mt-2 text-[11px] text-rose-500 dark:text-rose-400">
                    {insightErrors[student.id]}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}