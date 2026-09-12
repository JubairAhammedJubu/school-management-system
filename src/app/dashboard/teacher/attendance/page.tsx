"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  Sparkles,
  Users,
  UserCheck,
  UserX,
  Clock3,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  GraduationCap,
  Layers,
  Compass,
  Calendar,
  ChevronDown,
  Check,
  Loader2,
  FileSpreadsheet,
  Edit3,
  Download,
  AlertTriangle,
  Percent,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import MarkAttendanceModal from "@/components/shared/MarkAttendanceModal";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("better-auth.session_token");
  }
  return null;
};

const CLASS_FILTER_OPTIONS = ["All Classes", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTION_FILTER_OPTIONS = ["All Sections", "Section A", "Section B"]; // Strictly Section A and Section B
const GROUP_FILTER_OPTIONS = ["All Groups", "Science", "Business Studies", "Humanities"];
const STATUS_FILTER_OPTIONS = ["All Status", "PRESENT", "LATE", "ABSENT", "NOT_MARKED", "AT_RISK"];
const DATE_PRESET_OPTIONS = ["Single Day", "This Week", "This Month", "Custom Date Range"];

export type AttendanceRecordRow = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  studentClass?: string | null;
  studentSection?: string | null;
  department?: string | null;
  status: "PRESENT" | "LATE" | "ABSENT" | "NOT_MARKED";
  isMarked?: boolean;
  updatedAt?: string | null;
  attendanceRate?: number;
  totalClassesRecorded?: number;
  isAtRisk?: boolean;
};

export default function TeacherAttendancePage() {
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Overall statistics state
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentCount: 0,
    presentRate: "0.0",
    lateCount: 0,
    lateRate: "0.0",
    absentCount: 0,
    absentRate: "0.0",
    weeklyAttendance: [] as { day: string; attendance: number }[],
    classAttendance: [] as { name: string; attendance: number }[],
    distributionData: [] as { name: string; value: number }[],
  });

  // Table filters and state
  const [tableClass, setTableClass] = useState("All Classes");
  const [tableSection, setTableSection] = useState("All Sections");
  const [tableGroup, setTableGroup] = useState("All Groups");
  const [tableStatus, setTableStatus] = useState("All Status");
  const [datePreset, setDatePreset] = useState("Single Day");
  const [tableDate, setTableDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [customEndDate, setCustomEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [tableSearch, setTableSearch] = useState("");

  const [tableRecords, setTableRecords] = useState<AttendanceRecordRow[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  const showGroupSelector = tableClass === "Class 9" || tableClass === "Class 10" || tableClass === "All Classes";

  // Fetch overall statistics
  const fetchAttendanceStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      const response = await fetch(`${SERVER_URL}/api/teacher/attendance/stats`, {
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (response.ok && data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Fetch attendance stats error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch table records with date range calculation
  const fetchTableRecords = useCallback(async () => {
    try {
      setIsTableLoading(true);
      const token = getAuthToken();

      const queryParams = new URLSearchParams({
        ...(tableClass !== "All Classes" ? { grade: tableClass } : {}),
        ...(tableSection !== "All Sections" ? { section: tableSection } : {}),
        ...(showGroupSelector && tableGroup !== "All Groups" ? { group: tableGroup } : {}),
      });

      if (datePreset === "Single Day") {
        queryParams.append("date", tableDate);
      } else if (datePreset === "This Week") {
        const today = new Date(tableDate);
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 4);

        queryParams.append("startDate", startOfWeek.toISOString().split("T")[0]);
        queryParams.append("endDate", endOfWeek.toISOString().split("T")[0]);
      } else if (datePreset === "This Month") {
        const today = new Date(tableDate);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        queryParams.append("startDate", startOfMonth.toISOString().split("T")[0]);
        queryParams.append("endDate", endOfMonth.toISOString().split("T")[0]);
      } else if (datePreset === "Custom Date Range") {
        if (customStartDate) queryParams.append("startDate", customStartDate);
        if (customEndDate) queryParams.append("endDate", customEndDate);
      }

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

      if (response.ok && data.success) {
        setTableRecords(data.students || []);
      }
    } catch (error) {
      console.error("Fetch table records error:", error);
    } finally {
      setIsTableLoading(false);
    }
  }, [tableClass, tableSection, tableGroup, tableDate, datePreset, customStartDate, customEndDate, showGroupSelector]);

  useEffect(() => {
    fetchAttendanceStats();
  }, [fetchAttendanceStats]);

  useEffect(() => {
    fetchTableRecords();
  }, [fetchTableRecords]);

  // Refresh both stats and table after modal or inline status update
  const handleSuccessMark = () => {
    fetchAttendanceStats();
    fetchTableRecords();
  };

  // Manual refresh handler for Refresh Data button
  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([fetchAttendanceStats(), fetchTableRecords()]);
      toast.success("Attendance records refreshed!");
    } catch (err) {
      console.error("Refresh data error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filtered records by search and status dropdown
  const filteredTableRecords = useMemo(() => {
    return tableRecords.filter((rec) => {
      const matchSearch =
        rec.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        rec.email.toLowerCase().includes(tableSearch.toLowerCase()) ||
        (rec.studentClass && rec.studentClass.toLowerCase().includes(tableSearch.toLowerCase())) ||
        (rec.studentSection && rec.studentSection.toLowerCase().includes(tableSearch.toLowerCase())) ||
        (rec.department && rec.department.toLowerCase().includes(tableSearch.toLowerCase()));

      let matchStatus = true;
      if (tableStatus === "AT_RISK") {
        matchStatus = !!rec.isAtRisk || (rec.attendanceRate !== undefined && rec.attendanceRate < 75);
      } else if (tableStatus !== "All Status") {
        matchStatus = rec.status === tableStatus;
      }

      return matchSearch && matchStatus;
    });
  }, [tableRecords, tableSearch, tableStatus]);

  // At-risk student count summary
  const atRiskCount = useMemo(() => {
    return tableRecords.filter(
      (r) => r.isAtRisk || (r.attendanceRate !== undefined && r.attendanceRate < 75)
    ).length;
  }, [tableRecords]);

  // Export PDF Report Handler
  const handleExportPDF = () => {
    if (filteredTableRecords.length === 0) {
      toast.warning("No records available to export.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to export PDF.");
      return;
    }

    const reportDate = datePreset === "Single Day" ? tableDate : `${tableDate} (${datePreset})`;
    const total = filteredTableRecords.length;
    const present = filteredTableRecords.filter((r) => r.status === "PRESENT").length;
    const late = filteredTableRecords.filter((r) => r.status === "LATE").length;
    const absent = filteredTableRecords.filter((r) => r.status === "ABSENT").length;
    const atRisk = filteredTableRecords.filter(
      (r) => r.isAtRisk || (r.attendanceRate !== undefined && r.attendanceRate < 75)
    ).length;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance_Report_${tableClass.replace(/\s+/g, "_")}_${tableSection.replace(/\s+/g, "_")}_${tableDate}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 0;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #6366f1;
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            .brand-title {
              font-size: 20px;
              font-weight: 800;
              color: #4f46e5;
            }
            .brand-sub {
              font-size: 11px;
              color: #64748b;
              margin-top: 2px;
              font-weight: 600;
            }
            .report-meta {
              text-align: right;
              font-size: 11px;
              color: #475569;
              line-height: 1.5;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 20px;
            }
            .stat-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 10px 12px;
            }
            .stat-label {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              color: #64748b;
            }
            .stat-val {
              font-size: 18px;
              font-weight: 800;
              color: #0f172a;
              margin-top: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }
            th {
              background: #4f46e5;
              color: #ffffff;
              font-weight: 700;
              text-transform: uppercase;
              padding: 9px 10px;
              text-align: left;
              font-size: 10px;
              letter-spacing: 0.5px;
            }
            td {
              padding: 9px 10px;
              border-bottom: 1px solid #e2e8f0;
            }
            tr:nth-child(even) {
              background: #f8fafc;
            }
            .badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-weight: 700;
              font-size: 10px;
            }
            .badge-present { background: #dcfce7; color: #15803d; }
            .badge-late { background: #fef3c7; color: #b45309; }
            .badge-absent { background: #ffe4e6; color: #be123c; }
            .badge-unmarked { background: #f1f5f9; color: #475569; }
            .badge-risk { background: #ffe4e6; color: #be123c; border: 1px solid #fecdd3; font-weight: 800; }
            .footer {
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #e2e8f0;
              font-size: 10px;
              color: #94a3b8;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand-title">EduNexus Academy</div>
              <div class="brand-sub">Official Student Attendance Register Report</div>
            </div>
            <div class="report-meta">
              <div><strong>Filter:</strong> ${tableClass} - ${tableSection} (${tableGroup})</div>
              <div><strong>Date Log:</strong> ${reportDate}</div>
              <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
            </div>
          </div>

          <div class="summary-grid">
            <div class="stat-box">
              <div class="stat-label">Total Roster</div>
              <div class="stat-val">${total}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Present</div>
              <div class="stat-val" style="color: #15803d">${present}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Late / Absent</div>
              <div class="stat-val" style="color: #be123c">${late + absent}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">At Risk (&lt;75%)</div>
              <div class="stat-val" style="color: #be123c">${atRisk}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Class & Section</th>
                <th>Group</th>
                <th>Overall Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTableRecords
        .map(
          (r, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>
                    <strong>${r.name}</strong>
                    ${r.isAtRisk || (r.attendanceRate !== undefined && r.attendanceRate < 75)
              ? '<span class="badge badge-risk" style="margin-left: 4px;">At Risk</span>'
              : ""
            }
                  </td>
                  <td>${r.email}</td>
                  <td>${r.studentClass || "Class 8"} - ${r.studentSection || "Section A"}</td>
                  <td>${r.department || "General"}</td>
                  <td><strong>${r.attendanceRate ?? 100}%</strong></td>
                  <td>
                    <span class="badge ${r.status === "PRESENT"
              ? "badge-present"
              : r.status === "LATE"
                ? "badge-late"
                : r.status === "ABSENT"
                  ? "badge-absent"
                  : "badge-unmarked"
            }">${r.status}</span>
                  </td>
                </tr>
              `
        )
        .join("")}
            </tbody>
          </table>

          <div class="footer">
            <div>Teacher Workspace &bull; EduNexus School Management System</div>
            <div>Official Report</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    toast.success("Opening PDF print/save dialog...");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ===================================================== */}
      {/* HEADER BANNER */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              TEACHER WORKSPACE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Attendance Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Mark and track student class attendance dynamically for Section A and Section B.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10 flex-wrap">
          {/* Refresh Data Button */}
          <button
            type="button"
            disabled={isLoading || isTableLoading || isRefreshing}
            onClick={handleRefreshData}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-800 shadow-sm transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-600 dark:text-indigo-400 ${isLoading || isTableLoading || isRefreshing ? "animate-spin" : ""}`} />
            Refresh Attendance
          </button>

          {/* Mark Attendance Button */}
          <button
            type="button"
            onClick={() => setIsMarkModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer hover:scale-[1.02] shrink-0"
          >
            <CalendarCheck className="w-4 h-4" />
            Mark Attendance
          </button>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* STAT CARDS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={String(stats.totalStudents)}
          detail="Across All Registered Students"
          delay={0}
          isLoading={isLoading}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40"
        />

        <StatCard
          icon={UserCheck}
          label="Present Today"
          value={String(stats.presentCount)}
          detail={`${stats.presentRate}% attendance`}
          delay={0.05}
          isLoading={isLoading}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-900/40"
        />

        <StatCard
          icon={Clock3}
          label="Late Today"
          value={String(stats.lateCount)}
          detail={`${stats.lateRate}% of students`}
          delay={0.1}
          isLoading={isLoading}
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-900/40"
        />

        <StatCard
          icon={UserX}
          label="Absent Today"
          value={String(stats.absentCount)}
          detail={`${stats.absentRate}% of students`}
          delay={0.15}
          isLoading={isLoading}
          iconClass="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-900/40"
        />
      </div>

      {/* ===================================================== */}
      {/* CHARTS SECTION */}
      {/* ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Weekly Attendance Trend */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/60 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Weekly Attendance Trend
              </h2>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Average attendance percentage across weekdays
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
              <TrendingUp className="h-3 w-3" />
              Live Data
            </div>
          </div>

          <div className="mt-8 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.weeklyAttendance}
                margin={{
                  top: 10,
                  right: 5,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="attendanceFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "#94a3b8",
                  }}
                  dy={8}
                />

                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "#94a3b8",
                  }}
                  tickFormatter={(value) => `${value}%`}
                />

                <Tooltip
                  cursor={{
                    stroke: "#cbd5e1",
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                    fontSize: "11px",
                  }}
                  formatter={(value) => [`${value}%`, "Attendance"]}
                />

                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#attendanceFill)"
                  dot={{
                    r: 4,
                    fill: "#ffffff",
                    stroke: "#6366f1",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#6366f1",
                    stroke: "#ffffff",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Today's Distribution */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/60 sm:p-6"
        >
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Today&apos;s Attendance
            </h2>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Student attendance distribution
            </p>
          </div>

          <div className="mt-5 h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.distributionData}
                margin={{
                  top: 10,
                  right: 5,
                  left: -25,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: "#94a3b8",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: "#94a3b8",
                  }}
                  allowDecimals={false}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(148,163,184,0.06)",
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                    fontSize: "11px",
                  }}
                />

                <Bar
                  dataKey="value"
                  radius={[7, 7, 0, 0]}
                  barSize={38}
                >
                  {stats.distributionData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={
                        item.name === "Present"
                          ? "#10b981"
                          : item.name === "Late"
                            ? "#f59e0b"
                            : "#f43f5e"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-2 space-y-3">
            <AttendanceLegend
              label="Present"
              value={String(stats.presentCount)}
              percentage={`${stats.presentRate}%`}
              dot="bg-emerald-500"
            />

            <AttendanceLegend
              label="Late"
              value={String(stats.lateCount)}
              percentage={`${stats.lateRate}%`}
              dot="bg-amber-500"
            />

            <AttendanceLegend
              label="Absent"
              value={String(stats.absentCount)}
              percentage={`${stats.absentRate}%`}
              dot="bg-rose-500"
            />
          </div>
        </motion.section>
      </div>

      {/* ===================================================== */}
      {/* CLASS ATTENDANCE BAR CHART */}
      {/* ===================================================== */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
        className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/60 sm:p-6"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Class & Section Attendance
            </h2>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Attendance rate by class for Section A and Section B
            </p>
          </div>

          <span className="text-[10px] font-medium text-slate-400">
            Section A & B Only
          </span>
        </div>

        <div className="mt-6 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.classAttendance}
              layout="vertical"
              margin={{
                top: 5,
                right: 15,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />

              <XAxis
                type="number"
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 9,
                  fill: "#94a3b8",
                }}
                tickFormatter={(value) => `${value}%`}
              />

              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={85}
                tick={{
                  fontSize: 10,
                  fill: "#64748b",
                }}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(148,163,184,0.05)",
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  fontSize: "11px",
                }}
                formatter={(value) => [`${value}%`, "Attendance"]}
              />

              <Bar
                dataKey="attendance"
                fill="#6366f1"
                radius={[0, 7, 7, 0]}
                barSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* ===================================================== */}
      {/* ATTENDANCE RECORDS TABLE SECTION */}
      {/* ===================================================== */}

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.32 }}
        className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/60 sm:p-6 space-y-5"
      >
        {/* Table Header & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Daily Attendance Records
                </h2>
                {atRiskCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                    <AlertTriangle className="h-3 w-3" />
                    {atRiskCount} At-Risk (&lt;75%)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Filter, inspect, and export student attendance logs by class, section (A/B), group, status, and date range.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Export PDF Button */}
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white font-bold text-xs border border-rose-200 dark:border-rose-900/40 transition-all cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export PDF
            </button>

            {/* Mark Modal Launcher */}
            <button
              type="button"
              onClick={() => setIsMarkModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Mark / Edit Register
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-3.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-900/60 dark:border-slate-800">
          {/* Class Filter */}
          <NiceSelectDropdown
            label="Class"
            value={tableClass}
            options={CLASS_FILTER_OPTIONS}
            onChange={setTableClass}
            icon={GraduationCap}
          />

          {/* Section Filter (Strictly Section A & Section B) */}
          <NiceSelectDropdown
            label="Section"
            value={tableSection}
            options={SECTION_FILTER_OPTIONS}
            onChange={setTableSection}
            icon={Layers}
          />

          {/* Group Filter */}
          <NiceSelectDropdown
            label="Group"
            badgeText={showGroupSelector ? "" : "Optional"}
            value={tableGroup}
            options={GROUP_FILTER_OPTIONS}
            onChange={setTableGroup}
            disabled={!showGroupSelector}
            icon={Compass}
          />

          {/* Status Filter */}
          <NiceSelectDropdown
            label="Status Filter"
            value={tableStatus}
            options={STATUS_FILTER_OPTIONS}
            onChange={setTableStatus}
            icon={Users}
          />

          {/* Date Preset Selector */}
          <NiceSelectDropdown
            label="Range Preset"
            value={datePreset}
            options={DATE_PRESET_OPTIONS}
            onChange={setDatePreset}
            icon={Calendar}
          />

          {/* Attendance Date Filter (Single vs Custom Date Range) */}
          {datePreset === "Custom Date Range" ? (
            <>
              {/* Custom Start Date */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-indigo-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none transition-all hover:border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-indigo-900/50 dark:bg-slate-950 dark:text-slate-100 cursor-pointer shadow-xs"
                />
              </div>

              {/* Custom End Date */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-indigo-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none transition-all hover:border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-indigo-900/50 dark:bg-slate-950 dark:text-slate-100 cursor-pointer shadow-xs"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={tableDate}
                onChange={(e) => setTableDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none transition-all hover:border-indigo-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search by student name, email, or class..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition-all hover:border-indigo-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold self-end sm:self-center flex items-center gap-2">
            <span>Showing <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{filteredTableRecords.length}</span> records</span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:bg-slate-900/80 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Student Info</th>
                <th className="py-3.5 px-4">Class & Section</th>
                <th className="py-3.5 px-4">Group / Stream</th>
                <th className="py-3.5 px-4">Overall Attendance Rate</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status (Click to toggle)</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {isTableLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {/* Student Info Skeleton */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                          <div className="h-3 w-36 rounded bg-slate-200/70 dark:bg-slate-800/70" />
                        </div>
                      </div>
                    </td>

                    {/* Class & Section Skeleton */}
                    <td className="py-3.5 px-4">
                      <div className="h-6 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
                    </td>

                    {/* Group Skeleton */}
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>

                    {/* Overall Rate Skeleton */}
                    <td className="py-3.5 px-4">
                      <div className="w-32 space-y-1.5">
                        <div className="flex justify-between">
                          <div className="h-3 w-10 rounded bg-slate-200 dark:bg-slate-800" />
                          <div className="h-3 w-12 rounded bg-slate-200/70 dark:bg-slate-800/70" />
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
                      </div>
                    </td>

                    {/* Date Skeleton */}
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    </td>

                    {/* Status Badge Skeleton */}
                    <td className="py-3.5 px-4">
                      <div className="h-6 w-20 rounded-md bg-slate-200 dark:bg-slate-800" />
                    </td>

                    {/* Action Button Skeleton */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="ml-auto h-7 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))
              ) : filteredTableRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSpreadsheet className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        No attendance records found
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Try adjusting your class, section, group, date, or status filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTableRecords.map((record) => {
                  const initials = record.name
                    ? record.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                    : "ST";

                  const rate = record.attendanceRate ?? 100;
                  const isAtRisk = record.isAtRisk || rate < 75;

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-extrabold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{record.name}</span>
                              {isAtRisk && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900/40">
                                  <AlertTriangle className="h-3 w-3" /> At Risk
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-400">
                              {record.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class & Section */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {record.studentClass || "N/A"} - {record.studentSection || "Section A"}
                        </span>
                      </td>

                      {/* Group */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {record.department || "General"}
                        </span>
                      </td>

                      {/* Overall Attendance Rate Column */}
                      <td className="py-3.5 px-4">
                        <div className="w-32 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-extrabold">
                            <span className={rate >= 85 ? "text-emerald-600 dark:text-emerald-400" : rate >= 75 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}>
                              {rate}%
                            </span>
                            <span className="text-[9px] text-slate-400 font-normal">
                              ({record.totalClassesRecorded || 0} sessions)
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${rate >= 85
                                ? "bg-emerald-500"
                                : rate >= 75
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                                }`}
                              style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {datePreset === "Custom Date Range"
                              ? `${customStartDate} → ${customEndDate}`
                              : tableDate}
                          </span>
                        </div>
                      </td>

                      {/* Interactive Inline Status Toggle */}
                      <td className="py-3.5 px-4">
                        <InlineStatusDropdown
                          studentId={record.id}
                          studentName={record.name}
                          studentEmail={record.email}
                          studentClass={record.studentClass}
                          studentSection={record.studentSection}
                          department={record.department}
                          date={tableDate}
                          currentStatus={record.status}
                          onStatusUpdated={handleSuccessMark}
                        />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setIsMarkModalOpen(true)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/70 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-all cursor-pointer border border-indigo-100 dark:border-indigo-900/40"
                        >
                          <Edit3 className="h-3 w-3" />
                          Mark Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Mark Attendance Modal */}
      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        onSuccess={handleSuccessMark}
      />
    </div>
  );
}

/* ========================================================= */
/* INLINE STATUS DROPDOWN COMPONENT */
/* ========================================================= */

function InlineStatusDropdown({
  studentId,
  studentName,
  studentEmail,
  studentClass,
  studentSection,
  department,
  date,
  currentStatus,
  onStatusUpdated,
}: {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentClass?: string | null;
  studentSection?: string | null;
  department?: string | null;
  date: string;
  currentStatus: "PRESENT" | "LATE" | "ABSENT" | "NOT_MARKED";
  onStatusUpdated: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateStatus = async (newStatus: "PRESENT" | "LATE" | "ABSENT") => {
    setIsOpen(false);
    try {
      setIsUpdating(true);
      const token = getAuthToken();
      const payload = {
        date,
        grade: studentClass || "Class 8",
        section: studentSection || "Section A",
        group: department || null,
        records: [
          {
            studentId,
            studentEmail,
            studentName,
            status: newStatus,
          },
        ],
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
      if (response.ok && data.success) {
        toast.success(`Updated status for ${studentName}`);
        onStatusUpdated();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Inline status update error:", err);
      toast.error("Failed to update attendance status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer focus:outline-none hover:opacity-85 transition-opacity"
      >
        {isUpdating ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin text-indigo-600 dark:text-indigo-400" />
            Updating...
          </span>
        ) : (
          <StatusBadge status={currentStatus} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-50 mt-1.5 w-36 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
          >
            {(["PRESENT", "LATE", "ABSENT"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleUpdateStatus(st)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${currentStatus === st
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
              >
                <StatusBadge status={st} />
                {currentStatus === st && <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================================================= */
/* STATUS BADGE */
/* ========================================================= */

function StatusBadge({ status }: { status: "PRESENT" | "LATE" | "ABSENT" | "NOT_MARKED" }) {
  switch (status) {
    case "PRESENT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          Present
        </span>
      );
    case "LATE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
          <Clock3 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          Late
        </span>
      );
    case "ABSENT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
          <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
          Absent
        </span>
      );
    case "NOT_MARKED":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
          Not Marked
        </span>
      );
  }
}

/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
  isLoading = false,
  iconClass = "text-indigo-600 dark:text-indigo-400",
  iconBg = "bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
  isLoading?: boolean;
  iconClass?: string;
  iconBg?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/50 sm:p-5"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-4 text-[10px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      {isLoading ? (
        <div className="mt-2 space-y-2">
          <div className="h-7 w-20 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-3 w-28 rounded-md bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
        </div>
      ) : (
        <>
          <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {value}
          </p>

          <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500">
            {detail}
          </p>
        </>
      )}
    </motion.div>
  );
}

/* ========================================================= */
/* ATTENDANCE LEGEND */
/* ========================================================= */

function AttendanceLegend({
  label,
  value,
  percentage,
  dot,
}: {
  label: string;
  value: string;
  percentage: string;
  dot: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
          {value}
        </span>

        <span className="w-10 text-right text-[10px] text-slate-400">
          {percentage}
        </span>
      </div>
    </div>
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
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-xs font-bold transition-all duration-200 cursor-pointer min-w-0 overflow-hidden ${disabled
          ? "border-slate-200/60 bg-slate-100/60 text-slate-400 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-600 opacity-60 cursor-not-allowed"
          : isOpen
            ? "border-indigo-600 bg-white ring-4 ring-indigo-500/10 dark:border-indigo-500 dark:bg-slate-950 dark:ring-indigo-500/20 text-slate-900 dark:text-white"
            : "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-indigo-500/60 dark:hover:bg-slate-900"
          }`}
      >
        <span className="truncate flex items-center gap-2 min-w-0 flex-1">
          {Icon && (
            <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          )}
          <span className="truncate">{value}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
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
            className="absolute left-0 top-full z-[100] mt-1.5 w-full min-w-[140px] sm:min-w-[160px] max-h-60 overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/80 font-medium"
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
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${isSelected
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