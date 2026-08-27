"use client";

import { useState } from "react";
import { Bell, CalendarDays, Sparkles, Search, Tag, Pin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notice {
  id: string;
  title: string;
  category: "Academic" | "Events" | "General";
  date: string;
  detail: string;
  isPinned?: boolean;
}

const noticesData: Notice[] = [
  {
    id: "1",
    title: "Mid-Term Examination Schedule Released",
    category: "Academic",
    date: "August 24, 2026",
    detail: "Review your subject exam dates, timings, and assigned exam rooms. Attendance is mandatory for all scheduled tests.",
    isPinned: true,
  },
  {
    id: "2",
    title: "Central Library Temporary Closure Notice",
    category: "General",
    date: "August 22, 2026",
    detail: "The main library facility will be closed this Saturday for annual catalog maintenance. Please borrow or return books by Friday 4:00 PM.",
    isPinned: true,
  },
  {
    id: "3",
    title: "Annual Sports & Athletics Registration Open",
    category: "Events",
    date: "August 18, 2026",
    detail: "Sign-ups for track and field, basketball, and football tournaments are officially open. Register with the Student Affairs office by September 2.",
  },
  {
    id: "4",
    title: "STEM Innovation Lab Workshop & Seminar",
    category: "Academic",
    date: "August 15, 2026",
    detail: "Join us for an interactive robotics and AI development workshop in Lab 302. Open to all grade levels.",
  },
  {
    id: "5",
    title: "Parent-Teacher Conference & Progress Review",
    category: "General",
    date: "August 10, 2026",
    detail: "Annual parent-teacher meetings will take place next Friday. Digital appointment slots can be booked through the student portal.",
  },
];

export default function NoticeBoard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Academic", "Events", "General"];

  const filteredNotices = noticesData.filter((notice) => {
    const matchesCategory = selectedCategory === "All" || notice.category === selectedCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full container mx-auto space-y-5">
      {/* Header Banner */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-5 sm:p-6 md:p-7 shadow-lg backdrop-blur-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 shrink-0 mt-0.5 sm:mt-0">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-3 w-3" /> Official Announcements
              </span>
              <h1 className="mt-1 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Notice Board
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Stay up-to-date with official academic notices, exam schedules, and events.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-5 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-60 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-8 pr-3.5 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
          </div>
        </div>
      </motion.section>

      {/* Notices List */}
      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => (
              <motion.article
                key={notice.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={`group relative rounded-2xl sm:rounded-3xl border bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 shadow-md transition-all hover:shadow-lg ${
                  notice.isPinned
                    ? "border-indigo-300 dark:border-indigo-800/80 bg-gradient-to-r from-indigo-50/30 to-white dark:from-indigo-950/20 dark:to-slate-900"
                    : "border-slate-200/80 dark:border-slate-800/80"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <CalendarDays className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {notice.isPinned && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Pin className="h-3 w-3" /> Pinned
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <Tag className="h-3 w-3" /> {notice.category}
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">
                          {notice.date}
                        </span>
                      </div>

                      <h2 className="mt-1.5 text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {notice.title}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                        {notice.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-10 text-center"
            >
              <Bell className="mx-auto h-7 w-7 text-slate-400 mb-2" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">No notices found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try adjusting your search query or filter options.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
