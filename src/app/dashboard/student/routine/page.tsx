"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CalendarDays, Printer, BookOpen } from "lucide-react";

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

export default function StudentRoutinePage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [grid, setGrid] = useState<Record<string, Record<string, Cell>>>({});
  const [sectionLabel, setSectionLabel] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
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

  if (loading) {
    return (
      <div className="p-5 sm:p-6 lg:p-8 space-y-4">
        <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
        <div className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 mb-3">
          <CalendarDays className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          No routine yet
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          School periods have not been configured yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6 print:p-6 print:bg-white">
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

          body,
          main,
          #__next,
          [data-main] {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>
      {/* Screen header — site style */}
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
            Weekly class timetable
            {sectionLabel ? ` · ${sectionLabel}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" />
          Print
        </button>
      </motion.div>

      {/* Sheet — slate + indigo only */}
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

        {/* Grid */}
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

        {/* Footer — site-like */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-2 print:bg-slate-50">
          <p className="text-[10px] font-bold text-slate-500">
            <span className="text-indigo-600">{WEBSITE_NAME}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            Class routine
          </p>
          <p className="text-[10px] text-slate-400">{printedAt}</p>
        </div>
      </motion.div>

      {!Object.values(grid).some((d) => Object.keys(d || {}).length > 0) && (
        <div className="no-print rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 px-4 py-8 text-center">
          <BookOpen className="mx-auto h-5 w-5 text-slate-300" />
          <p className="mt-2 text-xs text-slate-500">
            Your section timetable has not been filled yet.
          </p>
        </div>
      )}
    </div>
  );
}
