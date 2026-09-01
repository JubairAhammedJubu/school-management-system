"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Plus,
  Clock3,
  CheckCircle2,
  FileEdit,
  XCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function TeacherAssignmentsPage() {
  const { data: session, isPending } = useSession();

  const teacherEmail = session?.user?.email;
  const teacherName = session?.user?.name;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 bg-slate-100/90 p-6 text-slate-900 shadow-xs transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:p-8"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200">
            <FileText className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-300">
                <Sparkles className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                Teacher Workspace
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Assignments
            </h1>

            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Create, grade, and review student assignments.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Teacher information */}
      {!isPending && teacherEmail && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {teacherName || "Teacher"}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {teacherEmail}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create Assignment
          </button>
        </motion.div>
      )}

      {/* Assignment statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AssignmentStat
          icon={FileText}
          label="Total Assignments"
          value="0"
          description="All assignments"
        />

        <AssignmentStat
          icon={Clock3}
          label="Active"
          value="0"
          description="Currently active"
        />

        <AssignmentStat
          icon={CheckCircle2}
          label="Completed"
          value="0"
          description="Closed assignments"
        />

        <AssignmentStat
          icon={FileEdit}
          label="Drafts"
          value="0"
          description="Not published"
        />
      </div>

      {/* Empty state */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-12"
      >
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <FileText className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
            No assignments yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Create your first assignment to start managing coursework for your
            students.
          </p>

          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create your first assignment
          </button>
        </div>
      </motion.section>
    </div>
  );
}

function AssignmentStat({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}