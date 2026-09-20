"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Loader2, CalendarDays, ArrowLeft, Printer, Clock, User, BookOpen } from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";
const WEBSITE_NAME = "EduNexus";
const SCHOOL_NAME = "Your School Name";

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];
const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
};
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

export default function StudentRoutinePage() {
  const router = useRouter();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [grid, setGrid] = useState<Record<string, Record<string, any>>>({});
  const [sectionLabel, setSectionLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(DAYS[0]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/student/routine`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load routine");
      setPeriods(data.periods);
      setGrid(data.grid);
      setSectionLabel(data.section);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
        <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 mb-3">
          <CalendarDays className="h-5 w-5" />
        </div>
        <p className="text-sm text-slate-500">No periods have been configured for the school yet.</p>
      </div>
    );
  }

  const teachingPeriods = periods.filter((p) => !p.isBreak);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 print:p-0">
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: landscape;
            margin: 12mm;
          }
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print"
      >
        <div className="flex items-center gap-3 min-w-0">
         
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 shrink-0">
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span className="truncate">My Class Routine</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 ml-[42px] sm:ml-[52px] truncate">
              {sectionLabel}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 cursor-pointer transition-colors shrink-0"
        >
          <Printer className="h-3.5 w-3.5" />
          Print
        </button>
      </motion.div>

      {/* Print-only letterhead */}
      <div className="hidden print:flex print:flex-col print:items-center print:text-center print:mb-6 print:border-b-2 print:border-slate-800 print:pb-4">
        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">{WEBSITE_NAME}</p>
        <h1 className="text-2xl font-black text-slate-900 mt-1">{SCHOOL_NAME}</h1>
        <p className="text-sm font-bold text-slate-700 mt-2">Weekly Class Routine</p>
        <p className="text-sm text-slate-600 mt-0.5">{sectionLabel}</p>
      </div>

      {/* Day tabs — mobile only */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-1 no-print -mx-4 px-4">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
              activeDay === day
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            }`}
          >
            {DAY_SHORT[day]}
          </button>
        ))}
      </div>

      {/* MOBILE: card list for the active day */}
      <div className="sm:hidden space-y-2">
        {teachingPeriods.map((p, i) => {
          const cell = grid[activeDay]?.[p.id];
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 * i }}
              className={`rounded-2xl border p-3.5 flex items-center gap-3 shadow-sm ${
                cell
                  ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              }`}
            >
              <div className="flex flex-col items-center justify-center w-14 shrink-0 text-center">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5" />
                  {p.startTime}
                </span>
                <span className="text-[10px] text-slate-400">{p.endTime}</span>
              </div>
              <div className="w-px self-stretch bg-slate-200 dark:bg-slate-800" />
              <div className="min-w-0 flex-1">
                {cell ? (
                  <>
                    <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 truncate flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 shrink-0" />
                      {cell.subject}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <User className="h-2.5 w-2.5" />
                      {cell.teacherName}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-400 italic">Free period</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* DESKTOP/TABLET: full grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md print:shadow-none print:border-slate-300"
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-left text-xs font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800 min-w-[100px] print:static print:bg-slate-100">
                Day
              </th>
              {teachingPeriods.map((p) => (
                <th
                  key={p.id}
                  className="px-3 py-2.5 text-center text-xs font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800 min-w-[130px]"
                >
                  {p.label}
                  <div className="text-[10px] font-normal text-slate-400">
                    {p.startTime}–{p.endTime}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="sticky left-0 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 print:static">
                  {DAY_LABELS[day]}
                </td>
                {teachingPeriods.map((p) => {
                  const cell = grid[day]?.[p.id];
                  return (
                    <td key={p.id} className="px-2 py-2 align-top">
                      {cell ? (
                        <div className="rounded-lg border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1.5 print:border-indigo-300 print:bg-indigo-50">
                          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 print:text-indigo-800">{cell.subject}</p>
                          <p className="text-[10px] text-slate-500">{cell.teacherName}</p>
                        </div>
                      ) : (
                        <div className="text-center text-[11px] text-slate-300">—</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}