"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  Search,
  Users,
  UserCheck,
  TrendingUp,
  UserRound,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Mail,
  ArrowUpRight,
} from "lucide-react";

const students = [
  {
    name: "Aarav Sharma",
    initials: "AS",
    className: "Grade 8 A",
    roll: "08A-001",
    attendance: 96,
    average: 92,
    status: "Active",
  },
  {
    name: "Emma Wilson",
    initials: "EW",
    className: "Grade 8 A",
    roll: "08A-002",
    attendance: 94,
    average: 89,
    status: "Active",
  },
  {
    name: "Noah Williams",
    initials: "NW",
    className: "Grade 8 B",
    roll: "08B-014",
    attendance: 91,
    average: 84,
    status: "Active",
  },
  {
    name: "Olivia Brown",
    initials: "OB",
    className: "Grade 9 A",
    roll: "09A-006",
    attendance: 98,
    average: 95,
    status: "Active",
  },
  {
    name: "Liam Davis",
    initials: "LD",
    className: "Grade 9 A",
    roll: "09A-011",
    attendance: 87,
    average: 78,
    status: "Needs Attention",
  },
  {
    name: "Sophia Miller",
    initials: "SM",
    className: "Grade 10 A",
    roll: "10A-003",
    attendance: 97,
    average: 91,
    status: "Active",
  },
  {
    name: "Ethan Taylor",
    initials: "ET",
    className: "Grade 8 B",
    roll: "08B-021",
    attendance: 93,
    average: 86,
    status: "Active",
  },
  {
    name: "Mia Anderson",
    initials: "MA",
    className: "Grade 10 A",
    roll: "10A-009",
    attendance: 89,
    average: 81,
    status: "Needs Attention",
  },
];

const classes = ["All Classes", "Grade 8 A", "Grade 8 B", "Grade 9 A", "Grade 10 A"];

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.roll.toLowerCase().includes(search.toLowerCase());

      const matchesClass =
        selectedClass === "All Classes" ||
        student.className === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [search, selectedClass]);

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
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                  <Sparkles className="h-3 w-3" />
                  Teacher Workspace
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Students
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                View student roster and academic profiles.
              </p>
            </div>
          </div>

          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700">
            <Users className="h-3.5 w-3.5" />
            Student Directory
          </button>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* SUMMARY */}
      {/* ===================================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Total Students"
          value="115"
          detail="Across your classes"
          delay={0}
        />

        <SummaryCard
          icon={UserCheck}
          label="Active"
          value="111"
          detail="96.5% of students"
          delay={0.05}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />

        <SummaryCard
          icon={TrendingUp}
          label="Average Score"
          value="87.4%"
          detail="Across all subjects"
          delay={0.1}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />

        <SummaryCard
          icon={UserRound}
          label="Avg. Attendance"
          value="94.1%"
          detail="This academic term"
          delay={0.15}
          iconClass="text-cyan-600 dark:text-cyan-400"
          iconBg="bg-cyan-50 dark:bg-cyan-500/10"
        />
      </div>

      {/* ===================================================== */}
      {/* STUDENT LIST */}
      {/* ===================================================== */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Toolbar */}
        <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Student Roster
              </h2>

              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {filteredStudents.length} students matching your current
                filters.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-[230px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
                />
              </div>

              {/* Class filter */}
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-9 text-[11px] font-semibold text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:w-[145px]"
                >
                  {classes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* DESKTOP TABLE */}
        {/* ================================================= */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Student
                </th>

                <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Class
                </th>

                <th className="px-4 py-3 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Attendance
                </th>

                <th className="px-4 py-3 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Avg. Score
                </th>

                <th className="px-4 py-3 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-4 py-3" />
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student, index) => (
                <StudentRow
                  key={student.roll}
                  student={student}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* ================================================= */}
        {/* MOBILE LIST */}
        {/* ================================================= */}

        <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
          {filteredStudents.map((student, index) => (
            <MobileStudentCard
              key={student.roll}
              student={student}
              index={index}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Search className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">
              No students found
            </h3>

            <p className="mt-1 max-w-xs text-[10px] text-slate-400">
              Try changing your search term or selecting another class.
            </p>
          </div>
        )}
      </motion.section>

      {/* ===================================================== */}
      {/* ATTENTION PANEL */}
      {/* ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 dark:border-amber-500/10 dark:bg-amber-500/[0.05] sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <UserRound className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2 students need attention
            </h3>

            <p className="mt-1 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
              These students have attendance or academic performance below
              your expected threshold.
            </p>
          </div>
        </div>

        <button className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-[10px] font-bold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
          Review Students
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </div>
  );
}

/* ========================================================= */
/* DESKTOP STUDENT ROW */
/* ========================================================= */

function StudentRow({
  student,
  index,
}: {
  student: (typeof students)[number];
  index: number;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.2 + index * 0.04,
      }}
      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/30"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[9px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {student.initials}
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {student.name}
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              Roll No. {student.roll}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {student.className}
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="mx-auto w-[95px]">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {student.attendance}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              style={{ width: `${student.attendance}%` }}
              className={`h-full rounded-full ${
                student.attendance >= 95
                  ? "bg-emerald-500"
                  : student.attendance >= 90
                    ? "bg-blue-500"
                    : "bg-amber-500"
              }`}
            />
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-center">
        <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
          {student.average}%
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <StatusBadge status={student.status} />
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            aria-label={`View ${student.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <button
            aria-label={`More options for ${student.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ========================================================= */
/* MOBILE STUDENT CARD */
/* ========================================================= */

function MobileStudentCard({
  student,
  index,
}: {
  student: (typeof students)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.2 + index * 0.04,
      }}
      className="p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[9px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {student.initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {student.name}
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              {student.roll} · {student.className}
            </p>
          </div>
        </div>

        <StatusBadge status={student.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-[8px] font-medium uppercase tracking-wider text-slate-400">
            Attendance
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
              {student.attendance}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              style={{ width: `${student.attendance}%` }}
              className={`h-full rounded-full ${
                student.attendance >= 95
                  ? "bg-emerald-500"
                  : student.attendance >= 90
                    ? "bg-blue-500"
                    : "bg-amber-500"
              }`}
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-[8px] font-medium uppercase tracking-wider text-slate-400">
            Average Score
          </p>

          <p className="mt-2 text-lg font-extrabold text-slate-800 dark:text-slate-200">
            {student.average}%
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-[9px] font-bold text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <Eye className="h-3 w-3" />
          View Profile
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 dark:border-slate-700">
          <Mail className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ========================================================= */
/* STATUS BADGE */
/* ========================================================= */

function StatusBadge({ status }: { status: string }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-bold ${
        active
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />

      {status}
    </span>
  );
}

/* ========================================================= */
/* SUMMARY CARD */
/* ========================================================= */

function SummaryCard({
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