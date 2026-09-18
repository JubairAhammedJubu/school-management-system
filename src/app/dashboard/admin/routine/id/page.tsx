"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2, ArrowLeft, X, CalendarDays } from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];
const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
};

type Period = { id: string; periodNumber: number; label: string; startTime: string; endTime: string; isBreak: boolean };
type Cell = { id: string; classSubjectId: string; subject: string; teacherName: string; room: string | null } | undefined;
type AvailableSubject = { classSubjectId: string; name: string; teacherName: string };

export default function RoutinePage() {
  const params = useParams();
  const router = useRouter();
  const sectionId = params.sectionId as string;

  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [grid, setGrid] = useState<Record<string, Record<string, Cell>>>({});
  const [availableSubjects, setAvailableSubjects] = useState<AvailableSubject[]>([]);
  const [sectionLabel, setSectionLabel] = useState("");
  const [picking, setPicking] = useState<{ day: string; periodId: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/routine/sections/${sectionId}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load routine");
      setPeriods(data.periods);
      setGrid(data.grid);
      setAvailableSubjects(data.availableSubjects);
      setSectionLabel(`${data.class.name} - ${data.section.name}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    load();
  }, [load]);

  const setSlot = async (classSubjectId: string) => {
    if (!picking) return;
    try {
      const res = await fetch(`${SERVER}/api/admin/routine/sections/${sectionId}/slot`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: picking.day, periodId: picking.periodId, classSubjectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set slot");
      toast.success("Routine updated");
      setPicking(null);
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const clearSlot = async (slotId: string) => {
    try {
      const res = await fetch(`${SERVER}/api/admin/routine/slots/${slotId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear slot");
      toast.success("Slot cleared");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
          No periods configured yet for the school.
        </p>
        <p className="text-xs text-slate-500">
          Go to Admin → Periods and click "Seed Standard Schedule" first.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-600" />
            Routine — {sectionLabel}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Click any cell to assign or change a subject.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-left text-xs font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800 min-w-25">
                Day
              </th>
              {periods.map((p) => (
                <th
                  key={p.id}
                  className={`px-3 py-2.5 text-center text-xs font-bold border-b border-slate-200 dark:border-slate-800 min-w-32.5 ${
                    p.isBreak ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700" : "text-slate-500"
                  }`}
                >
                  {p.label}
                  <div className="text-[10px] font-normal text-slate-400">{p.startTime}–{p.endTime}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="sticky left-0 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  {DAY_LABELS[day]}
                </td>
                {periods.map((p) => {
                  if (p.isBreak) {
                    return (
                      <td key={p.id} className="px-3 py-2.5 text-center bg-amber-50/50 dark:bg-amber-500/5 text-[11px] text-amber-600 font-medium">
                        {p.label}
                      </td>
                    );
                  }
                  const cell = grid[day]?.[p.id];
                  return (
                    <td key={p.id} className="px-2 py-2 align-top">
                      {cell ? (
                        <div className="rounded-lg border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1.5 relative group">
                          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{cell.subject}</p>
                          <p className="text-[10px] text-slate-500">{cell.teacherName}</p>
                          <button
                            onClick={() => clearSlot(cell.id)}
                            className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPicking({ day, periodId: p.id })}
                          className="w-full rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-2 py-2.5 text-[11px] text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {picking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setPicking(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {DAY_LABELS[picking.day]} — Select Subject
              </h3>
              <button onClick={() => setPicking(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            {availableSubjects.length === 0 ? (
              <p className="text-xs text-slate-500">
                No subjects added to this section yet — add subjects from the section drawer first.
              </p>
            ) : (
              <div className="space-y-1.5">
                {availableSubjects.map((s) => (
                  <button
                    key={s.classSubjectId}
                    onClick={() => setSlot(s.classSubjectId)}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-left hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.teacherName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}