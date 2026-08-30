"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CalendarDays,
  Sparkles,
  Search,
  Tag,
  Pin,
  Plus,
  X,
  CheckCircle2,
  User,
  Loader2,
  GraduationCap,
  ChevronDown,
  Check,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  getNoticesAction,
  createNoticeAction,
  updateNoticeAction,
  deleteNoticeAction,
  NoticeItem,
} from "@/lib/actions/teacher.notice";

export type Notice = NoticeItem;

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
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: session } = useSession();

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<Notice["category"]>("Academic");
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [formDetail, setFormDetail] = useState("");
  const [formIsPinned, setFormIsPinned] = useState(false);

  // Edit Modal State
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormTitle, setEditFormTitle] = useState("");
  const [editFormCategory, setEditFormCategory] = useState<Notice["category"]>("Academic");
  const [isEditCategorySelectOpen, setIsEditCategorySelectOpen] = useState(false);
  const [editFormDetail, setEditFormDetail] = useState("");
  const [editFormIsPinned, setEditFormIsPinned] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = ["All", "Academic", "Events", "General"];

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await getNoticesAction();
      if (res.success && Array.isArray(res.notices)) {
        setNotices(res.notices as Notice[]);
      } else {
        console.warn("[NoticeBoard] Failed to load notices:", res.error);
        setNotices([]);
      }
    } catch (error) {
      console.error("Failed to load notices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Create Notice Handler
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDetail.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("better-auth.session_token")
          : null;
      const currentUserName =
        (session?.user as { name?: string } | undefined)?.name ||
        session?.user?.email ||
        "Teacher";
      const currentUserEmail = session?.user?.email;

      const payload = {
        teacherName: currentUserName,
        publishedBy: currentUserName,
        authorEmail: currentUserEmail,
        title: formTitle.trim(),
        description: formDetail.trim(),
        detail: formDetail.trim(),
        category: formCategory,
        isPinned: formIsPinned,
        createdAt: new Date().toISOString(),
      };

      const res = await createNoticeAction(payload, token);

      if (res.success && res.notice) {
        toast.success(res.message || "Notice published successfully!");

        const formattedNotice = res.notice as Notice;
        setNotices((prev) => [
          formattedNotice,
          ...prev.filter((n) => n.id !== formattedNotice.id),
        ]);

        // Reset Form
        setFormTitle("");
        setFormCategory("Academic");
        setFormDetail("");
        setFormIsPinned(false);
        setIsModalOpen(false);
      } else {
        toast.error(res.error || "Failed to publish notice.");
      }
    } catch (error) {
      console.error("Error creating notice:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setEditFormTitle(notice.title);
    setEditFormCategory(notice.category);
    setEditFormDetail(notice.detail || notice.description || "");
    setEditFormIsPinned(Boolean(notice.isPinned));
    setIsEditCategorySelectOpen(false);
    setIsEditModalOpen(true);
  };

  // Update Notice Handler
  const handleUpdateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    if (!editFormTitle.trim() || !editFormDetail.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsUpdating(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("better-auth.session_token")
          : null;
      const payload = {
        title: editFormTitle.trim(),
        description: editFormDetail.trim(),
        detail: editFormDetail.trim(),
        category: editFormCategory,
        isPinned: editFormIsPinned,
      };

      const res = await updateNoticeAction(editingNotice.id, payload, token);

      if (res.success && res.notice) {
        toast.success(res.message || "Notice updated successfully!");
        const updatedItem = res.notice as Notice;
        setNotices((prev) =>
          prev.map((n) => (n.id === updatedItem.id ? updatedItem : n))
        );
        setIsEditModalOpen(false);
        setEditingNotice(null);
      } else {
        toast.error(res.error || "Failed to update notice.");
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      toast.error("Network error while updating notice.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (notice: Notice) => {
    setDeletingNotice(notice);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!deletingNotice) return;

    setIsDeleting(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("better-auth.session_token")
          : null;
      const res = await deleteNoticeAction(deletingNotice.id, token);

      if (res.success) {
        toast.success(res.message || "Notice deleted successfully!");
        setNotices((prev) => prev.filter((n) => n.id !== deletingNotice.id));
        setIsDeleteModalOpen(false);
        setDeletingNotice(null);
      } else {
        toast.error(res.error || "Failed to delete notice.");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Network error while deleting notice.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      selectedCategory === "All" || notice.category === selectedCategory;
    const authorName = notice.teacherName || notice.publishedBy;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (authorName && authorName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const currentUser = session?.user;
  const userRole = (currentUser as { role?: string } | undefined)?.role?.toLowerCase();
  const isAdmin = userRole === "admin";

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
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 animate-pulse space-y-3"
              >
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice, index) => {
                const isOwner = Boolean(
                  currentUser &&
                    ((currentUser.email && notice.authorEmail === currentUser.email) ||
                      (currentUser.name && notice.teacherName === currentUser.name))
                );
                const canManage = isAdmin || isOwner;

                return (
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
                      <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
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
                            {(notice.teacherName || notice.publishedBy) && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                <User className="h-3 w-3" /> By {notice.teacherName || notice.publishedBy}
                              </span>
                            )}
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

                      {/* Action Buttons (Edit & Delete) for Admin / Owner */}
                      {canManage && (
                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-start pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => handleOpenEditModal(notice)}
                            title="Edit Notice"
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/60 transition-all cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(notice)}
                            title="Delete Notice"
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-950/60 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })
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
        )}
      </div>

      {/* Create Notice Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
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
                  onClick={() => !isSubmitting && setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
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
                    disabled={isSubmitting}
                    placeholder="Enter notice title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsCategorySelectOpen(!isCategorySelectOpen)}
                      className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        {formCategory === "Academic" && <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                        {formCategory === "Events" && <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />}
                        {formCategory === "General" && <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        <span className="font-semibold">{formCategory}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          isCategorySelectOpen ? "rotate-180 text-indigo-600" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isCategorySelectOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsCategorySelectOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 z-20 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-xl backdrop-blur-xl space-y-1"
                          >
                            {[
                              { id: "Academic", label: "Academic", icon: GraduationCap, color: "text-indigo-600 dark:text-indigo-400" },
                              { id: "Events", label: "Events", icon: Sparkles, color: "text-purple-600 dark:text-purple-400" },
                              { id: "General", label: "General", icon: Bell, color: "text-emerald-600 dark:text-emerald-400" },
                            ].map((cat) => {
                              const Icon = cat.icon;
                              const isSelected = formCategory === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    setFormCategory(cat.id as Notice["category"]);
                                    setIsCategorySelectOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Icon className={`h-4 w-4 ${cat.color}`} />
                                    <span>{cat.label}</span>
                                  </div>
                                  {isSelected && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notice Detail *
                  </label>
                  <textarea
                    required
                    rows={4}
                    disabled={isSubmitting}
                    placeholder="Enter announcement details..."
                    value={formDetail}
                    onChange={(e) => setFormDetail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="modalPin"
                    disabled={isSubmitting}
                    checked={formIsPinned}
                    onChange={(e) => setFormIsPinned(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                  />
                  <label htmlFor="modalPin" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    Pin notice to top
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Publish
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Notice Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpdating && setIsEditModalOpen(false)}
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
                  Edit Notice
                </h3>
                <button
                  onClick={() => !isUpdating && setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateNotice} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isUpdating}
                    placeholder="Enter notice title"
                    value={editFormTitle}
                    onChange={(e) => setEditFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => setIsEditCategorySelectOpen(!isEditCategorySelectOpen)}
                      className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        {editFormCategory === "Academic" && <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                        {editFormCategory === "Events" && <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />}
                        {editFormCategory === "General" && <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        <span className="font-semibold">{editFormCategory}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          isEditCategorySelectOpen ? "rotate-180 text-indigo-600" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isEditCategorySelectOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsEditCategorySelectOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 z-20 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-xl backdrop-blur-xl space-y-1"
                          >
                            {[
                              { id: "Academic", label: "Academic", icon: GraduationCap, color: "text-indigo-600 dark:text-indigo-400" },
                              { id: "Events", label: "Events", icon: Sparkles, color: "text-purple-600 dark:text-purple-400" },
                              { id: "General", label: "General", icon: Bell, color: "text-emerald-600 dark:text-emerald-400" },
                            ].map((cat) => {
                              const Icon = cat.icon;
                              const isSelected = editFormCategory === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    setEditFormCategory(cat.id as Notice["category"]);
                                    setIsEditCategorySelectOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Icon className={`h-4 w-4 ${cat.color}`} />
                                    <span>{cat.label}</span>
                                  </div>
                                  {isSelected && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notice Detail *
                  </label>
                  <textarea
                    required
                    rows={4}
                    disabled={isUpdating}
                    placeholder="Enter announcement details..."
                    value={editFormDetail}
                    onChange={(e) => setEditFormDetail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editModalPin"
                    disabled={isUpdating}
                    checked={editFormIsPinned}
                    onChange={(e) => setEditFormIsPinned(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                  />
                  <label htmlFor="editModalPin" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    Pin notice to top
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && deletingNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-10 space-y-4 my-auto text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Delete Announcement?
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-200">&quot;{deletingNotice.title}&quot;</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50 flex-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer disabled:opacity-50 flex-1"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
