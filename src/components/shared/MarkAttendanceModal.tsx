"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarCheck,
  Search,
  CheckCircle2,
  Clock,
  UserX,
  Loader2,
  Users,
  Calendar,
  Filter,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  GraduationCap,
  Compass,
} from "lucide-react";
import { toast } from "react-toastify";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("better-auth.session_token");
  }
  return null;
};

const CLASS_OPTIONS = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTION_OPTIONS = ["Section A", "Section B"]; // Strictly Section A and Section B
const GROUP_OPTIONS = ["All Groups", "Science", "Business Studies", "Humanities"];

export type StudentRosterItem = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  studentClass?: string | null;
  studentSection?: string | null;
  department?: string | null;
  status: "PRESENT" | "LATE" | "ABSENT";
  isMarked?: boolean;
};

type MarkAttendanceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function MarkAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
}: MarkAttendanceModalProps) {
  const [selectedClass, setSelectedClass] = useState("Class 8");
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [selectedGroup, setSelectedGroup] = useState("All Groups");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<StudentRosterItem[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const showGroupSelector = selectedClass === "Class 9" || selectedClass === "Class 10";

  // Fetch student roster whenever Class, Section, Group, or Date changes
  useEffect(() => {
    if (!isOpen) return;

    const fetchRoster = async () => {
      try {
        setIsLoadingRoster(true);
        setError("");

        const token = getAuthToken();
        const queryParams = new URLSearchParams({
          grade: selectedClass,
          section: selectedSection,
          ...(showGroupSelector && selectedGroup !== "All Groups"
            ? { group: selectedGroup }
            : {}),
          date: selectedDate,
        });

        const response = await fetch(
          `${SERVER_URL}/api/teacher/attendance/students?${queryParams.toString()}`,
          {
            credentials: "include",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load student roster.");
        }

        const loadedStudents = (data.students || []).map((s: any) => ({
          ...s,
          status: s.status === "NOT_MARKED" ? "PRESENT" : s.status,
        }));
        setStudents(loadedStudents);
      } catch (err: any) {
        console.error("Fetch roster error:", err);
        setError(err.message || "Failed to load student roster.");
      } finally {
        setIsLoadingRoster(false);
      }
    };

    fetchRoster();
  }, [isOpen, selectedClass, selectedSection, selectedGroup, selectedDate, showGroupSelector]);

  // Handle status toggle for individual student
  const handleStatusChange = (
    studentId: string,
    newStatus: "PRESENT" | "LATE" | "ABSENT"
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
    );
  };

  // Bulk status change
  const handleBulkStatusChange = (status: "PRESENT" | "ABSENT") => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  // Filter roster based on search input
  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const query = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        (s.department && s.department.toLowerCase().includes(query))
    );
  }, [students, search]);

  // Submit attendance to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (students.length === 0) {
      toast.warning("No students found in the selected roster.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      const token = getAuthToken();

      const payload = {
        date: selectedDate,
        grade: selectedClass,
        section: selectedSection,
        group: showGroupSelector ? selectedGroup : null,
        records: students.map((s) => ({
          studentId: s.id,
          studentEmail: s.email,
          studentName: s.name,
          status: s.status,
        })),
      };

      const response = await fetch(`${SERVER_URL}/api/teacher/attendance/mark`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit attendance.");
      }

      toast.success(
        `Attendance recorded for ${selectedClass} ${selectedSection}!`
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Save attendance error:", err);
      const msg = err.message || "Failed to submit attendance.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex min-h-full items-center justify-center px-3 py-6 sm:px-6 sm:py-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative z-10 my-auto w-full max-w-4xl max-h-[85vh] sm:max-h-[88vh] flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            {/* Modal Header (Fixed Top Bar) */}
            <div className="shrink-0 flex items-start justify-between border-b border-slate-200 bg-white p-3.5 sm:px-6 sm:py-4 dark:border-slate-800 dark:bg-slate-950 gap-2.5 sm:gap-3 z-20">
              <div className="flex items-start gap-2.5 sm:gap-4 min-w-0 flex-1">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-indigo-50 font-black text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 text-xs sm:text-sm shadow-xs">
                  <CalendarCheck className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                      <Sparkles className="h-3 w-3" />
                      Attendance Register
                    </span>
                  </div>

                  <h2 className="mt-1 text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                    Mark Class Attendance
                  </h2>

                  <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                    Select Class, Section (A/B), Group, and record student presence.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer shrink-0 border border-slate-200/60 dark:border-slate-700/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Middle Container (Form) */}
            <form
              id="mark-attendance-form"
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950"
            >
              {/* Filter Bar (Class, Section A/B, Group, Date - Mini cards scroll inside middle container) */}
              <div className="relative shrink-0 border-b border-slate-200 bg-slate-50 p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-900 z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  {/* Class Dropdown */}
                  <NiceSelectDropdown
                    label="Class"
                    value={selectedClass}
                    options={CLASS_OPTIONS}
                    onChange={setSelectedClass}
                    icon={GraduationCap}
                  />

                  {/* Section Dropdown (Strictly Section A & B) */}
                  <NiceSelectDropdown
                    label="Section"
                    value={selectedSection}
                    options={SECTION_OPTIONS}
                    onChange={setSelectedSection}
                    icon={Layers}
                  />

                  {/* Group Dropdown (Shown for Class 9 & 10) */}
                  <NiceSelectDropdown
                    label="Group"
                    badgeText={showGroupSelector ? "" : "Optional"}
                    value={selectedGroup}
                    options={GROUP_OPTIONS}
                    onChange={setSelectedGroup}
                    disabled={!showGroupSelector}
                    icon={Compass}
                  />

                  {/* Date Picker */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
                      Attendance Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none transition-all hover:border-indigo-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Roster Toolbar & Quick Action Buttons */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                  {/* Roster Search Input */}
                  <div className="relative flex-1 max-w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search student name or email..."
                      className="h-8.5 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>

                  {/* Bulk Status Toggles & Summary Counters */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/40">
                      P: {presentCount}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/40">
                      L: {lateCount}
                    </span>
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-100 dark:border-rose-900/40">
                      A: {absentCount}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleBulkStatusChange("PRESENT")}
                      className="h-8 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white px-2.5 text-[11px] font-extrabold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white transition-colors cursor-pointer border border-emerald-100 dark:border-emerald-900/40"
                    >
                      Mark All Present
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBulkStatusChange("ABSENT")}
                      className="h-8 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white px-2.5 text-[11px] font-extrabold text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white transition-colors cursor-pointer border border-rose-100 dark:border-rose-900/40"
                    >
                      Mark All Absent
                    </button>
                  </div>
                </div>
              </div>

              {/* Student Roster List */}
              <div className="flex-1 p-3 sm:p-6 space-y-2.5">
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                    {error}
                  </div>
                )}

                {isLoadingRoster ? (
                  <div className="space-y-2.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 animate-pulse"
                      >
                        {/* Student Info Skeleton */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800" />
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-3 w-44 rounded bg-slate-200/70 dark:bg-slate-800/70" />
                          </div>
                        </div>

                        {/* Status Buttons Skeleton */}
                        <div className="flex items-center gap-1.5 shrink-0 sm:self-center">
                          <div className="h-7 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
                          <div className="h-7 w-16 rounded-lg bg-slate-200 dark:bg-slate-800" />
                          <div className="h-7 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 px-3">
                    <Users className="h-8 w-8 text-slate-400 mb-2" />
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      No Students Found
                    </h4>
                    <p className="mt-1 max-w-sm text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      No student records match {selectedClass} {selectedSection}{" "}
                      {showGroupSelector && selectedGroup !== "All Groups" ? `(${selectedGroup})` : ""}.
                    </p>
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"
                    >
                      {/* Student Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-black text-white dark:bg-indigo-950/70 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 text-xs">
                          {student.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {student.name}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="truncate max-w-[160px] sm:max-w-none">
                              {student.email}
                            </span>
                            {student.department && (
                              <span className="rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.2 font-bold">
                                {student.department}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Toggle Radio Group */}
                      <div className="flex items-center gap-1.5 shrink-0 sm:self-center">
                        {/* PRESENT Button */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "PRESENT")}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold transition-all cursor-pointer border ${
                            student.status === "PRESENT"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300 border-slate-200/60 dark:border-slate-700/60"
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Present
                        </button>

                        {/* LATE Button */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "LATE")}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold transition-all cursor-pointer border ${
                            student.status === "LATE"
                              ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-amber-950/50 dark:hover:text-amber-300 border-slate-200/60 dark:border-slate-700/60"
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          Late
                        </button>

                        {/* ABSENT Button */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "ABSENT")}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold transition-all cursor-pointer border ${
                            student.status === "ABSENT"
                              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 border-slate-200/60 dark:border-slate-700/60"
                          }`}
                        >
                          <UserX className="h-3 w-3" />
                          Absent
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </form>

            {/* Modal Actions Footer (Fixed Bottom Bar) */}
            <div className="shrink-0 flex items-center justify-between border-t border-slate-200 bg-white sm:bg-slate-50 px-4 sm:px-6 py-3 sm:py-3.5 dark:border-slate-800 dark:bg-slate-950 z-20">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Records will be updated for {selectedClass} {selectedSection}.
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="mark-attendance-form"
                  disabled={isSaving || students.length === 0}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Save Attendance
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ========================================================= */
/* NICE SELECT DROPDOWN COMPONENT */
/* ========================================================= */

function NiceSelectDropdown({
  label,
  value,
  options,
  onChange,
  disabled = false,
  icon: Icon,
  badgeText,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
  icon?: React.ElementType;
  badgeText?: string;
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
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1 flex items-center justify-between">
        <span>{label}</span>
        {badgeText && (
          <span className="text-[9px] text-indigo-500 font-normal lowercase">
            ({badgeText})
          </span>
        )}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-xs font-bold transition-all duration-200 cursor-pointer ${
          disabled
            ? "border-slate-200/60 bg-slate-100/60 text-slate-400 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-600 opacity-60 cursor-not-allowed"
            : isOpen
            ? "border-indigo-600 bg-white ring-4 ring-indigo-500/10 dark:border-indigo-500 dark:bg-slate-950 dark:ring-indigo-500/20 text-slate-900 dark:text-white"
            : "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-indigo-500/60 dark:hover:bg-slate-900"
        }`}
      >
        <span className="truncate flex items-center gap-2">
          {Icon && (
            <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          )}
          <span>{value}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-[100] mt-1.5 w-full min-w-[140px] max-h-60 overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/80"
          >
            {options.map((option) => {
              const isSelected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 font-extrabold"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
