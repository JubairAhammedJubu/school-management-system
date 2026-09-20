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
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];
const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Sun", MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
};
const DAY_FULL: Record<string, string> = {
  SUNDAY: "Sunday", MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday", THURSDAY: "Thursday",
};

type Section = { id: string; name: string };
type SchoolClass = { id: string; name: string; order: number; sections: Section[] };
type Period = { id: string; periodNumber: number; label: string; startTime: string; endTime: string; isBreak: boolean };
type Cell = { id: string; classSubjectId: string; subject: string; teacherName: string } | undefined;
type AvailableSubject = { classSubjectId: string; name: string; teacherName: string };

export default function AdminRoutinePage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loadingShell, setLoadingShell] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [activeClassId, setActiveClassId] = useState("");
  const [activeSectionId, setActiveSectionId] = useState("");

  const [grid, setGrid] = useState<Record<string, Record<string, Cell>>>({});
  const [availableSubjects, setAvailableSubjects] = useState<AvailableSubject[]>([]);
  const [loadingGrid, setLoadingGrid] = useState(false);

  const [picking, setPicking] = useState<{ day: string; periodId: string } | null>(null);
  const [activeMobileDay, setActiveMobileDay] = useState(DAYS[0]);

  // ── Initial load: classes (6–10 sorted) + periods ──────────────────────
  const loadShell = useCallback(async () => {
    setLoadingShell(true);
    try {
      const [classesRes, periodsRes] = await Promise.all([
        fetch(`${SERVER}/api/admin/classes`, { credentials: "include" }),
        fetch(`${SERVER}/api/admin/periods`, { credentials: "include" }),
      ]);
      const classesData = await classesRes.json();
      const periodsData = await periodsRes.json();

      if (!classesRes.ok) throw new Error(classesData.error || "Failed to load classes");
      if (!periodsRes.ok) throw new Error(periodsData.error || "Failed to load periods");

      const sortedClasses = (classesData.classes || []).sort((a: SchoolClass, b: SchoolClass) => a.order - b.order);
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

  // ── Load the grid whenever the active section changes ──────────────────
  const loadGrid = useCallback(async (sectionId: string) => {
    if (!sectionId) return;
    setLoadingGrid(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/routine/sections/${sectionId}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load routine");
      setGrid(data.grid);
      setAvailableSubjects(data.availableSubjects);
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
      const res = await fetch(`${SERVER}/api/admin/periods/seed-standard`, { method: "POST", credentials: "include" });
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
      const res = await fetch(`${SERVER}/api/admin/routine/sections/${activeSectionId}/slot`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: picking.day, periodId: picking.periodId, classSubjectId }),
      });
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
      const res = await fetch(`${SERVER}/api/admin/routine/slots/${slotId}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear slot");
      toast.success("Slot cleared");
      loadGrid(activeSectionId);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const activeClass = classes.find((c) => c.id === activeClassId);
  const activeSection = activeClass?.sections.find((s) => s.id === activeSectionId);
  const teachingPeriods = periods.filter((p) => !p.isBreak);

  // ── Loading shell ────────────────────────────────────────────────────
  if (loadingShell) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
        <div className="h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
        <div className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
      </div>
    );
  }

  // ── No classes at all ────────────────────────────────────────────────
  if (classes.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 mb-3">
          <CalendarDays className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">No classes found</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Go to Classes &amp; Sections and click "Seed 6–10 + A/B" to create Class 6–10 with their sections first.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          Class Routine Builder
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-10.5 sm:ml-13">
          Build the weekly timetable for Class 6–10, section by section.
        </p>
      </motion.div>

      {/* No periods yet — inline seed prompt, no page navigation needed */}
      {periods.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 shrink-0">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">No school periods set up yet</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                Set the daily time slots once before building any class's routine.
              </p>
            </div>
          </div>
          <button
            onClick={seedPeriods}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Seed Standard Schedule (10am–3:10pm)
          </button>
        </div>
      ) : (
        <>
          {/* Class tabs — 6, 7, 8, 9, 10 */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => pickClass(c.id)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer ${
                  c.id === activeClassId
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Section pills for the active class */}
          {activeClass && activeClass.sections.length > 0 ? (
            <div className="flex gap-2">
              {activeClass.sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSectionId(s.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    s.id === activeSectionId
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              {activeClass?.name} has no sections yet — add one from Classes &amp; Sections.
            </p>
          )}

          {/* Grid */}
          {activeSectionId && (
            <>
              {loadingGrid ? (
                <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
              ) : (
                <>
                  {availableSubjects.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-4 py-3 text-xs text-slate-500">
                      No subjects are attached to {activeClass?.name} - {activeSection?.name} yet — open this section's
                      drawer on the Classes page to add subjects and assign teachers first, then come back here to
                      schedule them.
                    </div>
                  )}

                  {/* Mobile day tabs */}
                  <div className="flex sm:hidden gap-2 overflow-x-auto pb-1 -mx-4 px-4">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => setActiveMobileDay(day)}
                        className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                          activeMobileDay === day
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                            : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {DAY_LABELS[day]}
                      </button>
                    ))}
                  </div>

                  {/* Mobile: card list */}
                  <div className="sm:hidden space-y-2">
                    {teachingPeriods.map((p) => {
                      const cell = grid[activeMobileDay]?.[p.id];
                      return (
                        <div
                          key={p.id}
                          className={`rounded-2xl border p-3.5 flex items-center gap-3 shadow-sm ${
                            cell
                              ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10"
                              : "border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center w-14 shrink-0 text-center">
                            <span className="text-[10px] font-bold text-slate-400">{p.startTime}</span>
                            <span className="text-[10px] text-slate-400">{p.endTime}</span>
                          </div>
                          <div className="w-px self-stretch bg-slate-200 dark:bg-slate-800" />
                          {cell ? (
                            <>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 truncate">{cell.subject}</p>
                                <p className="text-[11px] text-slate-500 truncate">{cell.teacherName}</p>
                              </div>
                              <button
                                onClick={() => clearSlot(cell.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/15 text-red-600 shrink-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setPicking({ day: activeMobileDay, periodId: p.id })}
                              disabled={availableSubjects.length === 0}
                              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Add subject
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop: full grid */}
                  <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md">
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
                              {DAY_FULL[day]}
                            </td>
                            {periods.map((p) => {
                              if (p.isBreak) {
                                return (
                                  <td key={p.id} className="px-3 py-2.5 text-center bg-amber-50/50 dark:bg-amber-500/5 text-[11px] text-amber-600 font-medium">
                                    <Coffee className="h-3 w-3 inline" />
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
                                      disabled={availableSubjects.length === 0}
                                      className="w-full rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-2 py-2.5 text-[11px] text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Subject picker modal */}
      <AnimatePresence>
        {picking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setPicking(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {DAY_FULL[picking.day]} — Select Subject
                </h3>
                <button onClick={() => setPicking(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}