"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  TrendingUp,
  Search,
  RefreshCw,
  AlertTriangle,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  date: string;
  status: "PRESENT" | "LATE" | "ABSENT";
  grade: string; // Class
  section: string;
  group?: string; // Science, Business, Humanities, etc.
  subjectName?: string; // Subject name
  studentName?: string; // Student full name
  teacherName?: string; // Teacher full name
  teacherEmail?: string;
}
interface AttendanceSummary {
  total: number;
  present: number;
  late: number;
  absent: number;
  attendanceRate: number;
}

const ATTENDANCE_PAGE_SIZE = 20;

const statusConfig = {
  PRESENT: {
    label: "Present",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  LATE: {
    label: "Late",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    icon: Clock3,
  },
  ABSENT: {
    label: "Absent",
    className:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    icon: XCircle,
  },
};

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    attendanceRate: 100,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PRESENT" | "LATE" | "ABSENT"
  >("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data from API with server-side filters
  const fetchAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (debouncedSearch.trim())
        params.append("search", debouncedSearch.trim());

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/attendance?${params.toString()}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch attendance data.");
      }

      setRecords(data.records || []);
      setSummary(
        data.summary || {
          total: 0,
          present: 0,
          late: 0,
          absent: 0,
          attendanceRate: 100,
        },
      );
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(records.length / ATTENDANCE_PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * ATTENDANCE_PAGE_SIZE;
  const paginatedRecords = records.slice(pageStart, pageStart + ATTENDANCE_PAGE_SIZE);
  const rangeStart = records.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = pageStart + paginatedRecords.length;

  // Safe Date Formatting
  const formatDate = useCallback((dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-sm backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shrink-0">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              My Attendance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor your class presence, tardiness, and overall attendance
              records
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchAttendance}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-colors shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          <span>Refresh</span>
        </button>
      </motion.div>

      {/* Warning/Success Banner */}
      {!isLoading && summary.total > 0 && summary.attendanceRate < 75 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/90 dark:bg-rose-500/10 p-4 text-rose-800 dark:text-rose-300 flex items-center gap-3"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="text-xs sm:text-sm">
            <strong className="font-bold">Low Attendance Alert:</strong> Your
            current attendance rate is{" "}
            <span className="font-extrabold">{summary.attendanceRate}%</span>.
            Keep it above 75% to stay compliant!
          </div>
        </motion.div>
      )}

      {!isLoading && summary.total > 0 && summary.attendanceRate >= 90 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-center gap-3"
        >
          <Award className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-xs sm:text-sm">
            <strong className="font-bold">Great Job!</strong> You are
            maintaining an excellent attendance rate of{" "}
            <span className="font-extrabold">{summary.attendanceRate}%</span>.
          </div>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Attendance Rate",
            value: `${summary.attendanceRate}%`,
            icon: TrendingUp,
            color: "text-indigo-600 dark:text-indigo-400",
            bgColor:
              "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20",
          },
          {
            label: "Present Days",
            value: summary.present,
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor:
              "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
          },
          {
            label: "Late Days",
            value: summary.late,
            icon: Clock3,
            color: "text-amber-600 dark:text-amber-400",
            bgColor:
              "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20",
          },
          {
            label: "Absent Days",
            value: summary.absent,
            icon: XCircle,
            color: "text-rose-600 dark:text-rose-400",
            bgColor:
              "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 text-center shadow-xs"
          >
            <div
              className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl border ${item.bgColor} mb-2`}
            >
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <p className={`text-2xl sm:text-3xl font-extrabold ${item.color}`}>
              {isLoading ? "-" : item.value}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Table Section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Attendance History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing {rangeStart}–{rangeEnd} of {records.length} records
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Search class or teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {(["ALL", "PRESENT", "LATE", "ABSENT"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === st
                      ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {st === "ALL"
                    ? "All"
                    : st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
              Loading attendance records...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Failed to load records
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {error}
            </p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <CalendarDays className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
              No attendance records found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              There are no records matching your current selection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-5 sm:px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Date
                  </th>
                  <th className="px-5 sm:px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Student Details
                  </th>
                  <th className="px-5 sm:px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Subject &amp; Teacher
                  </th>
                  <th className="px-5 sm:px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedRecords.map((record) => {
                  const config =
                    statusConfig[record.status] || statusConfig.PRESENT;
                  const Icon = config.icon;

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Date */}
                      <td className="px-5 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {formatDate(record.date)}
                      </td>

                      {/* Student Name, Class, Section, and Group */}
                      <td className="px-5 sm:px-6 py-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {record.studentName || "Student"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Class {record.grade} · Sec {record.section}
                          {record.group && (
                            <span className="ml-1 inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                              {record.group}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Subject & Teacher Name */}
                      <td className="px-5 sm:px-6 py-4 text-xs sm:text-sm">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {record.subjectName || "General Class"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {record.teacherName || record.teacherEmail || "—"}
                        </div>
                      </td>

                      {/* Attendance Status */}
                      <td className="px-5 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${config.className}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {config.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {records.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-5 sm:px-6 py-4 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Page{" "}
              <span className="font-extrabold text-slate-900 dark:text-white">{page}</span>{" "}
              of{" "}
              <span className="font-extrabold text-slate-900 dark:text-white">{totalPages}</span>{" "}
              ({records.length} records · {ATTENDANCE_PAGE_SIZE} per page)
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setCurrentPage((prev) => Math.max(1, Math.min(prev, totalPages) - 1))}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, Math.min(prev, totalPages) + 1))}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}
