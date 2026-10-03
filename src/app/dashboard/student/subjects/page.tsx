"use client";
import { API_BASE_URL } from "@/lib/api-url";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Layers,
  User,
  Sparkles,
  Users,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface Subject {
  id: string;
  subject: string;
  subjectCode?: string;
  grade: string;
  section?: string;
  teacherName?: string | null;
  teacherEmail?: string | null;
}

function SubjectSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-xs animate-pulse space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-14 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-2.5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StudentSubjectsPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchSubjects = async (refresh = false) => {
    try {
      setIsLoading(true);
      if (refresh) setIsRefreshing(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/student/subjects`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load subjects");
      }

      setSubjects(data.subjects || []);
    } catch (err: any) {
      setError(err.message || "Failed to load subjects");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isSessionLoading) return;
    fetchSubjects();
  }, [isSessionLoading, session?.user?.email]);

  const assignedTeachersCount = subjects.filter((s) => Boolean(s.teacherName)).length;
  const currentClassLabel = subjects[0]?.grade ? `${subjects[0].grade}` : "Class Curriculum";

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  Student Workspace
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {currentClassLabel}
                </span>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                My Subjects & Faculty
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Enrolled academic subjects for your class section and details of your assigned subject teachers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => fetchSubjects(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing
                    ? "animate-spin text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* High-Contrast Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Enrolled Subjects",
            value: isLoading || isRefreshing ? null : String(subjects.length),
            icon: BookOpen,
            detail: "Active class subjects",
          },
          {
            label: "Assigned Faculty",
            value: isLoading || isRefreshing ? null : String(assignedTeachersCount),
            icon: Users,
            detail: "Subject instructors",
          },
          {
            label: "Class Grade",
            value: isLoading || isRefreshing ? null : currentClassLabel,
            icon: GraduationCap,
            detail: "Registered academic level",
          },
          {
            label: "Curriculum Status",
            value: isLoading || isRefreshing ? null : "Active",
            icon: CheckCircle2,
            detail: "Standardized syllabus",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl hover:border-indigo-500/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
                <item.icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {item.label}
            </p>

            {item.value === null ? (
              <div className="mt-1 h-7 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {item.value}
              </p>
            )}

            <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      {isLoading || isRefreshing ? (
        <SubjectSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mb-4 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Unable to load subjects
          </h3>
          <p className="max-w-md text-xs text-slate-500 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => fetchSubjects(true)}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-950">
          <GraduationCap className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
            No subjects found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Subjects will appear here once teachers are assigned to your class.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((item, index) => {
            const hasTeacher = Boolean(item.teacherName);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-xs hover:border-indigo-500/40 transition-all"
              >
                {/* Subject Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
                    <Layers className="h-5 w-5" />
                  </div>
                  {item.subjectCode && (
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                      {item.subjectCode}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  {item.subject}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {item.grade}
                  {item.section ? ` · ${item.section}` : ""}
                </p>

                {/* Teacher Section */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {hasTeacher ? (
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold shadow-2xs">
                        {item.teacherName!.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400">Assigned Teacher</p>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {item.teacherName}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-slate-400">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px]">Assigned Teacher</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Not assigned yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}