"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CalendarDays,
  BookOpen,
  Pencil,
  Trash2,
  Clock3,
  Award,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  subject: string;
  grade: string;
  section: string;
  dueDate: string;
  totalMarks: number;
  status: string;
  teacherEmail: string;
  teacherName?: string | null;
  createdAt: string;
  updatedAt: string;
};

type AssignmentCardProps = {
  assignment: Assignment;
  onEdit: (assignment: Assignment) => void;
  onDeleted: (assignmentId: string) => void | Promise<void>;
};

export default function AssignmentCard({
  assignment,
  onEdit,
  onDeleted,
}: AssignmentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No due date";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusStyles = () => {
    switch (assignment.status?.toUpperCase()) {
      case "ACTIVE":
        return {
          badge:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
          icon: "text-emerald-600 dark:text-emerald-400",
        };

      case "DRAFT":
        return {
          badge:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
          icon: "text-amber-600 dark:text-amber-400",
        };

      case "CLOSED":
        return {
          badge:
            "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
          icon: "text-slate-600 dark:text-slate-400",
        };

      default:
        return {
          badge:
            "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
          icon: "text-slate-600 dark:text-slate-400",
        };
    }
  };

  const statusStyles = getStatusStyles();

  const handleDelete = async () => {
    if (isDeleting) return;

    const result = await Swal.fire({
      title: "Delete assignment?",
      text: `"${assignment.title}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      await onDeleted(assignment.id);
    } catch (error) {
      console.error("Delete assignment error:", error);
      setDeleteError("Failed to delete assignment. Please try again.");

      await Swal.fire({
        title: "Delete failed",
        text: "The assignment could not be deleted. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Desktop Card */}
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 md:block"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <FileText className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusStyles.badge}`}
                  >
                    {assignment.status}
                  </span>

                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {assignment.subject}
                  </span>
                </div>

                <h2 className="mt-2 truncate text-xl font-extrabold text-slate-900 dark:text-white">
                  {assignment.title}
                </h2>

                {assignment.description && (
                  <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {assignment.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(assignment)}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
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

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-slate-400" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Class
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {assignment.grade} - {assignment.section}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-slate-400" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Due Date
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {formatDate(assignment.dueDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-slate-400" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Time
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {formatTime(assignment.dueDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-slate-400" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Marks
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {assignment.totalMarks}
                </p>
              </div>
            </div>
          </div>

          {deleteError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {deleteError}
            </div>
          )}
        </div>
      </motion.article>

      {/* Mobile Card */}
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 md:hidden"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusStyles.badge}`}
              >
                {assignment.status}
              </span>

              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {assignment.subject}
              </span>
            </div>

            <h2 className="mt-2 text-lg font-extrabold leading-7 text-slate-900 dark:text-white">
              {assignment.title}
            </h2>
          </div>
        </div>

        {assignment.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {assignment.description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">
                Class
              </span>
            </div>

            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
              {assignment.grade} - {assignment.section}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">
                Marks
              </span>
            </div>

            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
              {assignment.totalMarks}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">
                Due
              </span>
            </div>

            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
              {formatDate(assignment.dueDate)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">
                Time
              </span>
            </div>

            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
              {formatTime(assignment.dueDate)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onEdit(assignment)}
            disabled={isDeleting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}

            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {deleteError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {deleteError}
          </div>
        )}
      </motion.article>
    </>
  );
}