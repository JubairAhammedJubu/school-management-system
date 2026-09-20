"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Loader2,
  Clock,
  Sparkles,
  X,
  Plus,
  Trash2,
  Coffee,
  RefreshCw,
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"] as const;

const DAY_LABELS: Record<string, string> = {
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

type Section = { id: string; name: string };
type SchoolClass = {
  id: string;
  name: string;
  order: number;
  sections: Section[];
};
type Period = {
  id: string;
  periodNumber: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
};
type Cell =
  | { id: string; classSubjectId: string; subject: string; teacherName: string }
  | undefined;
type AvailableSubject = {
  classSubjectId: string;
  name: string;
  teacherName: string;
};

export default function AdminRoutinePage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loadingShell, setLoadingShell] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [activeClassId, setActiveClassId] = useState("");
  const [activeSectionId, setActiveSectionId] = useState("");

  const [grid, setGrid] = useState<Record<string, Record<string, Cell>>>({});
  const [availableSubjects, setAvailableSubjects] = useState<
    AvailableSubject[]
  >([]);
  const [loadingGrid, setLoadingGrid] = useState(false);

  const [picking, setPicking] = useState<{
    day: string;
    periodId: string;
  } | null>(null);

  const loadShell = useCallback(async () => {
    setLoadingShell(true);
    try {
      const [classesRes, periodsRes] = await Promise.all([
        fetch(`${SERVER}/api/admin/classes`, { credentials: "include" }),
        fetch(`${SERVER}/api/admin/periods`, { credentials: "include" }),
      ]);
      const classesData = await classesRes.json();
      const periodsData = await periodsRes.json();

      if (!classesRes.ok)
        throw new Error(classesData.error || "Failed to load classes");
      if (!periodsRes.ok)
        throw new Error(periodsData.error || "Failed to load periods");

      const sortedClasses = (classesData.classes || []).sort(
        (a: SchoolClass, b: SchoolClass) => a.order - b.order,
      );
      setClasses(sortedClasses);
      setPeriods(periodsData.periods || []);

      if (sortedClasses.length > 0 && !activeClassId) {
        setActiveClassId(sortedClasses[0].id);
        if (sortedClasses[0].sections?.[0]) {
          setActiveSectionId(sortedClasses[0].sections[0].id);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load");
    } finally {
      setLoadingShell(false);
    }
  }, [activeClassId]);

  useEffect(() => {
    loadShell();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGrid = useCallback(async (sectionId: string) => {
    if (!sectionId) return;
    setLoadingGrid(true);
    try {
      const res = await fetch(
        `${SERVER}/api/admin/routine/sections/${sectionId}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load routine");
      setGrid(data.grid || {});
      setAvailableSubjects(data.availableSubjects || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingGrid(false);
    }
  }, []);

  useEffect(() => {
    if (activeSectionId) loadGrid(activeSectionId);
  }, [activeSectionId, loadGrid]);

  const seedPeriods = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/periods/seed-standard`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      toast.success("Standard period schedule created");
      loadShell();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSeeding(false);
    }
  };

  const pickClass = (classId: string) => {
    setActiveClassId(classId);
    const cls = classes.find((c) => c.id === classId);
    setActiveSectionId(cls?.sections?.[0]?.id || "");
  };

  const setSlot = async (classSubjectId: string) => {
    if (!picking || !activeSectionId) return;
    try {
      const res = await fetch(
        `${SERVER}/api/admin/routine/sections/${activeSectionId}/slot`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            day: picking.day,
            periodId: picking.periodId,
            classSubjectId,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set slot");
      toast.success("Slot updated");
      setPicking(null);
      loadGrid(activeSectionId);
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
      loadGrid(activeSectionId);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const activeClass = classes.find((c) => c.id === activeClassId);
  const activeSection = activeClass?.sections.find(
    (s) => s.id === activeSectionId,
  );

  if (loadingShell) {
    return (
      <div className="p-5 sm:p-6 lg:p-8 space-y-4">
        <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
        <div className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 mb-3">
          <CalendarDays className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          No classes found
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Seed Class 6–10 with sections first from Classes &amp; Sections.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Header — same language as teacher routine */}
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
            Class routine
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Build weekly timetable by class &amp; section
            {activeClass && activeSection
              ? ` · ${activeClass.name} · ${activeSection.name}`
              : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            loadShell();
            if (activeSectionId) loadGrid(activeSectionId);
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </motion.div>

      {periods.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/80 dark:bg-amber-950/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                No periods yet
              </p>
              <p className="text-xs text-amber-800/80 dark:text-amber-400/80">
                Seed the bell schedule before building routines.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={seedPeriods}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
          >
            {seeding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Seed standard schedule
          </button>
        </div>
      ) : (
        <>
          {/* Class tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {classes.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pickClass(c.id)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  c.id === activeClassId
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Section pills */}
          {activeClass && activeClass.sections.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeClass.sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSectionId(s.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer ${
                    s.id === activeSectionId
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No sections for this class.
            </p>
          )}

          {activeSectionId && (
            <>
              {availableSubjects.length === 0 && (
                <p className="text-xs text-slate-500 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 px-4 py-3">
                  Attach subjects &amp; teachers to this section first, then
                  schedule them here.
                </p>
              )}

              {loadingGrid ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
                </div>
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
                              {DAY_LABELS[d]}
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
                                <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                                  <Coffee className="h-3 w-3" />
                                  Break
                                </span>
                              )}
                            </td>
                            {DAYS.map((day) => {
                              if (p.isBreak) {
                                return (
                                  <td
                                    key={day}
                                    className="px-1.5 py-1.5 bg-amber-50/40 dark:bg-amber-950/10"
                                  />
                                );
                              }
                              const cell = grid[day]?.[p.id];
                              if (!cell) {
                                return (
                                  <td key={day} className="px-1.5 py-1.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPicking({ day, periodId: p.id })
                                      }
                                      disabled={availableSubjects.length === 0}
                                      className="flex w-full min-h-[52px] items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 disabled:opacity-40 cursor-pointer"
                                    >
                                      <Plus className="h-3.5 w-3.5 mr-0.5" />
                                      Add
                                    </button>
                                  </td>
                                );
                              }
                              return (
                                <td
                                  key={day}
                                  className="px-1.5 py-1.5 align-top"
                                >
                                  <div className="relative group min-h-[52px] rounded-lg border border-indigo-100 bg-indigo-50/80 dark:border-indigo-900/50 dark:bg-indigo-950/30 px-2 py-1.5">
                                    <p className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight pr-4">
                                      {cell.subject}
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                      {cell.teacherName}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => clearSlot(cell.id)}
                                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-md text-rose-600 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                      title="Clear"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
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
            </>
          )}
        </>
      )}

      {/* Subject picker — same modal pattern */}
      <AnimatePresence>
        {picking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={() => setPicking(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {DAY_FULL[picking.day]} · pick subject
                </h3>
                <button
                  type="button"
                  onClick={() => setPicking(null)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {availableSubjects.map((s) => (
                  <button
                    key={s.classSubjectId}
                    type="button"
                    onClick={() => setSlot(s.classSubjectId)}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2.5 text-left hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {s.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {s.teacherName}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}