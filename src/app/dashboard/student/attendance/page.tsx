"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  TrendingUp,
  Loader2,
  User,
  Search,
  RefreshCw,
  AlertTriangle,
  Award,
  Filter,
  Check,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

interface AttendanceRecord {
  id: string;
  date: string;
  status: "PRESENT" | "LATE" | "ABSENT";
  grade: string;
  section: string;
  group?: string;
  teacherEmail?: string;
}

interface Summary {
  total: number;
  present: number;
  late: number;
  absent: number;
  attendanceRate: number;
}

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("better-auth.session_token");
  }
  return null;
};

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
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PRESENT" | "LATE" | "ABSENT">("ALL");

  const fetchAttendance = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError("");

      const token = getAuthToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/attendance`,
        {
          credentials: "include",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load attendance");
      }

      setRecords(data.records || []);
      setSummary(data.summary || null);

      if (isManualRefresh) {
        toast.success("Attendance records updated!");
      }
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      setError(msg);
      if (isManualRefresh) {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const formattedDate = formatDate(rec.date).toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        formattedDate.includes(searchQuery.toLowerCase()) ||
        rec.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "ALL" || rec.status === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [records, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-sm backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shrink-0">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              My Attendance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Track your daily class attendance history and overall performance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchAttendance(true)}
          disabled={isLoading || isRefreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-colors shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Records"}</span>
        </button>
      </motion.div>

      {/* Summary Cards */}
      {summary && (
        <div className="space-y-4">
          {/* Performance Banner */}
          {summary.total > 0 && summary.attendanceRate < 75 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/90 dark:bg-rose-500/10 p-4 text-rose-800 dark:text-rose-300 backdrop-blur-xl flex items-center gap-3"
            >
              <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <div className="text-xs sm:text-sm">
                <strong className="font-bold">Attendance Warning:</strong> Your current attendance rate is{" "}
                <span className="font-extrabold">{summary.attendanceRate}%</span> (below the 75% minimum requirement). Please coordinate with your class teacher.
              </div>
            </motion.div>
          )}

          {summary.total > 0 && summary.attendanceRate >= 90 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 backdrop-blur-xl flex items-center gap-3"
            >
              <Award className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="text-xs sm:text-sm">
                <strong className="font-bold">Outstanding Attendance:</strong> Great job maintaining an attendance rate of{" "}
                <span className="font-extrabold">{summary.attendanceRate}%</span>!
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Attendance Rate",
                value: `${summary.attendanceRate}%`,
                icon: TrendingUp,
                color: "text-indigo-600 dark:text-indigo-400",
                bgColor: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20",
              },
              {
                label: "Present",
                value: summary.present,
                icon: CheckCircle2,
                color: "text-emerald-600 dark:text-emerald-400",
                bgColor: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
              },
              {
                label: "Late",
                value: summary.late,
                icon: Clock3,
                color: "text-amber-600 dark:text-amber-400",
                bgColor: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20",
              },
              {
                label: "Absent",
                value: summary.absent,
                icon: XCircle,
                color: "text-rose-600 dark:text-rose-400",
                bgColor: "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 text-center shadow-xs backdrop-blur-xl"
              >
                <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl border ${item.bgColor} mb-2`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <p className={`text-2xl sm:text-3xl font-extrabold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Records Table Section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm backdrop-blur-xl overflow-hidden"
      >
        {/* Controls Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Attendance Log History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing {filteredRecords.length} of {records.length} recorded classes
            </p>
          </div>

          {/* Search & Filter Inputs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-48">
              <input
                type="text"
                placeholder="Search date or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Status Dropdown Filter */}
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
                  {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Loading attendance records...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <User className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
              No matching attendance records
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              {searchQuery || statusFilter !== "ALL"
                ? "Try adjusting your search query or status filter."
                : "Your attendance records will appear here once your class teacher logs attendance."}
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
                    Class &amp; Section
                  </th>
                  <th className="px-5 sm:px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRecords.map((record) => {
                  const config = statusConfig[record.status] || statusConfig.PRESENT;
                  const Icon = config.icon;

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="px-5 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-5 sm:px-6 py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {record.grade}
                        {record.section ? ` · ${record.section}` : ""}
                        {record.group ? ` (${record.group})` : ""}
                      </td>
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
      </motion.section>
    </div>
  );
}