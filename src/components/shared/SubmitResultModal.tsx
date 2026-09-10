"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import type { Result } from "@/components/shared/ResultList";

type SubmitResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  result?: Result | null;
};

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /*
   * Populate form when editing.
   * Reset form when creating or closing.
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
      setError("");
      setIsSubmitting(false);
      return;
    }

    if (result) {
      setStudentId(result.studentId || "");
      setStudentName(result.studentName || "");
      setStudentEmail(result.studentEmail || "");
      setStudentClass(result.studentClass || "");
      setExam(result.exam || "");
      setScore(String(result.score ?? ""));
      setTotal(String(result.total ?? "100"));
      setGrade(result.grade || "");
      setStatus(result.status || "DRAFT");
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
      setError("");
    }
  }, [isOpen, result]);

  /*
   * Automatically calculate grade from score.
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

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    /*
     * Basic validation
     */
    if (
      !studentId.trim() ||
      !studentName.trim() ||
      !studentEmail.trim() ||
      !studentClass.trim()
    ) {
      setError(
        "Student ID, name, email, and class are required."
      );
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

    const numericScore = Number(score);
    const numericTotal = Number(total);

    if (
      !Number.isFinite(numericScore) ||
      !Number.isFinite(numericTotal)
    ) {
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

    /*
     * Edit mode requires an existing result ID.
     */
    if (isEditMode && !result?.id) {
      setError("Result ID is missing.");
      return;
    }

    try {
      setIsSubmitting(true);

      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teacher/results/${result?.id}`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teacher/results`;

      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId.trim(),
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim().toLowerCase(),
          studentClass: studentClass.trim(),
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
    } catch (error: any) {
      console.error(
        isEditMode
          ? "Error updating result:"
          : "Error submitting result:",
        error
      );

      const errorMessage =
        error?.message ||
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[94vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white
          shadow-2xl
          dark:border-slate-800
          dark:bg-slate-950
        "
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6 sm:py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              {isEditMode ? "Edit Result" : "Enter Result"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isEditMode
                ? "Update the student's examination result and status."
                : "Enter the student's examination result and status."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:hover:bg-slate-800
              dark:hover:text-slate-200
            "
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            <div className="space-y-5">

              {/* Student Information */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Student Information
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* Student ID */}
                  <InputField
                    label="Student ID"
                    value={studentId}
                    onChange={setStudentId}
                    placeholder="e.g. 2026001"
                    disabled={isSubmitting}
                  />

                  {/* Student Name */}
                  <InputField
                    label="Student Name"
                    value={studentName}
                    onChange={setStudentName}
                    placeholder="e.g. Aarav Sharma"
                    disabled={isSubmitting}
                  />

                  {/* Email */}
                  <InputField
                    label="Student Email"
                    type="email"
                    value={studentEmail}
                    onChange={setStudentEmail}
                    placeholder="student@example.com"
                    disabled={isSubmitting}
                  />

                  {/* Class */}
                  <InputField
                    label="Class"
                    value={studentClass}
                    onChange={setStudentClass}
                    placeholder="e.g. Grade 8 A"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Examination Information */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Examination
                </h3>

                <div className="mt-4 space-y-4">

                  {/* Exam */}
                  <InputField
                    label="Examination"
                    value={exam}
                    onChange={setExam}
                    placeholder="e.g. Mid-Term Examination"
                    disabled={isSubmitting}
                  />

                  {/* Marks */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField
                      label="Score"
                      type="number"
                      min="0"
                      value={score}
                      onChange={setScore}
                      placeholder="e.g. 85"
                      disabled={isSubmitting}
                    />

                    <InputField
                      label="Total Marks"
                      type="number"
                      min="1"
                      value={total}
                      onChange={setTotal}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Grade + Status */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* Grade */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Grade
                      </label>

                      <input
                        type="text"
                        value={grade}
                        readOnly
                        placeholder="Calculated automatically"
                        className="
                          w-full rounded-xl
                          border border-slate-200
                          bg-slate-50
                          px-4 py-3
                          text-sm font-bold
                          text-slate-900
                          outline-none
                          dark:border-slate-800
                          dark:bg-slate-900
                          dark:text-white
                        "
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Status
                      </label>

                      <select
                        value={status}
                        onChange={(event) =>
                          setStatus(event.target.value)
                        }
                        disabled={isSubmitting}
                        className="
                          w-full rounded-xl
                          border border-slate-300
                          bg-white
                          px-4 py-3
                          text-sm text-slate-900
                          outline-none
                          transition
                          focus:border-blue-500
                          focus:ring-2
                          focus:ring-blue-500/10
                          dark:border-slate-700
                          dark:bg-slate-900
                          dark:text-white
                        "
                      >
                        <option value="DRAFT">
                          Draft
                        </option>

                        <option value="PUBLISHED">
                          Published
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="
                w-full rounded-xl
                border border-slate-300
                bg-white
                px-5 py-3
                text-sm font-semibold
                text-slate-700
                transition
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full rounded-xl
                bg-blue-600
                px-5 py-3
                text-sm font-semibold
                text-white
                shadow-sm
                shadow-blue-600/20
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
            >
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Submitting..."
                : isEditMode
                  ? "Save Changes"
                  : "Submit Result"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================================================= */
/* INPUT FIELD */
/* ========================================================= */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  min,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        disabled={disabled}
        required
        className="
          w-full rounded-xl
          border border-slate-300
          bg-white
          px-4 py-3
          text-sm text-slate-900
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/10
          disabled:cursor-not-allowed
          disabled:opacity-60
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-white
        "
      />
    </div>
  );
}