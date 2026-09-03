"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  CalendarDays,
  BookOpen,
  Users,
  Save,
  Loader2,
  Layers,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  subject: string;
  grade: string;
  section: string;
  dueDate: string | Date;
  totalMarks: number;
  status: string;
  teacherEmail: string;
  teacherName?: string | null;
};

export type AssignmentFormData = {
  title: string;
  description: string;
  subject: string;
  grade: string;
  section: string;
  dueDate: string;
  totalMarks: number;
  teacherEmail: string;
  teacherName: string;
  status: string;
};

type AssignmentFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  assignment?: Assignment | null;
  teacherEmail?: string;
  teacherName?: string;
  onSaved?: (assignment: Assignment) => void;
  onSuccess?: (savedAssignment?: any, mode?: any) => void;
  onSubmit?: (data: AssignmentFormData) => Promise<void>;
};

const CLASS_OPTIONS = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTION_OPTIONS = ["Section A", "Section B"];

const SUBJECTS_BY_CLASS: Record<string, string[]> = {
  "Class 6": [
    "Bangla",
    "English",
    "Mathematics",
    "Science",
    "Bangladesh & Global Studies",
    "Information & Communication Technology (ICT)",
    "Physical Education & Health",
    "Work & Life Oriented Education",
    "Agricultural Studies",
    "Arts & Crafts",
    "Islamic Studies",
    "Hindu Religion Studies",
  ],
  "Class 7": [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "General Science",
    "Bangladesh & Global Studies",
    "Information & Communication Technology (ICT)",
    "Islamic Studies",
    "Hindu Religion Studies",
  ],
  "Class 8": [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "General Science",
    "Bangladesh & Global Studies",
    "Information & Communication Technology (ICT)",
    "Islamic Studies",
    "Hindu Religion Studies",
  ],
  "Class 9": [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Higher Mathematics",
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Information & Communication Technology (ICT)",
    "Accounting",
    "Finance & Banking",
    "Business Entrepreneurship",
    "Geography & Environment",
    "Civics & Citizenship",
    "Economics",
    "General Science",
    "Bangladesh & Global Studies",
    "Agricultural Studies",
    "Home Science",
    "Islamic Studies",
  ],
  "Class 10": [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Higher Mathematics",
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Information & Communication Technology (ICT)",
    "Accounting",
    "Finance & Banking",
    "Business Entrepreneurship",
    "Geography & Environment",
    "Civics & Citizenship",
    "Economics",
    "General Science",
    "Bangladesh & Global Studies",
    "Agricultural Studies",
    "Home Science",
    "Islamic Studies",
  ],
};

const STATUS_DISPLAY_MAP: Record<string, string> = {
  ACTIVE: "Active (Published for students)",
  DRAFT: "Draft (Unpublished draft)",
  CLOSED: "Closed (Submissions locked)",
};

const EMPTY_FORM: AssignmentFormData = {
  title: "",
  description: "",
  subject: "Mathematics",
  grade: "Class 8",
  section: "Section A",
  dueDate: "",
  totalMarks: 100,
  teacherEmail: "",
  teacherName: "",
  status: "ACTIVE",
};

export default function AssignmentFormModal({
  isOpen,
  onClose,
  assignment,
  teacherEmail = "",
  teacherName = "",
  onSaved,
  onSuccess,
  onSubmit,
}: AssignmentFormModalProps) {
  const isEditing = Boolean(assignment);

  const [form, setForm] = useState<AssignmentFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const availableSubjects = useMemo(() => {
    return SUBJECTS_BY_CLASS[form.grade] || SUBJECTS_BY_CLASS["Class 8"];
  }, [form.grade]);

  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(form.subject)) {
      setForm((previous) => ({
        ...previous,
        subject: availableSubjects[0],
      }));
    }
  }, [form.grade, availableSubjects, form.subject]);

  useEffect(() => {
    if (!isOpen) return;

    if (assignment) {
      const date = new Date(assignment.dueDate);
      let formattedDueDate = "";

      if (!Number.isNaN(date.getTime())) {
        formattedDueDate = date.toISOString().slice(0, 16);
      }

      setForm({
        title: assignment.title || "",
        description: assignment.description || "",
        subject: assignment.subject || availableSubjects[0],
        grade: assignment.grade || "Class 8",
        section: assignment.section || "Section A",
        dueDate: formattedDueDate,
        totalMarks: assignment.totalMarks || 100,
        teacherEmail: assignment.teacherEmail || teacherEmail,
        teacherName: assignment.teacherName || teacherName,
        status: assignment.status || "ACTIVE",
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        subject: availableSubjects[0] || "Mathematics",
        teacherEmail,
        teacherName,
      });
    }

    setError("");
  }, [isOpen, assignment, teacherEmail, teacherName]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const updateField = (field: keyof AssignmentFormData, value: string | number) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Assignment title is required.");
      toast.error("Assignment title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Description & instructions are required.");
      toast.error("Description & instructions are required.");
      return;
    }

    if (!form.grade.trim()) {
      setError("Class is required.");
      toast.error("Class is required.");
      return;
    }

    if (!form.section.trim()) {
      setError("Section is required.");
      toast.error("Section is required.");
      return;
    }

    if (!form.subject.trim()) {
      setError("Subject is required.");
      toast.error("Subject is required.");
      return;
    }

    if (!form.dueDate) {
      setError("Deadline Date & Time is required.");
      toast.error("Deadline Date & Time is required.");
      return;
    }

    const parsedDueDate = new Date(form.dueDate);

    if (Number.isNaN(parsedDueDate.getTime())) {
      setError("Please provide a valid due date.");
      toast.error("Please provide a valid due date.");
      return;
    }

    if (Number(form.totalMarks) <= 0) {
      setError("Total marks must be greater than 0.");
      toast.error("Total marks must be greater than 0.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      if (onSubmit) {
        await onSubmit({
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
          subject: form.subject.trim(),
          grade: form.grade.trim(),
          section: form.section.trim(),
          teacherEmail: form.teacherEmail.trim(),
          teacherName: form.teacherName.trim(),
          totalMarks: Number(form.totalMarks) || 100,
        });

        toast.success(
          isEditing
            ? "Assignment updated successfully!"
            : "Assignment created successfully!"
        );
        onClose();
        return;
      }

      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
      const url = isEditing
        ? `${SERVER_URL}/api/teacher/assignments/${assignment?.id}`
        : `${SERVER_URL}/api/teacher/assignments`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          subject: form.subject.trim(),
          grade: form.grade.trim(),
          section: form.section.trim(),
          dueDate: parsedDueDate.toISOString(),
          totalMarks: Number(form.totalMarks) || 100,
          teacherEmail: (form.teacherEmail || teacherEmail).trim(),
          teacherName: (form.teacherName || teacherName || "Teacher").trim(),
          status: form.status,
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response received from the server.");
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            (isEditing
              ? "Failed to update assignment."
              : "Failed to create assignment.")
        );
      }

      if (data.assignment) {
        onSaved?.(data.assignment);
        onSuccess?.(data.assignment, isEditing ? "update" : "create");
      }

      toast.success(
        isEditing
          ? "Assignment updated successfully!"
          : "Assignment created successfully!"
      );
      onClose();
    } catch (err) {
      console.error("Assignment save error:", err);
      const message =
        err instanceof Error
          ? err.message
          : isEditing
            ? "Failed to update assignment."
            : "Failed to create assignment.";

      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800/80 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-xs shadow-md">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-white">
                    {isEditing ? "Edit Assignment" : "Create New Assignment"}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {isEditing
                      ? "Update assignment details & class settings"
                      : "Fill in assignment title, class, section, subject & due date"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                  {error}
                </div>
              )}

              {/* Assignment Title */}
              <div>
                <label htmlFor="assignment-title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title *
                </label>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="assignment-title"
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g. Chapter 5 Algebra & Functions"
                    disabled={isSaving}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Sequence: 1. Class -> 2. Section -> 3. Subject */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* 1. Class Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class *
                  </label>
                  <ModalSelectDropdown
                    value={form.grade}
                    options={CLASS_OPTIONS}
                    onChange={(val) => updateField("grade", val)}
                    icon={Users}
                    disabled={isSaving}
                  />
                </div>

                {/* 2. Section Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section *
                  </label>
                  <ModalSelectDropdown
                    value={form.section}
                    options={SECTION_OPTIONS}
                    onChange={(val) => updateField("section", val)}
                    icon={Users}
                    disabled={isSaving}
                  />
                </div>

                {/* 3. Subject Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <ModalSelectDropdown
                    value={form.subject}
                    options={availableSubjects}
                    onChange={(val) => updateField("subject", val)}
                    icon={BookOpen}
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Single Field Due Date & Time & Total Marks Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Custom Single Field Due Date & Time */}
                <SingleFieldDateTimePicker
                  value={form.dueDate}
                  onChange={(val) => updateField("dueDate", val)}
                  disabled={isSaving}
                />

                {/* Total Marks */}
                <div>
                  <label htmlFor="assignment-total-marks" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Marks *
                  </label>
                  <input
                    id="assignment-total-marks"
                    type="number"
                    min={1}
                    value={form.totalMarks}
                    onChange={(e) => updateField("totalMarks", Number(e.target.value))}
                    disabled={isSaving}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <ModalSelectDropdown
                  value={form.status}
                  options={["ACTIVE", "DRAFT", "CLOSED"]}
                  displayMap={STATUS_DISPLAY_MAP}
                  onChange={(val) => updateField("status", val)}
                  icon={Layers}
                  disabled={isSaving}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="assignment-description" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Instructions *
                </label>
                <textarea
                  id="assignment-description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Add coursework instructions, guidelines, or submission requirements..."
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      {isEditing ? "Save Changes" : "Create Assignment"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ========================================================= */
/* SINGLE FIELD DUE DATE & TIME PICKER COMPONENT */
/* ========================================================= */

function SingleFieldDateTimePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const formattedPreview = useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  }, [value]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="assignment-due-date" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Deadline Date & Time *
        </label>
        {formattedPreview && (
          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-500/20 truncate max-w-[200px]">
            {formattedPreview}
          </span>
        )}
      </div>

      <div className="relative group">
        <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-indigo-600 text-white shadow-xs">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>
        </div>

        <input
          id="assignment-due-date"
          type="datetime-local"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-10 w-full rounded-xl border border-slate-200/90 bg-slate-50/80 pl-11 pr-3 text-xs font-bold text-slate-800 outline-none transition-all duration-200 hover:border-indigo-300 hover:bg-white focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/90 dark:bg-slate-800/80 dark:text-slate-100 cursor-pointer"
        />
      </div>
    </div>
  );
}

/* ========================================================= */
/* MODAL SELECT DROPDOWN COMPONENT */
/* ========================================================= */

function ModalSelectDropdown({
  value,
  options,
  displayMap,
  onChange,
  icon: Icon,
  disabled = false,
}: {
  value: string;
  options: string[];
  displayMap?: Record<string, string>;
  onChange: (val: string) => void;
  icon: React.ElementType;
  disabled?: boolean;
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

  const displayText = displayMap?.[value] || value;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
      >
        <span className="truncate flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>{displayText}</span>
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
            className="absolute left-0 top-full z-40 mt-1.5 w-full max-h-56 overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900"
          >
            {options.map((option) => {
              const isSelected = option === value;
              const label = displayMap?.[option] || option;
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
                  <span className="truncate">{label}</span>
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