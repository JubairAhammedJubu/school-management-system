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
  Settings2,
  Users,
} from "lucide-react";
import SectionDetailDrawer from "@/components/shared/SectionDetailDrawer";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

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
  sections: Section[];
};

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingClass, setSavingClass] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [className, setClassName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  const [search, setSearch] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);
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
    if (!className.trim()) return;
    setSavingClass(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/classes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: className.trim(),
          order: Number(className.replace(/\D/g, "")) || 0,
          sessionYear: new Date().getFullYear().toString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      toast.success("Class created");
      setClassName("");
      await load();
    } catch (err: any) {
      toast.error(err.message);
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
    if (!sectionName.trim()) return;
    setSavingSection(true);
    try {
      const res = await fetch(
        `${SERVER}/api/admin/classes/${selectedClassId}/sections`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: sectionName.trim() }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      toast.success("Section added");
      setSectionName("");
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingSection(false);
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

  const totalSections = classes.reduce((n, c) => n + (c.sections?.length || 0), 0);

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <BookOpen className="h-5 w-5" />
            </span>
            Classes & sections
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Click any section to see its roster, class teacher, and substitute.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setSetupOpen((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Setup
            {setupOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 max-w-md">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Classes</p>
          <p className="mt-1 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{classes.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sections</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalSections}</p>
        </div>
      </div>

      {/* Collapsible setup panel — forms tucked away, not the first thing you see */}
      <AnimatePresence>
        {setupOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-4 pt-1">
              <form
                onSubmit={createClass}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-md space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600">
                    <Plus className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Add class</h2>
                    <p className="text-[11px] text-slate-500">e.g. Class 6</p>
                  </div>
                </div>
                <input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Class name"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                />
                <button
                  type="submit"
                  disabled={savingClass}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer transition-colors"
                >
                  {savingClass ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Create class
                </button>
              </form>

              <form
                onSubmit={createSection}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-md space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600">
                    <Layers className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Add section</h2>
                    <p className="text-[11px] text-slate-500">Under a class</p>
                  </div>
                </div>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="Section A"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                />
                <button
                  type="submit"
                  disabled={savingSection}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-colors"
                >
                  {savingSection ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Create section
                </button>
              </form>
            </div>

            <button
              type="button"
              onClick={seed}
              disabled={seeding}
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Seed Class 6–10 + Section A/B
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search classes..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      {/* Class cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            {classes.length === 0 ? "No classes yet" : "No classes match your search"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {classes.length === 0
              ? "Open Setup above to create a class manually, or seed Class 6–10 with Section A & B in one click."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">{c.name}</p>
                  {c.sessionYear && (
                    <p className="text-[11px] text-slate-500 mt-0.5">Session {c.sessionYear}</p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-500">
                  <Layers className="h-3 w-3" />
                  {c.sections?.length || 0}
                </span>
              </div>

              {(c.sections || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No sections yet</p>
              ) : (
                <div className="space-y-2">
                  {c.sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setOpenSectionId(s.id)}
                      className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-left hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors group cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 text-[10px] font-bold">
                          {s.name.replace(/[^A-Za-z0-9]/g, "").slice(-1) || "S"}
                        </span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.name}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {s.capacity && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold">
                            <Users className="h-3 w-3" />
                            {s.capacity}
                          </span>
                        )}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {openSectionId && (
        <SectionDetailDrawer
          sectionId={openSectionId}
          onClose={() => setOpenSectionId(null)}
        />
      )}
    </div>
  );
}