"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Loader2,
  GraduationCap,
  Layers,
  User,
} from "lucide-react";

interface Subject {
  id: string;
  subject: string;
  subjectCode?: string;
  grade: string;
  section?: string;
  teacherName?: string | null;
  teacherEmail?: string | null;
}
import { useSession } from "@/lib/auth-client";

export default function StudentSubjectsPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSessionLoading) return;

    const fetchSubjects = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/subjects`,
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
      }
    };

    fetchSubjects();
  }, [isSessionLoading, session?.user?.email]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 p-6 sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                My Subjects
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Subjects of your class and assigned teachers
              </p>
            </div>
          </div>

          {!isLoading && (
            <div className="rounded-2xl bg-indigo-600 px-5 py-3 text-center text-white shadow-lg shadow-indigo-500/20">
              <p className="text-2xl font-extrabold leading-none">
                {subjects.length}
              </p>
              <p className="text-[11px] font-semibold mt-0.5 opacity-90">
                Subjects
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-3 text-sm text-slate-500">Loading subjects...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-8 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
            No subjects found
          </h3>
          <p className="mt-1 text-xs text-slate-500">
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
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
              >
                {/* Subject Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600">
                    <Layers className="h-5 w-5" />
                  </div>
                  {item.subjectCode && (
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      {item.subjectCode}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  {item.subject}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.grade}
                  {item.section ? ` · ${item.section}` : ""}
                </p>

                {/* Teacher Section */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {hasTeacher ? (
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
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
                        <p className="text-xs font-medium">Not assigned yet</p>
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