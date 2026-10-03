"use client";
import { API_BASE_URL } from "@/lib/api-url";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  X,
  Users,
  UserCheck,
  UserPlus,
  Loader2,
  BookOpenIcon,
  ChevronDown,
  Check,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";

type Teacher = { id: string; name: string; email: string };
type Student = { id: string; name: string; email: string; roll: number };

type SectionDetail = {
  section: { id: string; name: string; capacity: number | null };
  class: { id: string; name: string };
  totalStudents: number;
  students: Student[];
  teacher: Teacher | null;
  substituteTeacher: Teacher | null;
};

type Props = {
  sectionId: string;
  onClose: () => void;
};
type SubjectRow = {
  id: string;
  subject: { id: string; name: string; code: string; group: string | null };
  teacher: Teacher | null;
  substituteTeacher: Teacher | null;
};

type SelectOption = {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
};

function NiceSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon: Icon,
  disabled = false,
  accentColor = "indigo",
}: {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: any;
  disabled?: boolean;
  accentColor?: "indigo" | "amber" | "emerald" | "blue";
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  const colorStyles = {
    indigo: {
      border: "focus:ring-indigo-500/30",
      activeBg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    amber: {
      border: "focus:ring-amber-500/30",
      activeBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    emerald: {
      border: "focus:ring-emerald-500/30",
      activeBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    blue: {
      border: "focus:ring-blue-500/30",
      activeBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  }[accentColor];

  return (
    <div className="relative flex-1 min-w-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 ${colorStyles.border}`}
      >
        <span className="flex items-center gap-2 truncate pr-2">
          {Icon && (
            <Icon className={`h-4 w-4 shrink-0 ${selected && selected.value ? colorStyles.iconColor : "text-slate-400"}`} />
          )}
          {selected && selected.value ? (
            <span className="truncate flex items-center gap-1.5">
              <span>{selected.label}</span>
              {selected.sublabel && (
                <span className="text-[11px] font-normal text-slate-400 truncate">
                  ({selected.sublabel})
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-400 font-medium truncate">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            open ? `rotate-180 ${colorStyles.iconColor}` : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-1.5 z-40 max-h-52 overflow-y-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl space-y-0.5"
            >
              {options.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-400 text-center">
                  No options available
                </p>
              ) : (
                options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value || "empty"}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? colorStyles.activeBg
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {Icon && (
                          <Icon
                            className={`h-3.5 w-3.5 shrink-0 ${
                              isSelected ? colorStyles.iconColor : "text-slate-400"
                            }`}
                          />
                        )}
                        <span className="truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="text-[10px] font-normal text-slate-400 truncate">
                            ({opt.sublabel})
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {opt.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <Check className={`h-3.5 w-3.5 ${colorStyles.iconColor}`} />
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
  );
}

function SectionDetailDrawerSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Class Teacher Card Skeleton */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-28 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-2.5 w-36 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          </div>
        </div>
        <div className="h-10 w-full rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="flex items-center gap-2">
          <div className="h-10 flex-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-10 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Substitute Teacher Card Skeleton */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-2.5 w-40 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 flex-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-10 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Subjects & Faculty Card Skeleton */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-36 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-2.5 w-48 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-24 w-full rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div className="h-24 w-full rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
      </div>

      {/* Student Roster Skeleton */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-28 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-9 w-full rounded-xl bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60"
            >
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-2.5 w-24 rounded bg-slate-200/70 dark:bg-slate-800/70" />
              </div>
              <div className="h-5 w-12 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SERVER = API_BASE_URL || "";

export default function SectionDetailDrawer({ sectionId, onClose }: Props) {
  const [detail, setDetail] = useState<SectionDetail | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [allSubjects, setAllSubjects] = useState<
    {
      id: string;
      name: string;
      code: string;
      group: { id: string; name: string } | null;
    }[]
  >([]);
  const [addSubjectId, setAddSubjectId] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [savingSubstitute, setSavingSubstitute] = useState(false);
  const [teacherPick, setTeacherPick] = useState("");
  const [substitutePick, setSubstitutePick] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [detailRes, teachersRes, subjectsRes, catalogRes] = await Promise.all([
        fetch(`${SERVER}/api/admin/classes/sections/${sectionId}`, {
          credentials: "include",
        }),
        fetch(`${SERVER}/api/admin/teachers`, { credentials: "include" }),
        fetch(`${SERVER}/api/admin/classes/sections/${sectionId}/subjects`, {
          credentials: "include",
        }),
        fetch(`${SERVER}/api/admin/subjects`, { credentials: "include" }),
      ]);
      const detailData = await detailRes.json();
      const teachersData = await teachersRes.json();
      const subjectsData = await subjectsRes.json();
      const catalogData = catalogRes.ok ? await catalogRes.json() : null;

      if (!detailRes.ok)
        throw new Error(detailData.error || "Failed to load section");
      if (!teachersRes.ok)
        throw new Error(teachersData.error || "Failed to load teachers");
      if (!subjectsRes.ok)
        throw new Error(subjectsData.error || "Failed to load subjects");

      setDetail(detailData);
      setTeachers(teachersData.teachers || []);
      setTeacherPick(detailData.teacher?.id ?? "");
      setSubstitutePick(detailData.substituteTeacher?.id ?? "");
      setSubjects(subjectsData.subjects || []);
      if (catalogRes.ok) setAllSubjects(catalogData.subjects || []);
    } catch (err: any) {
      toast.error(err.message || "Could not load section details");
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    load();
  }, [load]);

  const assignTeacher = async () => {
    setSavingTeacher(true);
    try {
      const res = await fetch(
        `${SERVER}/api/admin/classes/sections/${sectionId}/teacher`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teacherId: teacherPick || null }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign teacher");
      toast.success("Class teacher updated");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingTeacher(false);
    }
  };

  const assignSubstitute = async (teacherId: string | null) => {
    setSavingSubstitute(true);
    try {
      const res = await fetch(
        `${SERVER}/api/admin/classes/sections/${sectionId}/substitute`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teacherId }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update substitute");
      toast.success(teacherId ? "Substitute assigned" : "Substitute removed");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingSubstitute(false);
    }
  };

  const addSubject = async () => {
    if (!addSubjectId) return;
    try {
      const res = await fetch(
        `${SERVER}/api/admin/classes/sections/${sectionId}/subjects`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectId: addSubjectId }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add subject");
      toast.success("Subject added");
      setAddSubjectId("");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const removeSubject = async (classSubjectId: string) => {
    try {
      const res = await fetch(
        `${SERVER}/api/admin/classes/subjects/${classSubjectId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove subject");
      toast.success("Subject removed");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const assignSubjectTeacher = async (
    classSubjectId: string,
    teacherId: string,
  ) => {
    try {
      const res = await fetch(
        `${SERVER}/api/admin/classes/subjects/${classSubjectId}/teacher`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teacherId: teacherId || null }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign teacher");
      toast.success("Subject teacher assigned");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-slate-950 border-l border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between z-20">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-extrabold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>
                  {detail
                    ? `${detail.class.name} — ${detail.section.name}`
                    : "Section Roster"}
                </span>
              </div>
              {detail && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {detail.totalStudents} student
                  {detail.totalStudents !== 1 ? "s" : ""} enrolled
                  {detail.section.capacity
                    ? ` · ${detail.section.capacity} max capacity`
                    : ""}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading || !detail ? (
            <SectionDetailDrawerSkeleton />
          ) : (
            <div className="p-6 space-y-6">
              {/* Class teacher */}
              <div className="rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 p-5 shadow-lg space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
                    <UserCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Class Teacher
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Primary section supervisor
                    </p>
                  </div>
                </div>

                {detail.teacher && (
                  <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold">{detail.teacher.name}</span>
                      <p className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80">
                        {detail.teacher.email}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                      Active
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <NiceSelect
                    value={teacherPick}
                    onChange={setTeacherPick}
                    placeholder="Select class teacher..."
                    icon={UserCheck}
                    accentColor="indigo"
                    options={[
                      { value: "", label: "— None —" },
                      ...teachers.map((t) => ({
                        value: t.id,
                        label: t.name,
                        sublabel: t.email,
                      })),
                    ]}
                  />
                  <button
                    onClick={assignTeacher}
                    disabled={savingTeacher}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {savingTeacher ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Assign"
                    )}
                  </button>
                </div>
              </div>

              {/* Substitute teacher */}
              <div className="rounded-3xl border border-amber-100 dark:border-amber-900/50 bg-gradient-to-br from-white via-amber-50/20 to-white dark:from-slate-950 dark:via-amber-950/20 dark:to-slate-950 p-5 shadow-lg space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 shadow-xs">
                    <UserPlus className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Substitute Teacher
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Temporary cover supervisor
                    </p>
                  </div>
                </div>

                {detail.substituteTeacher ? (
                  <div className="flex items-center justify-between rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 px-3.5 py-2.5">
                    <div>
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                        {detail.substituteTeacher.name}
                      </p>
                      <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                        {detail.substituteTeacher.email}
                      </p>
                    </div>
                    <button
                      onClick={() => assignSubstitute(null)}
                      disabled={savingSubstitute}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No substitute currently assigned.
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <NiceSelect
                    value={substitutePick}
                    onChange={setSubstitutePick}
                    placeholder="Select substitute teacher..."
                    icon={UserPlus}
                    accentColor="amber"
                    options={[
                      { value: "", label: "— Select a teacher —" },
                      ...teachers
                        .filter((t) => t.id !== detail.teacher?.id)
                        .map((t) => ({
                          value: t.id,
                          label: t.name,
                          sublabel: t.email,
                        })),
                    ]}
                  />
                  <button
                    onClick={() => assignSubstitute(substitutePick)}
                    disabled={savingSubstitute || !substitutePick}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {savingSubstitute ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Assign"
                    )}
                  </button>
                </div>
              </div>

              {/* Subjects */}
              <div className="rounded-3xl border border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-white via-blue-50/20 to-white dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 p-5 shadow-lg space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 shadow-xs">
                    <BookOpenIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Subjects &amp; Faculty
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Curriculum mapping &amp; subject teachers
                    </p>
                  </div>
                </div>

                {subjects.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No subjects added to this section yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {subjects.map((cs) => (
                      <div
                        key={cs.id}
                        className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-3.5 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{cs.subject.name}</span>
                              <span className="text-[10px] font-normal text-slate-400">
                                ({cs.subject.code})
                              </span>
                            </p>
                            {cs.subject.group && (
                              <span className="inline-block mt-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-900/50">
                                {cs.subject.group}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeSubject(cs.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Remove subject"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div>
                          <NiceSelect
                            value={cs.teacher?.id ?? ""}
                            onChange={(val) => assignSubjectTeacher(cs.id, val)}
                            placeholder="— Assign subject teacher —"
                            icon={UserCheck}
                            accentColor="blue"
                            options={[
                              { value: "", label: "— No teacher assigned —" },
                              ...teachers.map((t) => ({
                                value: t.id,
                                label: t.name,
                                sublabel: t.email,
                              })),
                            ]}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <NiceSelect
                    value={addSubjectId}
                    onChange={setAddSubjectId}
                    placeholder="Select a subject to add..."
                    icon={BookOpenIcon}
                    accentColor="emerald"
                    options={[
                      { value: "", label: "Select a subject to add..." },
                      ...allSubjects
                        .filter(
                          (s) => !subjects.some((cs) => cs.subject.id === s.id),
                        )
                        .map((s) => ({
                          value: s.id,
                          label: s.name,
                          sublabel: s.code,
                          badge: s.group?.name,
                        })),
                    ]}
                  />

                  <button
                    onClick={addSubject}
                    disabled={!addSubjectId}
                    className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Students */}
              <div className="rounded-3xl border border-emerald-100 dark:border-emerald-900/50 bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs">
                      <Users className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Enrolled Students ({detail.totalStudents})
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Section class roster
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    {detail.totalStudents} Active
                  </span>
                </div>

                {detail.students.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No students enrolled in this section yet.
                  </p>
                ) : (
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto bg-white/70 dark:bg-slate-900/70">
                    {detail.students.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-black text-slate-700 dark:text-slate-300">
                            {s.roll || "#"}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {s.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {s.email}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          Roll {s.roll}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
