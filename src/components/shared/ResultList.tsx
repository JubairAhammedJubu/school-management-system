"use client";

import React from "react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

export type Result = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentClass: string;
  assignmentId: string | null;
  exam: string;
  score: number;
  total: number;
  grade: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ResultListProps = {
  refreshKey?: number;
  onResultsChange?: (results: Result[]) => void;
  onView?: (result: Result) => void;
  onEdit?: (result: Result) => void;
  onDelete?: (result: Result) => void;
};

type MenuPosition = {
  top: number;
  left: number;
};

export default function ResultList({
  refreshKey = 0,
  onResultsChange,
  onView,
  onEdit,
  onDelete,
}: ResultListProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] =
    useState<MenuPosition | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/teacher/results"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to fetch results."
        );
      }

      const fetchedResults: Result[] = data.results || [];

      setResults(fetchedResults);
      onResultsChange?.(fetchedResults);
    } catch (error: any) {
      console.error("Error fetching results:", error);

      setError(
        error?.message || "Failed to load results."
      );
    } finally {
      setIsLoading(false);
    }
  }, [onResultsChange]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults, refreshKey]);

  const closeMenu = () => {
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const handleMenuToggle = (
    resultId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (openMenuId === resultId) {
      closeMenu();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const menuWidth = 168;
    const menuHeight = 150;
    const spacing = 8;

    let left = rect.right - menuWidth;
    let top = rect.bottom + spacing;

    if (left < 12) {
      left = 12;
    }

    if (left + menuWidth > window.innerWidth - 12) {
      left = window.innerWidth - menuWidth - 12;
    }

    if (top + menuHeight > window.innerHeight - 12) {
      top = rect.top - menuHeight - spacing;
    }

    if (top < 12) {
      top = 12;
    }

    setOpenMenuId(resultId);
    setMenuPosition({
      top,
      left,
    });
  };

  const handleView = (result: Result) => {
    closeMenu();
    onView?.(result);
  };

  const handleEdit = (result: Result) => {
    closeMenu();
    onEdit?.(result);
  };

  const handleDelete = (result: Result) => {
    closeMenu();
    onDelete?.(result);
  };

  useEffect(() => {
    if (!openMenuId) return;

    const handleScroll = () => {
      closeMenu();
    };

    const handleResize = () => {
      closeMenu();
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [openMenuId]);

  return (
    <>
      <section className="w-full rounded-xl border border-slate-200/90 bg-white shadow-md dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Results
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Latest student examination records
            </p>
          </div>

          <div className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {results.length}{" "}
            {results.length === 1
              ? "Result"
              : "Results"}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[260px] items-center justify-center px-6">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
              Loading results...
            </div>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-500/20 dark:bg-red-500/10">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchResults}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          results.length === 0 && (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Eye className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
                No results yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Submitted student results will appear
                here.
              </p>
            </div>
          )}

        {/* Results */}
        {!isLoading &&
          !error &&
          results.length > 0 && (
            <>
              {/* Desktop */}
              <div className="hidden w-full overflow-x-auto sm:block">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                        Student
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                        Examination
                      </th>

                      <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                        Score
                      </th>

                      <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                        Grade
                      </th>

                      <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="w-16 px-4 py-4" />
                    </tr>
                  </thead>

                  <tbody>
                    {results.map(
                      (result, index) => (
                        <ResultRow
                          key={result.id}
                          result={result}
                          index={index}
                          onMenuToggle={
                            handleMenuToggle
                          }
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 sm:hidden">
                {results.map(
                  (result, index) => (
                    <MobileResultCard
                      key={result.id}
                      result={result}
                      index={index}
                      onMenuToggle={
                        handleMenuToggle
                      }
                      onView={handleView}
                    />
                  )
                )}
              </div>
            </>
          )}
      </section>

      {/* Floating Action Menu */}
      {typeof document !== "undefined" &&
        openMenuId &&
        menuPosition &&
        createPortal(
          <ResultActionMenu
            position={menuPosition}
            result={
              results.find(
                (item) => item.id === openMenuId
              )!
            }
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />,
          document.body
        )}
    </>
  );
}

/* ========================================================= */
/* RESULT ROW */
/* ========================================================= */

function ResultRow({
  result,
  index,
  onMenuToggle,
}: {
  result: Result;
  index: number;
  onMenuToggle: (
    resultId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
      }}
      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/30"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {getInitials(result.studentName)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
              {result.studentName}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {result.studentClass}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {result.exam}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
          {result.score}
        </span>

        <span className="text-xs text-slate-400">
          /{result.total}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <GradeBadge grade={result.grade} />
      </td>

      <td className="px-4 py-4 text-right">
        <StatusBadge status={result.status} />
      </td>

      <td className="px-4 py-4">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label={`More options for ${result.studentName}`}
            onClick={(event) =>
              onMenuToggle(result.id, event)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ========================================================= */
/* MOBILE RESULT CARD */
/* ========================================================= */

function MobileResultCard({
  result,
  index,
  onMenuToggle,
  onView,
}: {
  result: Result;
  index: number;
  onMenuToggle: (
    resultId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onView: (result: Result) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
      }}
      className="p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {getInitials(result.studentName)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
              {result.studentName}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {result.studentClass}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={result.status} />

          <button
            type="button"
            aria-label={`More options for ${result.studentName}`}
            onClick={(event) =>
              onMenuToggle(result.id, event)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Exam
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-600 dark:text-slate-300">
            {result.exam}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Score
          </p>

          <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
            {result.score}/{result.total}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Grade
          </p>

          <div className="mt-1">
            <GradeBadge grade={result.grade} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onView(result)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <Eye className="h-4 w-4" />
        View Result
      </button>
    </motion.div>
  );
}

/* ========================================================= */
/* FLOATING ACTION MENU */
/* ========================================================= */

function ResultActionMenu({
  position,
  result,
  onView,
  onEdit,
  onDelete,
}: {
  position: MenuPosition;
  result: Result;
  onView: (result: Result) => void;
  onEdit: (result: Result) => void;
  onDelete: (result: Result) => void;
}) {
  return (
    <div
      className="fixed z-[9999] w-42 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <button
        type="button"
        onClick={() => onView(result)}
        className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Eye className="mr-2.5 h-4 w-4 text-slate-400" />
        View
      </button>

      <button
        type="button"
        onClick={() => onEdit(result)}
        className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Pencil className="mr-2.5 h-4 w-4 text-slate-400" />
        Edit
      </button>

      <button
        type="button"
        onClick={() => onDelete(result)}
        className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
      >
        <Trash2 className="mr-2.5 h-4 w-4" />
        Delete
      </button>
    </div>
  );
}

/* ========================================================= */
/* GRADE BADGE */
/* ========================================================= */

function GradeBadge({ grade }: { grade: string }) {
  const normalizedGrade = grade.toUpperCase();

  const styles =
    normalizedGrade === "A+"
      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
      : normalizedGrade === "A"
        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
        : normalizedGrade === "B+"
          ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
          : normalizedGrade === "B"
            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            : normalizedGrade === "C"
              ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
              : normalizedGrade === "D"
                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";

  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-extrabold ${styles}`}
    >
      {normalizedGrade}
    </span>
  );
}

/* ========================================================= */
/* STATUS BADGE */
/* ========================================================= */

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase();
  const published = normalizedStatus === "PUBLISHED";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
        published
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published
            ? "bg-emerald-500"
            : "bg-amber-500"
        }`}
      />

      {published ? "Published" : "Draft"}
    </span>
  );
}

/* ========================================================= */
/* HELPERS */
/* ========================================================= */

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}