"use client";

import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  Plus,
  Clock3,
  CheckCircle2,
  Search,
  BookOpen,
  Filter,
  Layers,
  Check,
  ChevronDown,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

import AssignmentCard, { Assignment } from "@/components/shared/AssignmentCard";
import AssignmentFormModal from "@/components/shared/AssignmentFormModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const STATUS_OPTIONS = ["All Status", "ACTIVE", "DRAFT", "CLOSED"];
const CLASS_OPTIONS = ["All Classes", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

export default function TeacherAssignmentsPage() {
  const { data: session } = useSession();

  const teacherEmail = session?.user?.email;
  const teacherName = session?.user?.name;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedClass, setSelectedClass] = useState("All Classes");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Delete modal state
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load assignments.");
      }

      setAssignments(data.assignments || []);
    } catch (err) {
      console.error("Fetch assignments error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load assignments.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [teacherEmail]);

  useEffect(() => {
    if (teacherEmail) {
      fetchAssignments();
    }
  }, [teacherEmail, fetchAssignments]);

  const handleCreate = () => {
    setSelectedAssignment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  /**
   * Handle create or edit assignment success with live UI state update.
   */
  const handleAssignmentSuccess = (
    savedAssignment?: Assignment,
  ) => {
    if (savedAssignment) {
      setAssignments((current) => {
        const existingIndex = current.findIndex(
          (assignment) => assignment.id === savedAssignment.id
        );

        if (existingIndex === -1) {
          return [savedAssignment, ...current].sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );
        }

        const updated = [...current];
        updated[existingIndex] = savedAssignment;

        return [...updated].sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
      });
    } else {
      fetchAssignments();
    }

    handleCloseModal();
  };

  /**
   * Delete assignment trigger
   */
  const handleDeleteClick = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
  };

  const confirmDeleteAssignment = async () => {
    if (!assignmentToDelete) return;

    try {
      setIsDeleting(true);

      const url = `${API_URL}/api/teacher/assignments/${assignmentToDelete.id}${
        teacherEmail ? `?teacherEmail=${encodeURIComponent(teacherEmail)}` : ""
      }`;

      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete assignment.");
      }

      setAssignments((current) =>
        current.filter((item) => item.id !== assignmentToDelete.id)
      );

      toast.success("Assignment deleted successfully.");
      setAssignmentToDelete(null);
    } catch (err) {
      console.error("Assignment delete error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete assignment.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Filtered assignments list based on search and selected dropdown options.
   */
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subject.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        selectedStatus === "All Status" ||
        item.status.toUpperCase() === selectedStatus.toUpperCase();

      const matchClass =
        selectedClass === "All Classes" ||
        item.grade.toLowerCase().includes(selectedClass.toLowerCase().replace("class", "").trim()) ||
        selectedClass.toLowerCase().includes(item.grade.toLowerCase());

      return matchSearch && matchStatus && matchClass;
    });
  }, [assignments, search, selectedStatus, selectedClass]);

  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter((a) => a.status === "ACTIVE").length;
  const closedAssignments = assignments.filter((a) => a.status === "CLOSED").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner matching other routes */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              TEACHER ACADEMICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Assignments & Coursework
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Create, review, and manage homework tasks, deadlines, and grade allocations for your enrolled classes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer hover:scale-[1.02] shrink-0 z-10"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </motion.div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={BookOpen}
          label="Total Courseworks"
          value={isLoading ? "..." : String(totalAssignments)}
          detail="Assignments created across all sections"
          delay={0.05}
        />
        <SummaryCard
          icon={Clock3}
          label="Active & Open"
          value={isLoading ? "..." : String(activeAssignments)}
          detail="Currently accepting student submissions"
          delay={0.1}
          badgeColor="text-emerald-600 dark:text-emerald-400"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Closed / Locked"
          value={isLoading ? "..." : String(closedAssignments)}
          detail="Past deadline or locked by teacher"
          delay={0.15}
          badgeColor="text-slate-600 dark:text-slate-400"
        />
      </div>

      {/* Main Roster Section */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-visible rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/80 p-5 sm:p-6"
      >
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-100/90 pb-5 dark:border-slate-800/90 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
              Assignment Roster
              <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-extrabold text-white shadow-xs">
                {filteredAssignments.length} Items
              </span>
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage coursework, edit due dates, or remove existing assignments.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2.5 sm:gap-3 lg:w-auto max-w-full">
            {/* Search Input */}
            <div className="relative w-full sm:w-[210px] shrink-0">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, subject..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
              />
            </div>

            {/* Status Dropdown */}
            <SelectDropdown
              value={selectedStatus}
              options={STATUS_OPTIONS}
              onChange={setSelectedStatus}
              icon={Layers}
            />

            {/* Class Dropdown */}
            <SelectDropdown
              value={selectedClass}
              options={CLASS_OPTIONS}
              onChange={setSelectedClass}
              icon={Filter}
            />
          </div>
        </div>

        {/* Assignments Grid */}
        {isLoading && assignments.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-16 text-center dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FileText className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              No assignments found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              No assignment records matched your search parameters or filters.
            </p>

            <button
              type="button"
              onClick={handleCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Assignment
            </button>
          </div>
        )}
      </motion.section>

      {/* Assignment Form Modal (Create / Edit) */}
      <AssignmentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assignment={selectedAssignment}
        teacherEmail={teacherEmail}
        teacherName={teacherName || "Teacher"}
        onSuccess={handleAssignmentSuccess}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(assignmentToDelete)}
        onClose={() => !isDeleting && setAssignmentToDelete(null)}
        onConfirm={confirmDeleteAssignment}
        title="Delete Assignment"
        itemTitle={assignmentToDelete?.title || "this assignment"}
        isDeleting={isDeleting}
      />
    </div>
  );
}

/* ========================================================= */
/* HELPER COMPONENTS */
/* ========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
  badgeColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/90"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {detail}
      </p>
    </motion.div>
  );
}

function SelectDropdown({
  value,
  options,
  onChange,
  icon: Icon,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  icon: React.ElementType;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-auto sm:min-w-[135px] sm:max-w-[155px] shrink-0 min-w-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800 cursor-pointer min-w-0"
      >
        <span className="truncate flex items-center gap-1.5 min-w-0">
          <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="truncate">{value}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-30 mt-1.5 w-full min-w-[160px] max-h-60 overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900"
          >
            {options.map((option) => {
              const isSelected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 font-extrabold"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}