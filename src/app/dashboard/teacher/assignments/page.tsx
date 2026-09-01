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
  RefreshCw,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import AssignmentCard from "@/components/shared/AssignmentCard";
import AssignmentFormModal from "@/components/shared/AssignmentFormModal";

const API_URL = "http://localhost:5000";

type AssignmentStatus = "ACTIVE" | "DRAFT" | "CLOSED" | string;

export interface Assignment {
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
}

export default function TeacherAssignmentsPage() {
  const { data: session, isPending } = useSession();

  const teacherEmail = session?.user?.email;
  const teacherName = session?.user?.name;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  /**
   * Fetch assignments belonging to the logged-in teacher.
   */
  const fetchAssignments = useCallback(async () => {
    if (!teacherEmail) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/teacher/assignments?teacherEmail=${encodeURIComponent(
          teacherEmail
        )}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch assignments.");
      }

      setAssignments(data.assignments || []);
    } catch (err) {
      console.error("Assignment fetch error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to load assignments.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [teacherEmail]);

  useEffect(() => {
    if (!isPending && teacherEmail) {
      fetchAssignments();
    }
  }, [isPending, teacherEmail, fetchAssignments]);

  /**
   * Open modal for creating a new assignment.
   */
  const handleCreate = () => {
    setSelectedAssignment(null);
    setIsModalOpen(true);
  };

  /**
   * Open modal for editing an existing assignment.
   */
  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  /**
   * Close assignment form modal.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  /**
   * Called after successful create/update from AssignmentFormModal.
   *
   * The modal can return the newly created/updated assignment.
   */
  const handleAssignmentSuccess = (
    savedAssignment?: Assignment,
    mode?: "create" | "edit"
  ) => {
    if (savedAssignment) {
      setAssignments((current) => {
        const existingIndex = current.findIndex(
          (assignment) => assignment.id === savedAssignment.id
        );

        // New assignment
        if (existingIndex === -1) {
          return [...current, savedAssignment].sort(
            (a, b) =>
              new Date(a.dueDate).getTime() -
              new Date(b.dueDate).getTime()
          );
        }

        // Updated assignment
        const updated = [...current];
        updated[existingIndex] = savedAssignment;

        return updated.sort(
          (a, b) =>
            new Date(a.dueDate).getTime() -
            new Date(b.dueDate).getTime()
        );
      });
    } else {
      // Fallback if the modal doesn't return the saved assignment.
      fetchAssignments();
    }

    handleCloseModal();

    if (mode === "edit") {
      toast.success("Assignment updated successfully.");
    } else {
      toast.success("Assignment created successfully.");
    }
  };

  /**
   * Delete assignment after SweetAlert confirmation.
   */
  const handleDelete = async (assignmentId: string) => {
    const assignment = assignments.find(
      (item) => item.id === assignmentId
    );

    if (!assignment) return;

    const result = await Swal.fire({
      title: "Delete assignment?",
      text: `Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`,
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
      const response = await fetch(
        `${API_URL}/api/teacher/assignments/${assignmentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete assignment.");
      }

      setAssignments((current) =>
        current.filter((item) => item.id !== assignmentId)
      );

      toast.success("Assignment deleted successfully.");
    } catch (err) {
      console.error("Assignment delete error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete assignment.";

      toast.error(message);
    }
  };

  /**
   * Loading state while Better Auth checks the session.
   */
  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>

        <div className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  /**
   * No teacher session.
   */
  if (!teacherEmail) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
        Unable to load your teacher account.
      </div>
    );
  }

  const totalAssignments = assignments.length;

  const activeAssignments = assignments.filter(
    (assignment) => assignment.status === "ACTIVE"
  ).length;

  const closedAssignments = assignments.filter(
    (assignment) => assignment.status === "CLOSED"
  ).length;

  const draftAssignments = assignments.filter(
    (assignment) => assignment.status === "DRAFT"
  ).length;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 bg-slate-100/90 p-6 text-slate-900 shadow-xs transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:p-8"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200">
            <FileText className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                Teacher Workspace
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Assignments
            </h1>

            <p className="mt-1 text-base text-slate-500 dark:text-slate-400 sm:text-lg">
              Create, manage, and review student assignments.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Teacher information + Create button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: 0.05,
          ease: "easeOut",
        }}
        className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="min-w-0">
          <p className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {teacherName || "Teacher"}
          </p>

          <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            {teacherEmail}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-base font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-900 sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Create Assignment
        </button>
      </motion.div>

      {/* Statistics */}
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
          value={closedAssignments}
          description="Closed assignments"
        />

        <AssignmentStat
          icon={FileEdit}
          label="Drafts"
          value={draftAssignments}
          description="Not published"
        />
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-base font-bold text-red-800 dark:text-red-300">
              Unable to load assignments
            </p>

            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAssignments}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </motion.div>
      )}

      {/* Assignment list */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
              Your Assignments
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Manage assignments created for your students.
            </p>
          </div>

          {isLoading && (
            <RefreshCw className="h-5 w-5 shrink-0 animate-spin text-slate-400" />
          )}
        </div>

        {isLoading && assignments.length === 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : assignments.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-14"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <FileText className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
              No assignments yet
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Create your first assignment to start managing coursework for
              your students.
            </p>

            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-base font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Plus className="h-5 w-5" />
              Create Assignment
            </button>
          </motion.div>
        )}
      </section>

      {/* Existing form modal */}
      <AssignmentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assignment={selectedAssignment}
        teacherEmail={teacherEmail}
        teacherName={teacherName || "Teacher"}
        onSuccess={handleAssignmentSuccess}
      />
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
  value: number;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
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