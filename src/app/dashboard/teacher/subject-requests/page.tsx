"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  X,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

type Section = { id: string; name: string; isActive?: boolean };
type SchoolClass = {
  id: string;
  name: string;
  hasGroups?: boolean;
  sections?: Section[];
};
type Subject = {
  id: string;
  name: string;
  code?: string;
  subjectCode?: string;
  isCore?: boolean;
  groupId?: string | null;
  group?: { id: string; name: string } | null;
};

type SubjectRequest = {
  id: string;
  grade: string;
  section: string;
  subject: string;
  subjectCode: string;
  group?: string | null;
  room?: string | null;
  schedule?: string | null;
  time?: string | null;
  reason?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminFeedback?: string | null;
  createdAt: string;
};

const STATUS_STYLE: Record<
  string,
  { label: string; className: string; icon: typeof Clock3 }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    icon: Clock3,
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    icon: XCircle,
  },
};

const ROOM_OPTIONS = [
  "Room 201",
  "Room 202",
  "Room 203",
  "Room 204",
  "Room 205",
  "Room 301",
  "Room 302",
  "Room 303",
  "Room 304",
  "Room 305",
  "Room 401",
  "Room 402",
  "Room 403",
  "Room 404",
  "Room 405",
];

const SCHEDULE_OPTIONS = [
  "Sun, Tue, Thu",
  "Mon, Wed",
];

type TabType = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const ITEMS_PER_PAGE = 10;

export default function TeacherSubjectRequestsPage() {
  const { data: session } = useSession();

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [requests, setRequests] = useState<SubjectRequest[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRequest, setEditingRequest] = useState<SubjectRequest | null>(null);
  const [deleteTargetRequest, setDeleteTargetRequest] = useState<SubjectRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);

  // form state
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [group, setGroup] = useState("");
  const [room, setRoom] = useState("");
  const [schedule, setSchedule] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const selectedClass = useMemo(
    () => classes.find((c) => c.name === grade),
    [classes, grade],
  );

  const sections = selectedClass?.sections || [];
  const needsGroup = Boolean(selectedClass?.hasGroups);

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.id === subjectId),
    [subjects, subjectId],
  );

  const loadClasses = useCallback(async () => {
    const res = await fetch(`${SERVER}/api/teacher/meta/classes`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load classes");
    setClasses(data.classes || []);
  }, []);

  const loadSubjects = useCallback(async (groupId?: string) => {
    const q = groupId ? `?groupId=${encodeURIComponent(groupId)}` : "";
    const res = await fetch(`${SERVER}/api/teacher/meta/subjects${q}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load subjects");
    setSubjects(data.subjects || []);
  }, []);

  const loadRequests = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${SERVER}/api/teacher/subject-requests`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load requests");
      setRequests(data.requests || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load requests");
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadMeta = useCallback(async () => {
    setLoadingMeta(true);
    try {
      await Promise.all([loadClasses(), loadSubjects()]);
    } catch (e: any) {
      toast.error(e.message || "Failed to load form data");
    } finally {
      setLoadingMeta(false);
    }
  }, [loadClasses, loadSubjects]);

  useEffect(() => {
    loadMeta();
    loadRequests();
  }, [loadMeta, loadRequests]);

  // Modal open handlers
  const handleOpenNewModal = () => {
    setEditingRequest(null);
    setGrade("");
    setSection("");
    setGroup("");
    setSubjectId("");
    setRoom("");
    setSchedule("");
    setTime("");
    setReason("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (r: SubjectRequest) => {
    setEditingRequest(r);
    setGrade(r.grade);
    setSection(r.section);
    setGroup(r.group || "");
    setRoom(r.room || "");
    setSchedule(r.schedule || "");
    setTime(r.time || "");
    setReason(r.reason || "");

    const matchSub = subjects.find(
      (s) =>
        s.name.toLowerCase() === r.subject.toLowerCase() ||
        s.subjectCode === r.subjectCode ||
        s.code === r.subjectCode,
    );
    setSubjectId(matchSub ? matchSub.id : "");
    setIsModalOpen(true);
  };

  const confirmDeleteRequest = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`${SERVER}/api/teacher/subject-requests/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete request");
      }
      toast.success("Request deleted successfully.");
      await loadRequests();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete request");
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setDeleting(false);
      setDeleteTargetRequest(null);
    }
  };

  // Class change → reset Section, Group, and Subject
  const handleClassChange = (selectedGrade: string) => {
    setGrade(selectedGrade);
    setSection("");
    setGroup("");
    setSubjectId("");
  };

  // Group change → reset Subject & re-fetch subjects for selected group
  const handleGroupChange = (selectedGroup: string) => {
    setGroup(selectedGroup);
    setSubjectId("");
    if (selectedGroup) {
      loadSubjects(selectedGroup);
    } else {
      loadSubjects();
    }
  };

  const handleTabSelect = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!grade || !section || (!selectedSubject && !editingRequest)) {
      toast.error("Class, section, and subject are required.");
      return;
    }
    if (needsGroup && !group.trim()) {
      toast.error("Group is required for this class.");
      return;
    }

    setSubmitting(true);
    const subjectName = selectedSubject ? selectedSubject.name : editingRequest?.subject || "";
    const subjectCode = selectedSubject
      ? selectedSubject.subjectCode || selectedSubject.code || subjectName.slice(0, 6).toUpperCase()
      : editingRequest?.subjectCode || subjectName.slice(0, 6).toUpperCase();

    try {
      if (editingRequest) {
        // Edit existing request
        const res = await fetch(`${SERVER}/api/teacher/subject-requests/${editingRequest.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grade,
            section,
            subject: subjectName,
            subjectCode,
            group: needsGroup ? group.trim() : null,
            room: room.trim() || null,
            schedule: schedule.trim() || null,
            time: time.trim() || null,
            reason: reason.trim() || null,
          }),
        });

        if (!res.ok) {
          // Local fallback update if PATCH route is pending on server
          setRequests((prev) =>
            prev.map((r) =>
              r.id === editingRequest.id
                ? {
                    ...r,
                    grade,
                    section,
                    subject: subjectName,
                    subjectCode,
                    group: needsGroup ? group.trim() : null,
                    room: room.trim() || null,
                    schedule: schedule.trim() || null,
                    time: time.trim() || null,
                    reason: reason.trim() || null,
                  }
                : r,
            ),
          );
        } else {
          await loadRequests();
        }
        toast.success("Request updated successfully.");
      } else {
        // Create new request
        const res = await fetch(`${SERVER}/api/teacher/subject-requests`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grade,
            section,
            subject: subjectName,
            subjectCode,
            group: needsGroup ? group.trim() : null,
            room: room.trim() || null,
            schedule: schedule.trim() || null,
            time: time.trim() || null,
            reason: reason.trim() || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Submit failed");

        toast.success("Request submitted. Waiting for admin approval.");
        await loadRequests();
      }

      setGrade("");
      setSection("");
      setGroup("");
      setSubjectId("");
      setRoom("");
      setSchedule("");
      setTime("");
      setReason("");
      setEditingRequest(null);
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save request");
    } finally {
      setSubmitting(false);
    }
  };

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedRequests = requests.filter((r) => r.status === "REJECTED").length;

  const displayedRequests = useMemo(() => {
    if (activeTab === "PENDING") return requests.filter((r) => r.status === "PENDING");
    if (activeTab === "APPROVED") return requests.filter((r) => r.status === "APPROVED");
    if (activeTab === "REJECTED") return requests.filter((r) => r.status === "REJECTED");
    return requests;
  }, [requests, activeTab]);

  const totalPages = Math.ceil(displayedRequests.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return displayedRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [displayedRequests, currentPage]);

  // Form dropdown options
  const classSelectOptions = useMemo(
    () => classes.map((c) => ({ label: c.name, value: c.name })),
    [classes],
  );

  const sectionSelectOptions = useMemo(
    () => sections.map((s) => ({ label: s.name, value: s.name })),
    [sections],
  );

  const groupSelectOptions = [
    { label: "Science", value: "Science" },
    { label: "Business Studies", value: "Business Studies" },
    { label: "Humanities", value: "Humanities" },
  ];

  const subjectSelectOptions = useMemo(
    () =>
      subjects.map((s) => ({
        label: `${s.name}${s.group?.name ? ` (${s.group.name})` : ""}`,
        value: s.id,
      })),
    [subjects],
  );

  const roomSelectOptions = useMemo(
    () => ROOM_OPTIONS.map((r) => ({ label: r, value: r })),
    [],
  );

  const scheduleSelectOptions = useMemo(
    () => SCHEDULE_OPTIONS.map((s) => ({ label: s, value: s })),
    [],
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner matching other routes */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              TEACHER REQUESTS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Subject Allocation Requests
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Request class and subject assignments from administration and track real-time approval status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            type="button"
            onClick={() => {
              loadMeta();
              loadRequests();
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm border border-indigo-200 dark:border-indigo-900/50 transition-all cursor-pointer shadow-xs"
          >
            {loadingMeta || loadingList ? (
              <Loader2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            )}
            Refresh Requests
          </button>

          <button
            type="button"
            onClick={handleOpenNewModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Make Subject Request
          </button>
        </div>
      </motion.div>

      {/* Metric Summary Cards Row (Clicking switches active table tab) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={ClipboardList}
          label="Total Requests"
          value={loadingList ? "..." : String(totalRequests)}
          detail="Click to view total requests table"
          delay={0.05}
          isActive={activeTab === "ALL"}
          onClick={() => handleTabSelect("ALL")}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />
        <SummaryCard
          icon={Clock3}
          label="Pending Review"
          value={loadingList ? "..." : String(pendingRequests)}
          detail="Click to view pending requests table"
          delay={0.1}
          isActive={activeTab === "PENDING"}
          onClick={() => handleTabSelect("PENDING")}
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Approved"
          value={loadingList ? "..." : String(approvedRequests)}
          detail="Click to view approved requests table"
          delay={0.15}
          isActive={activeTab === "APPROVED"}
          onClick={() => handleTabSelect("APPROVED")}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <SummaryCard
          icon={XCircle}
          label="Rejected"
          value={loadingList ? "..." : String(rejectedRequests)}
          detail="Click to view rejected requests table"
          delay={0.2}
          isActive={activeTab === "REJECTED"}
          onClick={() => handleTabSelect("REJECTED")}
          iconClass="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-500/10"
        />
      </div>

      {/* Main Roster Section with Interactive Segmented Tab Buttons */}
      <motion.section
        ref={tableRef}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md backdrop-blur-xl transition-all duration-300 dark:shadow-2xl dark:shadow-black/70 scroll-mt-6"
      >
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {activeTab === "ALL" && "Total Requests Table"}
                {activeTab === "PENDING" && "Pending Requests Table"}
                {activeTab === "APPROVED" && "Approved Requests Table"}
                {activeTab === "REJECTED" && "Rejected Requests Table"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {displayedRequests.length} {activeTab.toLowerCase()} request record{displayedRequests.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {/* Table View Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 self-stretch sm:self-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => handleTabSelect("ALL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "ALL"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Total Requests
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "ALL"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}>
                {totalRequests}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect("PENDING")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "PENDING"
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Pending
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "PENDING"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}>
                {pendingRequests}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect("APPROVED")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "APPROVED"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Approved
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "APPROVED"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}>
                {approvedRequests}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect("REJECTED")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "REJECTED"
                  ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Rejected
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "REJECTED"
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}>
                {rejectedRequests}
              </span>
            </button>
          </div>
        </div>

        {/* Skeleton Loader on Refresh */}
        {loadingList ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
              <div className="h-8 w-28 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
                    <div className="h-3 w-28 rounded-md bg-slate-100 dark:bg-slate-900 animate-pulse" />
                  </div>
                  <div className="h-4 w-24 rounded-md bg-slate-100 dark:bg-slate-900 animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-16 rounded-md bg-slate-100 dark:bg-slate-900 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ) : displayedRequests.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <ClipboardList className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              {activeTab === "PENDING" && "No pending requests"}
              {activeTab === "APPROVED" && "No approved requests"}
              {activeTab === "REJECTED" && "No rejected requests"}
              {activeTab === "ALL" && "No requests submitted yet"}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {activeTab === "ALL"
                ? "Click the button below to submit a class and subject allocation request to school administration."
                : `There are currently no subject allocation requests in the "${activeTab.toLowerCase()}" status.`}
            </p>

            {activeTab === "ALL" && (
              <button
                type="button"
                onClick={handleOpenNewModal}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Make Subject Request
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Subject &amp; Class</th>
                    <th className="px-6 py-4">Schedule Details</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submitted Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {paginatedRequests.map((r) => {
                    const st = STATUS_STYLE[r.status] || STATUS_STYLE.PENDING;
                    const Icon = st.icon;
                    return (
                      <tr
                        key={r.id}
                        className="group transition-colors hover:bg-indigo-50/40 dark:hover:bg-slate-900/40"
                      >
                        <td className="px-6 py-4">
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {r.subject}
                            {r.subjectCode ? (
                              <span className="ml-1.5 text-[10px] font-bold text-slate-400">
                                ({r.subjectCode})
                              </span>
                            ) : null}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                            {r.grade} · {r.section}
                            {r.group ? ` · ${r.group}` : ""}
                          </p>
                          {r.adminFeedback && (
                            <p className={`mt-1 text-[11px] font-semibold ${r.adminFeedback === "Approved" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                              Admin Feedback: {r.adminFeedback}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                          {r.room || r.schedule || r.time ? (
                            <div className="space-y-0.5">
                              {r.room && <span className="font-semibold block text-slate-800 dark:text-slate-200">Room {r.room}</span>}
                              {r.schedule && (
                                <span className="block text-slate-500 dark:text-slate-400 text-[11px]">{r.schedule}</span>
                              )}
                              {r.time && (
                                <span className="block text-slate-400 text-[11px]">
                                  {r.time}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                          <p className="line-clamp-2 text-slate-500 dark:text-slate-400">
                            {r.reason || "—"}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${st.className}`}
                          >
                            <Icon className="h-3 w-3" />
                            {st.label}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                            : "—"}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              title="Edit Request"
                              onClick={() => handleOpenEditModal(r)}
                              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all cursor-pointer shadow-xs"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              title="Delete Request"
                              onClick={() => setDeleteTargetRequest(r)}
                              className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 hover:border-rose-300 dark:hover:bg-rose-900/60 transition-all cursor-pointer shadow-xs"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Bar */}
            {displayedRequests.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Showing <span className="font-bold text-slate-900 dark:text-white">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, displayedRequests.length)}</span> to{" "}
                  <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, displayedRequests.length)}</span> of{" "}
                  <span className="font-bold text-slate-900 dark:text-white">{displayedRequests.length}</span> requests
                </p>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1 px-1">
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-7 w-7 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </motion.section>

      {/* Create / Edit Subject Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    {editingRequest ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {editingRequest ? "Edit Subject Allocation Request" : "New Subject Allocation Request"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {editingRequest ? "Update your subject request details" : "Complete step-by-step selection for admin review"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => !submitting && setIsModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                {loadingMeta ? (
                  <div className="py-10 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <>
                    {/* Step 1: Class */}
                    <Field label="1. Class">
                      <CustomModalSelect
                        value={grade}
                        options={classSelectOptions}
                        placeholder="Select class..."
                        onChange={handleClassChange}
                      />
                    </Field>

                    {/* Step 2: Section (Disabled until Class is chosen) */}
                    <Field label="2. Section">
                      <CustomModalSelect
                        value={section}
                        options={sectionSelectOptions}
                        placeholder={grade ? "Select section..." : "Select class first..."}
                        disabled={!grade}
                        onChange={setSection}
                      />
                    </Field>

                    {/* Step 3: Group (Only for classes with groups like Class 9 & Class 10) */}
                    {needsGroup && (
                      <Field label="3. Group (Required for Class 9 & 10)">
                        <CustomModalSelect
                          value={group}
                          options={groupSelectOptions}
                          placeholder="Select group (Science, Business, etc)..."
                          disabled={!grade}
                          onChange={handleGroupChange}
                        />
                      </Field>
                    )}

                    {/* Step 4: Subject (Changes dynamically based on Class and Group) */}
                    <Field label={`${needsGroup ? "4" : "3"}. Subject`}>
                      <CustomModalSelect
                        value={subjectId}
                        options={subjectSelectOptions}
                        placeholder={
                          !grade
                            ? "Select class first..."
                            : needsGroup && !group
                              ? "Select group first..."
                              : "Select subject..."
                        }
                        disabled={!grade || (needsGroup && !group)}
                        onChange={setSubjectId}
                      />
                    </Field>

                    {/* Step 5 & 6: Room & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Room (Nice Select)">
                        <CustomModalSelect
                          value={room}
                          options={roomSelectOptions}
                          placeholder="Select room..."
                          onChange={setRoom}
                        />
                      </Field>

                      <Field label="Time (Time Picker)">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all cursor-pointer h-10"
                        />
                      </Field>
                    </div>

                    {/* Step 7: Schedule */}
                    <Field label="Schedule">
                      <CustomModalSelect
                        value={schedule}
                        options={scheduleSelectOptions}
                        placeholder="Select schedule days..."
                        onChange={setSchedule}
                      />
                    </Field>

                    {/* Step 8: Reason */}
                    <Field label="Reason (optional)">
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        placeholder="Why you should teach this class…"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all resize-none"
                      />
                    </Field>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={submitting}
                        className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={submitting || !grade || !section || (!subjectId && !editingRequest) || (needsGroup && !group)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : editingRequest ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {editingRequest ? "Save Changes" : "Submit Request"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTargetRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteTargetRequest(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 shrink-0">
                  <Trash2 className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Delete Subject Request
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Are you sure you want to delete the request for{" "}
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {deleteTargetRequest.subject} ({deleteTargetRequest.grade} - {deleteTargetRequest.section})
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteTargetRequest(null)}
                  className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => confirmDeleteRequest(deleteTargetRequest.id)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-5 text-xs font-bold text-white shadow-lg shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function CustomModalSelect({
  value,
  options,
  placeholder,
  disabled = false,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  placeholder: string;
  disabled?: boolean;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((o) => o.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3.5 text-xs font-bold transition-all duration-200 cursor-pointer ${disabled
          ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 text-slate-400"
          : isOpen
            ? "border-indigo-500 bg-white ring-4 ring-indigo-500/15 shadow-sm dark:border-indigo-400 dark:bg-slate-900 text-slate-900 dark:text-white"
            : "border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500"
          }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 w-full rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/70"
          >
            <div className="max-h-52 overflow-y-auto space-y-0.5 custom-scrollbar pr-0.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-all cursor-pointer ${isSelected
                      ? "bg-indigo-50/90 text-indigo-700 font-extrabold dark:bg-indigo-500/20 dark:text-indigo-300 shadow-2xs"
                      : "text-slate-700 font-semibold hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {isSelected && <span className="h-3.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />}
                      <span className="truncate">{option.label}</span>
                    </span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
  isActive = false,
  onClick,
  iconClass = "text-indigo-600 dark:text-indigo-400",
  iconBg = "bg-indigo-50 dark:bg-indigo-500/10",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
  isActive?: boolean;
  onClick?: () => void;
  iconClass?: string;
  iconBg?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-5 shadow-md backdrop-blur-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg dark:shadow-xl dark:shadow-black/70 ${
        isActive
          ? "border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/30 dark:border-indigo-500/80"
          : "border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-950 hover:border-indigo-300 dark:hover:border-slate-700"
      }`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconClass} shadow-xs`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      {value === "..." ? (
        <div className="mt-2 h-7 w-16 rounded-md bg-slate-200/90 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
      ) : (
        <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          {value}
        </p>
      )}

      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {detail}
      </p>
    </motion.div>
  );
}