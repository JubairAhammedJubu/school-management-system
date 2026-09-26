"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Loader2,
  Inbox,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Search,
  RefreshCw,
  BookOpen,
  GraduationCap,
  Calendar,
  AlertTriangle,
  Sparkles,
  SearchX,
  FileText,
  Building2,
  Layers,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  Filter
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";
const MAX_DISPLAY_COUNT = 20;

type RequestRow = {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  grade: string;
  section: string;
  subject: string;
  group: string | null;
  room: string | null;
  schedule: string | null;
  time: string | null;
  reason: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminFeedback: string | null;
  createdAt: string;
};

type StatusCounts = {
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
  ALL: number;
};

// Skeleton Loader for Stats Overview Cards
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 shadow-xl backdrop-blur-xl animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-900 rounded-md" />
            <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-900" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <div className="h-8 w-14 bg-slate-200 dark:bg-slate-900 rounded-lg" />
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-900 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton Loader for Subject Requests List Cards
function RequestCardsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl animate-pulse space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-900 flex-shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-36 bg-slate-200 dark:bg-slate-900 rounded-md" />
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-900 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-28 bg-slate-200 dark:bg-slate-900 rounded-xl" />
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-900 rounded-xl" />
                </div>
              </div>
            </div>
            <div className="h-7 w-32 bg-slate-200 dark:bg-slate-900 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-900 rounded-md" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-900 rounded-md" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-900 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Custom Select Component for Class Dropdown
function CustomSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative z-30" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-xs min-w-[150px]"
      >
        <div className="flex items-center gap-2 truncate">
          <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 w-48 py-1.5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer text-left ${isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminSubjectRequestsPage() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [counts, setCounts] = useState<StatusCounts>({ PENDING: 0, APPROVED: 0, REJECTED: 0, ALL: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");

  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<RequestRow | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadRequests = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      try {
        const res = await fetch(`${SERVER}/api/admin/subject-requests?status=${statusFilter}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load requests");

        setRequests(data.requests || []);
        if (data.counts) {
          setCounts(data.counts);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load subject requests");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`${SERVER}/api/admin/subject-requests/${id}/approve`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve request");
      toast.success("Request approved! Teacher assigned to subject successfully.");
      loadRequests(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingRequest || !rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setBusyId(rejectingRequest.id);
    try {
      const res = await fetch(`${SERVER}/api/admin/subject-requests/${rejectingRequest.id}/reject`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminFeedback: rejectReason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject request");
      toast.success("Request rejected");
      setRejectingRequest(null);
      setRejectReason("");
      loadRequests(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  // Filter requests locally by search & class
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      r.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.teacherEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.room && r.room.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass = selectedClass === "ALL" || r.grade.toLowerCase() === selectedClass.toLowerCase();

    return matchesSearch && matchesClass;
  });

  // Cap displayed items to latest 20 requests
  const displayedRequests = filteredRequests.slice(0, MAX_DISPLAY_COUNT);

  return (
    <div className="w-full space-y-6">
      {/* Top Banner - Pitch Black Dark Mode & Semi-Rounded Card Styling */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-950/90 p-6 sm:p-8 text-slate-900 dark:text-white shadow-xl backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-semibold tracking-wide border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>ACADEMIC MANAGEMENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Teacher Subject Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Review and approve subject teaching applications submitted by  faculty members across <br /> classes and sections.
            </p>
          </div>

          <button
            onClick={() => loadRequests(true)}
            disabled={refreshing || loading}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards Row with Skeleton Loading State */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending Card */}
          <div
            onClick={() => setStatusFilter("PENDING")}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-xl backdrop-blur-xl ${statusFilter === "PENDING"
              ? "bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/50 ring-2 ring-amber-500/20"
              : "bg-white/90 dark:bg-slate-950/90 border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-600/80"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Pending</span>
              <div className="p-2.5 rounded-2xl bg-amber-500/15 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {counts.PENDING}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">awaiting decision</span>
            </div>
          </div>

          {/* Approved Card */}
          <div
            onClick={() => setStatusFilter("APPROVED")}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-xl backdrop-blur-xl ${statusFilter === "APPROVED"
              ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/50 ring-2 ring-emerald-500/20"
              : "bg-white/90 dark:bg-slate-950/90 border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-600/80"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Approved</span>
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {counts.APPROVED}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">assigned teachers</span>
            </div>
          </div>

          {/* Rejected Card */}
          <div
            onClick={() => setStatusFilter("REJECTED")}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-xl backdrop-blur-xl ${statusFilter === "REJECTED"
              ? "bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/50 ring-2 ring-rose-500/20"
              : "bg-white/90 dark:bg-slate-950/90 border-slate-200/80 dark:border-slate-800/80 hover:border-rose-400 dark:hover:border-rose-600/80"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Rejected</span>
              <div className="p-2.5 rounded-2xl bg-rose-500/15 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {counts.REJECTED}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">declined</span>
            </div>
          </div>

          {/* Total Card */}
          <div
            onClick={() => setStatusFilter("ALL")}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-xl backdrop-blur-xl ${statusFilter === "ALL"
              ? "bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500/50 ring-2 ring-indigo-500/20"
              : "bg-white/90 dark:bg-slate-950/90 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600/80"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Total Requests</span>
              <div className="p-2.5 rounded-2xl bg-indigo-500/15 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {counts.ALL}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                (Last 20 shown)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stacked Upper & Down Filter Controls Section */}
      <div className="space-y-3">
        {/* Upper Part: Status Filter Pills */}
        <div className="w-full bg-white/90 dark:bg-slate-950/90 p-3 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl backdrop-blur-xl overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((tab) => {
              const isActive = statusFilter === tab;
              const countVal = counts[tab];

              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                >
                  <span>{tab === "ALL" ? "All Requests" : tab.charAt(0) + tab.slice(1).toLowerCase()}</span>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800"
                      }`}
                  >
                    {countVal}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Down Part: Class Dropdown Custom Select & Search Bar */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/90 dark:bg-slate-950/90 p-3 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl backdrop-blur-xl">
          {/* Custom Select for Class Filter */}
          <div className="flex items-center gap-2">
            <CustomSelect
              value={selectedClass}
              onChange={setSelectedClass}
              options={[
                { value: "ALL", label: "All Classes" },
                { value: "Class 6", label: "Class 6" },
                { value: "Class 7", label: "Class 7" },
                { value: "Class 8", label: "Class 8" },
                { value: "Class 9", label: "Class 9" },
                { value: "Class 10", label: "Class 10" },
              ]}
            />
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by teacher name, email, subject, class, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Request Content */}
      {loading ? (
        <RequestCardsSkeleton />
      ) : filteredRequests.length === 0 ? (
        /* Semi-Rounded Empty States Card */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white/90 dark:bg-slate-950/90 rounded-3xl p-8 sm:p-14 border border-slate-200/80 dark:border-slate-800/80 shadow-xl backdrop-blur-xl text-center flex flex-col items-center justify-center space-y-4 my-2"
        >
          {searchQuery !== "" || selectedClass !== "ALL" ? (
            <>
              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                <SearchX className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  No Matching Requests Found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  We couldn't find any request matching <span className="font-semibold text-slate-700 dark:text-slate-200">"{searchQuery || selectedClass}"</span>. Try adjusting your search keywords or class filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedClass("ALL");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </>
          ) : statusFilter === "PENDING" ? (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/15">
                <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-900/40">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>ALL CAUGHT UP</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  No Pending Requests
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                  There are currently no teacher subject requests awaiting administrative review. All teacher assignments are up to date!
                </p>
              </div>
              {counts.APPROVED > 0 && (
                <button
                  onClick={() => setStatusFilter("APPROVED")}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>View Approved Requests ({counts.APPROVED})</span>
                </button>
              )}
            </>
          ) : statusFilter === "APPROVED" ? (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  No Approved Subject Requests
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  No teacher subject assignment requests have been approved yet. Approved requests will appear here.
                </p>
              </div>
            </>
          ) : statusFilter === "REJECTED" ? (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
                <XCircle className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  No Rejected Requests
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  No teacher subject assignment requests have been rejected.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                <Inbox className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  No Requests Found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  No subject assignment requests exist in the system yet.
                </p>
              </div>
            </>
          )}
        </motion.div>
      ) : (
        /* Requests Grid List - Semi-Rounded Cards with Pitch-Black Dark Mode */
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {displayedRequests.map((r) => {
              const isPending = r.status === "PENDING";
              const isApproved = r.status === "APPROVED";
              const isRejected = r.status === "REJECTED";

              return (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl hover:shadow-2xl transition-all space-y-4 relative overflow-hidden"
                >
                  {/* Status Indicator Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${isPending
                      ? "bg-amber-500"
                      : isApproved
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                      }`}
                  />

                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-2">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-base flex-shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                        {r.teacherName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                            {r.teacherName}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                            {r.teacherEmail}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                            <BookOpen className="w-3.5 h-3.5" />
                            {r.subject} {r.group ? `(${r.group})` : ""}
                          </span>

                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            {r.grade} • {r.section}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="self-start sm:self-center">
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 text-xs font-extrabold animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> Pending Review
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 text-xs font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 text-xs font-extrabold">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Meta Grid */}
                  <div className="pl-2 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                      <span>Room: </span>
                      <strong className="text-slate-900 dark:text-white font-mono">
                        {r.room || "Not specified"}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                      <span>Schedule: </span>
                      <strong className="text-slate-900 dark:text-white">
                        {r.schedule || "Flexible"} {r.time ? `(${r.time})` : ""}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                      <span>Submitted: </span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        {new Date(r.createdAt).toLocaleDateString()} at{" "}
                        {new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  {/* Teacher's Reason */}
                  {r.reason && (
                    <div className="pl-2">
                      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                        <span className="font-bold flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400">
                          <FileText className="w-3.5 h-3.5" /> Teacher's Application Note:
                        </span>
                        <p className="italic leading-relaxed pl-5 text-slate-700 dark:text-slate-300">
                          "{r.reason}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Admin Rejection Feedback (If rejected) */}
                  {isRejected && r.adminFeedback && (
                    <div className="pl-2">
                      <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-950 dark:text-rose-200 space-y-1">
                        <span className="font-bold flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400">
                          <AlertCircle className="w-3.5 h-3.5" /> Reason for Rejection:
                        </span>
                        <p className="pl-5 text-slate-700 dark:text-slate-300 font-medium">
                          {r.adminFeedback}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Admin Action Buttons for PENDING */}
                  {isPending && (
                    <div className="pl-2 pt-1 flex items-center justify-end gap-3">
                      <button
                        onClick={() => setRejectingRequest(r)}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(r.id)}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {busyId === r.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Approve Request</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Notice when requests exceed 20 items */}
          {filteredRequests.length > MAX_DISPLAY_COUNT && (
            <div className="p-4 text-center rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-2 shadow-xl backdrop-blur-xl">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span>
                Showing the latest 20 requests out of <strong>{filteredRequests.length}</strong> total matching requests.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal with Pitch-Black Dark Mode */}
      <AnimatePresence>
        {rejectingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setRejectingRequest(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-md shadow-rose-500/15">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Reject Subject Request
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {rejectingRequest.teacherName} • {rejectingRequest.subject} ({rejectingRequest.grade})
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this request is being rejected (e.g., Schedule conflict, Subject already assigned to another teacher)..."
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingRequest(null)}
                  disabled={busyId === rejectingRequest.id}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={busyId === rejectingRequest.id || !rejectReason.trim()}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {busyId === rejectingRequest.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirm Reject"
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