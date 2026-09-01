"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Plus,
  Clock3,
  CheckCircle2,
  FileEdit,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

import AssignmentCard from "@/components/shared/AssignmentCard";
import AssignmentFormModal from "@/components/shared/AssignmentFormModal";

type AssignmentStatus = "ACTIVE" | "DRAFT" | "CLOSED";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  subject: string;
  grade: string;
  section: string;
  dueDate: string;
  totalMarks: number;
  status: AssignmentStatus;
  teacherEmail: string;
  teacherName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function TeacherAssignmentsPage() {
  const { data: session, isPending } = useSession();

  const teacherEmail = session?.user?.email || "";
  const teacherName = session?.user?.name || "Teacher";

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<Assignment | null>(null);

  /**
   * Fetch teacher assignments
   */
  const fetchAssignments = useCallback(async () => {
    if (!teacherEmail) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/teacher/assignments?teacherEmail=${encodeURIComponent(
          teacherEmail
        )}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch assignments");
      }

      setAssignments(data.assignments || []);
    } catch (err: any) {
      console.error("Assignment fetch error:", err);
      setError(err?.message || "Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  }, [teacherEmail]);

  /**
   * Load assignments when teacher session is available
   */
  useEffect(() => {
    if (teacherEmail) {
      fetchAssignments();
    }
  }, [teacherEmail, fetchAssignments]);

  /**
   * Open modal in CREATE mode
   */
  const handleCreateAssignment = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  /**
   * Open modal in EDIT mode
   */
  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  /**
   * Called after assignment is successfully created/updated
   */
  const handleAssignmentSaved = async () => {
    handleCloseModal();
    await fetchAssignments();
  };

  /**
   * Statistics
   */
  const totalAssignments = assignments.length;

  const activeAssignments = assignments.filter(
    (assignment) => assignment.status === "ACTIVE"
  ).length;

  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === "CLOSED"
  ).length;

  const draftAssignments = assignments.filter(
    (assignment) => assignment.status === "DRAFT"
  ).length;

  return (
    <div className="w-full space-y-6 pb-8">
      {/* =========================================================
          HEADER
      ========================================================= */}
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
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                Teacher Workspace
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Assignments
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Create, manage, and review student assignments.
            </p>
          </div>
        </div>
      </motion.div>

      {/* =========================================================
          TEACHER INFO + CREATE BUTTON
      ========================================================= */}
      {!isPending && teacherEmail && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.05,
            ease: "easeOut",
          }}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              {teacherName}
            </p>

            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              {teacherEmail}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateAssignment}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto sm:text-base"
          >
            <Plus className="h-5 w-5" />
            Create Assignment
          </button>
        </motion.div>
      )}

      {/* =========================================================
          STATISTICS
      ========================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AssignmentStat
          icon={FileText}
          label="Total Assignments"
          value={totalAssignments}
          description="All assignments"
        />

        <AssignmentStat
          icon={Clock3}
          label="Active"
          value={activeAssignments}
          description="Currently active"
        />

        <AssignmentStat
          icon={CheckCircle2}
          label="Completed"
          value={completedAssignments}
          description="Closed assignments"
        />

        <AssignmentStat
          icon={FileEdit}
          label="Drafts"
          value={draftAssignments}
          description="Not published"
        />
      </div>

      {/* =========================================================
          ERROR
      ========================================================= */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="text-sm font-bold sm:text-base">
              Unable to load assignments
            </p>

            <p className="mt-1 text-sm opacity-90">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAssignments}
              className="mt-3 text-sm font-bold underline underline-offset-4 hover:no-underline"
            >
              Try again
            </button>
          </div>
        </motion.div>
      )}

      {/* =========================================================
          LOADING
      ========================================================= */}
      {isLoading && (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />

            <span className="text-sm font-semibold sm:text-base">
              Loading assignments...
            </span>
          </div>
        </div>
      )}

      {/* =========================================================
          ASSIGNMENT LIST
      ========================================================= */}
      {!isLoading && assignments.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
                Your Assignments
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                Manage the assignments you have created.
              </p>
            </div>

            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {totalAssignments}{" "}
              {totalAssignments === 1 ? "assignment" : "assignments"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onEdit={handleEditAssignment}
                onDeleted={fetchAssignments}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* =========================================================
          EMPTY STATE
      ========================================================= */}
      {!isLoading && !error && assignments.length === 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.1,
            ease: "easeOut",
          }}
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
              Create your first assignment to start managing coursework for
              your students.
            </p>

            <button
              type="button"
              onClick={handleCreateAssignment}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:text-base"
            >
              <Plus className="h-5 w-5" />
              Create your first assignment
            </button>
          </div>
        </motion.section>
      )}

      {/* =========================================================
          ASSIGNMENT FORM MODAL
          
          null assignment = CREATE
          existing assignment = EDIT
      ========================================================= */}
      <AssignmentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assignment={editingAssignment}
        teacherEmail={teacherEmail}
        teacherName={teacherName}
        onSaved={handleAssignmentSaved}
      />
    </div>
  );
}

/* ===============================================================
   STAT CARD
================================================================ */

function AssignmentStat({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 sm:text-base">
            {label}
          </p>

          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {value}
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}