"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Sparkles,
  UserCheck,
  Building,
  ArrowUpRight,
  Activity,
  Bell,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  // Loading skeleton while checking authentication & role
  if (isPending) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        </div>
      </div>
    );
  }

  // If not logged in or role is not admin, redirect handles it
  if (!session?.user || rawRole !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              ADMIN WORKSPACE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome, Admin!
            </h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Central EduNexus administration hub and institution overview.
        </p>
      </motion.div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Students */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-full">
              +12 this term
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Students
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              1,240
            </h3>
          </div>
        </motion.div>

        {/* Card 2: Total Teachers */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-1 rounded-full">
              Active Staff
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Teachers
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              84
            </h3>
          </div>
        </motion.div>

        {/* Card 3: Active Classes */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-full">
              Running
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Classes
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              36
            </h3>
          </div>
        </motion.div>

        {/* Card 4: Fee Collection */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-full">
              94.2% Collected
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Fee Collection
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              $48,200
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Middle Section: Attendance Chart & Fee Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Attendance Bar Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Weekly Attendance Analytics
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
              Last 7 Days
            </span>
          </div>

          <div className="h-52 flex items-end justify-between gap-3 sm:gap-5 pt-8 px-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            {[
              { day: "Sat", height: "78%", rate: "88%" },
              { day: "Sun", height: "94%", rate: "96%" },
              { day: "Mon", height: "85%", rate: "91%" },
              { day: "Tue", height: "98%", rate: "99%" },
              { day: "Wed", height: "89%", rate: "93%" },
              { day: "Thu", height: "92%", rate: "95%" },
              { day: "Fri", height: "55%", rate: "65%" },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  {col.rate}
                </span>
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-indigo-400 dark:from-blue-700 dark:to-cyan-400 rounded-t-2xl hover:from-blue-500 hover:to-indigo-300 transition-all duration-300 shadow-lg shadow-blue-500/10"
                  style={{ height: col.height }}
                />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
                  {col.day}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-sm mb-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span>Faculty Punctuality & Activity</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">96.5%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm" style={{ width: "96.5%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Fee Collection Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Fee Status Breakdown
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold text-slate-600 dark:text-slate-300">
                <span>Paid (94.2%)</span>
                <span className="text-emerald-600">$48,200</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94.2%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold text-slate-600 dark:text-slate-300">
                <span>Pending (4.1%)</span>
                <span className="text-amber-600">$2,100</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "4.1%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold text-slate-600 dark:text-slate-300">
                <span>Overdue (1.7%)</span>
                <span className="text-rose-600">$850</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: "1.7%" }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-bold text-blue-700 dark:text-blue-400 mb-0.5">Automated Reminders</p>
            Next notification batch for overdue fees is scheduled for tomorrow.
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Activity Feed */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Recent System Activities
            </h2>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
              View All Logs
            </span>
          </div>

          <div className="space-y-3">
            {[
              { title: "New student account registered", desc: "Rafiq Ahmed joined Class 11", time: "10 mins ago", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" },
              { title: "Fee payment confirmed", desc: "$450 received from ID #1092", time: "45 mins ago", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" },
              { title: "Notice broadcasted", desc: "Mid-term exam schedule updated", time: "3 hours ago", color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${item.color}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Management Actions */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/admin/users")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:border-blue-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Manage Users
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add/Remove accounts
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </button>

            <button
              onClick={() => router.push("/admin/classes")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:border-blue-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    School Classes
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure grades & sections
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </button>

            <button
              onClick={() => router.push("/dashboard/admin/notices")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:border-blue-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Broadcast Notice
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Send updates to school
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}