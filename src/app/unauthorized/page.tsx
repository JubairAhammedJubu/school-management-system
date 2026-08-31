"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard, LogIn, Lock } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const userRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();
  const dashboardHref =
    userRole === "student"
      ? "/dashboard/student"
      : userRole === "admin"
        ? "/dashboard/admin"
        : "/dashboard/teacher";

  return (
    <main className="flex-1 w-full min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-16 sm:py-20 relative overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-500/15 dark:bg-rose-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/15 dark:bg-indigo-600/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl relative z-10"
      >
        {/* Animated Warning Shield Badge */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-rose-500/20 dark:bg-rose-500/30 animate-ping opacity-75" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-500 to-rose-600 text-white shadow-xl shadow-rose-500/25">
            <ShieldAlert className="h-10 w-10" />
          </div>
        </div>

        {/* Status Code & Main Title */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 mb-3">
          <Lock className="h-3.5 w-3.5" />
          Error 403 • Unauthorized Access
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Access Restricted
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
          You don&apos;t have sufficient role privileges or authorization to view this page. If you believe this is an error, please contact your EduNexus school administrator.
        </p>

        {/* Quick User Context Details */}
        {session?.user && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Signed in as:</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
                {session.user.name || session.user.email}
              </span>
              <span className="rounded-md bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 font-bold uppercase text-[10px] text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {userRole || "User"}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <Link
            href={session?.user ? dashboardHref : "/login"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            {session?.user ? (
              <>
                <LayoutDashboard className="h-4 w-4" />
                <span>My Dashboard</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </>
            )}
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all shadow-xs cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
