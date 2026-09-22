"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
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
interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlStatus = searchParams.get("status");
  const urlSearch = searchParams.get("search");
  const urlPage = searchParams.get("page");
  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch || "");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PRESENT" | "LATE" | "ABSENT"
  >(
    urlStatus === "PRESENT" || urlStatus === "LATE" || urlStatus === "ABSENT"
      ? urlStatus
      : "ALL",
  );

  const [page, setPage] = useState(
    Math.max(parseInt(urlPage || "1", 10) || 1, 1),
  );
 useEffect(() => {
  const urlPage = Math.max(
    parseInt(searchParams.get("page") || "1", 10) || 1,
    1,
  );

  setPage(urlPage);
}, [searchParams]);

  const updateUrl = useCallback(
    ({
      status = statusFilter,
      search = debouncedSearch,
      page: nextPage = page,
    }: {
      status?: "ALL" | "PRESENT" | "LATE" | "ABSENT";
      search?: string;
      page?: number;
    }) => {
      const params = new URLSearchParams();

      if (status !== "ALL") {
        params.set("status", status);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (nextPage > 1) {
        params.set("page", nextPage.toString());
      }

      const queryString = params.toString();

      router.replace(
        queryString
          ? `/dashboard/student/attendance?${queryString}`
          : "/dashboard/student/attendance",
        { scroll: false },
      );
    },
    [router, statusFilter, debouncedSearch, page],
  );
 
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

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery === debouncedSearch) return;

    setDebouncedSearch(searchQuery);

    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }

    // New search হলে page 1
    params.delete("page");

    router.replace(
      params.toString()
        ? `/dashboard/student/attendance?${params.toString()}`
        : "/dashboard/student/attendance",
      { scroll: false },
    );

    setPage(1);
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery]);
  // Debounce search input (300ms)
 

  // Fetch data from API with server-side filters
  const fetchAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();

      params.append("page", page.toString());
      params.append("limit", pagination.limit.toString());

      if (statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      if (debouncedSearch.trim()) {
        params.append("search", debouncedSearch.trim());
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/attendance?${params.toString()}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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

      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          totalRecords: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [page, pagination.limit, statusFilter, debouncedSearch]);
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

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
              Showing {records.length} of {pagination.totalRecords} records
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
                  onClick={() => {
                    setStatusFilter(st);
                  

                    updateUrl({
                      status: st,
                      page:page
                    });
                  }}
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
                {records.map((record) => {
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
        {!isLoading && !error && pagination.totalRecords > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-4">
            {/* Result info */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Page{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {pagination.totalPages}
              </span>
            </p>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage || isLoading}
                onClick={() => {
                  const nextPage = Math.max(page - 1, 1);

                  setPage(nextPage);

                  updateUrl({
                    page: nextPage,
                  });
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, index) => index + 1,
                )
                  .filter((pageNumber) => {
                    return (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      Math.abs(pageNumber - pagination.page) <= 1
                    );
                  })
                  .map((pageNumber, index, pages) => {
                    const previousPage = pages[index - 1];

                    return (
                      <React.Fragment key={pageNumber}>
                        {previousPage && pageNumber - previousPage > 1 && (
                          <span className="px-1 text-xs text-slate-400">
                            ...
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setPage(pageNumber);
                            updateUrl({ page: pageNumber });
                          }}
                          className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition ${
                            pagination.page === pageNumber
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                type="button"
                disabled={!pagination.hasNextPage || isLoading}
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  updateUrl({ page: nextPage });
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}
