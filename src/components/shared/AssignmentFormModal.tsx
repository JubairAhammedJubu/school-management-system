"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  CalendarDays,
  BookOpen,
  Users,
  Save,
  Loader2,
} from "lucide-react";

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
};

type AssignmentFormModalProps = {
  isOpen: boolean;
  onClose: () => void;

  assignment?: Assignment | null;

  teacherEmail?: string;
  teacherName?: string;

  onSaved?: (assignment: Assignment) => void;

  // Kept for compatibility with your existing page/component code.
  onSubmit?: (data: AssignmentFormData) => Promise<void>;
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

const EMPTY_FORM: AssignmentFormData = {
  title: "",
  description: "",
  subject: "",
  grade: "",
  section: "",
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
  onSubmit,
}: AssignmentFormModalProps) {
  const isEditing = Boolean(assignment);

  const [form, setForm] = useState<AssignmentFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (assignment) {
      const date = new Date(assignment.dueDate);

      const formattedDate = Number.isNaN(date.getTime())
        ? ""
        : date.toISOString().slice(0, 16);

      setForm({
        title: assignment.title || "",
        description: assignment.description || "",
        subject: assignment.subject || "",
        grade: assignment.grade || "",
        section: assignment.section || "",
        dueDate: formattedDate,
        totalMarks: assignment.totalMarks || 100,
        teacherEmail: assignment.teacherEmail || teacherEmail,
        teacherName: assignment.teacherName || teacherName,
        status: assignment.status || "ACTIVE",
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        teacherEmail,
        teacherName,
      });
    }

    setError("");
  }, [isOpen, assignment, teacherEmail, teacherName]);

  const updateField = (
    field: keyof AssignmentFormData,
    value: string | number
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Assignment title is required.");
      return;
    }

    if (!form.subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (!form.grade.trim()) {
      setError("Grade is required.");
      return;
    }

    if (!form.section.trim()) {
      setError("Section is required.");
      return;
    }

    if (!form.dueDate) {
      setError("Due date is required.");
      return;
    }

    if (!form.teacherEmail.trim()) {
      setError("Teacher email is required.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      /*
       * If the parent supplied onSubmit, use it.
       * This keeps the component compatible with your existing page.
       */
      if (onSubmit) {
        await onSubmit(form);

        onClose();
        return;
      }

      const url = assignment
        ? `http://localhost:5000/api/teacher/assignments/${assignment.id}`
        : "http://localhost:5000/api/teacher/assignments";

      const method = assignment ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          subject: form.subject.trim(),
          grade: form.grade.trim(),
          section: form.section.trim(),
          dueDate: new Date(form.dueDate).toISOString(),
          totalMarks: Number(form.totalMarks) || 100,
          teacherEmail: form.teacherEmail.trim(),
          teacherName: form.teacherName.trim(),
          status: form.status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            `Failed to ${assignment ? "update" : "create"} assignment`
        );
      }

      if (data.assignment) {
        onSaved?.(data.assignment);
      }

      onClose();
    } catch (err) {
      console.error("Assignment save error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the assignment."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
            onClick={isSaving ? undefined : onClose}
          />

          {/* Modal wrapper */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7 dark:border-slate-800">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                      {isEditing
                        ? "Edit Assignment"
                        : "Create Assignment"}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {isEditing
                        ? "Update the assignment details below."
                        : "Create a new assignment for your students."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-7">
                  {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                      {error}
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Title */}
                    <div>
                      <label
                        htmlFor="assignment-title"
                        className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200"
                      >
                        Assignment Title
                      </label>

                      <div className="relative">
                        <FileText className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          id="assignment-title"
                          type="text"
                          value={form.title}
                          onChange={(event) =>
                            updateField("title", event.target.value)
                          }
                          placeholder="e.g. Chapter 5 Mathematics"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="assignment-description"
                        className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200"
                      >
                        Description
                        <span className="ml-1 font-normal text-slate-400">
                          (optional)
                        </span>
                      </label>

                      <textarea
                        id="assignment-description"
                        value={form.description}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        placeholder="Add instructions or details for students..."
                        rows={4}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                      />
                    </div>

                    {/* Subject / Grade / Section */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <FormInput
                        label="Subject"
                        icon={BookOpen}
                        value={form.subject}
                        placeholder="Mathematics"
                        onChange={(value) =>
                          updateField("subject", value)
                        }
                      />

                      <FormInput
                        label="Grade"
                        icon={Users}
                        value={form.grade}
                        placeholder="Grade 10"
                        onChange={(value) => updateField("grade", value)}
                      />

                      <FormInput
                        label="Section"
                        icon={Users}
                        value={form.section}
                        placeholder="A"
                        onChange={(value) => updateField("section", value)}
                      />
                    </div>

                    {/* Due date / marks */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="assignment-due-date"
                          className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200"
                        >
                          Due Date
                        </label>

                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                          <input
                            id="assignment-due-date"
                            type="datetime-local"
                            value={form.dueDate}
                            onChange={(event) =>
                              updateField("dueDate", event.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="assignment-total-marks"
                          className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200"
                        >
                          Total Marks
                        </label>

                        <input
                          id="assignment-total-marks"
                          type="number"
                          min={1}
                          value={form.totalMarks}
                          onChange={(event) =>
                            updateField(
                              "totalMarks",
                              Number(event.target.value)
                            )
                          }
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label
                        htmlFor="assignment-status"
                        className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200"
                      >
                        Status
                      </label>

                      <select
                        id="assignment-status"
                        value={form.status}
                        onChange={(event) =>
                          updateField("status", event.target.value)
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-7">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSaving}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {isEditing
                          ? "Save Changes"
                          : "Create Assignment"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function FormInput({
  label,
  icon: Icon,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">
        {label}
      </label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
        />
      </div>
    </div>
  );
}