"use client";

import { useState } from "react";
import { Bell, CalendarDays, Sparkles, Search, Tag, Pin, Plus, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export interface Notice {
  id: string;
  title: string;
  category: "Academic" | "Events" | "General";
  date: string;
  detail: string;
  isPinned?: boolean;
}

const initialNotices: Notice[] = [
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

interface NoticeBoardProps {
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
}

export default function NoticeBoard({
  title = "Notice Board",
  subtitle = "Stay up-to-date with official academic notices, exam schedules, and events.",
  showCreateButton = false,
}: NoticeBoardProps) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<Notice["category"]>("Academic");
  const [formDetail, setFormDetail] = useState("");
  const [formIsPinned, setFormIsPinned] = useState(false);

  const categories = ["All", "Academic", "Events", "General"];

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDetail.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const newNotice: Notice = {
      id: Date.now().toString(),
      title: formTitle.trim(),
      category: formCategory,
      date: todayStr,
      detail: formDetail.trim(),
      isPinned: formIsPinned,
    };

    setNotices((prev) => [newNotice, ...prev]);
    toast.success("Notice published successfully!");

    // Reset Form
    setFormTitle("");
    setFormCategory("Academic");
    setFormDetail("");
    setFormIsPinned(false);
    setIsModalOpen(false);
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = selectedCategory === "All" || notice.category === selectedCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-6 md:p-7 shadow-lg backdrop-blur-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 shrink-0 mt-0.5 sm:mt-0">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 sm:px-3 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-3 w-3 shrink-0" /> Official Announcements
              </span>

              <h1 className="mt-1 text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white break-words">
                {title}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl break-words">
                {subtitle}
              </p>
            </div>
          </div>

          {showCreateButton && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 self-stretch sm:self-center"
            >
              <Plus className="h-4 w-4 shrink-0" /> Create Notice
            </button>
          )}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
          <div className="relative w-full sm:w-60 md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-8.5 pr-3.5 py-2 sm:py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
          </div>
        </div>
      </motion.section>

      {/* Notices List */}
      <div className="space-y-3 sm:space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => (
              <motion.article
                key={notice.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={`group relative rounded-2xl sm:rounded-3xl border bg-white dark:bg-slate-900 p-3.5 sm:p-5 md:p-6 shadow-md transition-all hover:shadow-lg ${
                  notice.isPinned
                    ? "border-indigo-300 dark:border-indigo-800/80 bg-gradient-to-r from-indigo-50/30 to-white dark:from-indigo-950/20 dark:to-slate-900"
                    : "border-slate-200/80 dark:border-slate-800/80"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="mt-0.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <CalendarDays className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
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

                      <h2 className="mt-1.5 text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug break-words">
                        {notice.title}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words max-w-3xl">
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
              className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-6 sm:p-10 text-center bg-white/50 dark:bg-slate-900/50"
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

      {/* Create Notice Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-10 space-y-4 my-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Publish New Notice
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNotice} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter notice title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Notice["category"])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Events">Events</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notice Detail *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter announcement details..."
                    value={formDetail}
                    onChange={(e) => setFormDetail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="modalPin"
                    checked={formIsPinned}
                    onChange={(e) => setFormIsPinned(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="modalPin" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    Pin notice to top
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Publish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
