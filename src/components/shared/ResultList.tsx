"use client";

import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Filter,
  Layers,
  ChevronDown,
  Check,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const STATUS_OPTIONS = ["All Status", "PUBLISHED", "DRAFT"];
const CLASS_OPTIONS = ["All Classes", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

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

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedClass, setSelectedClass] = useState("All Classes");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/api/teacher/results`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch results.");
      }

      const fetchedResults: Result[] = data.results || [];
      setResults(fetchedResults);
      onResultsChange?.(fetchedResults);
    } catch (error: any) {
      console.error("Error fetching results:", error);
      setError(error?.message || "Failed to load results.");
    } finally {
      setIsLoading(false);
    }
  }, [onResultsChange]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults, refreshKey]);

  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      const query = search.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.studentName.toLowerCase().includes(query) ||
        item.studentEmail.toLowerCase().includes(query) ||
        item.studentId.toLowerCase().includes(query) ||
        item.exam.toLowerCase().includes(query) ||
        item.studentClass.toLowerCase().includes(query);

      const matchStatus =
        selectedStatus === "All Status" ||
        item.status.toUpperCase() === selectedStatus.toUpperCase();

      const matchClass =
        selectedClass === "All Classes" ||
        item.studentClass.toLowerCase().includes(selectedClass.toLowerCase().replace("class", "").trim()) ||
        selectedClass.toLowerCase().includes(item.studentClass.toLowerCase());

      return matchSearch && matchStatus && matchClass;
    });
  }, [results, search, selectedStatus, selectedClass]);

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

    if (left < 12) left = 12;
    if (left + menuWidth > window.innerWidth - 12) {
      left = window.innerWidth - menuWidth - 12;
    }
    if (top + menuHeight > window.innerHeight - 12) {
      top = rect.top - menuHeight - spacing;
    }
    if (top < 12) top = 12;

    setOpenMenuId(resultId);
    setMenuPosition({ top, left });
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

    const handleScroll = () => closeMenu();
    const handleResize = () => closeMenu();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [openMenuId]);

  return (
    <>
      <section className="w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70">
        {/* Header & Controls Toolbar */}
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-100/90 pb-5 dark:border-slate-800/90 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
              Recent Examination Results
              <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-extrabold text-white shadow-xs">
                {filteredResults.length} Items
              </span>
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage student marks, update grades, or publish result statements.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2.5 sm:gap-3 lg:w-auto max-w-full">
            {/* Search Input */}
            <div className="relative w-full sm:w-[210px] shrink-0">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, exam..."
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[260px] items-center justify-center px-6">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
              Loading student results...
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </p>
              <button
                type="button"
                onClick={fetchResults}
                className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredResults.length === 0 && (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Award className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              No results found
            </h3>

            <p className="mt-1 max-w-sm text-xs font-medium text-slate-500 dark:text-slate-400">
              {search || selectedStatus !== "All Status" || selectedClass !== "All Classes"
                ? "No examination results match your selected search or filter criteria."
                : "Submitted student examination records will appear here."}
            </p>
          </div>
        )}

        {/* Results List View */}
        {!isLoading && !error && filteredResults.length > 0 && (
          <>
            {/* Desktop Table (md and up) */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-4 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Student
                    </th>
                    <th className="py-3 px-4 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Examination
                    </th>
                    <th className="py-3 px-4 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="w-12 py-3 px-2 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults.map((result, index) => (
                    <ResultRow
                      key={result.id}
                      result={result}
                      index={index}
                      onMenuToggle={handleMenuToggle}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards (< md) */}
            <div className="grid grid-cols-1 gap-3.5 md:hidden">
              {filteredResults.map((result, index) => (
                <MobileResultCard
                  key={result.id}
                  result={result}
                  index={index}
                  onMenuToggle={handleMenuToggle}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Floating Action Portal Menu */}
      {typeof document !== "undefined" &&
        openMenuId &&
        menuPosition &&
        createPortal(
          <ResultActionMenu
            position={menuPosition}
            result={results.find((item) => item.id === openMenuId)!}
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
/* RESULT ROW (DESKTOP) */
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80 dark:border-slate-800/80 dark:hover:bg-slate-900/60"
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
            {getInitials(result.studentName)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {result.studentName}
            </p>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-block rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                Class {result.studentClass}
              </span>
              <span className="truncate text-[11px] text-slate-400">
                {result.studentEmail}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4">
        <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
          {result.exam}
        </span>
      </td>

      <td className="py-3.5 px-4 text-center">
        <StatusBadge status={result.status} />
      </td>

      <td className="py-3.5 px-2 text-right">
        <button
          type="button"
          aria-label={`Options for ${result.studentName}`}
          onClick={(event) => onMenuToggle(result.id, event)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </motion.tr>
  );
}

/* ========================================================= */
/* MOBILE RESULT CARD (< md) */
/* ========================================================= */

function MobileResultCard({
  result,
  index,
  onMenuToggle,
  onView,
  onEdit,
  onDelete,
}: {
  result: Result;
  index: number;
  onMenuToggle: (
    resultId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onView: (result: Result) => void;
  onEdit: (result: Result) => void;
  onDelete: (result: Result) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
            {getInitials(result.studentName)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold text-slate-950 dark:text-white">
              {result.studentName}
            </h3>

            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Class {result.studentClass}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <StatusBadge status={result.status} />

          <button
            type="button"
            aria-label={`Options for ${result.studentName}`}
            onClick={(event) => onMenuToggle(result.id, event)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Exam Details Grid */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-2.5 dark:border-slate-800/60 dark:bg-slate-950/40 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
            Exam
          </span>
          <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white truncate">
            {result.exam}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-2.5 dark:border-slate-800/60 dark:bg-slate-950/40 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
            Score
          </span>
          <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white truncate">
            {result.score}/{result.total}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-2.5 dark:border-slate-800/60 dark:bg-slate-950/40 min-w-0 flex flex-col justify-center items-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate mb-0.5">
            Grade
          </span>
          <GradeBadge grade={result.grade} />
        </div>
      </div>

      {/* Actions Row */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100/90 pt-3 dark:border-slate-800/90">
        <button
          type="button"
          onClick={() => onView(result)}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer flex-1"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>

        <button
          type="button"
          onClick={() => onEdit(result)}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl bg-indigo-50 px-3 text-xs font-bold text-indigo-600 transition hover:bg-indigo-600 hover:text-white dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(result)}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </motion.article>
  );
}

/* ========================================================= */
/* FLOATING ACTION MENU (PORTAL) */
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
      className="fixed z-[9999] w-40 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <button
        type="button"
        onClick={() => onView(result)}
        className="flex w-full items-center rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
      >
        <Eye className="mr-2 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        View Details
      </button>

      <button
        type="button"
        onClick={() => onEdit(result)}
        className="flex w-full items-center rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
      >
        <Pencil className="mr-2 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        Edit Record
      </button>

      <button
        type="button"
        onClick={() => onDelete(result)}
        className="flex w-full items-center rounded-xl px-3 py-2 text-left text-xs font-bold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 cursor-pointer"
      >
        <Trash2 className="mr-2 h-3.5 w-3.5" />
        Delete Record
      </button>
    </div>
  );
}

/* ========================================================= */
/* SELECT DROPDOWN COMPONENT */
/* ========================================================= */

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
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="truncate">{value}</span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-full min-w-[150px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900"
          >
            {options.map((option) => {
              const isSelected = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================================================= */
/* GRADE BADGE */
/* ========================================================= */

function GradeBadge({ grade }: { grade: string }) {
  const normalizedGrade = grade?.toUpperCase() || "";

  const styles =
    normalizedGrade === "A+"
      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20"
      : normalizedGrade === "A"
        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
        : normalizedGrade === "B+"
          ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20"
          : normalizedGrade === "B"
            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
            : normalizedGrade === "C"
              ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20"
              : normalizedGrade === "D"
                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20";

  return (
    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-black ${styles}`}>
      {normalizedGrade || "N/A"}
    </span>
  );
}

/* ========================================================= */
/* STATUS BADGE */
/* ========================================================= */

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status?.toUpperCase() || "";
  const published = normalizedStatus === "PUBLISHED";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold border ${
        published
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
          : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
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
  if (!name) return "ST";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}