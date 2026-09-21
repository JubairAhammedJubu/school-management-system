"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Loader2,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
] as const;

const DAY_LABEL: Record<string, string> = {
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
  className?: string;
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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/teacher/routine`, {
        credentials: "include",
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
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <CalendarDays className="h-5 w-5" />
            </span>
            My routine
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Classes assigned to you by period
            {session?.user?.name ? ` · ${session.user.name}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </button>
      </motion.div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
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
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
                  <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-900 px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 min-w-[100px]">
                    Period
                  </th>
                  {DAYS.map((d) => (
                    <th
                      key={d}
                      className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 min-w-[120px]"
                    >
                      {DAY_LABEL[d]}
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
                    <td className="sticky left-0 z-10 bg-white dark:bg-slate-950 px-3 py-2.5 align-top">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">
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
                      const cell = grid[day]?.[p.id];
                      if (p.isBreak) {
                        return (
                          <td
                            key={day}
                            className="px-1.5 py-1.5 bg-amber-50/40 dark:bg-amber-950/10"
                          />
                        );
                      }
                      if (!cell) {
                        return (
                          <td key={day} className="px-1.5 py-1.5">
                            <div className="min-h-[52px] rounded-lg border border-dashed border-slate-100 dark:border-slate-800" />
                          </td>
                        );
                      }
                      const isSub = cell.role === "SUBSTITUTE";
                      return (
                        <td key={day} className="px-1.5 py-1.5 align-top">
                          <div
                            className={`min-h-[52px] rounded-lg border px-2 py-1.5 ${
                              isSub
                                ? "border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/30"
                                : "border-indigo-100 bg-indigo-50/80 dark:border-indigo-900/50 dark:bg-indigo-950/30"
                            }`}
                          >
                            <p className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight">
                              {cell.subject}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {cell.className}
                              {cell.sectionName ? ` · ${cell.sectionName}` : ""}
                            </p>
                            {cell.room && (
                              <p className="text-[10px] text-slate-400">
                                Room {cell.room}
                              </p>
                            )}
                            {isSub && (
                              <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                                Substitute
                              </p>
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

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400">
        <BookOpen className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">{text}</p>
    </div>
  );
}