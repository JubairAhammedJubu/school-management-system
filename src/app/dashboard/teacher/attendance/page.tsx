"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Sparkles,
  Users,
  UserCheck,
  UserX,
  Clock3,
  ChevronDown,
  TrendingUp,
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

const weeklyAttendance = [
  { day: "Mon", attendance: 92 },
  { day: "Tue", attendance: 95 },
  { day: "Wed", attendance: 89 },
  { day: "Thu", attendance: 94 },
  { day: "Fri", attendance: 97 },
];

const classAttendance = [
  { name: "Grade 8 A", attendance: 96 },
  { name: "Grade 8 B", attendance: 91 },
  { name: "Grade 9 A", attendance: 94 },
  { name: "Grade 9 B", attendance: 88 },
  { name: "Grade 10 A", attendance: 97 },
];

const distributionData = [
  { name: "Present", value: 131 },
  { name: "Late", value: 6 },
  { name: "Absent", value: 5 },
];

export default function TeacherAttendancePage() {
  return (
    <div className="space-y-6 pb-8">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/90 p-6 shadow-xs transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-blue-600 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-blue-400">
              <CalendarCheck className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                  <Sparkles className="h-3 w-3" />
                  Teacher Workspace
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Attendance
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Mark and track student class attendance.
              </p>
            </div>
          </div>

          <button className="inline-flex h-10 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-xs transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600">
            <CalendarCheck className="h-4 w-4 text-slate-400" />
            This Week
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
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
          value="142"
          detail="Across your classes"
          delay={0}
        />

        <StatCard
          icon={UserCheck}
          label="Present"
          value="131"
          detail="92.3% attendance"
          delay={0.05}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />

        <StatCard
          icon={Clock3}
          label="Late"
          value="06"
          detail="4.2% of students"
          delay={0.1}
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
        />

        <StatCard
          icon={UserX}
          label="Absent"
          value="05"
          detail="3.5% of students"
          delay={0.15}
          iconClass="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-500/10"
        />
      </div>

      {/* ===================================================== */}
      {/* CHARTS */}
      {/* ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Weekly Attendance */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Weekly Attendance
              </h2>

              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Average attendance across all classes
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              +3.2%
            </div>
          </div>

          <div className="mt-8 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyAttendance}
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
                      stopColor="#3b82f6"
                      stopOpacity={0.22}
                    />
                    <stop
                      offset="100%"
                      stopColor="#3b82f6"
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
                  domain={[80, 100]}
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
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#attendanceFill)"
                  dot={{
                    r: 4,
                    fill: "#ffffff",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#3b82f6",
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
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6"
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
                data={distributionData}
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
                  {distributionData.map((item) => (
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
              value="131"
              percentage="92.3%"
              dot="bg-emerald-500"
            />

            <AttendanceLegend
              label="Late"
              value="6"
              percentage="4.2%"
              dot="bg-amber-500"
            />

            <AttendanceLegend
              label="Absent"
              value="5"
              percentage="3.5%"
              dot="bg-rose-500"
            />
          </div>
        </motion.section>
      </div>

      {/* ===================================================== */}
      {/* CLASS ATTENDANCE */}
      {/* ===================================================== */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Class Attendance
            </h2>

            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Attendance rate by class
            </p>
          </div>

          <span className="text-[10px] font-medium text-slate-400">
            Current week
          </span>
        </div>

        <div className="mt-6 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={classAttendance}
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
                width={70}
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
                fill="#3b82f6"
                radius={[0, 7, 7, 0]}
                barSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* ===================================================== */}
      {/* QUICK ACTION */}
      {/* ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-500/10 dark:bg-blue-500/[0.06] sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Ready to take attendance?
          </h3>

          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Mark today&apos;s attendance for your classes and keep your records
            up to date.
          </p>
        </div>

        <button className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700">
          <CalendarCheck className="h-4 w-4" />
          Mark Attendance
        </button>
      </motion.div>
    </div>
  );
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
  iconClass = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-50 dark:bg-blue-500/10",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
  iconClass?: string;
  iconBg?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-4 text-[10px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500">
        {detail}
      </p>
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