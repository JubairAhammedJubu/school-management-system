"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  Award,
  CreditCard,
  Bell,
  FileText,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

type UserRole = "admin" | "teacher" | "student";

export default function DashboardPage() {
  const { data: session } = useSession();
  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();
  const userRole: UserRole =
    rawRole === "admin" ? "admin" : rawRole === "teacher" ? "teacher" : "student";

  const userName = session?.user?.name ?? "User";

  const getStatsForRole = (role: UserRole) => {
    switch (role) {
      case "admin":
        return [
          { label: "Total Students", value: "1,248", icon: GraduationCap, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60" },
          { label: "Total Teachers", value: "84", icon: Users, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60" },
          { label: "Active Classes", value: "36", icon: BookOpen, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60" },
          { label: "Fees Collected", value: "$48,250", icon: CreditCard, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60" },
        ];
      case "teacher":
        return [
          { label: "Assigned Classes", value: "4", icon: BookOpen, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60" },
          { label: "Active Students", value: "142", icon: GraduationCap, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60" },
          { label: "Pending Assignments", value: "18", icon: FileText, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60" },
          { label: "Avg Class Attendance", value: "94.8%", icon: CalendarCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60" },
        ];
      case "student":
      default:
        return [
          { label: "Overall Attendance", value: "96.2%", icon: CalendarCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60" },
          { label: "Current GPA", value: "3.88", icon: Award, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60" },
          { label: "Pending Assignments", value: "3", icon: FileText, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60" },
          { label: "Fee Status", value: "Paid", icon: CreditCard, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60" },
        ];
    }
  };

  const stats = getStatsForRole(userRole);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 shadow-xl shadow-blue-500/10"
      >
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="capitalize">{userRole} Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {userRole === "admin"
              ? "Here is an overview of your school metrics, management tools, and notices."
              : userRole === "teacher"
              ? "Manage your classes, track student performance, and review assignments."
              : "Track your academic progress, class schedule, results, and school notices."}
          </p>
        </div>
      </motion.div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <div className={`p-2.5 rounded-xl ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {item.value}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dashboard Section Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / Quick Actions */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Workspace Overview</span>
            </h2>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Active</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    System Synchronization
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    All school records up to date.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">Just now</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Next Semester Announcement
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Final exams schedule published by administration.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">2h ago</span>
            </div>
          </div>
        </div>

        {/* Role Quick Links */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Quick Navigation</span>
          </h2>
          <div className="space-y-2">
            {userRole === "admin" && (
              <>
                <Link href="/dashboard/teachers" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">
                  <span>Manage Teachers</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/dashboard/students" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">
                  <span>Manage Students</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/dashboard/notices" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">
                  <span>Publish Notice</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}

            {userRole === "teacher" && (
              <>
                <Link href="/dashboard/my-classes" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors">
                  <span>View My Classes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/dashboard/attendance" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors">
                  <span>Mark Attendance</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/dashboard/assignments" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors">
                  <span>Create Assignment</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}

            {userRole === "student" && (
              <>
                <Link href="/dashboard/attendance" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">
                  <span>Check Attendance</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/dashboard/results" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">
                  <span>View Grade Sheet</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/dashboard/notices" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">
                  <span>Read Notices</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
