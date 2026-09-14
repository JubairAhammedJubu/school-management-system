"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, CalendarDays, Sparkles, CheckCircle2, XCircle, Clock3, AlertTriangle } from "lucide-react";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

interface AttendanceRecord {
  id: string;
  date: string; // ISO date string from the server
  status: AttendanceStatus;
  grade: string;
  section: string;
  group?: string | null;
}

interface AttendanceSummary {
  total: number;
  presentPercent: number;
  absentPercent: number;
  latePercent: number;
  attendanceRate: number;
  isAtRisk: boolean;
}

const statusStyles: Record<
  AttendanceStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  PRESENT: {
    label: "Present",
    className:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    icon: CheckCircle2,
  },
  ABSENT: {
    label: "Absent",
    className:
      "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
    icon: XCircle,
  },
  LATE: {
    label: "Late",
    className:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    icon: Clock3,
  },
};

// Safely retrieve the Better Auth bearer token on the client, same
// helper used on the assignments page.
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

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAttendance() {
      setIsLoading(true);
      setError(null);
      try {
        const authToken = getAuthToken();
        const headers: Record<string, string> = authToken
          ? { Authorization: `Bearer ${authToken}` }
          : {};

        const [recordsRes, summaryRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/attendance/me`, {
            credentials: "include",
            headers,
          }).then(parseJsonResponse),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/attendance/me/summary`, {
            credentials: "include",
            headers,
          }).then(parseJsonResponse),
        ]);

        if (!isMounted) return;

        if (recordsRes.success) {
          setRecords(recordsRes.records || []);
        } else {
          setError(recordsRes.error || "Failed to load attendance records.");
        }

        if (summaryRes.success) {
          setSummary(summaryRes.summary);
        }
      } catch (err) {
        console.error("Failed to load attendance:", err);
        if (isMounted) setError("Failed to load attendance records.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAttendance();
    return () => {
      isMounted = false;
    };
  }, []);

  const summaryCards = [
    {
      label: "Present",
      value: summary ? `${summary.presentPercent}%` : "—",
      className: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Absent",
      value: summary ? `${summary.absentPercent}%` : "—",
      className: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Late",
      value: summary ? `${summary.latePercent}%` : "—",
      className: "text-amber-600 dark:text-amber-400",
    },
  ];

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
            <CalendarCheck className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <Sparkles className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                Student Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              Attendance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Your daily attendance record for this term.
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
            <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
            <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          </div>
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            {summaryCards.map((item, idx) => (
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

          {/* At-risk banner — mirrors the same flag the teacher roster uses */}
          {summary?.isAtRisk && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
              className="flex items-center gap-3 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-5 py-4"
            >
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300">
                Your attendance rate is {summary.attendanceRate}%, below the 75% threshold. Consider reaching out to your teacher if something&apos;s affecting your attendance.
              </p>
            </motion.div>
          )}

          {/* Attendance Log — one card per recorded day */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white px-1">Recent Log</h2>

            {error ? (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {error}
              </div>
            ) : records.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                No attendance records yet — your teacher hasn&apos;t marked a class for you.
              </div>
            ) : (
              records.map((record, idx) => {
                const style = statusStyles[record.status];
                const StatusIcon = style.icon;
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 + Math.min(idx, 6) * 0.05, ease: "easeOut" }}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors duration-300 p-5 sm:p-6"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                        <CalendarDays className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {formatDateLabel(record.date)}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {record.grade} · {record.section}
                          {record.group ? ` · ${record.group}` : ""}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {style.label}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}