"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import NoticeBoard from "@/components/NoticeBoard/NoticeBoard";
import { Bell, Pin, Megaphone, ShieldCheck, Sparkles, Layers, RefreshCw } from "lucide-react";
import { getNoticesAction, NoticeItem } from "@/lib/actions/teacher.notice";

export default function AdminNoticesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await getNoticesAction();
      if (res.success && Array.isArray(res.notices)) {
        setNotices(res.notices as NoticeItem[]);
      }
    } catch {
      toast.error("Could not load notice statistics");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    loadStats();
    setRefreshTrigger((prev) => prev + 1);
  }, [loadStats]);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/");
      } else if (rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  useEffect(() => {
    if (session?.user && rawRole === "admin") {
      loadStats();
    }
  }, [session, rawRole, loadStats]);

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

  const totalPublished = notices.length;
  const pinnedCount = notices.filter((n) => n.isPinned).length;

  const categoriesInUse = new Set(notices.map((n) => n.category));
  const audienceLabel =
    categoriesInUse.size === 0
      ? "None yet"
      : categoriesInUse.size >= 3
      ? "All Users"
      : Array.from(categoriesInUse).join(", ");

  const handleNoticesChange = useCallback((updated: NoticeItem[]) => {
    setNotices(updated);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Top Hero Banner with Gradient Glow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-indigo-50/30 to-white/90 dark:from-slate-950/90 dark:via-indigo-950/30 dark:to-slate-950/90 p-8 shadow-2xl backdrop-blur-2xl"
      >
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
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
            <button
              onClick={handleRefresh}
              disabled={statsLoading}
              className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer shadow-sm backdrop-blur-xl disabled:opacity-50"
              title="Refresh Stats & Notice Board"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-600 dark:text-indigo-400 ${statsLoading ? "animate-spin" : ""}`} />
            </button>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-md backdrop-blur-xl text-xs font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.16em]">Total Published</p>
            {statsLoading ? (
              <div className="h-9 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {String(totalPublished).padStart(2, "0")}
              </h3>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Layers className="w-3.5 h-3.5" /> All notices on record
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <Megaphone className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-violet-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.16em]">Pinned Notices</p>
            {statsLoading ? (
              <div className="h-9 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {String(pinnedCount).padStart(2, "0")}
              </h3>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <Pin className="w-3.5 h-3.5" /> Highlighted on top
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-inner">
            <Pin className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-sky-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.16em]">Target Audiences</p>
            {statsLoading ? (
              <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white truncate max-w-40">
                {audienceLabel}
              </h3>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <Bell className="w-3.5 h-3.5" /> Based on active categories
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-inner">
            <Bell className="w-7 h-7" />
          </div>
        </motion.div>
      </div>

      {/* Main Notice Board Component Card Wrapper */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 shadow-2xl backdrop-blur-xl overflow-hidden p-4 sm:p-6 transition-all">
        <NoticeBoard
          title="Admin Notice Board"
          subtitle="Manage active circulars, review scheduled postings, and publish institutional announcements."
          showCreateButton={true}
          showRefreshButton={false}
          refreshTrigger={refreshTrigger}
          onNoticesChange={handleNoticesChange}
        />
      </div>
    </div>
  );
}
