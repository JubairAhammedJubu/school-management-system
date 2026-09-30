"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FileText,
  Clock3,
  CheckCircle2,
  UploadCloud,
  Loader2,
  Trash2,
  ExternalLink,
  X,
  RefreshCw,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface AssignmentRecord {
  id?: string;
  title: string;
  subject: string;
  dueDate: string;
  submitStatus: "PENDING" | "SUBMITTED" | "GRADED";
  grade?: string;
  totalMarks?: number;
  marks?: number | null;
  feedback?: string | null;
  fileUrl?: string;
  attemptsUsed: number;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isSafePdfUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

const parseJsonResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  const rawText = await response.text();
  throw new Error(
    `Server returned non-JSON response (${response.status}): ${rawText.slice(0, 100)}...`,
  );
};

const getAssignments = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/assignments`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    const data = await parseJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch assignments");
    }

    return data.assignments || [];
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};

const statusStyles: Record<
  AssignmentRecord["submitStatus"],
  {
    label: string;
    className: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    icon: Clock3,
  },
  SUBMITTED: {
    label: "Submitted",
    className:
      "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
    icon: UploadCloud,
  },
  GRADED: {
    label: "Graded",
    className:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    icon: CheckCircle2,
  },
};

function AssignmentSelect({
  assignments,
  value,
  onChange,
  disabled,
}: {
  assignments: AssignmentRecord[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItem = assignments.find(
    (a) => (a.id ?? a.title) === value,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-800 shadow-2xs outline-none transition-all hover:border-indigo-400 focus:border-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-indigo-500 cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          <FileText className="h-4 w-4 shrink-0 text-indigo-500" />
          <span className="truncate">
            {selectedItem
              ? `${selectedItem.title} — ${selectedItem.subject}`
              : "Choose an assignment"}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            {assignments.length === 0 ? (
              <p className="p-3 text-center text-xs text-slate-400">
                No submittable assignments available
              </p>
            ) : (
              assignments.map((assignment) => {
                const id = assignment.id ?? assignment.title;
                const isSelected = id === value;
                const attemptsUsed = assignment.attemptsUsed ?? 0;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onChange(id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="truncate font-semibold">
                        {assignment.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {assignment.subject}
                        </span>
                        <span>•</span>
                        <span>Due {formatDate(assignment.dueDate)}</span>
                        <span>•</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {attemptsUsed === 1 ? "1 attempt left" : "2 attempts left"}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto p-5 sm:p-6 animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentAssignmentsPage() {
  const { isPending: isSessionLoading } = useSession();
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [previewUrl, setPreviewUrl] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const fetchAssignments = async (refresh = false) => {
    try {
      setIsLoading(true);
      if (refresh) setIsRefreshing(true);
      const data = await getAssignments();
      if (data) {
        setAssignments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isSessionLoading) return;
    fetchAssignments();
  }, [isSessionLoading]);

  const pendingCount = assignments.filter(
    (a) => a.submitStatus === "PENDING",
  ).length;
  const submittedAssignments = assignments.filter(
    (a) => a.submitStatus === "SUBMITTED",
  );
  const turnedInAssignments = assignments.filter(
    (a) => a.submitStatus === "SUBMITTED" || a.submitStatus === "GRADED",
  );
  const submittedCount = submittedAssignments.length;
  const gradedCount = assignments.filter(
    (a) => a.submitStatus === "GRADED",
  ).length;
  const selectedAssignment = assignments.find(
    (assignment) =>
      (assignment.id ?? assignment.title) === selectedAssignmentId,
  );

  // Filter out assignments that are GRADED or have used max 2 attempts
  const submittableAssignments = assignments.filter((assignment) => {
    const attempts = assignment.attemptsUsed ?? 0;
    return assignment.submitStatus !== "GRADED" && attempts < 2;
  });

  const pendingAssignmentsList = assignments.filter(
    (item) => item.submitStatus === "PENDING",
  );
  const totalPages = Math.ceil(pendingAssignmentsList.length / pageSize) || 1;
  const paginatedPending = pendingAssignmentsList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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
      const msg = "Select an assignment and attach your PDF before submitting.";
      toast.error(msg);
      setSubmitError(msg);
      return;
    }

    if (!selectedAssignment.id) {
      const msg =
        "This assignment cannot be submitted because it has no identifier.";
      toast.error(msg);
      setSubmitError(msg);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/assignments/${selectedAssignment.id}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const uploadData = await parseJsonResponse(uploadResponse);

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Failed to upload assignment PDF");
      }

      const fileUrl = uploadData.fileUrl || uploadData.url;

      if (typeof fileUrl !== "string" || !fileUrl.trim()) {
        throw new Error("The uploaded PDF URL was not returned by the server.");
      }

      if (!isSafePdfUrl(fileUrl.trim())) {
        throw new Error("Invalid or unsafe file URL returned by the server.");
      }

      const safeFileUrl = fileUrl.trim();

      const submitResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/assignments/${selectedAssignment.id}/submit`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `PDF submission: ${selectedFile.name}`,
            fileUrl: safeFileUrl,
          }),
        },
      );

      const submitData = await parseJsonResponse(submitResponse);

      if (!submitResponse.ok) {
        throw new Error(submitData.error || "Failed to submit assignment");
      }

      const newAttemptsUsed =
        submitData.attemptsUsed ?? (selectedAssignment.attemptsUsed || 0) + 1;

      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === selectedAssignment.id
            ? {
                ...assignment,
                submitStatus: "SUBMITTED",
                fileUrl: safeFileUrl,
                attemptsUsed: newAttemptsUsed,
              }
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
      {/* Executive Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-indigo-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FileText className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Student Workspace
                </span>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Assignments & Coursework
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Track assigned tasks, upload PDF submissions, monitor review attempts, and check teacher feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => fetchAssignments(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing
                    ? "animate-spin text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* High-Contrast Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Assignments",
            value: isLoading || isRefreshing ? null : String(assignments.length),
            icon: FileText,
            detail: "Assigned course tasks",
          },
          {
            label: "Pending Submission",
            value: isLoading || isRefreshing ? null : String(pendingCount),
            icon: Clock3,
            detail: "Action required",
          },
          {
            label: "Submitted Tasks",
            value: isLoading || isRefreshing ? null : String(submittedCount),
            icon: UploadCloud,
            detail: "Turned in for review",
          },
          {
            label: "Graded & Reviewed",
            value: isLoading || isRefreshing ? null : String(gradedCount),
            icon: CheckCircle2,
            detail: "Marks & feedback available",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl hover:border-indigo-500/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
                <item.icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {item.label}
            </p>

            {item.value === null ? (
              <div className="mt-1 h-7 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {item.value}
              </p>
            )}

            <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Submit Assignment Card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12, ease: "easeOut" }}
        className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 shadow-xs dark:border-indigo-900/60 dark:bg-indigo-950/20 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Submit an assignment
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Upload a PDF up to 10 MB. You can submit each assignment up to two times.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] lg:items-end"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Choose Assignment
            </span>
            <AssignmentSelect
              assignments={submittableAssignments}
              value={selectedAssignmentId}
              onChange={(id) => {
                setSelectedAssignmentId(id);
                setSelectedFile(null);
                setSubmitError("");
              }}
              disabled={submittableAssignments.length === 0 || isSubmitting}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>PDF file</span>
              {!selectedAssignmentId && (
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  (Select assignment first)
                </span>
              )}
            </span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => handleFileChange(event.target.files?.[0])}
              disabled={!selectedAssignmentId || isSubmitting}
              className="block h-11 w-full rounded-xl border border-slate-200 bg-white text-xs text-slate-600 file:mr-3 file:h-full file:border-0 file:bg-slate-100 file:px-3 file:font-semibold disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:file:bg-slate-800 cursor-pointer"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !selectedAssignment || !selectedFile}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-white px-3.5 py-2.5 text-xs dark:border-indigo-900/60 dark:bg-slate-900">
            <span className="flex min-w-0 items-center gap-2 text-slate-700 dark:text-slate-300">
              <FileText className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="truncate font-semibold">{selectedFile.name}</span>
              <span className="shrink-0 text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              disabled={isSubmitting}
              className="shrink-0 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              aria-label="Remove selected PDF"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
        {submitError && (
          <p className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {submitError}
          </p>
        )}
        {submittableAssignments.length === 0 && (
          <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            There are no open assignments to submit right now.
          </p>
        )}
      </motion.section>

      {/* Submissions Section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs transition-colors duration-300 overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Your submissions
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Scores and comments appear here after your teacher saves them.
              </p>
            </div>
          </div>
        </div>

        {isLoading || isRefreshing ? (
          <TableSkeleton rows={3} />
        ) : turnedInAssignments.length === 0 ? (
          <p className="px-5 sm:px-6 py-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            You haven&apos;t submitted any assignments yet.
          </p>
        ) : (
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
                    Attempts
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Score
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    PDF
                  </th>
                </tr>
              </thead>
              <tbody>
                {turnedInAssignments.map((item, idx) => {
                  const style = statusStyles[item.submitStatus];
                  const StatusIcon = style?.icon || CheckCircle2;
                  const attemptsUsed = item.attemptsUsed ?? 0;

                  return (
                    <tr
                      key={item.id ?? `${item.title}-submitted-${idx}`}
                      className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                        <div>{item.title}</div>
                        {item.feedback ? (
                          <p className="mt-1 max-w-sm text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                            {item.feedback}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {item.subject}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(item.dueDate)}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                            style?.className || ""
                          }`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {style?.label || item.submitStatus}
                        </span>
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                        {attemptsUsed} / 2
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {item.marks != null ? (
                          `${item.marks}${item.totalMarks ? `/${item.totalMarks}` : ""}`
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm">
                        {item.fileUrl && isSafePdfUrl(item.fileUrl) ? (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewUrl({
                                url: item.fileUrl!,
                                title: item.title,
                              })
                            }
                            className="font-semibold cursor-pointer text-indigo-600 hover:underline dark:text-indigo-400"
                          >
                            View PDF
                          </button>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>

      {/* All Assignments Table with Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs transition-colors duration-300 overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              All Pending Assignments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tasks waiting for your PDF submission
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {pendingAssignmentsList.length} total
          </span>
        </div>

        {isLoading || isRefreshing ? (
          <TableSkeleton rows={4} />
        ) : pendingAssignmentsList.length === 0 ? (
          <div className="px-5 sm:px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
              No pending assignments
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              You have submitted all your assignments or there are none available right now.
            </p>
          </div>
        ) : (
          <>
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
                  {paginatedPending.map((item, idx) => {
                    const style = statusStyles[item.submitStatus];
                    const StatusIcon = style?.icon || Clock3;
                    return (
                      <tr
                        key={item.id ?? `${item.title}-${idx}`}
                        className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {item.title}
                        </td>
                        <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          {item.subject}
                        </td>
                        <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          {formatDate(item.dueDate)}
                        </td>
                        <td className="px-5 sm:px-6 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                              style?.className || ""
                            }`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {style?.label || item.submitStatus}
                          </span>
                        </td>
                        <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {item.grade ? (
                            item.grade
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pendingAssignmentsList.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, pendingAssignmentsList.length)} to{" "}
                  {Math.min(currentPage * pageSize, pendingAssignmentsList.length)} of {pendingAssignmentsList.length} assignments
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 font-semibold text-slate-700 dark:text-slate-300">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* PDF Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewUrl(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative z-10 w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            {/* PDF Viewer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-3 sm:px-6 py-2.5 sm:py-3.5 dark:border-slate-800 dark:bg-slate-900 gap-2 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                  <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {previewUrl.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <a
                  href={previewUrl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Open New Tab</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewUrl(null)}
                  className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-xl bg-slate-200/80 text-slate-500 hover:bg-slate-300 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                >
                  <X className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </button>
              </div>
            </div>

            {/* PDF iframe Container */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-900 w-full h-full relative">
              <iframe
                src={previewUrl.url}
                className="w-full h-full border-0"
                title={previewUrl.title}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
