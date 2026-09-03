"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  Edit3,
  FileText,
  Trash2,
  Users,
  Award,
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
  onDelete: (assignment: Assignment) => void;
};

export default function AssignmentCard({
  assignment,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  const formattedDueDate = formatDate(assignment.dueDate);
  const isPastDue = new Date(assignment.dueDate).getTime() < Date.now();

  const handleDelete = () => {
    onDelete(assignment);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-700/60"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all duration-300" />

      {/* Main Content Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 truncate block">
                {assignment.subject}
              </span>
              <h3 className="line-clamp-1 text-sm font-extrabold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {assignment.title}
              </h3>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <StatusBadge status={assignment.status} />

            {isPastDue && assignment.status === "ACTIVE" && (
              <span className="rounded-lg bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                Past due
              </span>
            )}
          </div>
        </div>

        {assignment.description && (
          <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {assignment.description}
          </p>
        )}
      </div>

      {/* Grid Specs */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs min-w-0">
        <div className="min-w-0">
          <AssignmentDetail
            icon={Users}
            label="Class"
            value={`${assignment.grade} · ${assignment.section}`}
          />
        </div>

        <div className="min-w-0">
          <AssignmentDetail
            icon={Award}
            label="Total Marks"
            value={`${assignment.totalMarks} pts`}
          />
        </div>

        <div className="col-span-2 min-w-0">
          <AssignmentDetail
            icon={CalendarDays}
            label="Deadline Date"
            value={formattedDueDate}
            valueClassName={isPastDue ? "text-rose-600 dark:text-rose-400" : ""}
          />
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100/90 pt-3.5 dark:border-slate-800/90">
        <button
          type="button"
          onClick={() => onEdit(assignment)}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-rose-50 px-3.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-600 hover:text-white dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </motion.article>
  );
}

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
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200/60 bg-slate-50/60 p-2.5 dark:border-slate-800/60 dark:bg-slate-950/40">
      <div className="flex items-center gap-1.5 mb-0.5 min-w-0">
        <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">
          {label}
        </span>
      </div>
      <p
        title={value}
        className={`text-xs font-bold text-slate-900 dark:text-white truncate ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Active
      </span>
    );
  }

  if (normalizedStatus === "DRAFT") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
        Draft
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
      Closed
    </span>
  );
}

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