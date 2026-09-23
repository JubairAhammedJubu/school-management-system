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
      const res = await fetch(`${SERVER}/api/teacher/routine`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data)
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

  if (loading) {
    return (
      <div className="p-5 sm:p-6 lg:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-7 w-44 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-56 rounded-md bg-slate-100 dark:bg-slate-900 animate-pulse" />
          </div>
          <div className="h-9 w-24 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-3.5"
            >
              <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
              <div className="mt-3 h-7 w-10 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-72 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-5">
      <style jsx global>{`
        @media print {
          * {
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
            background: #fff !important;
            margin: 0 !important;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <CalendarDays className="h-5 w-5" />
            </span>
            My routine
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Your weekly teaching timetable
            {session?.user?.name ? ` · ${session.user.name}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!hasAnyClass}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-3 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 disabled:opacity-40 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
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

      {/* Stats */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MiniStat label="Periods" value={teachingPeriods.length} />
        <MiniStat
          label="Assigned slots"
          value={filledCount}
          accent="text-indigo-600 dark:text-indigo-400"
        />
        <MiniStat
          label="School days"
          value={DAYS.length}
          accent="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {periods.length === 0 ? (
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

function MiniStat({
  label,
  value,
  accent = "text-slate-900 dark:text-white",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-3.5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-xl font-extrabold ${accent}`}>{value}</p>
    </div>
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
