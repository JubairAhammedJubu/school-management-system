"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  CalendarCheck,
  Award,
  FileText,
  CreditCard,
  Bell,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface StatCard {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stats: StatCard[] = [
  { label: "Attendance", value: "94%", hint: "This term", icon: CalendarCheck },
  { label: "Average Grade", value: "A-", hint: "Across 6 subjects", icon: Award },
  { label: "Pending Assignments", value: "3", hint: "Due this week", icon: FileText },
  { label: "Fee Due", value: "$120", hint: "Due Sep 10", icon: CreditCard },
];

interface UpcomingItem {
  title: string;
  subject: string;
  due: string;
}

const upcomingAssignments: UpcomingItem[] = [
  { title: "Algebra Problem Set 4", subject: "Mathematics", due: "Tomorrow" },
  { title: "Lab Report: Photosynthesis", subject: "Biology", due: "In 3 days" },
  { title: "Essay: Industrial Revolution", subject: "History", due: "In 5 days" },
];

interface NoticeItem {
  title: string;
  date: string;
}

const recentNotices: NoticeItem[] = [
  { title: "Mid-term exam schedule released", date: "2 days ago" },
  { title: "Library will be closed on Saturday", date: "4 days ago" },
  { title: "Annual sports day registration open", date: "1 week ago" },
];

export default function StudentDashboardView() {
  const { data: session } = useSession();
  const studentName = session?.user?.name ?? "Student";

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 p-6 sm:p-8 text-slate-900 dark:text-white shadow-xs transition-colors duration-300"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-2xs shrink-0">
            <LayoutDashboard className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <Sparkles className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                Student Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              Welcome, {studentName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Here&apos;s what&apos;s happening with your studies today.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06, ease: "easeOut" }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                {stat.label}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {stat.hint}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs transition-colors duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              Upcoming Assignments
            </h2>
            <Link
              href="/dashboard/student/assignment"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ul className="space-y-3">
            {upcomingAssignments.map((item) => (
              <li
                key={item.title}
                className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 px-4 py-3"
              >
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.subject}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                  <Clock className="h-3 w-3" />
                  {item.due}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Recent Notices */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs transition-colors duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              Recent Notices
            </h2>
            <Link
              href="/dashboard/notices"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ul className="space-y-3">
            {recentNotices.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 px-4 py-3"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
