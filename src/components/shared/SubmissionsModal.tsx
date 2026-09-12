"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  ExternalLink,
  Download,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  BookOpen,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";

export type SubmissionStudent = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  studentClass?: string | null;
  studentSection?: string | null;
};

export type SubmissionItem = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentEmail: string;
  fileUrl?: string | null;
  content?: string | null;
  attemptsUsed: number;
  status: string; // "SUBMITTED" | "GRADED" | "LATE"
  submittedAt: string;
  createdAt?: string;
  updatedAt?: string;
  student?: SubmissionStudent | null;
};

export type AssignmentForModal = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  section: string;
  dueDate: string;
  totalMarks: number;
  status?: string;
  teacherEmail?: string;
  teacherName?: string | null;
  submissions?: SubmissionItem[];
};

type SubmissionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  assignment: AssignmentForModal | null;
};

export default function SubmissionsModal({
  isOpen,
  onClose,
  assignment,
}: SubmissionsModalProps) {
  const [activePreviewPdf, setActivePreviewPdf] = useState<{
    url: string;
    studentName: string;
    filename: string;
  } | null>(null);

  if (!isOpen || !assignment) return null;

  const submissions = assignment.submissions || [];
  const totalSubmissions = submissions.length;
  const gradedCount = submissions.filter((s) => s.status === "GRADED").length;
  const lateCount = submissions.filter((s) => s.status === "LATE").length;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const extractFilename = (submission: SubmissionItem) => {
    if (submission.content && submission.content.startsWith("PDF submission: ")) {
      return submission.content.replace("PDF submission: ", "");
    }
    if (submission.fileUrl) {
      const parts = submission.fileUrl.split("/");
      return parts[parts.length - 1] || "Submitted_Document.pdf";
    }
    return "Submission_File.pdf";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex min-h-full items-center justify-center p-2 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          {/* Main Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative z-10 my-auto w-full max-w-4xl max-h-[94vh] sm:max-h-[92vh] flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            {/* Ambient Background Gradient Accent */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl" />

            {/* Modal Header */}
            <div className="relative shrink-0 flex items-start justify-between border-b border-slate-200 bg-white p-3.5 sm:px-6 sm:py-5 dark:border-slate-800 dark:bg-slate-950 gap-2.5 sm:gap-3">
              <div className="flex items-start gap-2.5 sm:gap-4 min-w-0 flex-1">
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-indigo-50 font-black text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 text-xs sm:text-sm shadow-xs">
                  <BookOpen className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] sm:text-xs font-extrabold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                      {assignment.subject}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      Class {assignment.grade} · {assignment.section}
                    </span>
                  </div>

                  <h2 className="mt-1 text-sm sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug break-words">
                    {assignment.title}
                  </h2>

                  <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 sm:gap-3 flex-wrap font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
                      {assignment.totalMarks} Points
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer shrink-0 border border-slate-200/60 dark:border-slate-700/60"
              >
                <X className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
            </div>

            {/* Quick Metrics Header Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 border-b border-slate-200 bg-slate-50/70 p-2.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl bg-white p-2.5 sm:p-3 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                  <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Submissions
                  </p>
                  <p className="text-sm sm:text-lg font-black text-slate-950 dark:text-white leading-tight">
                    {totalSubmissions}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl bg-white p-2.5 sm:p-3 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                  <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Graded
                  </p>
                  <p className="text-sm sm:text-lg font-black text-slate-950 dark:text-white leading-tight">
                    {gradedCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl bg-white p-2.5 sm:p-3 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                  <Clock className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Late Turns
                  </p>
                  <p className="text-sm sm:text-lg font-black text-slate-950 dark:text-white leading-tight">
                    {lateCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Submissions List Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 custom-scrollbar">
              {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 px-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 mb-2.5">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    No Submissions Received Yet
                  </h4>
                  <p className="mt-1 max-w-sm text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Students assigned to Class {assignment.grade} Section {assignment.section} have not submitted answers for this assignment yet.
                  </p>
                </div>
              ) : (
                submissions.map((submission, index) => {
                  const filename = extractFilename(submission);
                  const studentName =
                    submission.student?.name ||
                    submission.studentEmail.split("@")[0];
                  const studentEmail = submission.studentEmail;

                  return (
                    <motion.div
                      key={submission.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs transition-all duration-200 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                    >
                      {/* Left: Student Info & Submission Details */}
                      <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                        <div className="flex h-9 w-9 sm:h-10.5 sm:w-10.5 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-black text-white dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 text-xs sm:text-sm shadow-xs">
                          {studentName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                              {studentName}
                            </h4>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800/90 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 truncate max-w-full w-fit">
                              {studentEmail}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              {formatDate(submission.submittedAt)}
                            </span>

                            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                              Attempt {submission.attemptsUsed}
                            </span>

                            <StatusBadge status={submission.status} />
                          </div>

                          {/* File snippet line */}
                          <div className="mt-2 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-xl px-2.5 py-1.5 max-w-full min-w-0">
                            <FileText className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate min-w-0 flex-1">
                              {filename}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions (Preview PDF & Download) */}
                      {submission.fileUrl ? (
                        <div className="flex items-center gap-2 shrink-0 sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80 justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setActivePreviewPdf({
                                url: submission.fileUrl!,
                                studentName,
                                filename,
                              })
                            }
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Preview PDF
                          </button>

                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
                            title="Open in new tab / Download"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs italic text-slate-400">
                          No file attached
                        </span>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 border-t border-slate-200 bg-slate-50/80 p-3 sm:px-6 sm:py-4 dark:border-slate-800 dark:bg-slate-950 text-center sm:text-left shrink-0">
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                Only assignment creator ({assignment.teacherEmail || "You"}) can view these submissions.
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>

          {/* Nested PDF Viewer Modal */}
          <AnimatePresence>
            {activePreviewPdf && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-6 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActivePreviewPdf(null)}
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
                          {activePreviewPdf.filename}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                          Submitted by {activePreviewPdf.studentName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <a
                        href={activePreviewPdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="hidden xs:inline">Open New Tab</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setActivePreviewPdf(null)}
                        className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-xl bg-slate-200/80 text-slate-500 hover:bg-slate-300 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <X className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* PDF iframe Container */}
                  <div className="flex-1 bg-slate-100 dark:bg-slate-900 w-full h-full relative">
                    <iframe
                      src={activePreviewPdf.url}
                      className="w-full h-full border-0"
                      title={activePreviewPdf.filename}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

function StatusBadge({ status }: { status: string }) {
  let badgeStyle =
    "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800/60";
  let label = status;

  if (status === "LATE") {
    badgeStyle =
      "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800/60";
    label = "Late Submission";
  } else if (status === "GRADED") {
    badgeStyle =
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60";
    label = "Graded";
  } else if (status === "SUBMITTED") {
    badgeStyle =
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60";
    label = "Submitted";
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold border ${badgeStyle}`}
    >
      {label}
    </span>
  );
}
