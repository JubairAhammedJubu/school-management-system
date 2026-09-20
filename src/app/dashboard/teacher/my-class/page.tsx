"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Loader2,
  RefreshCw,
  Users,
  GraduationCap,
  Shield,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

type ClassTeacherRow = {
  sectionId: string;
  sectionName: string;
  className: string;
  classId: string;
  role: "CLASS_TEACHER" | "SUBSTITUTE_CLASS_TEACHER";
};

type SubjectTeacherRow = {
  classSubjectId: string;
  subjectName: string;
  subjectCode?: string | null;
  group?: string | null;
  sectionId: string;
  sectionName: string | null;
  className: string | null;
  role: "SUBJECT_TEACHER" | "SUBSTITUTE_SUBJECT_TEACHER";
};

export default function TeacherMyClassesPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [asClassTeacher, setAsClassTeacher] = useState<ClassTeacherRow[]>([]);
  const [asSubjectTeacher, setAsSubjectTeacher] = useState<
    SubjectTeacherRow[]
  >([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/teacher/assign `, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load assignments");
      setAsClassTeacher(data.asClassTeacher || []);
      setAsSubjectTeacher(data.asSubjectTeacher || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
              <GraduationCap className="h-5 w-5" />
            </span>
            My classes
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Classes and subjects assigned to you by admin
            {session?.user?.name ? ` · ${session.user.name}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 max-w-md">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Class teacher
          </p>
          <p className="mt-1 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {asClassTeacher.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Subject loads
          </p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {asSubjectTeacher.length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Class teacher cards */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md"
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                As class teacher
              </h2>
            </div>
            {asClassTeacher.length === 0 ? (
              <Empty text="No section assigned as class teacher yet." />
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {asClassTeacher.map((row) => (
                  <li
                    key={row.sectionId}
                    className="px-5 py-3.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {row.className}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {row.sectionName}
                      </p>
                    </div>
                    <RoleBadge role={row.role} />
                  </li>
                ))}
              </ul>
            )}
          </motion.section>

          {/* Subject teacher */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md"
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Subject assignments
              </h2>
            </div>
            {asSubjectTeacher.length === 0 ? (
              <Empty text="No subject assigned in any class yet." />
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {asSubjectTeacher.map((row) => (
                  <li
                    key={row.classSubjectId}
                    className="px-5 py-3.5 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {row.subjectName}
                        {row.subjectCode ? (
                          <span className="ml-1.5 text-[11px] font-bold text-slate-400">
                            {row.subjectCode}
                          </span>
                        ) : null}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {row.className || "—"} · {row.sectionName || "—"}
                        {row.group ? ` · ${row.group}` : ""}
                      </p>
                    </div>
                    <RoleBadge role={row.role} />
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isSub = role.includes("SUBSTITUTE");
  return (
    <span
      className={`inline-flex items-center gap-1 shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
        isSub
          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
          : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
      }`}
    >
      {isSub ? <Shield className="h-3 w-3" /> : null}
      {isSub ? "Substitute" : "Primary"}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="px-5 py-10 text-center text-xs text-slate-500">{text}</p>
  );
}