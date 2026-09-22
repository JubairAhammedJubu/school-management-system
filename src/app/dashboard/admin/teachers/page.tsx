"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Users,
  Search,
  Mail,
  BookOpen,
  CheckCircle2,
  UserX,
  Coffee,
  Activity,
  RefreshCw,
  Trash2,
  UserCog,
  X,
  ChevronDown,
  Edit,
  GraduationCap,
  Briefcase,
  Sparkles,
  Check,
  ShieldAlert,
  Loader2,
  Lock,
} from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

function authedFetch(path: string, init?: RequestInit) {
  return fetch(`${SERVER_URL}${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
  });
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  image?: string;
  department?: string;
  qualification?: string;
  isApproved: boolean;
  twoFactorEnabled?: boolean;
  createdAt: string;
  assignedSubject?: string;
  assignedClass?: string;
  availability?: "Active" | "On Leave";
}

interface SubjectOption {
  id: string;
  name: string;
  code?: string;
}

interface ClassOption {
  id: string;
  name: string;
}

type FilterTab = "all" | "pending" | "approved" | "on_leave";

type ModalAction =
  | { type: "role"; teacher: Teacher }
  | { type: "delete"; teacher: Teacher }
  | { type: "edit"; teacher: Teacher }
  | { type: "revoke"; teacher: Teacher }
  | { type: "demo_protected"; teacher: Teacher }
  | null;

// Helper to check if account is demo teacher
const isDemoTeacher = (teacher: Teacher) => {
  const email = (teacher.email || "").toLowerCase().trim();
  const name = (teacher.name || "").toLowerCase().trim();
  return (
    email === "demoteacher@edunexus.tchr.com" ||
    email.includes("demoteacher") ||
    name.includes("demo teacher") ||
    (teacher as any).isDemo === true
  );
};

const DEPARTMENT_OPTIONS = [
  "Science",
  "Commerce",
  "Arts",
  "Computer Science & ICT",
  "Mathematics",
  "English",
  "Bangla",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Science",
  "Accounting",
  "Islamic Studies",
  "Physical Education",
];

const QUALIFICATION_OPTIONS = [
  "B.Sc",
  "M.Sc",
  "B.A",
  "M.A",
  "B.Ed",
  "M.Ed",
  "B.Com",
  "M.Com",
  "Ph.D",
  "Diploma in Education",
];

interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select Option",
  icon: Icon,
}: {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ElementType;
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

  const selectedOpt =
    options.find((o) => o.value === value) ||
    (value ? { value, label: value } : undefined);

  return (
    <div className={`relative ${isOpen ? "z-[60]" : "z-10"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-3 pr-2.5 py-2 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${isOpen
            ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
            : "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600"
          }`}
      >
        <div className="flex items-center gap-2 truncate pr-1 min-w-0">
          {Icon && <Icon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
          {selectedOpt && selectedOpt.value !== "" ? (
            <span className="font-medium text-slate-900 dark:text-white truncate">
              {selectedOpt.label}
              {selectedOpt.subLabel && (
                <span className="text-slate-400 dark:text-slate-500 text-xs ml-1 font-normal">
                  ({selectedOpt.subLabel})
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-normal truncate">
              {selectedOpt?.label || placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-indigo-500" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-[70] left-0 right-0 max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-1 space-y-0.5"
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={`${opt.value}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs sm:text-sm text-left transition-colors cursor-pointer ${isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                        ({opt.subLabel})
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminTeachersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectOption[]>([]);
  const [classesList, setClassesList] = useState<ClassOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [modal, setModal] = useState<ModalAction>(null);
  const [isActing, setIsActing] = useState(false);
  const [actingTeacherId, setActingTeacherId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("teacher");

  // Edit states
  const [editDept, setEditDept] = useState("");
  const [editQual, setEditQual] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editClassNum, setEditClassNum] = useState("");
  const [editGroup, setEditGroup] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editAvailability, setEditAvailability] = useState<"Active" | "On Leave">("Active");

  // Auth Redirect Guard
  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/");
      } else if (rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  // Fetch Teachers Data
  const loadTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authedFetch("/api/admin/users?role=teacher&limit=100");
      const data = await res.json();
      if (res.ok) setTeachers(data.users ?? []);
    } catch {
      toast.error("Failed to load teachers list.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Dynamic Subjects & Classes
  const loadSubjectsAndClasses = useCallback(async () => {
    try {
      const [subjRes, classRes] = await Promise.all([
        authedFetch("/api/admin/subjects"),
        authedFetch("/api/admin/classes"),
      ]);

      if (subjRes.ok) {
        const subjData = await subjRes.json();
        setSubjectsList(subjData.subjects ?? []);
      }
      if (classRes.ok) {
        const classData = await classRes.json();
        setClassesList(classData.classes ?? []);
      }
    } catch {
      // Fallback silently if optional metadata endpoint fails
    }
  }, []);

  useEffect(() => {
    if (session?.user && rawRole === "admin") {
      loadTeachers();
      loadSubjectsAndClasses();
    }
  }, [session, rawRole, loadTeachers, loadSubjectsAndClasses]);

  // 1-Click Approve / Toggle Approval
  const handleToggleApprove = async (teacher: Teacher) => {
    setActingTeacherId(teacher.id);
    const nextApprovedState = !teacher.isApproved;

    try {
      const res = await authedFetch(`/api/admin/users/${teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: nextApprovedState }),
      });

      if (res.ok) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === teacher.id ? { ...t, isApproved: nextApprovedState } : t))
        );
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to update account status.");
      }
    } catch {
      toast.error("Network error while updating status.");
    } finally {
      setActingTeacherId(null);
    }
  };

  // Revoke Teacher Approval Access with Demo Protection Guard
  const handleRevoke = async () => {
    if (!modal || modal.type !== "revoke" || isActing) return;

    if (isDemoTeacher(modal.teacher)) {
      setModal({ type: "demo_protected", teacher: modal.teacher });
      return;
    }

    setIsActing(true);
    try {
      const res = await authedFetch(`/api/admin/users/${modal.teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false }),
      });

      if (res.ok) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === modal.teacher.id ? { ...t, isApproved: false } : t))
        );
        toast.success(`Revoked access for ${modal.teacher.name}`);
        setModal(null);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to update account status.");
      }
    } catch {
      toast.error("Network error while updating status.");
    } finally {
      setIsActing(false);
    }
  };

  // Save Edit & Assignments
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || modal.type !== "edit" || isActing) return;
    setIsActing(true);

    try {
      const isClass9or10 =
        editClassNum === "Class 9" ||
        editClassNum === "Class 10" ||
        editClassNum.includes("9") ||
        editClassNum.includes("10");

      const groupPart = isClass9or10 && editGroup ? ` - ${editGroup}` : "";
      const sectionPart = editSection ? ` (${editSection})` : "";
      const combinedClass = editClassNum
        ? `${editClassNum}${groupPart}${sectionPart}`
        : "";

      const res = await authedFetch(`/api/admin/users/${modal.teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: editDept,
          qualification: editQual,
          assignedSubject: editSubject,
          assignedClass: combinedClass,
          availability: editAvailability,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update profile");
      }

      setTeachers((prev) =>
        prev.map((t) =>
          t.id === modal.teacher.id
            ? {
                ...t,
                department: editDept,
                qualification: editQual,
                assignedSubject: editSubject,
                assignedClass: combinedClass,
                availability: editAvailability,
              }
            : t
        )
      );

      toast.success(`Updated ${modal.teacher.name}'s details!`);
      setModal(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile.");
    } finally {
      setIsActing(false);
    }
  };

  const parseAssignedClass = (raw: string) => {
    let c = "";
    let g = "";
    let s = "";
    if (!raw) return { c, g, s };

    if (raw.includes("Class 10") || raw.includes("Grade 10") || raw.includes("10")) c = "Class 10";
    else if (raw.includes("Class 9") || raw.includes("Grade 9") || raw.includes("9")) c = "Class 9";
    else if (raw.includes("Class 8") || raw.includes("Grade 8") || raw.includes("8")) c = "Class 8";
    else if (raw.includes("Class 7") || raw.includes("Grade 7") || raw.includes("7")) c = "Class 7";
    else if (raw.includes("Class 6") || raw.includes("Grade 6") || raw.includes("6")) c = "Class 6";
    else c = raw;

    if (raw.includes("Science")) g = "Science";
    else if (raw.includes("Business Studies") || raw.includes("Commerce")) g = "Business Studies";
    else if (raw.includes("Humanities") || raw.includes("Arts")) g = "Humanities";

    if (raw.includes("Section B") || raw.includes("Sec B") || raw.includes("(B)") || raw.endsWith(" B")) s = "Section B";
    else if (raw.includes("Section A") || raw.includes("Sec A") || raw.includes("(A)") || raw.endsWith(" A")) s = "Section A";

    return { c, g, s };
  };

  const openEditModal = (t: Teacher) => {
    setModal({ type: "edit", teacher: t });
    setEditDept(t.department || "");
    setEditQual(t.qualification || "");
    setEditSubject(t.assignedSubject || "");

    const parsed = parseAssignedClass(t.assignedClass || "");
    setEditClassNum(parsed.c);
    setEditGroup(parsed.g);
    setEditSection(parsed.s);

    setEditAvailability(t.availability || "Active");
  };

  // Delete Teacher Account with Demo Protection Guard
  const handleDelete = async () => {
    if (!modal || modal.type !== "delete" || isActing) return;

    // Prevent deletion of demo teacher account
    if (isDemoTeacher(modal.teacher)) {
      setModal({ type: "demo_protected", teacher: modal.teacher });
      return;
    }

    setIsActing(true);
    try {
      const res = await authedFetch(`/api/admin/users/${modal.teacher.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");
      toast.success(data.message || "Teacher account deleted.");
      setTeachers((prev) => prev.filter((t) => t.id !== modal.teacher.id));
      setModal(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to delete.");
    } finally {
      setIsActing(false);
    }
  };

  // Role Change with Demo Protection Guard
  const handleRoleChange = async () => {
    if (!modal || modal.type !== "role" || isActing) return;

    if (isDemoTeacher(modal.teacher)) {
      setModal({ type: "demo_protected", teacher: modal.teacher });
      return;
    }

    setIsActing(true);
    try {
      const res = await authedFetch(`/api/admin/users/${modal.teacher.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      toast.success(data.message || "Role updated.");
      setTeachers((prev) => prev.filter((t) => t.id !== modal.teacher.id));
      setModal(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to change role.");
    } finally {
      setIsActing(false);
    }
  };

  if (isPending) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (!session?.user || rawRole !== "admin") return null;

  // Metrics
  const totalFaculty = teachers.length;
  const approvedCount = teachers.filter((t) => t.isApproved).length;
  const pendingCount = teachers.filter((t) => !t.isApproved).length;
  const onLeaveCount = teachers.filter((t) => t.availability === "On Leave").length;

  // Filtered Teachers List
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.department || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.assignedSubject || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "pending") return !t.isApproved;
    if (activeTab === "approved") return t.isApproved;
    if (activeTab === "on_leave") return t.availability === "On Leave";
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Dynamic Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden"
      >
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 via-blue-600 to-sky-600 text-white shadow-lg shadow-indigo-500/25">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                <Sparkles className="w-3 h-3" /> FACULTY MANAGEMENT
              </span>
              {pendingCount > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Teachers Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage registered faculty members, approve requests &amp; assign class subjects.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={loadTeachers}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all disabled:opacity-60 cursor-pointer shadow-sm"
            title="Refresh Roster"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Faculty",
            value: totalFaculty,
            icon: Users,
            color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/40",
            tab: "all" as FilterTab,
          },
          {
            label: "Pending Access",
            value: pendingCount,
            icon: Coffee,
            badge: pendingCount > 0,
            color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40",
            tab: "pending" as FilterTab,
          },
          {
            label: "Approved Faculty",
            value: approvedCount,
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40",
            tab: "approved" as FilterTab,
          },
          {
            label: "Faculty On Leave",
            value: onLeaveCount,
            icon: Activity,
            color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900/40",
            tab: "on_leave" as FilterTab,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          const isActive = activeTab === card.tab;

          return (
            <button
              key={i}
              onClick={() => setActiveTab(card.tab)}
              className={`text-left rounded-2xl border ${isActive
                  ? "border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-lg"
                  : "border-slate-200/80 dark:border-slate-800"
                } bg-white/90 dark:bg-slate-900/90 p-4 shadow-sm backdrop-blur-xl transition-all hover:scale-[1.01] cursor-pointer flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {card.badge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse shadow-sm">
                    <ShieldAlert className="w-3 h-3" /> Requires Action
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {isLoading ? (
                    <span className="inline-block h-6 w-10 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  ) : (
                    card.value
                  )}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm overflow-x-auto">
          {[
            { id: "all", label: "All Faculty", count: totalFaculty },
            { id: "pending", label: "Pending Access", count: pendingCount, alert: pendingCount > 0 },
            { id: "approved", label: "Approved", count: approvedCount },
            { id: "on_leave", label: "On Leave", count: onLeaveCount },
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isTabActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${isTabActive
                      ? "bg-white/20 text-white"
                      : tab.alert
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Teachers Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <UserX className="w-12 h-12 text-slate-400" />
          <p className="text-base font-bold text-slate-900 dark:text-white">No teachers found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            {searchTerm
              ? `No results matching "${searchTerm}"`
              : activeTab === "pending"
                ? "Great! All registered teachers have been reviewed and approved."
                : "No faculty members match this filter criteria."}
          </p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeachers.map((teacher) => {
              const isUpdatingThis = actingTeacherId === teacher.id;
              const isDemo = isDemoTeacher(teacher);

              return (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  {/* Top Info Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
                          {teacher.name.charAt(0).toUpperCase()}
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${teacher.isApproved ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white break-words">
                            {teacher.name}
                          </h3>
                          {isDemo && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                              <Lock className="w-2.5 h-2.5" /> Protected Demo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate mt-0.5">
                          <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                          <span className="truncate">{teacher.email}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${teacher.isApproved
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-900/40"
                        }`}
                    >
                      {teacher.isApproved ? "Approved" : "Pending Access"}
                    </span>
                  </div>

                  {/* Info Details Grid (Shows real DB data or 'Unassigned') */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 dark:border-slate-800/80 py-3">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">Dept: {teacher.department || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">Subject: {teacher.assignedSubject || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">Class: {teacher.assignedClass || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
                      <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">
                        Status:{" "}
                        <strong
                          className={
                            teacher.availability === "On Leave"
                              ? "text-red-500"
                              : "text-emerald-600 dark:text-emerald-400"
                          }
                        >
                          {teacher.availability || "Active"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* 1-Click Approve / Revoke Action */}
                    {!teacher.isApproved ? (
                      <button
                        onClick={() => handleToggleApprove(teacher)}
                        disabled={isUpdatingThis}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                      >
                        {isUpdatingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Access</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (isDemo) {
                            setModal({ type: "demo_protected", teacher });
                          } else {
                            setModal({ type: "revoke", teacher });
                          }
                        }}
                        disabled={isUpdatingThis}
                        className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all cursor-pointer shadow-xs"
                        title="Revoke Approval Access"
                      >
                        {isUpdatingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    {/* Assign & Edit Profile Modal Button */}
                    <button
                      onClick={() => openEditModal(teacher)}
                      className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all cursor-pointer shadow-xs"
                      title="Assign Subject, Class & Edit Profile"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* Change Role Button with Demo Protection Guard */}
                    <button
                      onClick={() => {
                        if (isDemo) {
                          setModal({ type: "demo_protected", teacher });
                        } else {
                          setNewRole("teacher");
                          setModal({ type: "role", teacher });
                        }
                      }}
                      className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:text-blue-700 dark:hover:text-blue-300 transition-all cursor-pointer shadow-xs"
                      title={isDemo ? "Protected Demo Account" : "Change User Role"}
                    >
                      <UserCog className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button with Demo Protection Guard */}
                    <button
                      onClick={() => {
                        if (isDemo) {
                          setModal({ type: "demo_protected", teacher });
                        } else {
                          setModal({ type: "delete", teacher });
                        }
                      }}
                      className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 hover:text-red-700 dark:hover:text-red-300 transition-all cursor-pointer shadow-xs"
                      title={isDemo ? "Protected Demo Account" : "Delete Teacher Account"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {/* Assign Subject, Class & Profile Edit Modal */}
      <AnimatePresence>
        {modal && modal.type === "edit" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl max-w-lg w-full relative overflow-visible my-auto"
            >
              {/* Background ambient glow */}
              <div className="absolute -right-16 -top-16 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setModal(null)}
                className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 pr-6 mb-3 sm:mb-4 shrink-0">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 shrink-0">
                  <Edit className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    Edit Faculty Details
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    {modal.teacher.name} • <span className="font-mono text-slate-400 dark:text-slate-500">{modal.teacher.email}</span>
                  </p>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleEditSave} className="space-y-3 relative overflow-visible">
                {/* Section 1: Profile Details */}
                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 relative overflow-visible">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Profile Info</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        Department
                      </label>
                      <CustomSelect
                        value={editDept}
                        onChange={setEditDept}
                        options={[
                          { value: "", label: "-- Select Department --" },
                          ...DEPARTMENT_OPTIONS.map((d) => ({
                            value: d,
                            label: d,
                          })),
                        ]}
                        placeholder="-- Select Department --"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        Qualification
                      </label>
                      <CustomSelect
                        value={editQual}
                        onChange={setEditQual}
                        options={[
                          { value: "", label: "-- Select Qualification --" },
                          ...QUALIFICATION_OPTIONS.map((q) => ({
                            value: q,
                            label: q,
                          })),
                        ]}
                        placeholder="-- Select Qualification --"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Academic Assignments */}
                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 relative overflow-visible">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>Academic Assignments</span>
                  </div>

                  {/* Assigned Subject */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                      Assigned Subject
                    </label>
                    {subjectsList.length > 0 ? (
                      <CustomSelect
                        value={editSubject}
                        onChange={setEditSubject}
                        options={[
                          { value: "", label: "-- Select Subject --" },
                          ...subjectsList.map((s) => ({
                            value: s.name,
                            label: s.name,
                            subLabel: s.code || undefined,
                          })),
                        ]}
                        placeholder="-- Select Subject --"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editSubject}
                        onChange={(e) => setEditSubject(e.target.value)}
                        placeholder="e.g. Mathematics"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                    )}
                  </div>

                  {/* Class, Group (Only for Class 9 and 10), and Section */}
                  <div
                    className={`grid gap-2.5 transition-all ${
                      editClassNum.includes("9") || editClassNum.includes("10")
                        ? "grid-cols-1 sm:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {/* 1. Class */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        Class
                      </label>
                      <CustomSelect
                        value={editClassNum}
                        onChange={(val) => {
                          setEditClassNum(val);
                          if (!val.includes("9") && !val.includes("10")) {
                            setEditGroup("");
                          }
                        }}
                        options={[
                          { value: "", label: "-- Select Class --" },
                          { value: "Class 6", label: "Class 6" },
                          { value: "Class 7", label: "Class 7" },
                          { value: "Class 8", label: "Class 8" },
                          { value: "Class 9", label: "Class 9" },
                          { value: "Class 10", label: "Class 10" },
                        ]}
                        placeholder="-- Select Class --"
                      />
                    </div>

                    {/* 2. Group (Only for Class 9 and 10) */}
                    {(editClassNum.includes("9") || editClassNum.includes("10")) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          Group <span className="text-[10px] text-indigo-500 font-normal">(Class 9-10)</span>
                        </label>
                        <CustomSelect
                          value={editGroup}
                          onChange={setEditGroup}
                          options={[
                            { value: "", label: "-- Select Group --" },
                            { value: "Science", label: "Science" },
                            { value: "Business Studies", label: "Business Studies" },
                            { value: "Humanities", label: "Humanities" },
                          ]}
                          placeholder="-- Select Group --"
                        />
                      </motion.div>
                    )}

                    {/* 3. Section (A and B) */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        Section
                      </label>
                      <CustomSelect
                        value={editSection}
                        onChange={setEditSection}
                        options={[
                          { value: "", label: "-- Select Section --" },
                          { value: "Section A", label: "Section A" },
                          { value: "Section B", label: "Section B" },
                        ]}
                        placeholder="-- Select Section --"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Availability Status */}
                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 relative overflow-visible">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        Availability Status
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Set whether faculty member is currently active or on leave
                      </p>
                    </div>
                    <div className="w-32 sm:w-36 shrink-0">
                      <CustomSelect
                        value={editAvailability}
                        onChange={(val) => setEditAvailability(val as "Active" | "On Leave")}
                        options={[
                          { value: "Active", label: "Active Duty" },
                          { value: "On Leave", label: "On Leave" },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    disabled={isActing}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isActing}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete / Role / Demo Protection Modals */}
      <AnimatePresence>
        {modal && modal.type !== "edit" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={() => !isActing && setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative"
            >
              <button
                onClick={() => !isActing && setModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Demo Account Protection Alert Modal */}
              {modal.type === "demo_protected" && (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 mb-3">
                    <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Protected Demo Account
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-5 leading-relaxed">
                    The Demo Teacher account (<span className="font-semibold text-slate-800 dark:text-slate-200">{modal.teacher.email}</span>) is protected and cannot be deleted or have its role modified. This account is reserved for platform demonstrations and system testing.
                  </p>
                  <button
                    onClick={() => setModal(null)}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    Understood
                  </button>
                </>
              )}

              {modal.type === "delete" && (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 mb-3">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Delete {modal.teacher.name}?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
                    This action will permanently delete this account from the database.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal(null)}
                      disabled={isActing}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isActing}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-500/20"
                    >
                      {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                    </button>
                  </div>
                </>
              )}

              {/* Revoke Approval Confirmation Modal */}
              {modal.type === "revoke" && (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3">
                    <UserX className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Revoke Access for {modal.teacher.name}?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-5 leading-relaxed">
                    This teacher will no longer be able to log in or access teacher features until re-approved by an admin.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal(null)}
                      disabled={isActing}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRevoke}
                      disabled={isActing}
                      className="flex-1 bg-linear-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/25"
                    >
                      {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Revoke Access"}
                    </button>
                  </div>
                </>
              )}

              {/* Role Change Modal with Custom Interactive Role Cards */}
              {modal.type === "role" && (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3">
                    <UserCog className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Change Role for {modal.teacher.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                    Select a new role for this user:
                  </p>

                  {/* Interactive Custom Role Option Cards */}
                  <div className="space-y-2.5 mb-5">
                    {[
                      {
                        id: "teacher",
                        label: "Teacher",
                        desc: "Faculty tools, grading & schedule",
                        icon: BookOpen,
                      },
                      {
                        id: "admin",
                        label: "Admin",
                        desc: "Full administrative access & settings",
                        icon: ShieldAlert,
                      },
                    ].map((roleOpt) => {
                      const RoleIcon = roleOpt.icon;
                      const isSelected = newRole === roleOpt.id;
                      return (
                        <button
                          key={roleOpt.id}
                          type="button"
                          onClick={() => setNewRole(roleOpt.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${isSelected
                              ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 text-slate-900 dark:text-white shadow-xs"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${isSelected
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                : "bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300"
                              }`}
                          >
                            <RoleIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {roleOpt.label}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {roleOpt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal(null)}
                      disabled={isActing}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRoleChange}
                      disabled={isActing}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
                    >
                      {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save New Role"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}