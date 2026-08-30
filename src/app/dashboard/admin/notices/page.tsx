"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  BellRing, 
  Plus, 
  Search, 
  Pin, 
  Calendar, 
  Megaphone,
  Trash2,
  Edit3
} from "lucide-react";

export default function AdminNoticesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

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

  const noticesList = [
    {
      id: "NOT-01",
      title: "Mid-term Examination Schedule Released",
      category: "Academic",
      date: "Aug 26, 2026",
      pinned: true,
      target: "All Students & Teachers",
    },
    {
      id: "NOT-02",
      title: "Library and Laboratory Timing Updates",
      category: "General",
      date: "Aug 24, 2026",
      pinned: true,
      target: "All Students",
    },
    {
      id: "NOT-03",
      title: "Annual Sports Week Registration Open",
      category: "Event",
      date: "Aug 20, 2026",
      pinned: false,
      target: "Grade 8 - 10",
    },
  ];

  const filteredNotices = noticesList.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            ADMIN ANNOUNCEMENTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Notice Board Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create, edit, pin, and publish institutional announcements.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/notices/create")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Broadcast Notice
        </button>
      </motion.div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Notices</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">24</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pinned Notices</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">4</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Pin className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Broadcasts</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">18</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <BellRing className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notices by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Notices List Section */}
      <div className="space-y-4">
        {filteredNotices.map((notice, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                notice.pinned 
                  ? "bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400" 
                  : "bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400"
              }`}>
                {notice.pinned ? <Pin className="w-5 h-5 fill-amber-500 text-amber-500" /> : <Megaphone className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{notice.title}</h3>
                  {notice.pinned && (
                    <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                      Pinned
                    </span>
                  )}
                  <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {notice.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {notice.date}</span>
                  <span>Target: <strong className="text-slate-700 dark:text-slate-300">{notice.target}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer" title="Edit Notice">
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer" title="Delete Notice">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}