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

  // Present when editing an existing assignment
  assignment?: Assignment | null;

  // Current logged-in teacher
  teacherEmail?: string;
  teacherName?: string;

  // Called after successful API save
  onSaved?: (assignment: Assignment) => void;

  // Called after successful save (compat with page.tsx)
  onSuccess?: (savedAssignment?: any, mode?: any) => void;

  // Optional compatibility with your previous implementation
  onSubmit?: (data: AssignmentFormData) => Promise<void>;
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
  onSuccess,
  onSubmit,
}: AssignmentFormModalProps) {
  const isEditing = Boolean(assignment);

  const [form, setForm] = useState<AssignmentFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * Populate the form when:
   * - modal opens for creating
   * - modal opens for editing
   * - selected assignment changes
   */
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
        subject: assignment.subject || "",
        grade: assignment.grade || "",
        section: assignment.section || "",
        dueDate: formattedDueDate,
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

  /*
   * Prevent background page scrolling while modal is open.
   */
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const updateField = (
    field: keyof AssignmentFormData,
    value: string | number
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    /*
     * Client-side validation
     */
    if (!form.title.trim()) {
      setError("Assignment title is required.");
      toast.error("Assignment title is required.");
      return;
    }

    if (!form.subject.trim()) {
      setError("Subject is required.");
      toast.error("Subject is required.");
      return;
    }

    if (!form.grade.trim()) {
      setError("Grade is required.");
      toast.error("Grade is required.");
      return;
    }

    if (!form.section.trim()) {
      setError("Section is required.");
      toast.error("Section is required.");
      return;
    }

    if (!form.dueDate) {
      setError("Due date is required.");
      toast.error("Due date is required.");
      return;
    }

    if (!form.teacherEmail.trim()) {
      setError("Teacher email is required.");
      toast.error("Teacher email is required.");
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

      /*
       * Compatibility mode:
       * If parent supplied onSubmit, let the parent handle saving.
       */
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

      /*
       * Create:
       * POST /api/teacher/assignments
       *
       * Edit:
       * PATCH /api/teacher/assignments/:id
       */
      const url = isEditing
        ? `http://localhost:5000/api/teacher/assignments/${assignment?.id}`
        : "http://localhost:5000/api/teacher/assignments";

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
          teacherEmail: form.teacherEmail.trim(),
          teacherName: form.teacherName.trim() || null,
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

      /*
       * Send updated/new assignment back to parent.
       */
      if (data.assignment) {
        onSaved?.(data.assignment);
        onSuccess?.(data.assignment, isEditing ? "update" : "create");
      }

      /*
       * Success toast
       */
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-slate-950/55 backdrop-blur-sm"
            onMouseDown={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              transition={{
                duration: 0.22,
                ease: "easeOut",
              }}
              className="relative my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-h-[calc(100vh-3rem)]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              {/* Header */}
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-7">
                <div className="flex min-w-0 items-start gap-3.5">
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
                        ? "Update the assignment details and save your changes."
                        : "Create a new assignment for your students."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  aria-label="Close modal"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form content */}
              <form
                onSubmit={handleSubmit}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
                  {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
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
                          disabled={isSaving}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
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
                          updateField(
                            "description",
                            event.target.value
                          )
                        }
                        placeholder="Add instructions or details for students..."
                        rows={4}
                        disabled={isSaving}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                      />
                    </div>

                    {/* Subject / Grade / Section */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <FormInput
                        label="Subject"
                        icon={BookOpen}
                        value={form.subject}
                        placeholder="Mathematics"
                        disabled={isSaving}
                        onChange={(value) =>
                          updateField("subject", value)
                        }
                      />

                      <FormInput
                        label="Grade"
                        icon={Users}
                        value={form.grade}
                        placeholder="Grade 10"
                        disabled={isSaving}
                        onChange={(value) =>
                          updateField("grade", value)
                        }
                      />

                      <FormInput
                        label="Section"
                        icon={Users}
                        value={form.section}
                        placeholder="A"
                        disabled={isSaving}
                        onChange={(value) =>
                          updateField("section", value)
                        }
                      />
                    </div>

                    {/* Due date / Total marks */}
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
                              updateField(
                                "dueDate",
                                event.target.value
                              )
                            }
                            disabled={isSaving}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
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
                          disabled={isSaving}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
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
                        disabled={isSaving}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-7">
                  <button
                    type="button"
                    onClick={handleClose}
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
  disabled,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  placeholder: string;
  disabled?: boolean;
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
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
        />
      </div>
    </div>
  );
}