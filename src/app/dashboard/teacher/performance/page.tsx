"use client";
import { API_BASE_URL } from "@/lib/api-url";

import React, { useEffect, useState, useRef, useMemo } from "react";
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
  Filter,
  Check,
  Users,
  CheckCircle2,
  Clock3,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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

const riskStyles: Record<
  RiskLevel,
  { label: string; className: string; dot: string }
> = {
  HIGH: {
    label: "Needs Support",
    className:
      "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
    dot: "bg-rose-500",
  },
  MEDIUM: {
    label: "Building",
    className:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    dot: "bg-amber-500",
  },
  LOW: {
    label: "On Track",
    className:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
  },
  INSUFFICIENT_DATA: {
    label: "Getting Started",
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
    <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 px-3 py-1.5">
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

const PIE_COLORS: Record<RiskLevel, string> = {
  LOW: "#10b981",
  MEDIUM: "#f59e0b",
  HIGH: "#f43f5e",
  INSUFFICIENT_DATA: "#94a3b8",
};

export default function StudentPerformanceOverviewPage() {
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

      const response = await fetch(
        `${API_BASE_URL}/api/teacher/at-risk`,
        { credentials: "include", headers }
      );
      const data = await parseJsonResponse(response);

      if (data.success) {
        setStudents(data.students || []);
      } else {
        setError(data.error || "Failed to load the performance overview.");
      }
    } catch (err) {
      console.error("Failed to load the performance overview:", err);
      setError("Failed to load the performance overview.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [gradeFilter, sectionFilter]);

  const handleGenerateInsight = async (student: AtRiskStudent) => {
    setGeneratingId(student.id);
    setInsightErrors((prev) => ({ ...prev, [student.id]: "" }));
    try {
      const authToken = getAuthToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const response = await fetch(
        `${API_BASE_URL}/api/teacher/at-risk/${student.id}/insight`,
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

  // Dynamically extract assigned classes and sections from teacher's students
  const availableGrades = useMemo(() => {
    return Array.from(
      new Set(students.map((s) => s.grade).filter(Boolean))
    ) as string[];
  }, [students]);

  const availableSections = useMemo(() => {
    return Array.from(
      new Set(students.map((s) => s.section).filter(Boolean))
    ) as string[];
  }, [students]);

  const gradeOptions = [
    { label: "All Assigned Classes", value: "" },
    ...availableGrades.map((g) => ({ label: g, value: g })),
  ];

  const sectionOptions = [
    { label: "All Sections", value: "" },
    ...availableSections.map((s) => ({ label: s, value: s })),
  ];

  // Filtered and paginated students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchGrade = !gradeFilter || student.grade === gradeFilter;
      const matchSection = !sectionFilter || student.section === sectionFilter;
      return matchGrade && matchSection;
    });
  }, [students, gradeFilter, sectionFilter]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const lowCount = filteredStudents.filter((s) => s.riskLevel === "LOW").length;
  const mediumCount = filteredStudents.filter((s) => s.riskLevel === "MEDIUM").length;
  const highCount = filteredStudents.filter((s) => s.riskLevel === "HIGH").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner matching other routes */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              TEACHER WORKSPACE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Student Performance Overview
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Attendance, exam, and assignment signals for every student — an assistive view to guide targeted learning.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadStudents}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm border border-indigo-200 dark:border-indigo-900/50 transition-all cursor-pointer shadow-xs shrink-0 z-10"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          )}
          Refresh Overview
        </button>
      </motion.div>

      {/* Metric Summary Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Total Students"
          value={isLoading ? "..." : String(students.length)}
          detail="Evaluated across active filters"
          delay={0.05}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="On Track"
          value={isLoading ? "..." : String(lowCount)}
          detail="Steady attendance and exam scores"
          delay={0.1}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <SummaryCard
          icon={Clock3}
          label="Building"
          value={isLoading ? "..." : String(mediumCount)}
          detail="Slight score or attendance drop"
          delay={0.15}
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
        />
        <SummaryCard
          icon={AlertCircle}
          label="Needs Support"
          value={isLoading ? "..." : String(highCount)}
          detail="Recommended for active check-in"
          delay={0.2}
          iconClass="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-500/10"
        />
      </div>

      {/* Nice Select Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <CustomSelect
          value={gradeFilter}
          options={gradeOptions}
          placeholder="All Classes"
          onChange={setGradeFilter}
          icon={Filter}
        />

        <CustomSelect
          value={sectionFilter}
          options={sectionOptions}
          placeholder="All Sections"
          onChange={setSectionFilter}
          icon={Filter}
        />
      </div>

      {!isLoading && !error && students.length > 0 && (
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70">
          <p className="text-base font-extrabold text-slate-950 dark:text-white">Class snapshot</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            How this group splits across the performance bands.
          </p>
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="h-56 min-w-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={(["LOW", "MEDIUM", "HIGH", "INSUFFICIENT_DATA"] as RiskLevel[])
                      .map((level) => ({
                        name: riskStyles[level].label,
                        value: students.filter((student) => student.riskLevel === level).length,
                        level,
                      }))
                      .filter((slice) => slice.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                  >
                    {(["LOW", "MEDIUM", "HIGH", "INSUFFICIENT_DATA"] as RiskLevel[])
                      .filter((level) => students.some((student) => student.riskLevel === level))
                      .map((level) => (
                        <Cell key={level} fill={PIE_COLORS[level]} />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:items-end sm:pb-2">
              {(
                [
                  ["LOW", "Steady attendance, scores, and assignments."],
                  ["MEDIUM", "A couple of areas are lower than usual."],
                  ["HIGH", "Several signals are low. A check-in is worth it."],
                  ["INSUFFICIENT_DATA", "Not enough history recorded yet."],
                ] as [RiskLevel, string][]
              ).map(([level, detail]) => {
                const count = students.filter((student) => student.riskLevel === level).length;
                return (
                  <div
                    key={level}
                    className="w-full sm:w-64 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/80 transition-all"
                  >
                    <p className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-sm"
                        style={{ backgroundColor: PIE_COLORS[level] }}
                      />
                      {riskStyles[level].label}: {count}
                    </p>
                    <p className="mt-0.5 pl-4 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                      {detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 p-5 shadow-md animate-pulse skeleton-shimmer" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 shadow-md">
          {error}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 shadow-md">
          No students found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedStudents.map((student, idx) => {
            const style = riskStyles[student.riskLevel];

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx, 8) * 0.04, ease: "easeOut" }}
                className="rounded-xl border border-slate-200/90 bg-white shadow-md backdrop-blur-xl transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base font-extrabold text-slate-900 dark:text-white">
                        {student.name}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${style.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {student.email} · {student.grade} · {student.section}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateInsight(student)}
                    disabled={generatingId === student.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer shrink-0"
                  >
                    {generatingId === student.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="h-3.5 w-3.5" />
                    )}
                    {insights[student.id] ? "Regenerate Insight" : "Generate AI Insight"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5">
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
                  <ul className="mt-3.5 space-y-1">
                    {student.reasons.map((reason, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-slate-400 dark:text-slate-500 shrink-0" />
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
                      className="mt-4 overflow-hidden"
                    >
                      <div className="rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 p-4">
                        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          Suggested Insight
                        </p>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                          {insights[student.id]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {insightErrors[student.id] && (
                  <p className="mt-2 text-xs font-semibold text-rose-500 dark:text-rose-400">
                    {insightErrors[student.id]}
                  </p>
                )}
              </motion.div>
            );
          })}

          {/* Pagination Controls */}
          {filteredStudents.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950 shadow-md backdrop-blur-xl">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Page{" "}
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {totalPages}
                </span>{" "}
                ({filteredStudents.length} total students · {ITEMS_PER_PAGE} per page)
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1 || isLoading}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  disabled={currentPage >= totalPages || isLoading}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ========================================================= */
/* HELPER COMPONENTS */
/* ========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
  iconClass = "text-indigo-600 dark:text-indigo-400",
  iconBg = "bg-indigo-50 dark:bg-indigo-500/10",
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/70"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconClass} shadow-xs`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      {value === "..." ? (
        <div className="mt-2 h-7 w-16 rounded-md bg-slate-200/90 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
      ) : (
        <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          {value}
        </p>
      )}

      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {detail}
      </p>
    </motion.div>
  );
}

function CustomSelect({
  value,
  options,
  placeholder,
  onChange,
  icon: Icon = Filter,
}: {
  value: string;
  options: { label: string; value: string }[];
  placeholder: string;
  onChange: (val: string) => void;
  icon?: React.ElementType;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((o) => o.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="relative w-full sm:w-52 shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-slate-50/90 px-3.5 text-xs font-bold transition-all duration-200 cursor-pointer dark:bg-slate-900/90 ${
          isOpen
            ? "border-indigo-500 bg-white ring-4 ring-indigo-500/15 shadow-sm dark:border-indigo-400 dark:bg-slate-900 text-slate-900 dark:text-white"
            : "border-slate-200/90 text-slate-700 hover:border-indigo-400 hover:bg-slate-100/80 dark:border-slate-800 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
        }`}
      >
        <span className="truncate flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-105 dark:bg-indigo-500/15 dark:text-indigo-400">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="truncate">{selectedLabel}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 shrink-0 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : "group-hover:text-slate-600 dark:group-hover:text-slate-300"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 sm:left-auto sm:right-0 top-[calc(100%+0.35rem)] z-50 w-full min-w-52 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/70"
          >
            <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar pr-0.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50/90 text-indigo-700 font-extrabold dark:bg-indigo-500/20 dark:text-indigo-300 shadow-2xs"
                        : "text-slate-700 font-semibold hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {isSelected && <span className="h-3.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />}
                      <span className="truncate">{option.label}</span>
                    </span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}