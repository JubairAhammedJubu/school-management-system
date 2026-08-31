"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import NoticeBoard from "@/components/NoticeBoard/NoticeBoard";
import { Bell, Pin, Megaphone, ShieldCheck, Sparkles, Layers } from "lucide-react";

export default function AdminNoticesPage() {
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

  if (isPending) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (!session?.user || rawRole !== "admin") {
    return null;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Top Hero Banner with Gradient Glow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-emerald-50/30 to-white/90 dark:from-slate-900/90 dark:via-emerald-950/20 dark:to-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl"
      >
        {/* Background Ambient Glows */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              ADMIN COMMUNICATION HUB
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Notice &amp; Announcement Center
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Create, pin, and broadcast official institutional alerts seamlessly across faculties, staff, and students.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-md backdrop-blur-xl text-xs font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verified System Admin</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1 */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Published</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">24</h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Layers className="w-3.5 h-3.5" /> Active this term
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
            <Megaphone className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Pinned Notices</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">04</h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Pin className="w-3.5 h-3.5" /> Highlighted on top
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
            <Pin className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Target Audiences</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">All Users</h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Bell className="w-3.5 h-3.5" /> Staff, Students &amp; Parents
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
            <Bell className="w-7 h-7" />
          </div>
        </motion.div>
      </div>

      {/* Main Notice Board Component Card Wrapper */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden p-4 sm:p-6 transition-all">
        <NoticeBoard
          title="Admin Notice Board"
          subtitle="Manage active circulars, review scheduled postings, and publish institutional announcements."
          showCreateButton={true}
        />
      </div>
    </div>
  );
}