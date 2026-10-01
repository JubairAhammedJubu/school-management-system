"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Loader2,
  RefreshCw,
  BookOpen,
  Clock3,
  Printer,
  MapPin,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";
const WEBSITE_NAME = "EduNexus";
const SCHOOL_NAME = "Your School Name";

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"] as const;

const DAY_SHORT: Record<string, string> = {
  SUNDAY: "Sun",
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
};
const DAY_FULL: Record<string, string> = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
};

type Period = {
  id: string;
  periodNumber: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
};

type Cell = {
  subject: string;
  className?: string;
  group?:string;
  sectionName?: string;
  room?: string | null;
  role?: string;
};

type Grid = Record<string, Record<string, Cell>>;

export default function TeacherRoutinePage() {
  const { data: session } = useSession();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [grid, setGrid] = useState<Grid>({});
  const [loading, setLoading] = useState(true);

  const teachingPeriods = useMemo(
    () =>
      [...periods]
        .filter((p) => !p.isBreak)
        .sort((a, b) => a.periodNumber - b.periodNumber),
    [periods],
  );

  const filledCount = useMemo(() => {
    let n = 0;
    for (const day of DAYS) {
      for (const p of teachingPeriods) {
        if (grid[day]?.[p.id]) n += 1;
      }
    }
    return n;
  }, [grid, teachingPeriods]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/teacher/routine?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load routine");
      setPeriods(data.periods || []);
      setGrid(data.grid || {});
    } catch (e: any) {
      toast.error(e.message || "Failed to load routine");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasAnyClass = useMemo(() => {
    return DAYS.some((day) => Object.keys(grid[day] || {}).length > 0);
  }, [grid]);

  return (
    <div className="space-y-6 pb-12">
      <style jsx global>{`
        @media print {
          html, body, main, div, table, tr, td, th, p, span {
            background-color: #ffffff !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
            box-shadow: none !important;
            text-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print,
          nav,
          header,
          aside,
          [data-sidebar] {
            display: none !important;
          }
          body,
          main {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
            background-color: #ffffff !important;
          }
          th {
            background-color: #f1f5f9 !important;
            color: #1e293b !important;
            font-weight: 800 !important;
            border: 1px solid #cbd5e1 !important;
          }
          td {
            background-color: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
          }
          td div {
            background-color: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            color: #0f172a !important;
            border-radius: 8px !important;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Top Header Banner matching other routes */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="no-print relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              ACADEMIC SCHEDULE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Weekly Routine &amp; Timetable
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              View your assigned class periods, section allocations, classroom locations, and breaks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm border border-indigo-200 dark:border-indigo-900/50 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-indigo-600 dark:text-indigo-400 ${loading ? "animate-spin" : ""}`} />
            Refresh Routine
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            disabled={!hasAnyClass}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-40"
          >
            <Printer className="h-4 w-4" />
            Print Routine
          </button>
        </div>
      </motion.div>

      {/* Print letterhead */}
      <div className="hidden print:block mb-3 border-b border-indigo-200 pb-3">
        <p className="text-lg font-extrabold text-indigo-900">{WEBSITE_NAME}</p>
        <p className="text-sm text-slate-600">
          {SCHOOL_NAME} · Teacher timetable
        </p>
        {session?.user?.name && (
          <p className="text-xs text-slate-500 mt-1">{session.user.name}</p>
        )}
      </div>

      {/* Metric Summary Cards Row */}
      <div className="no-print grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Clock3}
          label="Daily Periods"
          value={loading ? "..." : String(teachingPeriods.length)}
          detail="Configured teaching periods per day"
          delay={0.05}
          isLoading={loading}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />
        <SummaryCard
          icon={BookOpen}
          label="Assigned Slots"
          value={loading ? "..." : String(filledCount)}
          detail="Weekly allocated class sessions"
          delay={0.1}
          isLoading={loading}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <SummaryCard
          icon={CalendarDays}
          label="School Days"
          value={loading ? "..." : String(DAYS.length)}
          detail="Weekly scheduled academic days"
          delay={0.15}
          isLoading={loading}
          iconClass="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-500/10"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 p-4 shadow-md backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
            <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
                  <th className="px-3 py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 min-w-[100px]">Period</th>
                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].map((day) => (
                    <th key={day} className="px-2 py-3 text-center text-[11px] font-extrabold uppercase tracking-wider text-slate-400 min-w-[120px]">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, pIdx) => (
                  <tr key={pIdx} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                    <td className="px-3 py-3">
                      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
                      <div className="mt-1 h-3 w-14 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
                    </td>
                    {Array.from({ length: 5 }).map((_, dIdx) => (
                      <td key={dIdx} className="px-1.5 py-1.5">
                        <div className="min-h-[58px] rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 p-2.5 space-y-2">
                          <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
                          <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : periods.length === 0 ? (
        <Empty
          title="No periods configured"
          text="Admin has not set the school bell schedule yet."
        />
      ) : !hasAnyClass ? (
        <Empty
          title="No classes on your routine"
          text="When admin assigns subjects and builds the timetable, your slots will appear here."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden print:shadow-none print:border-slate-300"
        >
          <div className="no-print flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Weekly grid
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              Read-only · set by admin
            </span>
          </div>

          <div className="overflow-x-auto p-2 sm:p-3">
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/60 print:bg-indigo-50">
                  <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-900 print:bg-indigo-50 px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 min-w-[100px]">
                    Period
                  </th>
                  {DAYS.map((d) => (
                    <th
                      key={d}
                      className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 min-w-[120px]"
                    >
                      <span className="sm:hidden print:hidden">
                        {DAY_SHORT[d]}
                      </span>
                      <span className="hidden sm:inline print:inline">
                        {DAY_FULL[d]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                  >
                    <td className="sticky left-0 z-10 bg-white dark:bg-slate-950 print:bg-white px-3 py-2.5 align-top">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {p.label}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        {p.startTime}–{p.endTime}
                      </p>
                      {p.isBreak && (
                        <span className="mt-0.5 inline-block rounded-md bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          Break
                        </span>
                      )}
                    </td>
                    {DAYS.map((day) => {
                      if (p.isBreak) {
                        return (
                          <td
                            key={day}
                            className="px-1.5 py-1.5 bg-amber-50/40 dark:bg-amber-950/10 print:bg-amber-50/50"
                          />
                        );
                      }
                      const cell = grid[day]?.[p.id];
                      if (!cell) {
                        return (
                          <td key={day} className="px-1.5 py-1.5">
                            <div className="min-h-[56px] flex items-center justify-center text-[11px] text-slate-300">
                              —
                            </div>
                          </td>
                        );
                      }
                      const isSub = cell.role === "SUBSTITUTE";
                      return (
                        <td key={day} className="px-1.5 py-1.5 align-top">
                          <div
                            className={`min-h-[56px] rounded-xl border px-2.5 py-2 shadow-sm ${
                              isSub
                                ? "border-amber-200 bg-amber-50/90 dark:border-amber-800 dark:bg-amber-950/30 print:border-amber-300 print:bg-amber-50"
                                : "border-indigo-100 bg-indigo-50/90 dark:border-indigo-900/50 dark:bg-indigo-950/30 print:border-indigo-200 print:bg-indigo-50"
                            }`}
                          >
                            <p className="text-[11px] font-extrabold text-slate-900 dark:text-white print:text-indigo-900 leading-tight">
                              {cell.subject}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                              <BookOpen className="h-2.5 w-2.5 shrink-0 no-print opacity-60" />
                              {cell.className}
                              {cell.sectionName ? ` · ${cell.sectionName}` : ""}
                            </p>
                            {cell.group ? (
                              <span className="mt-1 inline-flex rounded-md bg-indigo-100 dark:bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:text-indigo-300">
                                {cell.group}
                              </span>
                            ) : null}
                            {cell.room && (
                              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5 no-print" />
                                Room {cell.room}
                              </p>
                            )}
                            {isSub && (
                              <span className="mt-1 inline-block rounded-md bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                                Substitute
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
  isLoading = false,
  iconClass = "text-indigo-600 dark:text-indigo-400",
  iconBg = "bg-indigo-50 dark:bg-indigo-500/10",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
  isLoading?: boolean;
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

      {isLoading || value === "..." ? (
        <div className="my-1 h-7 w-16 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
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

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400">
        <Clock3 className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">{text}</p>
    </div>
  );
}

