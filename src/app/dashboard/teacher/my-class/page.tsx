"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Loader2,
  RefreshCw,
  Users,
  GraduationCap,
  Shield,
  School,
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

  const totalDistinctSections = useMemo(() => {
    const set = new Set<string>();
    asClassTeacher.forEach((ct) => set.add(ct.sectionId));
    asSubjectTeacher.forEach((st) => set.add(st.sectionId));
    return set.size;
  }, [asClassTeacher, asSubjectTeacher]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner matching other routes */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              CLASSROOM MANAGEMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              My Classes &amp; Course Loads
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Overview of sections assigned as Class Teacher and subject course load allocations.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={load}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm border border-indigo-200 dark:border-indigo-900/50 transition-all cursor-pointer shadow-xs shrink-0 z-10"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          )}
          Refresh Classes
        </button>
      </motion.div>

      {/* Metric Summary Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Users}
          label="Class Teacher Roles"
          value={loading ? "..." : String(asClassTeacher.length)}
          detail="Direct class section guardianship"
          delay={0.05}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />
        <SummaryCard
          icon={BookOpen}
          label="Subject Assignments"
          value={loading ? "..." : String(asSubjectTeacher.length)}
          detail="Course subjects taught across classes"
          delay={0.1}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <SummaryCard
          icon={School}
          label="Distinct Sections"
          value={loading ? "..." : String(totalDistinctSections)}
          detail="Unique student sections assigned"
          delay={0.15}
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
        />
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Skeleton for Class teacher section */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 p-5 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-900/60 last:border-0">
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
                    <div className="h-3 w-16 rounded-md bg-slate-100 dark:bg-slate-900 animate-pulse" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton for Subject teacher section */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 p-5 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-900/60 last:border-0">
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
                    <div className="h-3 w-24 rounded-md bg-slate-100 dark:bg-slate-900 animate-pulse" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
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

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
  iconClass = "text-indigo-600 dark:text-indigo-400",
  iconBg = "bg-indigo-50 dark:bg-indigo-500/10",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
  iconClass?: string;
  iconBg?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/70"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconClass} shadow-xs`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      {value === "..." ? (
        <div className="mt-2 h-7 w-16 rounded-md bg-slate-200/90 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
      ) : (
        <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          {value}
        </p>
      )}

      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {detail}
      </p>
    </motion.div>
  );
}