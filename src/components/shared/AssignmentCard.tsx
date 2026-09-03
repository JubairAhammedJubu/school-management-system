"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Edit3,
  FileText,
  Loader2,
  Trash2,
  Users,
} from "lucide-react";

export type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  subject: string;
  grade: string;
  section: string;
  dueDate: string | Date;
  totalMarks: number;
  status: "ACTIVE" | "DRAFT" | "CLOSED" | string;
  teacherEmail: string;
  teacherName?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type AssignmentCardProps = {
  assignment: Assignment;
  onEdit: (assignment: Assignment) => void;
  onDeleted?: (assignmentId: string) => void;
  onDelete?: (assignmentId: string) => void;
};

export default function AssignmentCard({
  assignment,
  onEdit,
  onDeleted,
  onDelete,
}: AssignmentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const formattedDueDate = formatDate(assignment.dueDate);
  const isPastDue = new Date(assignment.dueDate).getTime() < Date.now();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${assignment.title}"?`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setDeleteError("");

      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

      const response = await fetch(
        `${SERVER_URL}/api/teacher/assignments/${assignment.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete assignment.");
      }

      onDeleted?.(assignment.id);
      onDelete?.(assignment.id);
    } catch (error) {
      console.error("Delete assignment error:", error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete assignment."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      {/* Main content */}
      <div className="p-5 sm:p-6">
        {/* Top row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <FileText className="h-5 w-5" />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={assignment.status} />

                {isPastDue && assignment.status === "ACTIVE" && (
                  <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                    Past due
                  </span>
                )}
              </div>

              <h2 className="truncate text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                {assignment.title}
              </h2>

              {assignment.description && (
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {assignment.description}
                </p>
              )}
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => onEdit(assignment)}
              disabled={isDeleting}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/15"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}

              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Assignment details */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AssignmentDetail
            icon={BookOpen}
            label="Subject"
            value={assignment.subject}
          />

          <AssignmentDetail
            icon={Users}
            label="Class"
            value={`${assignment.grade} - ${assignment.section}`}
          />

          <AssignmentDetail
            icon={CalendarDays}
            label="Due date"
            value={formattedDueDate}
            valueClassName={isPastDue ? "text-rose-600 dark:text-rose-400" : ""}
          />

          <AssignmentDetail
            icon={Clock3}
            label="Total marks"
            value={`${assignment.totalMarks} marks`}
          />
        </div>

        {/* Mobile actions */}
        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5 dark:border-slate-800 sm:hidden">
          <button
            type="button"
            onClick={() => onEdit(assignment)}
            disabled={isDeleting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/15"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}

            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* Delete error */}
        {deleteError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
            {deleteError}
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail                                                                       */
/* -------------------------------------------------------------------------- */

function AssignmentDetail({
  icon: Icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />

        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </span>
      </div>

      <p
        className={`mt-1.5 truncate text-sm font-bold text-slate-800 dark:text-slate-200 ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status                                                                       */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase();

  const styles = {
    ACTIVE:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    DRAFT:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    CLOSED:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  const label = {
    ACTIVE: "Active",
    DRAFT: "Draft",
    CLOSED: "Closed",
  };

  const className =
    styles[normalizedStatus as keyof typeof styles] ||
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

  const displayLabel =
    label[normalizedStatus as keyof typeof label] || normalizedStatus;

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${className}`}
    >
      {displayLabel}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Date                                                                         */
/* -------------------------------------------------------------------------- */

function formatDate(date: string | Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}