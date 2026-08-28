"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  MoreHorizontal,
  Sparkles,
  Users,
  UserCheck,
} from "lucide-react";

const classes = [
  {
    subject: "Mathematics",
    code: "MATH-08A",
    grade: "Grade 8",
    section: "Section A",
    students: 32,
    attendance: 96,
    schedule: "Mon · Wed · Fri",
    time: "09:00 AM – 10:00 AM",
    room: "Room 204",
  },
  {
    subject: "Mathematics",
    code: "MATH-08B",
    grade: "Grade 8",
    section: "Section B",
    students: 28,
    attendance: 91,
    schedule: "Tue · Thu",
    time: "10:15 AM – 11:15 AM",
    room: "Room 204",
  },
  {
    subject: "Advanced Mathematics",
    code: "MATH-09A",
    grade: "Grade 9",
    section: "Section A",
    students: 31,
    attendance: 94,
    schedule: "Mon · Wed · Fri",
    time: "11:30 AM – 12:30 PM",
    room: "Room 301",
  },
  {
    subject: "Mathematics",
    code: "MATH-10A",
    grade: "Grade 10",
    section: "Section A",
    students: 24,
    attendance: 97,
    schedule: "Tue · Thu",
    time: "01:30 PM – 02:30 PM",
    room: "Room 301",
  },
];

export default function TeacherMyClassesPage() {
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
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                  <Sparkles className="h-3 w-3" />
                  Teacher Workspace
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                My Classes
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Manage and view your assigned class sections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs dark:border-slate-700 dark:bg-slate-800">
            <BookOpen className="h-4 w-4 text-blue-500" />

            <div>
              <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                Assigned Classes
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {classes.length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* SUMMARY */}
      {/* ===================================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={BookOpen}
          label="Classes"
          value="04"
          detail="Assigned sections"
          delay={0}
        />

        <SummaryCard
          icon={Users}
          label="Students"
          value="115"
          detail="Across all classes"
          delay={0.05}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />

        <SummaryCard
          icon={UserCheck}
          label="Avg. Attendance"
          value="94.5%"
          detail="This week"
          delay={0.1}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />

        <SummaryCard
          icon={Clock3}
          label="Teaching Hours"
          value="18h"
          detail="This week"
          delay={0.15}
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
        />
      </div>

      {/* ===================================================== */}
      {/* CLASS SECTION */}
      {/* ===================================================== */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
      >
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Your Classes
            </h2>

            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Select a class to view students, attendance, and coursework.
            </p>
          </div>

          <button className="hidden items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 sm:flex">
            View schedule
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Class cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {classes.map((item, index) => (
            <ClassCard
              key={item.code}
              item={item}
              index={index}
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
}

/* ========================================================= */
/* CLASS CARD */
/* ========================================================= */

function ClassCard({
  item,
  index,
}: {
  item: (typeof classes)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.2 + index * 0.07,
      }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
    >
      {/* Top accent */}
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 opacity-70" />

      <div className="p-5 sm:p-6">
        {/* Card header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {item.subject}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {item.grade}
                </span>

                <span className="text-slate-300 dark:text-slate-700">
                  •
                </span>

                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {item.section}
                </span>
              </div>
            </div>
          </div>

          <button
            aria-label={`More options for ${item.subject}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Class code */}
        <div className="mt-5 inline-flex rounded-md bg-slate-50 px-2.5 py-1 text-[9px] font-bold tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {item.code}
        </div>

        {/* Details */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoItem
            icon={Users}
            label="Students"
            value={`${item.students}`}
          />

          <InfoItem
            icon={UserCheck}
            label="Attendance"
            value={`${item.attendance}%`}
            valueClass={
              item.attendance >= 95
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-blue-600 dark:text-blue-400"
            }
          />

          <InfoItem
            icon={CalendarDays}
            label="Schedule"
            value={item.schedule}
          />

          <InfoItem
            icon={Clock3}
            label="Time"
            value={item.time}
          />
        </div>

        {/* Attendance progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              Attendance
            </span>

            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">
              {item.attendance}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.attendance}%` }}
              transition={{
                duration: 0.7,
                delay: 0.35 + index * 0.08,
                ease: "easeOut",
              }}
              className={`h-full rounded-full ${
                item.attendance >= 95
                  ? "bg-emerald-500"
                  : item.attendance >= 90
                    ? "bg-blue-500"
                    : "bg-amber-500"
              }`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {item.room}
          </div>

          <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600 dark:hover:text-white">
            Open Class
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ========================================================= */
/* INFO ITEM */
/* ========================================================= */

function InfoItem({
  icon: Icon,
  label,
  value,
  valueClass = "text-slate-700 dark:text-slate-200",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/50">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-slate-400" />

        <span className="text-[9px] font-medium text-slate-400">
          {label}
        </span>
      </div>

      <p
        className={`mt-1.5 truncate text-[10px] font-bold ${valueClass}`}
      >
        {value}
      </p>
    </div>
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