"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  TrendingUp,
  Loader2,
  User,
} from "lucide-react";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setIsLoading(true);
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
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 p-6 sm:p-8"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <CalendarDays className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              My Attendance
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Track your daily attendance record and overall performance
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Attendance Rate",
              value: `${summary.attendanceRate}%`,
              icon: TrendingUp,
              color: "text-indigo-600 dark:text-indigo-400",
            },
            {
              label: "Present",
              value: summary.present,
              icon: CheckCircle2,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Late",
              value: summary.late,
              icon: Clock3,
              color: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Absent",
              value: summary.absent,
              icon: XCircle,
              color: "text-rose-600 dark:text-rose-400",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center"
            >
              <item.icon className={`h-5 w-5 mx-auto ${item.color}`} />
              <p className={`mt-2 text-2xl font-extrabold ${item.color}`}>
                {item.value}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Records Table */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Attendance History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Your daily attendance records
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">Loading attendance...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600">{error}</div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <User className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
              No attendance records yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              Your attendance will appear here once your teacher starts marking.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Date
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Class
                  </th>
                  <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const config = statusConfig[record.status];
                  const Icon = config.icon;

                  return (
                    <tr
                      key={record.id}
                      className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                    >
                      <td className="px-5 sm:px-6 py-3.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-sm text-slate-600 dark:text-slate-400">
                        {record.grade}
                        {record.section ? ` · ${record.section}` : ""}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${config.className}`}
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