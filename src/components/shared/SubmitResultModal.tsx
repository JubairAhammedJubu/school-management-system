"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  GraduationCap,
  Award,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Search,
  Check,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import type { Result } from "@/components/shared/ResultList";
import { getTeacherStudentsAction, StudentUser } from "@/lib/actions/teacher-students";

type SubmitResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  result?: Result | null;
};

const EXAM_PRESETS = [
  "Mid-Term Examination",
  "Final Examination",
  "Quiz 1",
  "Quiz 2",
  "Lab Evaluation",
  "Unit Test",
  "Project Assessment",
];

export default function SubmitResultModal({
  isOpen,
  onClose,
  onSuccess,
  result = null,
}: SubmitResultModalProps) {
  const isEditMode = Boolean(result);

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [exam, setExam] = useState("");
  const [score, setScore] = useState("");
  const [total, setTotal] = useState("100");
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState("DRAFT");

  // Roster Auto-Select State
  const [enrolledStudents, setEnrolledStudents] = useState<StudentUser[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch enrolled students on modal open
  useEffect(() => {
    if (!isOpen) return;

    const fetchStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const res = await getTeacherStudentsAction({ limit: 100 });
        if (res.success && res.students) {
          setEnrolledStudents(res.students);
        }
      } catch (err) {
        console.error("Error fetching enrolled students for modal:", err);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [isOpen]);

  /*
   * Populate form when editing or reset when creating/closing.
   */
  useEffect(() => {
    if (!isOpen) {
      setStudentId("");
      setStudentName("");
      setStudentEmail("");
      setStudentClass("");
      setExam("");
      setScore("");
      setTotal("100");
      setGrade("");
      setStatus("DRAFT");
      setSelectedStudentId("");
      setError("");
      setIsSubmitting(false);
      return;
    }

    if (result) {
      setStudentId(result.studentId || "N/A");
      setStudentName(result.studentName || "N/A");
      setStudentEmail(result.studentEmail || "N/A");
      setStudentClass(result.studentClass || "N/A");
      setExam(result.exam || "");
      setScore(String(result.score ?? ""));
      setTotal(String(result.total ?? "100"));
      setGrade(result.grade || "");
      setStatus(result.status || "DRAFT");
      setSelectedStudentId(result.studentId || "");
      setError("");
    } else {
      setStudentId("");
      setStudentName("");
      setStudentEmail("");
      setStudentClass("");
      setExam("");
      setScore("");
      setTotal("100");
      setGrade("");
      setStatus("DRAFT");
      setSelectedStudentId("");
      setError("");
    }
  }, [isOpen, result]);

  // Auto-fill student details when a student is selected from roster dropdown
  const handleSelectStudentFromRoster = (st: StudentUser | null) => {
    if (!st) {
      setSelectedStudentId("");
      setStudentId("");
      setStudentName("");
      setStudentEmail("");
      setStudentClass("");
      return;
    }

    setSelectedStudentId(st.id);
    const rollVal = st.roll && st.roll.trim() !== "" ? st.roll.trim() : "N/A";
    const nameVal = st.name && st.name.trim() !== "" ? st.name.trim() : "N/A";
    const emailVal = st.email && st.email.trim() !== "" ? st.email.trim() : "N/A";
    const classVal = st.studentClass && st.studentClass.trim() !== "" ? st.studentClass.trim() : "N/A";

    setStudentId(rollVal);
    setStudentName(nameVal);
    setStudentEmail(emailVal);
    setStudentClass(classVal);
    if (error) setError("");
  };

  // Ensure score never exceeds total marks
  const handleScoreChange = (val: string) => {
    if (error) setError("");
    if (val === "") {
      setScore("");
      return;
    }

    const numericVal = Number(val);
    const numericTot = Number(total);

    if (Number.isFinite(numericVal) && Number.isFinite(numericTot) && numericTot > 0) {
      if (numericVal > numericTot) {
        setScore(String(numericTot));
        return;
      }
    }

    setScore(val);
  };

  const handleTotalChange = (val: string) => {
    if (error) setError("");
    setTotal(val);

    if (val === "") return;

    const numericTot = Number(val);
    const numericSc = Number(score);

    if (score !== "" && Number.isFinite(numericSc) && Number.isFinite(numericTot) && numericTot > 0) {
      if (numericSc > numericTot) {
        setScore(String(numericTot));
      }
    }
  };

  /*
   * Automatically calculate grade from score & total.
   */
  useEffect(() => {
    if (!score || !total) {
      setGrade("");
      return;
    }

    const numericScore = Number(score);
    const numericTotal = Number(total);

    if (
      !Number.isFinite(numericScore) ||
      !Number.isFinite(numericTotal) ||
      numericTotal <= 0
    ) {
      setGrade("");
      return;
    }

    const percentage = (numericScore / numericTotal) * 100;

    if (percentage >= 80) {
      setGrade("A+");
    } else if (percentage >= 70) {
      setGrade("A");
    } else if (percentage >= 60) {
      setGrade("B+");
    } else if (percentage >= 55) {
      setGrade("B");
    } else if (percentage >= 50) {
      setGrade("C");
    } else if (percentage >= 40) {
      setGrade("D");
    } else {
      setGrade("F");
    }
  }, [score, total]);

  const numericScore = Number(score);
  const numericTotal = Number(total);
  const calculatedPercentage =
    score && total && Number.isFinite(numericScore) && Number.isFinite(numericTotal) && numericTotal > 0
      ? ((numericScore / numericTotal) * 100).toFixed(1)
      : null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!selectedStudentId && !isEditMode) {
      setError("Please select a student from the roster.");
      return;
    }

    if (!exam.trim()) {
      setError("Exam name is required.");
      return;
    }

    if (!score || !total) {
      setError("Score and total marks are required.");
      return;
    }

    if (!Number.isFinite(numericScore) || !Number.isFinite(numericTotal)) {
      setError("Score and total marks must be valid numbers.");
      return;
    }

    if (numericTotal <= 0) {
      setError("Total marks must be greater than zero.");
      return;
    }

    if (numericScore < 0) {
      setError("Score cannot be negative.");
      return;
    }

    if (numericScore > numericTotal) {
      setError("Score cannot be greater than total marks.");
      return;
    }

    if (!grade) {
      setError("Grade could not be calculated.");
      return;
    }

    if (isEditMode && !result?.id) {
      setError("Result ID is missing.");
      return;
    }

    try {
      setIsSubmitting(true);
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/api/teacher/results/${result?.id}`
        : `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/api/teacher/results`;

      const method = isEditMode ? "PATCH" : "POST";

      const finalStudentId = studentId && studentId !== "N/A" ? studentId.trim() : (selectedStudentId || "N/A");
      const finalStudentName = studentName && studentName !== "N/A" ? studentName.trim() : "Student";
      const finalStudentEmail = (studentEmail && studentEmail !== "N/A" ? studentEmail.trim() : `student_${selectedStudentId}@school.edu`).toLowerCase();
      const finalStudentClass = studentClass && studentClass !== "N/A" ? studentClass.trim() : "General";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: finalStudentId,
          studentName: finalStudentName,
          studentEmail: finalStudentEmail,
          studentClass: finalStudentClass,
          exam: exam.trim(),
          score: numericScore,
          total: numericTotal,
          grade,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            (isEditMode
              ? "Failed to update result."
              : "Failed to submit result.")
        );
      }

      toast.success(
        isEditMode
          ? "Result updated successfully!"
          : "Result submitted successfully!"
      );

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(
        isEditMode ? "Error updating result:" : "Error submitting result:",
        err
      );
      const errorMessage =
        err?.message ||
        (isEditMode
          ? "Something went wrong while updating the result."
          : "Something went wrong while submitting the result.");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="submit-result-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex min-h-full items-center justify-center overflow-y-auto bg-black/60 p-3.5 sm:p-6 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) {
              onClose();
            }
          }}
        >
          <motion.div
            key="submit-result-modal-container"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative my-auto flex max-h-[88vh] sm:max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl flex items-center gap-2">
                    {isEditMode ? "Edit Examination Result" : "Enter Examination Result"}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {isEditMode
                      ? "Update recorded examination marks, grade, and publication status."
                      : "Submit student examination marks and grade allocations."}
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                disabled={isSubmitting}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 space-y-6">
                {/* Student Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      Student Selection
                    </h3>

                    {enrolledStudents.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {enrolledStudents.length} Students in Roster
                      </span>
                    )}
                  </div>

                  {/* Required Custom Roster Selector */}
                  {!isEditMode && (
                    <RosterSelectDropdown
                      students={enrolledStudents}
                      selectedStudentId={selectedStudentId}
                      onSelectStudent={handleSelectStudentFromRoster}
                      disabled={isSubmitting}
                      isLoading={isLoadingStudents}
                    />
                  )}

                  {/* Disabled Auto-Filled Student Fields */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DisabledInputField
                      label="Student Roll"
                      value={studentId}
                      placeholder="N/A"
                    />
                    <DisabledInputField
                      label="Student Name"
                      value={studentName}
                      placeholder="N/A"
                    />
                    <DisabledInputField
                      label="Student Email"
                      value={studentEmail}
                      placeholder="N/A"
                    />
                    <DisabledInputField
                      label="Class / Grade"
                      value={studentClass}
                      placeholder="N/A"
                    />
                  </div>
                </div>

                {/* Examination Details Section */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      Examination Details
                    </h3>
                  </div>

                  {/* Examination Title Presets & Input */}
                  <div>
                    <div className="space-y-2">
                      <ExamPresetSelect
                        value={exam}
                        onChange={(preset) => setExam(preset)}
                        disabled={isSubmitting}
                      />

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          Examination Title Details <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={exam}
                          onChange={(e) => setExam(e.target.value)}
                          placeholder="e.g. Mid-Term Algebra Examination"
                          disabled={isSubmitting}
                          required
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Marks */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField
                      label="Score"
                      type="number"
                      min="0"
                      max={total || undefined}
                      value={score}
                      onChange={handleScoreChange}
                      placeholder="e.g. 85"
                      disabled={isSubmitting}
                      helperText={total ? `Max limit: ${total}` : undefined}
                    />
                    <InputField
                      label="Total Marks"
                      type="number"
                      min="1"
                      value={total}
                      onChange={handleTotalChange}
                      placeholder="e.g. 100"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Live Percentage & Calculated Grade Badge */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Calculated Grade</span>
                        {calculatedPercentage && (
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span
                              className={`rounded px-1 py-0.2 font-bold ${
                                Number(calculatedPercentage) >= 40
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                                  : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20"
                              }`}
                            >
                              {Number(calculatedPercentage) >= 40 ? "PASS" : "FAIL"}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {calculatedPercentage}% Score
                            </span>
                          </div>
                        )}
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={grade ? `${grade} ${calculatedPercentage ? `(${calculatedPercentage}%)` : ""}` : ""}
                          readOnly
                          placeholder="Calculated automatically"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-black text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />

                        <AnimatePresence mode="wait">
                          {grade && (
                            <motion.span
                              key={grade}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 450, damping: 22 }}
                              className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase border ${
                                grade === "A+" || grade === "A"
                                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40"
                                  : grade === "B+" || grade === "B"
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                                    : grade === "C" || grade === "D"
                                      ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                                      : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20"
                              }`}
                            >
                              Grade {grade}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <StatusSelectDropdown
                      value={status}
                      onChange={(newStatus) => setStatus(newStatus)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -6 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:justify-end sm:px-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:opacity-60 sm:w-auto cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>{isEditMode ? "Saving..." : "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isEditMode ? "Save Changes" : "Submit Result"}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RosterSelectDropdown({
  students,
  selectedStudentId,
  onSelectStudent,
  disabled,
  isLoading,
}: {
  students: StudentUser[];
  selectedStudentId: string;
  onSelectStudent: (student: StudentUser | null) => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.roll && s.roll.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.studentClass && s.studentClass.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          Select Student from Roster <span className="text-red-500">*</span>
        </span>
        {isLoading && (
          <span className="text-[10px] text-indigo-500 animate-pulse font-normal">
            Loading roster...
          </span>
        )}
      </label>

      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        disabled={disabled || isLoading}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs text-left transition outline-none cursor-pointer ${
          isOpen
            ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-slate-50 dark:bg-slate-900 dark:border-indigo-500"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:border-slate-600"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {selectedStudent ? (
          <div className="flex items-center gap-2.5 truncate">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
              {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  {selectedStudent.name}
                </span>
                {selectedStudent.roll ? (
                  <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-mono font-medium text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                    Roll: {selectedStudent.roll}
                  </span>
                ) : (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Roll: N/A
                  </span>
                )}
                {selectedStudent.studentClass && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {selectedStudent.studentClass}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">{selectedStudent.email}</p>
            </div>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">
            -- Choose a student from directory roster --
          </span>
        )}

        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="roster-select-dropdown-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 flex max-h-72 flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
          >
            {/* Search Header */}
            <div className="border-b border-slate-100 p-2 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student by name, roll, class, email..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  autoFocus
                />
              </div>
            </div>

            {/* Options List */}
            <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
              {filteredStudents.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching students found in roster.
                </div>
              ) : (
                filteredStudents.map((st) => {
                  const isSelected = st.id === selectedStudentId;
                  return (
                    <motion.button
                      key={st.id}
                      type="button"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelectStudent(st);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={`w-full flex items-center justify-between rounded-lg p-2.5 text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/50"
                          : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {st.name ? st.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {st.name}
                            </span>
                            {st.roll ? (
                              <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                                Roll: {st.roll}
                              </span>
                            ) : (
                              <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                                Roll: N/A
                              </span>
                            )}
                            {st.studentClass && (
                              <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-400">
                                {st.studentClass}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{st.email}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DisabledInputField({
  label,
  value,
  placeholder = "N/A",
}: {
  label: string;
  value: string;
  placeholder?: string;
}) {
  const displayVal = value && value.trim() !== "" ? value : "N/A";

  return (
    <div>
      <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
        <span>{label}</span>
        <span className="flex items-center gap-1 text-[10px] font-normal text-slate-400">
          <Lock className="h-2.5 w-2.5" /> Auto-filled
        </span>
      </label>

      <input
        type="text"
        value={displayVal}
        disabled
        readOnly
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-100/90 px-4 py-2.5 text-xs font-semibold text-slate-700 outline-none transition cursor-not-allowed dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
      />
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
  placeholder,
  disabled,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} <span className="text-red-500">*</span>
        </label>
        {helperText && (
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-medium">
            {helperText}
          </span>
        )}
      </div>

      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
    </div>
  );
}

function ExamPresetSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (presetName: string) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPresetSelected = EXAM_PRESETS.includes(value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Examination Name / Category <span className="text-red-500">*</span>
      </label>

      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs text-left transition outline-none cursor-pointer ${
          isOpen
            ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-slate-50 dark:bg-slate-900 dark:border-indigo-500"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:border-slate-600"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2 truncate">
          <GraduationCap className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {isPresetSelected ? value : "-- Choose examination category preset --"}
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="exam-preset-dropdown-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 flex max-h-60 flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 p-1.5 space-y-1 overflow-y-auto"
          >
            <motion.button
              type="button"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between rounded-lg p-2 text-left transition cursor-pointer text-slate-500 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-xs italic"
            >
              Custom / Type Examination Title Below
            </motion.button>

            {EXAM_PRESETS.map((preset) => {
              const isSelected = preset === value;
              return (
                <motion.button
                  key={preset}
                  type="button"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onChange(preset);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg p-2.5 text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/50"
                      : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {preset}
                  </span>

                  {isSelected && (
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusSelectDropdown({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const STATUS_ITEMS = [
    {
      id: "DRAFT",
      label: "Draft (Internal Only)",
      description: "Saved internally for review. Not visible to students.",
      dotColor: "bg-amber-500",
    },
    {
      id: "PUBLISHED",
      label: "Published (Visible to Students)",
      description: "Live result. Immediately visible to students in portal.",
      dotColor: "bg-emerald-500",
    },
  ];

  const currentStatus = STATUS_ITEMS.find((s) => s.id === value) || STATUS_ITEMS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Publication Status <span className="text-red-500">*</span>
      </label>

      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs text-left transition outline-none cursor-pointer ${
          isOpen
            ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-slate-50 dark:bg-slate-900 dark:border-indigo-500"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:border-slate-600"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${currentStatus.dotColor} shrink-0`} />
          <span className="font-bold text-slate-900 dark:text-white">
            {currentStatus.label}
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="status-select-dropdown-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 flex flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 p-1.5 space-y-1 overflow-hidden"
          >
            {STATUS_ITEMS.map((item) => {
              const isSelected = item.id === value;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg p-2.5 text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/50"
                      : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.dotColor} shrink-0`} />
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white ml-2">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}