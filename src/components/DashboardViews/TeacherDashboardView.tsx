"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  Users,
  CalendarCheck,
  FileText,
  TrendingUp,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

/* ========================================================= */
/* DATA */
/* ========================================================= */

const performanceData = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 76 },
  { month: "Mar", score: 74 },
  { month: "Apr", score: 81 },
  { month: "May", score: 84 },
  { month: "Jun", score: 88 },
  { month: "Jul", score: 91 },
];

const attendanceData = [
  { day: "Mon", present: 91, absent: 9 },
  { day: "Tue", present: 95, absent: 5 },
  { day: "Wed", present: 93, absent: 7 },
  { day: "Thu", present: 97, absent: 3 },
  { day: "Fri", present: 94, absent: 6 },
];

const classPerformance = [
  { className: "Grade 8 A", score: 91 },
  { className: "Grade 8 B", score: 86 },
  { className: "Grade 9 A", score: 88 },
  { className: "Grade 10 A", score: 94 },
];

const assignments = [
  {
    title: "Mathematics — Algebra",
    className: "Grade 8 A",
    submitted: 27,
    total: 30,
    status: "On track",
  },
  {
    title: "Science — Human Biology",
    className: "Grade 9 A",
    submitted: 22,
    total: 28,
    status: "Review",
  },
  {
    title: "Physics — Motion",
    className: "Grade 10 A",
    submitted: 31,
    total: 32,
    status: "On track",
  },
];

/* ========================================================= */
/* MAIN COMPONENT */
/* ========================================================= */

export default function TeacherDashboardView() {
  return (
    <div className="space-y-6 pb-8">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/90 p-6 shadow-xs transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200">
            <LayoutDashboard className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-300">
                <Sparkles className="h-3 w-3 text-blue-500" />
                Teacher Workspace
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Welcome, Teacher!
            </h1>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Teacher Dashboard Overview
            </p>
          </div>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* QUICK STATS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value="115"
          detail="+6 this term"
          positive
          delay={0}
        />

        <StatCard
          icon={CalendarCheck}
          label="Attendance"
          value="94.1%"
          detail="+2.4% this week"
          positive
          delay={0.05}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />

        <StatCard
          icon={FileText}
          label="Assignments"
          value="24"
          detail="7 awaiting review"
          delay={0.1}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />

        <StatCard
          icon={TrendingUp}
          label="Avg. Performance"
          value="87.4%"
          detail="+4.8% this term"
          positive
          delay={0.15}
          iconClass="text-cyan-600 dark:text-cyan-400"
          iconBg="bg-cyan-50 dark:bg-cyan-500/10"
        />
      </div>

      {/* ===================================================== */}
      {/* PERFORMANCE + ATTENDANCE */}
      {/* ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Performance */}
        <DashboardCard
          title="Student Performance"
          description="Average academic performance over the current term."
          icon={TrendingUp}
          delay={0.18}
        >
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                91%
              </p>
              <p className="mt-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                ↑ 4.2% compared with last month
              </p>
            </div>

            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[9px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              This Term
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={performanceData}
                margin={{
                  top: 5,
                  right: 5,
                  left: -25,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopOpacity={0.18} />
                    <stop offset="100%" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                  }}
                  className="text-slate-400"
                />

                <YAxis
                  domain={[60, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                  }}
                  className="text-slate-400"
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "11px",
                  }}
                  formatter={(value) => [`${value}%`, "Performance"]}
                />

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#performanceFill)"
                  dot={false}
                  activeDot={{
                    r: 4,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Attendance */}
        <DashboardCard
          title="Weekly Attendance"
          description="Student attendance for the current week."
          icon={CalendarCheck}
          delay={0.22}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        >
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                94.1%
              </p>
              <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                Average attendance
              </p>
            </div>

            <div className="flex items-center gap-2 text-[9px] font-semibold text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Present
            </div>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceData}
                margin={{
                  top: 5,
                  right: 0,
                  left: -25,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                  }}
                  className="text-slate-400"
                />

                <YAxis
                  domain={[80, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                  }}
                  className="text-slate-400"
                />

                <Tooltip
                  cursor={{ fill: "rgba(148,163,184,0.06)" }}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "11px",
                  }}
                  formatter={(value) => [`${value}%`, "Present"]}
                />

                <Bar
                  dataKey="present"
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* ===================================================== */}
      {/* CLASS PERFORMANCE + ACTIVITY */}
      {/* ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        {/* Class Performance */}
        <DashboardCard
          title="Class Performance"
          description="Average score by assigned class."
          icon={BookOpen}
          delay={0.26}
        >
          <div className="mt-2 space-y-5">
            {classPerformance.map((item, index) => (
              <motion.div
                key={item.className}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.35 + index * 0.05,
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {item.className}
                  </span>

                  <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">
                    {item.score}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{
                      duration: 0.7,
                      delay: 0.35 + index * 0.05,
                    }}
                    className="h-full rounded-full bg-blue-600"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <button className="mt-7 inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400">
            View detailed results
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </DashboardCard>

        {/* Assignment Activity */}
        <DashboardCard
          title="Assignment Activity"
          description="Latest submission and grading activity."
          icon={FileText}
          delay={0.3}
        >
          <div className="space-y-3">
            {assignments.map((assignment, index) => {
              const percentage = Math.round(
                (assignment.submitted / assignment.total) * 100
              );

              const isReview = assignment.status === "Review";

              return (
                <motion.div
                  key={assignment.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.35 + index * 0.07,
                  }}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        {assignment.title}
                      </h3>

                      <p className="mt-1 text-[9px] text-slate-400">
                        {assignment.className}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-md px-2 py-1 text-[8px] font-bold ${
                        isReview
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-[9px] text-slate-400">
                        Submissions
                      </span>

                      <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">
                        {assignment.submitted}/{assignment.total}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full rounded-full ${
                          isReview ? "bg-amber-500" : "bg-blue-500"
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      {/* ===================================================== */}
      {/* BOTTOM QUICK ACTIONS */}
      {/* ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.38 }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        <QuickAction
          icon={CheckCircle2}
          title="Mark Attendance"
          description="Record today's attendance"
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />

        <QuickAction
          icon={FileText}
          title="Create Assignment"
          description="Give students new work"
          iconClass="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-500/10"
        />

        <QuickAction
          icon={Clock}
          title="Review Submissions"
          description="7 assignments waiting"
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
        />
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
  positive,
  delay,
  iconClass = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-50 dark:bg-blue-500/10",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
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

      <p
        className={`mt-0.5 text-[9px] ${
          positive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {detail}
      </p>
    </motion.div>
  );
}

/* ========================================================= */
/* DASHBOARD CARD */
/* ========================================================= */

function DashboardCard({
  title,
  description,
  icon: Icon,
  children,
  delay,
  iconClass = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-50 dark:bg-blue-500/10",
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay: number;
  iconClass?: string;
  iconBg?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-6 flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconClass}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-1 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </motion.section>
  );
}

/* ========================================================= */
/* QUICK ACTION */
/* ========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  iconClass,
  iconBg,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  iconClass: string;
  iconBg: string;
}) {
  return (
    <button className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <p className="mt-0.5 text-[9px] text-slate-400">{description}</p>
      </div>

      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-slate-600" />
    </button>
  );
}