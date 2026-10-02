"use client";
import { API_BASE_URL } from "@/lib/api-url";

import { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Plus,
  Loader2,
  Layers,
  Trash2,
  Sparkles,
  RefreshCw,
  Search,
  X,
  AlertTriangle,
  ChevronDown,
  Check,
  Tag,
  ShieldCheck,
} from "lucide-react";

const SERVER = API_BASE_URL;

type Group = { id: string; name: string };

type SubjectRow = {
  id: string;
  name: string;
  code: string;
  isCore: boolean;
  group: Group | null;
};

// Custom Select UI for Academic Groups
function CustomGroupSelect({
  value,
  onChange,
  options,
  placeholder = "Select Academic Group",
}: {
  value: string;
  onChange: (val: string) => void;
  options: Group[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedGroup = options.find((g) => g.id === value);

  return (
    <div className={`relative ${isOpen ? "z-[60]" : "z-10"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-medium flex items-center justify-between transition-all cursor-pointer ${
          isOpen
            ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs"
            : "border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white hover:border-indigo-400 dark:hover:border-indigo-500/60"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="truncate">
            {selectedGroup ? selectedGroup.name : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-[70] max-h-56 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-2xl p-1.5 space-y-1 custom-scrollbar"
          >
            {options.length === 0 ? (
              <div className="px-3 py-2.5 text-xs text-slate-400 dark:text-slate-500 italic">
                No academic groups found
              </div>
            ) : (
              options.map((g) => {
                const isSelected = g.id === value;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      onChange(g.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Layers className={`w-4 h-4 shrink-0 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                      <span className="truncate">{g.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<SubjectRow | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<"core" | "group">("core");
  const [groupId, setGroupId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [subjectsRes, groupsRes] = await Promise.all([
        fetch(`${SERVER}/api/admin/subjects`, { credentials: "include" }),
        fetch(`${SERVER}/api/admin/academic-groups`, {
          credentials: "include",
        }),
      ]);
      const subjectsData = await subjectsRes.json();
      const groupsData = await groupsRes.json();

      if (!subjectsRes.ok)
        throw new Error(subjectsData.error || "Failed to load subjects");
      if (!groupsRes.ok)
        throw new Error(groupsData.error || "Failed to load groups");

      setSubjects(subjectsData.subjects || []);
      setGroups(groupsData.groups || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setName("");
    setCode("");
    setType("core");
    setGroupId("");
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const createSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error("Subject name and code are required.");
      return;
    }
    if (type === "group" && !groupId) {
      toast.error("Select an academic group for group-specific subjects.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/subjects`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
          isCore: type === "core",
          groupId: type === "group" ? groupId : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create subject");

      toast.success(`Subject "${name.trim()}" created successfully!`);
      setShowAddModal(false);
      resetForm();
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to create subject");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemoveSubject = async () => {
    if (!deletingSubject) return;
    setDeleting(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/subjects/${deletingSubject.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove subject");

      toast.success(`Subject "${deletingSubject.name}" removed successfully!`);
      setDeletingSubject(null);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete subject");
    } finally {
      setDeleting(false);
    }
  };

  const filteredSubjects = subjects.filter((s) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      s.name.toLowerCase().includes(term) ||
      s.code.toLowerCase().includes(term) ||
      (s.group && s.group.name.toLowerCase().includes(term))
    );
  });

  const coreSubjects = filteredSubjects.filter((s) => s.isCore);
  const groupSubjects = filteredSubjects.filter((s) => !s.isCore);

  const totalSubjectsCount = subjects.length;
  const coreSubjectsCount = subjects.filter((s) => s.isCore).length;
  const groupSubjectsCount = subjects.filter((s) => !s.isCore).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Hero Banner with Indigo Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-indigo-50/30 to-white/90 dark:from-slate-900/90 dark:via-indigo-950/20 dark:to-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
      >
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            ACADEMIC CURRICULUM CATALOG
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
              <BookOpen className="h-5 w-5" />
            </span>
            Subject Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Configure institutional subjects, assign core requirements or stream-specific electives, and streamline class rosters.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0 self-start sm:self-center">
          <button
            onClick={load}
            disabled={loading}
            className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer shadow-sm backdrop-blur-xl disabled:opacity-50"
            title="Refresh Subjects"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-600 dark:text-indigo-400 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </div>
      </motion.div>

      {/* Stats Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Subjects */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.16em]">Total Subjects</p>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {String(totalSubjectsCount).padStart(2, "0")}
              </h3>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-3.5 h-3.5" /> Full catalog size
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <BookOpen className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Core Courses */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-violet-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.16em]">Core Subjects</p>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {String(coreSubjectsCount).padStart(2, "0")}
              </h3>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Compulsory for all
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-inner">
            <Tag className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Group Electives */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-sky-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.16em]">Group Electives</p>
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {String(groupSubjectsCount).padStart(2, "0")}
              </h3>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <Layers className="w-3.5 h-3.5" /> Department specific
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-inner">
            <Layers className="w-7 h-7" />
          </div>
        </motion.div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search subject name, code, or group..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subjects Lists Row */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Core Subjects Box */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 overflow-hidden shadow-xl backdrop-blur-xl flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                  Core Subjects
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Mandatory subjects taken by all enrolled students
                </p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                {coreSubjects.length} Core
              </span>
            </div>

            {coreSubjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                {searchTerm ? "No matching core subjects found" : "No core subjects created yet."}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {coreSubjects.map((s) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">
                        {s.name}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                        {s.code}
                      </span>
                    </div>

                    <button
                      onClick={() => setDeletingSubject(s)}
                      title="Delete Subject"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Group Subjects Box */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 overflow-hidden shadow-xl backdrop-blur-xl flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
                  Group Subjects
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Elective courses assigned to specific stream groups
                </p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/60">
                {groupSubjects.length} Electives
              </span>
            </div>

            {groupSubjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                {searchTerm ? "No matching group subjects found" : "No group-specific subjects created yet."}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {groupSubjects.map((s) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {s.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                          {s.code}
                        </span>
                      </div>
                      {s.group && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-md border border-violet-200/60 dark:border-violet-800/60">
                          <Layers className="w-3 h-3 text-violet-500" />
                          {s.group.name}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setDeletingSubject(s)}
                      title="Delete Subject"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 z-10 p-6 sm:p-7 space-y-5 custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      Add New Subject
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configure details for the subject catalog
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => !saving && setShowAddModal(false)}
                  disabled={saving}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={createSubject} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mathematics"
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      required
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. MATH-101"
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      required
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Curriculum Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setType("core")}
                      className={`rounded-2xl px-4 py-3 text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        type === "core"
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                          : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Every Student (Core)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setType("group")}
                      className={`rounded-2xl px-4 py-3 text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        type === "group"
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                          : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Layers className="w-4 h-4 shrink-0" />
                      <span>Specific Group Only</span>
                    </button>
                  </div>
                </div>

                {type === "group" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Target Academic Group *
                    </label>
                    <CustomGroupSelect
                      value={groupId}
                      onChange={setGroupId}
                      options={groups}
                      placeholder="Select Academic Group"
                    />
                    {groups.length === 0 && (
                      <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
                        No groups found yet — add Academic Groups (Science, Business Studies, Humanities) first.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving Subject...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Save Subject</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeletingSubject(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 z-10 p-6 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    Delete Subject?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This action will remove the subject from catalog
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {deletingSubject.name} <span className="text-slate-400 font-normal">({deletingSubject.code})</span>
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Type: {deletingSubject.isCore ? "Core Requirement" : `Group (${deletingSubject.group?.name || "Elective"})`}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Are you sure you want to delete this subject? It will be removed from future section assignments.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeletingSubject(null)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={confirmRemoveSubject}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {deleting ? (
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
    </div>
  );
}

