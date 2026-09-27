"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Loader2,
  Plus,
  Trash2,
  X,
  RefreshCw,
  Layers,
  BookOpen,
  Clock3,
  AlertCircle,
  UserX,
  Sparkles,
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

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
const FALLBACK_GROUPS = ["Science", "Business Studies", "Humanities"];

type Section = { id: string; name: string };
type SchoolClass = {
  id: string;
  name: string;
  order?: number;
  hasGroups?: boolean;
  groups?: string[];
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
type Cell = {
  id: string;
  classSubjectId: string;
  subject: string;
  teacherName: string;
  room?: string | null;
};
type AvailableSubject = {
  classSubjectId: string;
  name: string;
  teacherName: string;
};

export default function AdminRoutinePage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loadingShell, setLoadingShell] = useState(true);

  const [activeClassId, setActiveClassId] = useState("");
  const [activeSectionId, setActiveSectionId] = useState("");
  const [activeGroup, setActiveGroup] = useState("Science");

  const [grid, setGrid] = useState<Record<string, Record<string, Cell>>>({});
  const [availableSubjects, setAvailableSubjects] = useState<AvailableSubject[]>(
    [],
  );
  const [apiGroups, setApiGroups] = useState<string[]>([]);
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState<{
    day: string;
    periodId: string;
  } | null>(null);

  const activeClass = classes.find((c) => c.id === activeClassId);
  const activeSection = activeClass?.sections.find(
    (s) => s.id === activeSectionId,
  );
  const hasGroups = Boolean(activeClass?.hasGroups);
  const groups =
    apiGroups.length > 0
      ? apiGroups
      : activeClass?.groups?.length
        ? activeClass.groups
        : FALLBACK_GROUPS;

  const teachingPeriods = useMemo(
    () =>
      [...periods]
        .filter((p) => !p.isBreak)
        .sort((a, b) => a.periodNumber - b.periodNumber),
    [periods],
  );

  // Only subjects with a real teacher assigned can actually be scheduled.
  const assignableSubjects = useMemo(
    () => availableSubjects.filter((s) => s.teacherName && s.teacherName !== "Unassigned"),
    [availableSubjects],
  );
  const unassignedSubjectCount = availableSubjects.length - assignableSubjects.length;

  const filledCount = useMemo(() => {
    let n = 0;
    for (const day of DAYS) {
      for (const p of teachingPeriods) {
        if (grid[day]?.[p.id]) n += 1;
      }
    }
    return n;
  }, [grid, teachingPeriods]);

  const loadShell = useCallback(async () => {
    setLoadingShell(true);
    try {
      const [cRes, pRes] = await Promise.all([
        fetch(`${SERVER}/api/admin/classes`, { credentials: "include" }),
        fetch(`${SERVER}/api/admin/periods`, { credentials: "include" }),
      ]);
      const cData = await cRes.json();
      const pData = await pRes.json();
      if (!cRes.ok) throw new Error(cData.error || "Failed to load classes");
      if (!pRes.ok) throw new Error(pData.error || "Failed to load periods");

      const list: SchoolClass[] = (cData.classes || []).sort(
        (a: SchoolClass, b: SchoolClass) => (a.order || 0) - (b.order || 0),
      );
      setClasses(list);
      setPeriods(pData.periods || []);

      if (list.length) {
        setActiveClassId((prev) => prev || list[0].id);
        setActiveSectionId((prev) => prev || list[0].sections?.[0]?.id || "");
        if (list[0].hasGroups) {
          setActiveGroup(list[0].groups?.[0] || FALLBACK_GROUPS[0]);
        }
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoadingShell(false);
    }
  }, []);

  useEffect(() => {
    loadShell();
  }, [loadShell]);

  const loadGrid = useCallback(async () => {
    if (!activeSectionId) return;
    if (hasGroups && !activeGroup) return;

    setLoadingGrid(true);
    try {
      const q =
        hasGroups && activeGroup
          ? `?group=${encodeURIComponent(activeGroup)}`
          : "";
      const res = await fetch(
        `${SERVER}/api/admin/routine/sections/${activeSectionId}${q}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load routine");
      setGrid(data.grid || {});
      setAvailableSubjects(data.availableSubjects || []);
      if (data.periods?.length) setPeriods(data.periods);
      if (data.class?.groups?.length) setApiGroups(data.class.groups);
    } catch (e: any) {
      toast.error(e.message);
      setGrid({});
      setAvailableSubjects([]);
    } finally {
      setLoadingGrid(false);
    }
  }, [activeSectionId, activeGroup, hasGroups]);

  useEffect(() => {
    loadGrid();
  }, [loadGrid]);

  const pickClass = (id: string) => {
    setActiveClassId(id);
    const cls = classes.find((c) => c.id === id);
    setActiveSectionId(cls?.sections?.[0]?.id || "");
    setApiGroups(cls?.groups || []);
    if (cls?.hasGroups) {
      setActiveGroup(cls.groups?.[0] || FALLBACK_GROUPS[0]);
    }
    setGrid({});
  };

  // Called by the empty-cell "+ Add" button — never silently does nothing now.
  const handleAddClick = (day: string, periodId: string) => {
    if (availableSubjects.length === 0) {
      toast.error(
        "No subjects are linked to this section yet — add subjects from Classes → section drawer first.",
        { toastId: "routine-no-subjects" },
      );
      return;
    }
    if (assignableSubjects.length === 0) {
      toast.error(
        "Every subject here still needs a teacher assigned before it can go on the routine — assign one from Classes → section drawer.",
        { toastId: "routine-no-teachers" },
      );
      return;
    }
    setPicking({ day, periodId });
  };

  const setSlot = async (classSubjectId: string) => {
    if (!picking || !activeSectionId || saving) return;
    setSaving(true);
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
            ...(hasGroups ? { group: activeGroup } : {}),
          }),
        },
      );
      const data = await res.json();
      if (res.status === 409) {
        toast.error(data.error || "Teacher already has a class at this time");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Failed to set slot");
      toast.success("Slot saved");
      setPicking(null);
      await loadGrid();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const clearSlot = async (slotId: string) => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/routine/slots/${slotId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to clear");
      toast.success("Cleared");
      await loadGrid();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Skeleton ───────────────────────────────────────── */
  if (loadingShell) {
    return (
      <div className="space-y-6 pb-12">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-8 shadow-xl backdrop-blur-xl animate-pulse space-y-4">
          <div className="h-6 w-44 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl animate-pulse"
            >
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-3 h-7 w-12 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl space-y-4 animate-pulse">
          <div className="h-10 w-full rounded-2xl bg-slate-100 dark:bg-slate-900" />
          <div className="h-72 w-full rounded-2xl bg-slate-100 dark:bg-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-indigo-50/30 to-white/90 dark:from-slate-950/90 dark:via-indigo-950/30 dark:to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
      >
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              ROUTINE SCHEDULER HUB
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Class Routine &amp; Timetable
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Design weekly routine grids per class and section, assign faculty subjects, and prevent schedule conflicts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                loadShell();
                loadGrid();
              }}
              disabled={loadingGrid}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loadingGrid ? "animate-spin" : ""}`} />
              <span>Refresh Routine</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 4 Metric Stats Cards */}
      {classes.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Scheduled Slots */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Scheduled Cells</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {loadingGrid ? <span className="inline-block h-7 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /> : filledCount}
              </h3>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Grid assignments</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Periods */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Teaching Slots</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {teachingPeriods.length}
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Bell periods</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <Clock3 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Assignable Subjects */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Assignable Subjects</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {assignableSubjects.length}
              </h3>
              <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">Teacher ready</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Group Stream */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Active Stream</p>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 truncate max-w-36">
                {hasGroups ? activeGroup : "General"}
              </h3>
              <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">{activeClass?.name || "Class"}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {classes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 px-6 py-14 text-center bg-white dark:bg-slate-950">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            No classes yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Seed classes from Classes &amp; sections first.
          </p>
        </div>
      )}

      {periods.length === 0 && classes.length > 0 && (
        <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40 px-4 py-3 text-sm font-semibold text-amber-800 dark:text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            No periods configured — open Periods and seed/create a schedule
            first.
          </span>
        </div>
      )}

      {classes.length > 0 && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 shadow-xl backdrop-blur-xl overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 sm:p-5 space-y-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Class
              </p>
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
                {classes.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickClass(c.id)}
                    className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                      c.id === activeClassId
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800"
                    }`}
                  >
                    {c.name}
                    {c.hasGroups && (
                      <span
                        className={`ml-1.5 text-[9px] font-bold ${
                          c.id === activeClassId
                            ? "text-indigo-200"
                            : "text-indigo-500"
                        }`}
                      >
                        · streams
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {activeClass && activeClass.sections.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <Layers className="h-3 w-3" /> Section
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeClass.sections.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSectionId(s.id)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer transition-colors ${
                        s.id === activeSectionId
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasGroups && (
              <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-br from-indigo-50/90 to-white dark:from-indigo-950/30 dark:to-slate-950 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Stream — separate routine each
                </p>
                <div className="flex flex-wrap gap-2">
                  {groups.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setActiveGroup(g)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer transition-all ${
                        activeGroup === g
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSection && (
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <ContextChip icon={BookOpen} label={activeClass?.name || "—"} />
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <ContextChip icon={Layers} label={activeSection.name} />
                {hasGroups && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <ContextChip icon={Layers} label={activeGroup} accent />
                  </>
                )}
                <ContextChip
                  icon={Clock3}
                  label={`${teachingPeriods.length} periods`}
                />
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="p-3 sm:p-4 relative">
            {!activeSectionId ? (
              <p className="text-center text-xs text-slate-500 py-12">
                Select a section to edit the timetable
              </p>
            ) : periods.length === 0 ? null : loadingGrid ? (
              <GridSkeleton />
            ) : (
              <>
                {availableSubjects.length === 0 ? (
                  <div className="mb-3 flex items-start gap-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                    <span>
                      No subjects linked to this section
                      {hasGroups ? ` · ${activeGroup}` : ""}. Add subjects from
                      Classes → section drawer first.
                    </span>
                  </div>
                ) : unassignedSubjectCount > 0 ? (
                  <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 px-4 py-3 text-xs text-amber-800 dark:text-amber-200">
                    <UserX className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>
                      {unassignedSubjectCount} subject
                      {unassignedSubjectCount > 1 ? "s" : ""} in this section
                      {hasGroups ? ` · ${activeGroup}` : ""} still need a
                      teacher assigned before they can go on the routine —
                      assign one from Classes → section drawer.
                    </span>
                  </div>
                ) : null}

                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                  <table className="w-full min-w-[720px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
                        <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-900 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 min-w-[100px]">
                          Period
                        </th>
                        {DAYS.map((d) => (
                          <th
                            key={d}
                            className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 min-w-[120px]"
                          >
                            <span className="sm:hidden">{DAY_SHORT[d]}</span>
                            <span className="hidden sm:inline">
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
                          <td className="sticky left-0 z-10 bg-white dark:bg-slate-950 px-3 py-2.5 align-top">
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
                                    onClick={() => handleAddClick(day, p.id)}
                                    disabled={saving}
                                    className="flex w-full min-h-[56px] items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10 disabled:opacity-40 cursor-pointer transition-colors"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add
                                  </button>
                                </td>
                              );
                            }
                            return (
                              <td key={day} className="px-1.5 py-1.5 align-top">
                                <div className="relative group min-h-[56px] rounded-xl border border-indigo-100 bg-indigo-50/90 dark:border-indigo-900/50 dark:bg-indigo-950/30 px-2.5 py-2 shadow-sm">
                                  <p className="text-[11px] font-extrabold text-slate-900 dark:text-white pr-5 leading-tight">
                                    {cell.subject}
                                  </p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">
                                    {cell.teacherName}
                                  </p>
                                  {cell.room && (
                                    <p className="text-[10px] text-slate-400">
                                      Room {cell.room}
                                    </p>
                                  )}
                                  <button
                                    type="button"
                                    title="Clear"
                                    disabled={saving}
                                    onClick={() => clearSlot(cell.id)}
                                    className="absolute top-1.5 right-1.5 rounded-md p-0.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-all disabled:opacity-30"
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Subject picker */}
      <AnimatePresence>
        {picking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4"
            onClick={() => !saving && setPicking(null)}
          >
            <motion.div
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {DAY_FULL[picking.day]}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {activeClass?.name} · {activeSection?.name}
                    {hasGroups ? ` · ${activeGroup}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setPicking(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select subject
              </p>
              <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
                {availableSubjects.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No subjects available
                  </p>
                ) : (
                  availableSubjects.map((s) => {
                    const noTeacher = !s.teacherName || s.teacherName === "Unassigned";
                    return (
                      <button
                        key={s.classSubjectId}
                        type="button"
                        disabled={saving || noTeacher}
                        onClick={() => setSlot(s.classSubjectId)}
                        title={noTeacher ? "Assign a teacher to this subject first" : undefined}
                        className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
                          noTeacher
                            ? "border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/30 cursor-not-allowed opacity-70"
                            : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer disabled:opacity-50"
                        }`}
                      >
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {s.name}
                        </span>
                        {noTeacher ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 shrink-0">
                            <UserX className="h-3 w-3" />
                            No teacher
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400 shrink-0">
                            {s.teacherName}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
              {saving && (
                <div className="mt-3 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

function ContextChip({
  icon: Icon,
  label,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  accent?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${
        accent
          ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
          : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
      }`}
    >
      <Icon className="h-3 w-3 opacity-70" />
      {label}
    </span>
  );
}

function GridSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-10 w-full rounded-xl skeleton-shimmer-subtle" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-2">
          <div className="h-14 w-24 shrink-0 rounded-lg skeleton-shimmer" />
          {Array.from({ length: 5 }).map((_, j) => (
            <div
              key={j}
              className="h-14 flex-1 rounded-xl skeleton-shimmer-subtle"
            />
          ))}
        </div>
      ))}
    </div>
  );
}