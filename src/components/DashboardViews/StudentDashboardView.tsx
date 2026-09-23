"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Trophy,
  Clock3,
  CheckCircle2,
  Loader2,
  ArrowRight,
  GraduationCap,
  Layers,
  AlertTriangle,
  Lock,
  Bell,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  SlidersHorizontal,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submitStatus: "PENDING" | "SUBMITTED" | "GRADED";
}

interface Result {
  id: string;
  exam: string;
  score: number;
  total: number;
  grade: string;
  createdAt: string;
}

interface Subject {
  id: string;
  subject: string;
  teacherName: string;
  subjectCode?: string;
}

interface FeeOverdue {
  isRestricted: boolean;
  unpaidMonthsCount: number;
  unpaidMonths: { monthName: string }[];
  cumulativeOverdue: number;
}

export default function StudentOverviewPage() {
  const { data: session } = useSession();
  const studentName = session?.user?.name || "Student";
  const studentEmail = session?.user?.email;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [feeOverdue, setFeeOverdue] = useState<FeeOverdue | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!studentEmail) return;

    const fetchAll = async () => {
      try {
        setIsLoading(true);

        const [assignRes, resultRes, subjectRes, feeRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/assignments`,
            {
              credentials: "include",
            },
          ).catch(() => null),
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/results?status=PUBLISHED`,
            {
              credentials: "include",
            },
          ).catch(() => null),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/subjects`, {
            credentials: "include",
          }).catch(() => null),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/fees`, {
            credentials: "include",
          }).catch(() => null),
        ]);

        if (assignRes && assignRes.ok) {
          const assignData = await assignRes.json();
          if (assignData.success) setAssignments(assignData.assignments || []);
        }

        if (resultRes && resultRes.ok) {
          const resultData = await resultRes.json();
          if (resultData.success) setResults(resultData.results || []);
        }

        if (subjectRes && subjectRes.ok) {
          const subjectData = await subjectRes.json();
          if (subjectData.success) setSubjects(subjectData.subjects || []);
        }

        if (feeRes && feeRes.ok) {
          const feeData = await feeRes.json();
          if (feeData && feeData.overdue) {
            setFeeOverdue(feeData.overdue);
          }
        }
      } catch (err) {
        console.error("Overview fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [studentEmail]);

  const pendingCount = assignments.filter(
    (a) => a.submitStatus === "PENDING",
  ).length;
  const submittedCount = assignments.filter(
    (a) => a.submitStatus === "SUBMITTED",
  ).length;
  const resultsCount = results.length;
  const subjectsCount = subjects.length;

  const upcomingAssignments = assignments
    .filter((a) => a.submitStatus === "PENDING")
    .slice(0, 3);

  const recentResults = results.slice(0, 3);
  const isRestricted = !!feeOverdue?.isRestricted;

  return (
    <div className="space-y-6">
      {/* ⚠️ CRITICAL WARNING BANNER IF 3+ MONTHS OVERDUE */}
      {isRestricted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 p-5 shadow-lg shadow-rose-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400">
                  Account Warning: Overdue Tuition Fees (
                  {feeOverdue.unpaidMonthsCount} Months)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Privileges Suspended
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                You have exceeded the maximum allowed limit of 3 months overdue.
                Unpaid months:{" "}
                <strong className="text-rose-600 dark:text-rose-400">
                  {feeOverdue.unpaidMonths.map((m) => m.monthName).join(", ")}
                </strong>{" "}
                (Total: ৳{feeOverdue.cumulativeOverdue.toLocaleString()}).
                Examination admit slips and result sheets are locked until dues
                are cleared.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/student/fee"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/20 shrink-0"
          >
            Clear Overdue Fees
          </Link>
        </motion.div>
      )}

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 p-6 sm:p-8"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white text-xl font-bold shadow-lg shadow-indigo-500/25">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back,
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {studentName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Here is your academic overview
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Pending",
            value: isLoading ? "..." : pendingCount,
            icon: Clock3,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/40",
          },
          {
            label: "Submitted",
            value: isLoading ? "..." : submittedCount,
            icon: CheckCircle2,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/40",
          },
          {
            label: "Results",
            value: isLoading ? "..." : resultsCount,
            icon: Trophy,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/40",
            badge: isRestricted ? "Locked" : undefined,
          },
          {
            label: "Subjects",
            value: isLoading ? "..." : subjectsCount,
            icon: BookOpen,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-950/40",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              {item.badge && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Lock className="w-3 h-3" /> {item.badge}
                </span>
              )}
            </div>
            <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
              {item.value}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Assignments
              </h2>
            </div>
            <Link
              href="/dashboard/student/assignment"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-5">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : upcomingAssignments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                No pending assignments
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.subject} • Due{" "}
                        {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* Recent Results */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Results
              </h2>
            </div>
            <Link
              href="/dashboard/student/result"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-5">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : isRestricted ? (
              <div className="p-6 text-center space-y-2">
                <Lock className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Results Access Temporarily Locked
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  You have 3 or more months of unpaid tuition fees. Please clear
                  pending fees to view grade cards.
                </p>
                <Link
                  href="/dashboard/student/fee"
                  className="inline-block mt-2 text-xs font-bold text-rose-600 hover:underline"
                >
                  Go to Fee Portal →
                </Link>
              </div>
            ) : recentResults.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                No results published yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentResults.map((item) => {
                  const percentage = Math.round(
                    (item.score / item.total) * 100,
                  );
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {item.exam}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.score}/{item.total} • {percentage}%
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {item.grade}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Subjects Quick View */}
      {subjects.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              My Subjects
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.slice(0, 6).map((subject) => (
              <div
                key={subject.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {subject.subject}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {subject.teacherName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Direct Route Shortcuts */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
            Quick Navigation Hub
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Direct Portal Access
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            {
              label: "Notices",
              href: "/dashboard/student/notices",
              icon: Bell,
            },
            {
              label: "Assignments",
              href: "/dashboard/student/assignment",
              icon: FileText,
            },
            {
              label: "Results",
              href: "/dashboard/student/result",
              icon: Trophy,
            },
            {
              label: "Attendance",
              href: "/dashboard/student/attendance",
              icon: CalendarCheck,
            },
            {
              label: "Routine",
              href: "/dashboard/student/routine",
              icon: CalendarDays,
            },
            { label: "Fees", href: "/dashboard/student/fee", icon: CreditCard },
            {
              label: "Subjects",
              href: "/dashboard/student/subjects",
              icon: BookOpen,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
