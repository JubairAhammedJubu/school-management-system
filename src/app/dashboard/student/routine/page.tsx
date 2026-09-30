"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CalendarDays, Printer, BookOpen, RefreshCw } from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";
const WEBSITE_NAME = "EduNexus";
const SCHOOL_NAME = "EduNexus Academy";

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"] as const;

const DAY_SHORT: Record<string, string> = {
  SUNDAY: "Sun",
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
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
  teacherName: string;
  room?: string | null;
};

function RoutineSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid grid-cols-6 gap-3 pt-2">
        {Array.from({ length: 24 }).map((_, idx) => (
          <div
            key={idx}
            className="h-16 rounded-xl bg-slate-100 dark:bg-slate-900/60"
          />
        ))}
      </div>
    </div>
  );
}

export default function StudentRoutinePage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [grid, setGrid] = useState<Record<string, Record<string, Cell>>>({});
  const [sectionLabel, setSectionLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    setLoading(true);
    if (refresh) setIsRefreshing(true);
    try {
      const res = await fetch(`${SERVER}/api/student/routine`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load routine");
      setPeriods(data.periods || []);
      setGrid(data.grid || {});
      setSectionLabel(data.section || "");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const printedAt = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-6 print:p-0 print:bg-white">
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          html,
          body,
          main,
          #__next,
          [data-main],
          div,
          section,
          article,
          header,
          footer,
          aside,
          nav,
          table,
          tbody,
          thead,
          tr,
          td,
          th {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #0f172a !important;
            border-color: #e2e8f0 !important;
            box-shadow: none !important;
          }

          /* Force light mode background colors for timetable elements in PDF/Print */
          .bg-indigo-50\/80,
          .dark .dark\:bg-indigo-950\/30,
          .dark .dark\:bg-indigo-950\/50,
          .dark .dark\:bg-indigo-50\/80 {
            background-color: #eef2ff !important;
            border-color: #c7d2fe !important;
          }

          .bg-slate-50\/90,
          .bg-slate-50\/80,
          .bg-slate-50,
          .dark .dark\:bg-slate-900\/50,
          .dark .dark\:bg-slate-900\/40,
          .dark .dark\:bg-slate-900 {
            background-color: #f8fafc !important;
          }

          .bg-amber-50\/50,
          .dark .dark\:bg-amber-950\/10 {
            background-color: #fffbeb !important;
          }

          /* Force dark mode text colors to dark slate for high legibility in PDF */
          .text-white,
          .dark .dark\:text-white,
          .dark .dark\:text-slate-100,
          .dark .dark\:text-slate-200 {
            color: #0f172a !important;
          }

          .text-slate-500,
          .text-slate-400,
          .dark .dark\:text-slate-300,
          .dark .dark\:text-slate-400,
          .dark .dark\:text-slate-500 {
            color: #475569 !important;
          }

          .text-indigo-600,
          .dark .dark\:text-indigo-400 {
            color: #4f46e5 !important;
          }

          .no-print,
          nav,
          header,
          aside,
          [data-sidebar],
          [data-navbar],
          .sidebar,
          .app-header,
          .dashboard-header {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }

          .fixed,
          .sticky,
          [class*="fixed"],
          [class*="sticky"] {
            position: static !important;
          }

          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Executive Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="no-print relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-blue-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Student Workspace
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {sectionLabel || "Routine Schedule"}
                </span>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Class Routine & Room Schedule
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Official weekly timetable showing period timings, subjects, classroom locations, and faculty members.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 md:pt-0">
            <button
              type="button"
              onClick={() => load(true)}
              disabled={loading || isRefreshing}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isRefreshing
                    ? "animate-spin text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Routine</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* High-Contrast Stat Cards Grid */}
      <div className="no-print grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Daily Class Periods",
            value: loading || isRefreshing ? null : String(periods.length),
            icon: CalendarDays,
            detail: "Scheduled slots per day",
          },
          {
            label: "Active Days",
            value: loading || isRefreshing ? null : "5 Days",
            icon: BookOpen,
            detail: "Sunday to Thursday",
          },
          {
            label: "Section & Grade",
            value: loading || isRefreshing ? null : sectionLabel || "Class Section",
            icon: CalendarDays,
            detail: "Enrolled class section",
          },
          {
            label: "Break & Recess Slots",
            value:
              loading || isRefreshing
                ? null
                : String(periods.filter((p) => p.isBreak).length),
            icon: CalendarDays,
            detail: "Rest & tiffin periods",
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

      {loading || isRefreshing ? (
        <RoutineSkeleton />
      ) : periods.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No routine configured yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            School periods and class schedules have not been configured for your section yet.
          </p>
        </div>
      ) : (
        /* Routine Sheet */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md overflow-hidden print:shadow-md print:border-slate-200"
        >
          {/* Letterhead */}
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/50 print:bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 print:shadow-none">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {WEBSITE_NAME}
                  </p>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white print:text-slate-900">
                    {SCHOOL_NAME}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Weekly class routine
                  </p>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 print:bg-indigo-50 print:text-indigo-800">
                  {sectionLabel || "Routine"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1.5">{printedAt}</p>
              </div>
            </div>
          </div>

          {/* Routine Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 print:bg-slate-50">
                  <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-900 px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 min-w-25 print:static print:bg-slate-50">
                    Period
                  </th>
                  {DAYS.map((d) => (
                    <th
                      key={d}
                      className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 min-w-30"
                    >
                      {DAY_SHORT[d]}
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
                    <td className="sticky left-0 z-10 bg-white dark:bg-slate-950 px-3 py-2.5 align-top print:static print:bg-white">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white print:text-slate-900">
                        {p.label}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        {p.startTime}–{p.endTime}
                      </p>
                      {p.isBreak && (
                        <span className="mt-0.5 inline-block text-[10px] font-bold text-amber-600">
                          Break
                        </span>
                      )}
                    </td>
                    {DAYS.map((day) => {
                      if (p.isBreak) {
                        return (
                          <td
                            key={day}
                            className="px-1.5 py-1.5 bg-amber-50/50 dark:bg-amber-950/10 print:bg-amber-50"
                          />
                        );
                      }
                      const cell = grid[day]?.[p.id];
                      if (!cell) {
                        return (
                          <td key={day} className="px-1.5 py-1.5">
                            <div className="min-h-13 rounded-lg border border-dashed border-slate-100 dark:border-slate-800 flex items-center justify-center text-[11px] text-slate-300 print:border-slate-200">
                              —
                            </div>
                          </td>
                        );
                      }
                      return (
                        <td key={day} className="px-1.5 py-1.5 align-top">
                          <div className="min-h-13 rounded-lg border border-indigo-100 bg-indigo-50/80 dark:border-indigo-900/50 dark:bg-indigo-950/30 px-2 py-1.5 print:border-indigo-200 print:bg-indigo-50">
                            <p className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight print:text-slate-900">
                              {cell.subject}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {cell.teacherName}
                            </p>
                            {cell.room ? (
                              <p className="text-[10px] text-slate-400">
                                Room {cell.room}
                              </p>
                            ) : null}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-2 print:bg-slate-50">
            <p className="text-[10px] font-bold text-slate-500">
              <span className="text-indigo-600">{WEBSITE_NAME}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              Class routine
            </p>
            <p className="text-[10px] text-slate-400">{printedAt}</p>
          </div>
        </motion.div>
      )}

      {!loading &&
        !isRefreshing &&
        periods.length > 0 &&
        !Object.values(grid).some((d) => Object.keys(d || {}).length > 0) && (
          <div className="no-print rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 px-4 py-8 text-center bg-white dark:bg-slate-950">
            <BookOpen className="mx-auto h-5 w-5 text-slate-300 dark:text-slate-600" />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Your section timetable has not been filled yet.
            </p>
          </div>
        )}
    </div>
  );
}
