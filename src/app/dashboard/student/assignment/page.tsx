"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FileText,
  Sparkles,
  Clock3,
  CheckCircle2,
  UploadCloud,
  Loader2,
  Trash2,
} from "lucide-react";

interface AssignmentRecord {
  id?: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "ACTIVE" | "graded";
  grade?: string;
}

// const assignments: AssignmentRecord[] = [
//   { title: "Algebra Problem Set 4", subject: "Mathematics", dueDate: "Aug 27, 2026", status: "pending" },
//   { title: "Lab Report: Photosynthesis", subject: "Biology", dueDate: "Aug 29, 2026", status: "pending" },
//   { title: "Essay: Industrial Revolution", subject: "History", dueDate: "Aug 31, 2026", status: "pending" },
//   { title: "Grammar Worksheet 3", subject: "English", dueDate: "Aug 20, 2026", status: "submitted" },
//   { title: "Newton's Laws Quiz Prep", subject: "Physics", dueDate: "Aug 15, 2026", status: "graded", grade: "18/20" },
//   { title: "Recursion Practice Set", subject: "Computer Science", dueDate: "Aug 12, 2026", status: "graded", grade: "20/20" },
// ];

const getAssignments = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/assignments`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch assignments");
    }

    console.log("Assignments:", data.assignments);
    return data.assignments;
  } catch (error) {
    console.error("Error fetching assignments:", error);
  }
};

const statusStyles: Record<
  AssignmentRecord["status"],
  {
    label: string;
    className: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    icon: Clock3,
  },
  ACTIVE: {
    label: "ACTIVE",
    className:
      "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
    icon: UploadCloud,
  },
  graded: {
    label: "Graded",
    className:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    icon: CheckCircle2,
  },
};

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      const data = await getAssignments();
      if (data) {
        setAssignments(data);
      }
    };

    fetchAssignments();
  }, []);

  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const submittedCount = assignments.filter(
    (a) => a.status === "ACTIVE",
  ).length;
  const gradedCount = assignments.filter((a) => a.status === "graded").length;
  const selectedAssignment = assignments.find(
    (assignment) =>
      (assignment.id ?? assignment.title) === selectedAssignmentId,
  );
  const submittableAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "pending" || assignment.status === "ACTIVE",
  );

  const handleFileChange = (file: File | undefined) => {
    setSubmitError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setSelectedFile(null);
      setSubmitError("Please choose a PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setSubmitError("PDF files must be 10 MB or smaller.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (!selectedAssignment || !selectedFile) {
      toast.error(
        "Select an assignment and attach your PDF before submitting.",
      );
      setSubmitError(
        "Select an assignment and attach your PDF before submitting.",
      );
      return;
    }

    if (!selectedAssignment.id) {
      toast.error(
        "This assignment cannot be submitted because it has no identifier.",
      );
      setSubmitError(
        "This assignment cannot be submitted because it has no identifier.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/assignments/${selectedAssignment.id}/upload`,
        { method: "POST", credentials: "include", body: formData },
      );
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Failed to upload assignment PDF");
      }

      const fileUrl = uploadData.fileUrl || uploadData.url;
      if (typeof fileUrl !== "string" || !fileUrl.trim()) {
        throw new Error("The uploaded PDF URL was not returned by the server.");
      }

      const submitResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/assignments/${selectedAssignment.id}/submit`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `PDF submission: ${selectedFile.name}`,
            fileUrl: fileUrl.trim(),
          }),
        },
      );
      const submitData = await submitResponse.json();

      if (!submitResponse.ok) {
        throw new Error(submitData.error || "Failed to submit assignment");
      }

      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === selectedAssignment.id
            ? { ...assignment, status: "ACTIVE" }
            : assignment,
        ),
      );
      setSelectedFile(null);
      setSelectedAssignmentId("");
      toast.success("Assignment submitted successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit assignment";
      toast.error(message);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 p-6 sm:p-8 text-slate-900 dark:text-white shadow-xs transition-colors duration-300"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-2xs shrink-0">
            <FileText className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <Sparkles className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                Student Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              Assignments
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Track, submit, and review your assignments.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Pending",
            value: pendingCount,
            className: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Submitted",
            value: submittedCount,
            className: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Graded",
            value: gradedCount,
            className: "text-emerald-600 dark:text-emerald-400",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.06, ease: "easeOut" }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center shadow-xs transition-colors duration-300"
          >
            <p
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${item.className}`}
            >
              {item.value}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12, ease: "easeOut" }}
        className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 shadow-xs dark:border-blue-900/60 dark:bg-blue-950/20 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Submit an assignment
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Upload a PDF up to 10 MB. You can submit each assignment up to two
              times.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Assignment
            </span>
            <select
              value={selectedAssignmentId}
              onChange={(event) => {
                setSelectedAssignmentId(event.target.value);
                setSubmitError("");
              }}
              disabled={submittableAssignments.length === 0 || isSubmitting}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800"
            >
              <option value="">Choose an assignment</option>
              {submittableAssignments.map((assignment) => (
                <option
                  key={assignment.id ?? assignment.title}
                  value={assignment.id ?? assignment.title}
                >
                  {assignment.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              PDF file
            </span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => handleFileChange(event.target.files?.[0])}
              disabled={isSubmitting}
              className="block h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-xs text-slate-600 file:mr-3 file:h-full file:border-0 file:bg-slate-100 file:px-3 file:font-semibold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:file:bg-slate-800"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !selectedAssignment || !selectedFile}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            {isSubmitting ? "Submitting..." : "Submit PDF"}
          </button>
        </form>

        {selectedFile && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs dark:border-blue-900/60 dark:bg-slate-900">
            <span className="flex min-w-0 items-center gap-2 text-slate-700 dark:text-slate-300">
              <FileText className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="truncate">{selectedFile.name}</span>
              <span className="shrink-0 text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              disabled={isSubmitting}
              className="shrink-0 text-slate-500 hover:text-red-600"
              aria-label="Remove selected PDF"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
        {submitError && (
          <p className="mt-3 text-xs font-semibold text-red-600 dark:text-red-400">
            {submitError}
          </p>
        )}
        {submittableAssignments.length === 0 && (
          <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            There are no open assignments to submit right now.
          </p>
        )}
      </motion.section>

      {/* Assignments Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors duration-300 overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            All Assignments
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Assignment
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Subject
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Due Date
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((item, idx) => {
                const style = statusStyles[item.status];
                const StatusIcon = style.icon;
                return (
                  <tr
                    key={`${item.title}-${idx}`}
                    className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                  >
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {item.title}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {item.subject}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {item.dueDate}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {style.label}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {item.grade ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
