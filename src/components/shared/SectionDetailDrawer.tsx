"use client";

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
} from "lucide-react";
import Link from "next/link";

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

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

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
      const [detailRes, teachersRes, subjectsRes] = await Promise.all([
        fetch(`${SERVER}/api/admin/classes/sections/${sectionId}`, {
          credentials: "include",
        }),
        fetch(`${SERVER}/api/admin/teachers`, { credentials: "include" }),
        fetch(`${SERVER}/api/admin/classes/sections/${sectionId}/subjects`, {
          credentials: "include",
        }),
      ]);
      const detailData = await detailRes.json();
      const teachersData = await teachersRes.json();
      const subjectsData = await subjectsRes.json();

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

      // Load the catalog too (filtered by group if class has groups — not per-group UI yet, shows all)
      const catalogRes = await fetch(`${SERVER}/api/admin/subjects`, {
        credentials: "include",
      });
      const catalogData = await catalogRes.json();
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
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl overflow-y-auto"
        >
          <div className="sticky top-0 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {detail
                  ? `${detail.class.name} — ${detail.section.name}`
                  : "Loading..."}
              </h2>
              {detail && (
                <p className="text-[11px] text-slate-500">
                  {detail.totalStudents} student
                  {detail.totalStudents !== 1 ? "s" : ""}
                  {detail.section.capacity
                    ? ` / ${detail.section.capacity} capacity`
                    : ""}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading || !detail ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="p-5 space-y-6">
             
              {/* Class teacher */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600">
                    <UserCheck className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    Class Teacher
                  </h3>
                </div>
                {detail.teacher && (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Currently: {detail.teacher.name}{" "}
                    <span className="text-slate-400 font-normal">
                      ({detail.teacher.email})
                    </span>
                  </p>
                )}
                <div className="flex gap-2">
                  <select
                    value={teacherPick}
                    onChange={(e) => setTeacherPick(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    <option value="">— None —</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={assignTeacher}
                    disabled={savingTeacher}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {savingTeacher ? "Saving..." : "Assign"}
                  </button>
                </div>
              </div>

              {/* Substitute teacher */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/15 text-amber-600">
                    <UserPlus className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    Substitute Teacher
                  </h3>
                </div>

                {detail.substituteTeacher ? (
                  <div className="flex items-center justify-between rounded-xl bg-amber-50 dark:bg-amber-500/10 px-3 py-2 mb-3">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                      {detail.substituteTeacher.name}
                    </p>
                    <button
                      onClick={() => assignSubstitute(null)}
                      disabled={savingSubstitute}
                      className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mb-3">
                    No substitute currently assigned.
                  </p>
                )}

                <div className="flex gap-2">
                  <select
                    value={substitutePick}
                    onChange={(e) => setSubstitutePick(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    <option value="">Select a teacher</option>
                    {teachers
                      .filter((t) => t.id !== detail.teacher?.id)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => assignSubstitute(substitutePick)}
                    disabled={savingSubstitute || !substitutePick}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 disabled:opacity-50"
                  >
                    {savingSubstitute ? "Saving..." : "Assign"}
                  </button>
                </div>
              </div>
              {/* Subjects */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600">
                    <BookOpenIcon className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    Subjects & Subject Teachers
                  </h3>
                </div>

                {subjects.length === 0 ? (
                  <p className="text-xs text-slate-500 mb-3">
                    No subjects added to this section yet.
                  </p>
                ) : (
                  <div className="space-y-2 mb-3">
                    {subjects.map((cs) => (
                      <div
                        key={cs.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              {cs.subject.name}{" "}
                              <span className="text-slate-400 font-normal">
                                ({cs.subject.code})
                              </span>
                            </p>
                            {cs.subject.group && (
                              <p className="text-[10px] text-blue-600 font-semibold">
                                {cs.subject.group}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeSubject(cs.id)}
                            className="text-[11px] font-bold text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={cs.teacher?.id ?? ""}
                            onChange={(e) =>
                              assignSubjectTeacher(cs.id, e.target.value)
                            }
                            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/30"
                          >
                            <option value="">— No teacher assigned —</option>
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <select
                    value={addSubjectId}
                    onChange={(e) => setAddSubjectId(e.target.value)}
                    className="w-full sm:flex-1 min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="">Select a subject to add</option>

                    {allSubjects
                      .filter(
                        (s) => !subjects.some((cs) => cs.subject.id === s.id),
                      )
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.group ? `(${s.group.name})` : ""}
                        </option>
                      ))}
                  </select>

                  <button
                    onClick={addSubject}
                    disabled={!addSubjectId}
                    className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
              {/* Students */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600">
                    <Users className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    Students ({detail.totalStudents})
                  </h3>
                </div>
                {detail.students.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No students enrolled in this section yet.
                  </p>
                ) : (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                    {detail.students.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between px-4 py-2.5"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                            {s.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {s.email}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-400">
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
