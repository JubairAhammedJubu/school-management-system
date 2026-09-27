"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Plus,
  Loader2,
  Layers,
  RefreshCw,
  Sparkles,
  Search,
  ChevronRight,
  ChevronDown,
  Check,
  Users,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import SectionDetailDrawer from "@/components/shared/SectionDetailDrawer";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type Section = {
  id: string;
  name: string;
  capacity?: number | null;
};

type SchoolClass = {
  id: string;
  name: string;
  order?: number;
  sessionYear?: string | null;
  hasGroups?: boolean;
  groups?: string[];
  sections: Section[];
};

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingClass, setSavingClass] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Modal State
  const [createModalType, setCreateModalType] = useState<"class" | "section" | null>(null);

  // Form State
  const [className, setClassName] = useState("");
  const [classOrder, setClassOrder] = useState("");
  const [sessionYear, setSessionYear] = useState(new Date().getFullYear().toString());

  const [sectionName, setSectionName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [sectionCapacity, setSectionCapacity] = useState("30");
  const [isClassSelectOpen, setIsClassSelectOpen] = useState(false);

  // Edit & Delete Modal States
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);

  const [editingSection, setEditingSection] = useState<{ section: Section; classId: string } | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<{ section: Section; className: string } | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/classes`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load classes");
      setClasses(data.classes || []);
      if (!selectedClassId && data.classes?.[0]?.id) {
        setSelectedClassId(data.classes[0].id);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }, [selectedClassId]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      toast.error("Class name is required");
      return;
    }
    setSavingClass(true);
    try {
      const orderNum = classOrder
        ? Number(classOrder)
        : Number(className.replace(/\D/g, "")) || 0;
      const res = await fetch(`${SERVER}/api/admin/classes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: className.trim(),
          order: orderNum,
          sessionYear: sessionYear.trim() || new Date().getFullYear().toString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      toast.success("Class created");
      setClassName("");
      setClassOrder("");
      setCreateModalType(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to create class");
    } finally {
      setSavingClass(false);
    }
  };

  const createSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) {
      toast.error("Select a class first");
      return;
    }
    if (!sectionName.trim()) {
      toast.error("Section name is required");
      return;
    }
    const cap = Math.min(30, Math.max(1, Number(sectionCapacity) || 30));
    setSavingSection(true);
    try {
      const res = await fetch(
        `${SERVER}/api/admin/classes/${selectedClassId}/sections`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: sectionName.trim(),
            capacity: cap,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create section failed");
      toast.success("Section added");
      setSectionName("");
      setSectionCapacity("30");
      setCreateModalType(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to create section");
    } finally {
      setSavingSection(false);
    }
  };

  // ── Class Edit & Delete Handlers ─────────────────────────────────────
  const onUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !editingClass.name.trim()) {
      toast.error("Class name is required");
      return;
    }
    setIsUpdating(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/classes/${editingClass.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingClass.name.trim(),
          order: Number(editingClass.order) || 0,
          sessionYear: editingClass.sessionYear || new Date().getFullYear().toString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update class failed");
      toast.success("Class updated successfully");
      setEditingClass(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to update class");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeleteClass = async () => {
    if (!classToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/classes/${classToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete class failed");
      toast.success("Class deleted successfully");
      setClassToDelete(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete class");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Section Edit & Delete Handlers ───────────────────────────────────
  const onUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !editingSection.section.name.trim()) {
      toast.error("Section name is required");
      return;
    }
    const cap = Math.min(30, Math.max(1, Number(editingSection.section.capacity) || 30));
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${SERVER}/api/admin/classes/sections/${editingSection.section.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingSection.section.name.trim(),
            capacity: cap,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update section failed");
      toast.success("Section updated successfully");
      setEditingSection(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to update section");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${SERVER}/api/admin/classes/sections/${sectionToDelete.section.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete section failed");
      toast.success("Section deleted successfully");
      setSectionToDelete(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete section");
    } finally {
      setIsDeleting(false);
    }
  };

  const seed = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/classes/seed`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      toast.success("Class 6–10 with Section A & B ready");
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSeeding(false);
    }
  };

  const totalSections = classes.reduce(
    (n, c) => n + (c.sections?.length || 0),
    0,
  );

  const totalCapacity = classes.reduce(
    (acc, c) =>
      acc +
      (c.sections || []).reduce(
        (secAcc, s) => secAcc + (s.capacity || 0),
        0,
      ),
    0,
  );

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

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
              ACADEMIC CLASS DIRECTORY
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Classes &amp; Sections Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Configure grade levels (Class 6–10), assign sections, stream groups (Science, Business, Humanities), and inspect section rosters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setCreateModalType("class")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              <span>+ Add Class</span>
            </button>

            <button
              type="button"
              onClick={() => setCreateModalType("section")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Layers className="w-4 h-4" />
              <span>+ Add Section</span>
            </button>

            <button
              type="button"
              onClick={seed}
              disabled={seeding}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-xs sm:text-sm transition-all disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Seed 6–10</span>
            </button>

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all disabled:opacity-60 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 4 Metrics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Classes */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Classes</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {loading ? <span className="inline-block h-7 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /> : classes.length}
            </h3>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Grade 6 to 10</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Sections */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Active Sections</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {loading ? <span className="inline-block h-7 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /> : totalSections}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Section A &amp; B</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Academic Streams */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Group Streams</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              3 Streams
            </h3>
            <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">Sci, Bus, Hum</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Total Student Capacity */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Capacity</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {loading ? <span className="inline-block h-7 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /> : totalCapacity > 0 ? totalCapacity : "350+"}
            </h3>
            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">Max enrollment</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search classes..."
          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-6 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-4 w-36 rounded bg-slate-100 dark:bg-slate-800/60" />
              <div className="space-y-2 pt-2">
                <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800/80" />
                <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800/80" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 px-6 py-16 text-center shadow-xl backdrop-blur-xl">
          <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">No classes found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try creating a class or seeding default Class 6–10 setup.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
              className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {c.name}
                  </p>
                  {c.sessionYear && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Session {c.sessionYear}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingClass(c)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                    title={`Edit ${c.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassToDelete(c)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title={`Delete ${c.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClassId(c.id);
                      setCreateModalType("section");
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                    title={`Add section to ${c.name}`}
                  >
                    <Plus className="h-3 w-3" />
                    <span>Section</span>
                  </button>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-500">
                    <Layers className="h-3 w-3" />
                    {c.sections?.length || 0}
                  </span>
                </div>
              </div>

              {/* Groups — Class 9 & 10 */}
              {c.hasGroups && (c.groups?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.groups!.map((g) => (
                    <span
                      key={g}
                      className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {(c.sections || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No sections yet</p>
              ) : (
                <div className="space-y-2">
                  {c.sections.map((s) => (
                    <div
                      key={s.id}
                      className="group/sec flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenSectionId(s.id)}
                        className="flex-1 flex items-center justify-between text-left cursor-pointer mr-2"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 text-[10px] font-bold">
                            {s.name.replace(/[^A-Za-z0-9]/g, "").slice(-1) ||
                              "S"}
                          </span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {s.name}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400 group-hover/sec:text-indigo-600 transition-colors">
                          {s.capacity != null && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold">
                              <Users className="h-3 w-3" />
                              {s.capacity}
                            </span>
                          )}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </button>

                      <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover/sec:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingSection({ section: s, classId: c.id })
                          }
                          className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit section"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSectionToDelete({
                              section: s,
                              className: c.name,
                            })
                          }
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete section"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Class & Section Modal */}
      <AnimatePresence>
        {createModalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!savingClass && !savingSection) setCreateModalType(null);
              }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 z-10 p-6 sm:p-7 space-y-6"
            >
              {/* Modal Top Nav Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCreateModalType("class")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      createModalType === "class"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Add Class</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateModalType("section")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      createModalType === "section"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={savingClass || savingSection}
                  onClick={() => setCreateModalType(null)}
                  className="rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tab 1: Create Class Form */}
              {createModalType === "class" && (
                <form onSubmit={createClass} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Create Academic Class
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Add a new grade level (e.g. Class 6, Class 10) to the school directory.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <label className="block space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Class Name *
                      </span>
                      <input
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="e.g. Class 10 or Grade 9"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white"
                        required
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Display Order
                        </span>
                        <input
                          type="number"
                          value={classOrder}
                          onChange={(e) => setClassOrder(e.target.value)}
                          placeholder="Auto (e.g. 10)"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white"
                        />
                      </label>

                      <label className="block space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Session Year
                        </span>
                        <input
                          value={sessionYear}
                          onChange={(e) => setSessionYear(e.target.value)}
                          placeholder="2026"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white"
                        />
                      </label>
                    </div>

                    <div className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-3 text-xs text-indigo-700 dark:text-indigo-300 flex items-start gap-2.5">
                      <Sparkles className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                      <span>Class 9 and 10 automatically inherit standard stream groups (Science, Business Studies, Humanities).</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      disabled={savingClass}
                      onClick={() => setCreateModalType(null)}
                      className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingClass}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {savingClass ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span>Create Class</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 2: Create Section Form */}
              {createModalType === "section" && (
                <form onSubmit={createSection} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      Create Class Section
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Add a new section (e.g. Section A, Section B) under a target class.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Custom Target Class Select UI */}
                    <div className="relative space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Target Class *
                      </span>

                      <button
                        type="button"
                        onClick={() => setIsClassSelectOpen((v) => !v)}
                        className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white transition-all cursor-pointer shadow-xs"
                      >
                        {(() => {
                          const targetObj = classes.find(
                            (c) => c.id === selectedClassId,
                          );
                          if (targetObj) {
                            return (
                              <span className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                  <BookOpen className="h-3 w-3" />
                                </span>
                                <span className="font-extrabold text-slate-900 dark:text-white">
                                  {targetObj.name}
                                </span>
                                {targetObj.sessionYear && (
                                  <span className="text-xs text-slate-400 font-medium">
                                    ({targetObj.sessionYear})
                                  </span>
                                )}
                              </span>
                            );
                          }
                          return (
                            <span className="text-slate-400 font-medium">
                              Select a class...
                            </span>
                          );
                        })()}
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                            isClassSelectOpen
                              ? "rotate-180 text-emerald-600 dark:text-emerald-400"
                              : ""
                          }`}
                        />
                      </button>

                      {/* Custom Dropdown Options List */}
                      <AnimatePresence>
                        {isClassSelectOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setIsClassSelectOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -6, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -6, scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-52 overflow-y-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl space-y-0.5"
                            >
                              {classes.length === 0 ? (
                                <p className="px-3 py-2.5 text-xs text-slate-400 text-center">
                                  No classes available.
                                </p>
                              ) : (
                                classes.map((c) => {
                                  const isSelected = c.id === selectedClassId;
                                  return (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedClassId(c.id);
                                        setIsClassSelectOpen(false);
                                      }}
                                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                                        isSelected
                                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                      }`}
                                    >
                                      <span className="flex items-center gap-2">
                                        <BookOpen
                                          className={`h-3.5 w-3.5 ${
                                            isSelected
                                              ? "text-emerald-600 dark:text-emerald-400"
                                              : "text-slate-400"
                                          }`}
                                        />
                                        <span>{c.name}</span>
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                          {c.sections?.length || 0} sections
                                        </span>
                                        {isSelected && (
                                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        )}
                                      </div>
                                    </button>
                                  );
                                })
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Section Name *
                        </span>
                        <input
                          value={sectionName}
                          onChange={(e) => setSectionName(e.target.value)}
                          placeholder="e.g. Section A or Rose"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
                          required
                        />
                      </label>

                      <label className="block space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Max Capacity (Max 30)
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={sectionCapacity}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              setSectionCapacity("");
                              return;
                            }
                            const num = Number(val);
                            if (num > 30) {
                              setSectionCapacity("30");
                              toast.info("Maximum capacity per section is capped at 30.");
                            } else {
                              setSectionCapacity(val);
                            }
                          }}
                          placeholder="30"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      disabled={savingSection}
                      onClick={() => setCreateModalType(null)}
                      className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingSection}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {savingSection ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span>Create Section</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Class Modal */}
      <AnimatePresence>
        {editingClass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpdating && setEditingClass(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 z-10 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                    <Pencil className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      Edit Academic Class
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Update grade level title or order
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setEditingClass(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={onUpdateClass} className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Class Name *
                  </span>
                  <input
                    value={editingClass.name}
                    onChange={(e) =>
                      setEditingClass({ ...editingClass, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white"
                    required
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Display Order
                    </span>
                    <input
                      type="number"
                      value={editingClass.order ?? ""}
                      onChange={(e) =>
                        setEditingClass({
                          ...editingClass,
                          order: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white"
                    />
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Session Year
                    </span>
                    <input
                      value={editingClass.sessionYear ?? ""}
                      onChange={(e) =>
                        setEditingClass({
                          ...editingClass,
                          sessionYear: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 dark:text-white"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => setEditingClass(null)}
                    className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Class Confirmation Modal */}
      <AnimatePresence>
        {classToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setClassToDelete(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 z-10 p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 shrink-0">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      Delete Class {classToDelete.name}?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Remove grade level from directory
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setClassToDelete(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {classToDelete.name}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Session: {classToDelete.sessionYear || "Standard"} · {classToDelete.sections?.length || 0} active sections
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900 dark:text-slate-100">{classToDelete.name}</strong>? This action will remove all nested sections and assignments associated with this class.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setClassToDelete(null)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteClass}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Section Modal */}
      <AnimatePresence>
        {editingSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpdating && setEditingSection(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 z-10 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 shrink-0">
                    <Pencil className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      Edit Section
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Update section name or capacity limit
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setEditingSection(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={onUpdateSection} className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Section Name *
                  </span>
                  <input
                    value={editingSection.section.name}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        section: { ...editingSection.section, name: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
                    required
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Max Student Capacity (Max 30)
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={editingSection.section.capacity ?? 30}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = Number(val);
                      if (num > 30) {
                        toast.info("Maximum capacity per section is capped at 30.");
                        setEditingSection({
                          ...editingSection,
                          section: { ...editingSection.section, capacity: 30 },
                        });
                      } else {
                        setEditingSection({
                          ...editingSection,
                          section: { ...editingSection.section, capacity: num },
                        });
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
                  />
                </label>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => setEditingSection(null)}
                    className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Save Section</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Section Confirmation Modal */}
      <AnimatePresence>
        {sectionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setSectionToDelete(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 z-10 p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 shrink-0">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      Delete Section?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Remove section from class roster
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setSectionToDelete(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {sectionToDelete.section.name} <span className="font-normal text-slate-400">({sectionToDelete.className})</span>
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Capacity: {sectionToDelete.section.capacity ?? 30} students
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900 dark:text-slate-100">{sectionToDelete.section.name}</strong> from <strong className="text-slate-900 dark:text-slate-100">{sectionToDelete.className}</strong>?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setSectionToDelete(null)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteSection}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {openSectionId && (
        <SectionDetailDrawer
          sectionId={openSectionId}
          onClose={() => setOpenSectionId(null)}
        />
      )}
    </div>
  );
}