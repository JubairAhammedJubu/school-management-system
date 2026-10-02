"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Wallet,
  Loader2,
  RefreshCw,
  Save,
  Plus,
  Banknote,
  Search,
  Lock,
  Users,
  History,
  SlidersHorizontal,
  PlusCircle,
  DollarSign,
  Receipt,
  Check,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  X,
  Calendar,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Pencil,
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTIONS = ["All Sections", "Section A", "Section B"];

const inputCls =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20";

type Tab = "structure" | "catalog" | "cash" | "roster" | "history";

const taka = (n: number | string) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

// Custom Dropdown Select Component
function CustomSelect({
  value,
  options,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className || "w-full sm:w-48"}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-2xs outline-none transition-all hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder || "Select..."}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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
            className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl"
          >
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
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="p-5 sm:p-6 animate-pulse space-y-4">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div
          key={rIdx}
          className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
        >
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className={`h-4 rounded bg-slate-200 dark:bg-slate-800 ${
                cIdx === 0 ? "w-36" : "w-16 sm:w-24"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function AdminFeeSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Executive Header Skeleton */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-950 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-7 w-60 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-80 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3"
          >
            <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-7 w-24 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Main Tab Content Skeleton */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-4">
        <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-900" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminFeesPage() {
  const year = new Date().getFullYear().toString();
  const [tab, setTab] = useState<Tab>("structure");
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [structures, setStructures] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const [catalog, setCatalog] = useState<any[]>([]);
  const [catForm, setCatForm] = useState({
    title: "",
    feeType: "EXAM" as "EXAM" | "CUSTOM",
    amount: "",
    studentClass: "ALL",
    section: "",
    dueDate: "",
    description: "",
  });

  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [studentQ, setStudentQ] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [cashSource, setCashSource] = useState<"MONTHLY" | "EXAM" | "CATALOG">("MONTHLY");
  const [cashMonth, setCashMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
  );
  const [cashCatalogId, setCashCatalogId] = useState("");
  const [payFine, setPayFine] = useState(true);
  const [savingCash, setSavingCash] = useState(false);

  const [roster, setRoster] = useState<any[]>([]);
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterSection, setFilterSection] = useState("All Sections");
  const [rosterPage, setRosterPage] = useState(1);

  const [payments, setPayments] = useState<any[]>([]);
  const [payQ, setPayQ] = useState("");
  const [payMethod, setPayMethod] = useState("ALL");
  const [historyPage, setHistoryPage] = useState(1);

  const pageSize = 10;

  const loadStructure = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/structure?sessionYear=${year}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStructures(data.structures || []);
      setSettings(data.settings);
      const map: Record<string, string> = {};
      (data.structures || []).forEach((s: any) => {
        map[s.studentClass] = String(s.amount);
      });
      setAmounts(map);
    } catch (e: any) {
      toast.error(e.message || "Failed to load fee structure");
    } finally {
      setLoading(false);
    }
  }, [year]);

  const loadCatalog = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/catalog?sessionYear=${year}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setCatalog(data.catalog || []);
    } catch (e) {
      console.error(e);
    }
  }, [year]);

  const loadStudents = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/roster?sessionYear=${year}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setAllStudents(data.roster || []);
    } catch (e) {
      console.error(e);
    }
  }, [year]);

  const loadRoster = useCallback(async () => {
    setLoading(true);
    setRosterPage(1);
    try {
      const qs = new URLSearchParams({ sessionYear: year });
      if (filterClass !== "All Classes") qs.set("studentClass", filterClass);
      if (filterSection !== "All Sections") qs.set("section", filterSection);
      const res = await fetch(`${SERVER}/api/admin/fees/roster?${qs}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoster(data.roster || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load student roster");
    } finally {
      setLoading(false);
    }
  }, [year, filterClass, filterSection]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setHistoryPage(1);
    try {
      const qs = new URLSearchParams({ sessionYear: year, limit: "100" });
      if (payQ) qs.set("q", payQ);
      if (payMethod !== "ALL") qs.set("method", payMethod);
      if (filterClass !== "All Classes") qs.set("studentClass", filterClass);
      const res = await fetch(`${SERVER}/api/admin/fees/payments?${qs}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPayments(data.payments || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  }, [year, payQ, payMethod, filterClass]);

  const refreshCurrentTab = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (tab === "structure") await loadStructure();
      else if (tab === "catalog") await loadCatalog();
      else if (tab === "cash") {
        await Promise.all([loadCatalog(), loadStudents()]);
      } else if (tab === "roster") await loadRoster();
      else if (tab === "history") await loadHistory();
    } finally {
      setIsRefreshing(false);
    }
  }, [tab, loadStructure, loadCatalog, loadStudents, loadRoster, loadHistory]);

  useEffect(() => {
    if (tab === "structure") loadStructure();
    if (tab === "catalog") loadCatalog();
    if (tab === "cash") {
      loadCatalog();
      loadStudents();
    }
    if (tab === "roster") loadRoster();
    if (tab === "history") loadHistory();
  }, [tab, loadStructure, loadCatalog, loadStudents, loadRoster, loadHistory]);

  const studentHits = useMemo(() => {
    const q = studentQ.trim().toLowerCase();
    if (q.length < 1 || student) return [];
    return allStudents
      .filter((s) => {
        const name = (s.name || "").toLowerCase();
        const email = (s.email || "").toLowerCase();
        return name.includes(q) || email.includes(q);
      })
      .slice(0, 12);
  }, [allStudents, studentQ, student]);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    studentClass: string;
    oldAmount: number;
    newAmount: number;
  } | null>(null);
  const [noChangeModal, setNoChangeModal] = useState<{
    isOpen: boolean;
    studentClass: string;
    amount: number;
  } | null>(null);
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [isSavingRate, setIsSavingRate] = useState(false);

  const handleSaveClick = (studentClass: string) => {
    const newAmount = Number(amounts[studentClass]);
    if (!newAmount || isNaN(newAmount) || newAmount <= 0) {
      return toast.error("Please enter a valid positive amount");
    }
    const existing = Number(
      structures.find((s) => s.studentClass === studentClass)?.amount || 0,
    );
    if (newAmount === existing) {
      setNoChangeModal({
        isOpen: true,
        studentClass,
        amount: existing,
      });
      return;
    }
    setConfirmModal({
      isOpen: true,
      studentClass,
      oldAmount: existing,
      newAmount,
    });
  };

  const confirmSaveRate = async () => {
    if (!confirmModal) return;
    const { studentClass, newAmount } = confirmModal;
    setIsSavingRate(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/structure`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentClass, amount: newAmount, sessionYear: year }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update rate");
      toast.success(`Updated ${studentClass} rate to ${taka(newAmount)}`);
      setConfirmModal(null);
      setEditingClass(null);
      await loadStructure();
    } catch (e: any) {
      toast.error(e.message || "Failed to update rate");
    } finally {
      setIsSavingRate(false);
    }
  };

  const seed = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/structure/seed`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionYear: year }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Seeded default rates for Class 6–10");
      await loadStructure();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const createCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.title.trim()) return toast.error("Title is required");
    if (!Number(catForm.amount)) return toast.error("Amount is required");
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/catalog`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: catForm.title.trim(),
          feeType: catForm.feeType,
          amount: Number(catForm.amount),
          studentClass: catForm.studentClass,
          section: catForm.section || undefined,
          dueDate: catForm.dueDate || undefined,
          description: catForm.description || undefined,
          sessionYear: year,
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error);
      toast.success("Fee bill published successfully");
      setCatForm({
        title: "",
        feeType: "EXAM",
        amount: "",
        studentClass: "ALL",
        section: "",
        dueDate: "",
        description: "",
      });
      loadCatalog();
    } catch (e: any) {
      toast.error(e.message || "Failed to create fee");
    }
  };

  const pickStudent = (s: any) => {
    setStudent({
      id: s.studentId || s.id,
      name: s.name,
      email: s.email,
    });
    setStudentQ("");
  };

  const submitCash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student?.id) return toast.error("Please select a student from the list");
    if (cashSource !== "MONTHLY" && !cashCatalogId) {
      return toast.error("Please select a fee bill from the list");
    }
    setSavingCash(true);
    try {
      const body: any = {
        studentId: student.id,
        source: cashSource,
        sessionYear: year,
        payFine,
      };
      if (cashSource === "MONTHLY") body.month = cashMonth;
      else body.catalogId = cashCatalogId;
      const res = await fetch(`${SERVER}/api/admin/fees/payments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Cash payment recorded successfully");
      setStudent(null);
      setStudentQ("");
      setCashCatalogId("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingCash(false);
    }
  };

  const examCatalog = catalog.filter((c) => c.isActive && c.feeType === "EXAM");
  const customCatalog = catalog.filter((c) => c.isActive && c.feeType === "CUSTOM");
  const cashList = cashSource === "EXAM" ? examCatalog : cashSource === "CATALOG" ? customCatalog : [];

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "structure", label: "Monthly Rates", icon: SlidersHorizontal },
    { id: "catalog", label: "Create Fee", icon: PlusCircle },
    { id: "cash", label: "Record Cash", icon: Banknote },
    { id: "roster", label: "Student Status", icon: Users },
    { id: "history", label: "Payment History", icon: History },
  ];

  // Roster Pagination
  const rosterTotalPages = Math.ceil(roster.length / pageSize) || 1;
  const paginatedRoster = useMemo(() => {
    const start = (rosterPage - 1) * pageSize;
    return roster.slice(start, start + pageSize);
  }, [roster, rosterPage]);

  // Payment History Pagination
  const historyTotalPages = Math.ceil(payments.length / pageSize) || 1;
  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * pageSize;
    return payments.slice(start, start + pageSize);
  }, [payments, historyPage]);

  if (loading && !structures.length && !roster.length && !payments.length) {
    return <AdminFeeSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-indigo-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Wallet className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Admin Workspace
                </span>
                {settings && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                    Fine: {taka(settings.fineAmount)} · Lock after {settings.lockAfterMonths} unpaid mos
                  </span>
                )}
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Fee & Treasury Management
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Configure monthly tuition structures, publish exam & custom fees, record offline cash payments, and audit student access status.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={refreshCurrentTab}
              disabled={loading || isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing
                    ? "animate-spin text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* High-Contrast Stat Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Monthly Rate Profiles",
            value: isRefreshing ? null : `${structures.length} / 5 Classes`,
            icon: SlidersHorizontal,
            detail: "Configured grade levels",
          },
          {
            label: "Active Catalog Bills",
            value: isRefreshing ? null : String(catalog.length),
            icon: Receipt,
            detail: "Exam & custom fees published",
          },
          {
            label: "Fine Policy",
            value: isRefreshing ? null : taka(settings?.fineAmount || 500),
            icon: DollarSign,
            detail: `Lock threshold: ${settings?.lockAfterMonths || 3} months`,
          },
          {
            label: "Recent Transactions",
            value: isRefreshing ? null : String(payments.length),
            icon: History,
            detail: "Recorded payment history",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl hover:border-indigo-500/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
                <item.icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {item.label}
            </p>

            {item.value === null ? (
              <div className="mt-1 h-7 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {item.value}
              </p>
            )}

            <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Structure (Monthly Rates) */}
      {tab === "structure" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Class-wise Monthly Tuition Rates ({year})
            </h2>
            <button
              type="button"
              onClick={seed}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Seed Class 6–10 Defaults</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
            {CLASSES.map((c) => {
              const isEditing = editingClass === c;
              return (
                <div
                  key={c}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <div className="w-32">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {c}
                    </span>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Monthly Tuition
                    </p>
                  </div>

                  <div className="flex flex-1 items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        ৳
                      </span>
                      <input
                        type="number"
                        readOnly={!isEditing}
                        disabled={!isEditing}
                        placeholder="Amount e.g. 2500"
                        value={amounts[c] ?? ""}
                        onChange={(e) =>
                          setAmounts((a) => ({ ...a, [c]: e.target.value }))
                        }
                        className={`pl-7 ${inputCls} ${
                          !isEditing
                            ? "bg-slate-100/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed select-none"
                            : "bg-white dark:bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/20"
                        }`}
                      />
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const original = structures.find(
                              (s) => s.studentClass === c,
                            )?.amount;
                            if (original !== undefined) {
                              setAmounts((a) => ({ ...a, [c]: String(original) }));
                            }
                            setEditingClass(null);
                          }}
                          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Cancel</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveClick(c)}
                          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingClass(c)}
                        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
                      >
                        <Pencil className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Tab 2: Catalog (Create Fee) */}
      {tab === "catalog" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Create Form */}
          <form
            onSubmit={createCatalog}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <PlusCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Create & Publish Fee Bill
              </h2>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Fee Category
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["EXAM", "CUSTOM"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCatForm({ ...catForm, feeType: t })}
                    className={`rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      catForm.feeType === t
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    {t === "EXAM" ? "Exam Fee" : "Custom Charge"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Fee Title
              </label>
              <input
                required
                placeholder="e.g. Half Yearly Exam Fee or Annual Sports"
                value={catForm.title}
                onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Amount (৳)
              </label>
              <input
                required
                type="number"
                placeholder="Amount ৳"
                value={catForm.amount}
                onChange={(e) => setCatForm({ ...catForm, amount: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Target Class
              </p>
              <div className="flex flex-wrap gap-2">
                {["ALL", ...CLASSES].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCatForm({ ...catForm, studentClass: c })}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      catForm.studentClass === c
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    {c === "ALL" ? "All Classes" : c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Target Section
              </p>
              <div className="flex flex-wrap gap-2">
                {["", "Section A", "Section B"].map((s) => (
                  <button
                    key={s || "all"}
                    type="button"
                    onClick={() => setCatForm({ ...catForm, section: s })}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      catForm.section === s
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    {s || "All Sections"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={catForm.dueDate}
                onChange={(e) => setCatForm({ ...catForm, dueDate: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Description (Optional)
              </label>
              <input
                placeholder="Add brief details about this fee"
                value={catForm.description}
                onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer"
            >
              Publish Fee Bill
            </button>
          </form>

          {/* Catalog List */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Receipt className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Published Fee Catalog ({catalog.length})
              </h2>
            </div>

            {catalog.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
                No active custom or exam fee bills yet. Create one using the form on the left.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[520px] overflow-y-auto pr-1">
                {catalog.map((c) => (
                  <div key={c.id} className="py-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {c.title}
                      </p>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {taka(c.amount)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-bold">
                        {c.feeType}
                      </span>
                      <span>•</span>
                      <span>Target: {c.studentClass}</span>
                      {c.section && <span>({c.section})</span>}
                      {c.dueDate && (
                        <>
                          <span>•</span>
                          <span>Due: {new Date(c.dueDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>

                    {c.description && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        {c.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Tab 3: Cash (Record Cash Payment) */}
      {tab === "cash" && (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          onSubmit={submitCash}
          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Banknote className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Record Offline Cash Payment
            </h2>
          </div>

          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Select Student
            </label>

            {student ? (
              <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 dark:border-indigo-900/60 dark:bg-indigo-950/40">
                <div className="text-xs">
                  <p className="font-bold text-indigo-900 dark:text-indigo-200">{student.name}</p>
                  <p className="text-indigo-700 dark:text-indigo-400">{student.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStudent(null);
                    setStudentQ("");
                  }}
                  className="rounded-lg p-1 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={studentQ}
                    onChange={(e) => setStudentQ(e.target.value)}
                    placeholder="Type student name or email to search..."
                    className={`pl-9 ${inputCls}`}
                    autoComplete="off"
                  />
                </div>

                {studentHits.length > 0 && (
                  <ul className="absolute z-30 mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {studentHits.map((s) => (
                      <li key={s.studentId || s.id}>
                        <button
                          type="button"
                          onClick={() => pickStudent(s)}
                          className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                        >
                          <p className="font-bold text-slate-900 dark:text-slate-100">{s.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {s.email} · {s.studentClass} {s.section}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Fee Type
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["MONTHLY", "EXAM", "CATALOG"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setCashSource(s);
                    setCashCatalogId("");
                  }}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    cashSource === s
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {s === "MONTHLY" ? "Monthly Fee" : s === "EXAM" ? "Exam Fee" : "Custom Fee"}
                </button>
              ))}
            </div>
          </div>

          {cashSource === "MONTHLY" ? (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Select Month
              </label>
              <input
                type="month"
                value={cashMonth}
                onChange={(e) => setCashMonth(e.target.value)}
                className={inputCls}
              />
            </div>
          ) : cashList.length === 0 ? (
            <p className="text-xs text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 rounded-xl p-3 border border-amber-200 dark:border-amber-800/60">
              No active {cashSource === "EXAM" ? "exam" : "custom"} fee bills available. Create one first in the <strong>Create Fee</strong> tab.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Fee Bill
              </p>
              {cashList.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCashCatalogId(c.id)}
                  className={`w-full flex justify-between rounded-xl border p-3 text-left text-xs font-bold transition-all cursor-pointer ${
                    cashCatalogId === c.id
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <span>{c.title}</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">{taka(c.amount)}</span>
                </button>
              ))}
            </div>
          )}

          {cashSource === "MONTHLY" && (
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={payFine}
                onChange={(e) => setPayFine(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Collect ৳500 late fine if student is overdue
            </label>
          )}

          <button
            type="submit"
            disabled={savingCash || !student?.id}
            className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer"
          >
            {savingCash ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Recording...
              </span>
            ) : (
              "Record Cash Payment"
            )}
          </button>
        </motion.form>
      )}

      {/* Tab 4: Roster (Student Status) */}
      {tab === "roster" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full sm:w-auto">
              <CustomSelect
                value={filterClass}
                onChange={setFilterClass}
                options={[
                  { label: "All Classes", value: "All Classes" },
                  ...CLASSES.map((c) => ({ label: c, value: c })),
                ]}
              />

              <CustomSelect
                value={filterSection}
                onChange={setFilterSection}
                options={SECTIONS.map((s) => ({ label: s, value: s }))}
              />
            </div>

            <button
              type="button"
              onClick={loadRoster}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs overflow-hidden">
            {loading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : roster.length === 0 ? (
              <div className="p-8 sm:p-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Students Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  No student records match the selected class and section filter criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        {["Student", "Class / Section", "Unpaid Months", "Fine Due", "Catalog Due", "Account Access"].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                      {paginatedRoster.map((r) => (
                        <tr
                          key={r.studentId}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors text-xs sm:text-sm"
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-slate-900 dark:text-slate-100">{r.name}</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">{r.email}</p>
                          </td>
                          <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                            {r.studentClass} {r.section ? `(${r.section})` : ""}
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                            {r.unpaidMonths}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-rose-600 dark:text-rose-400">
                            {taka(r.fineDue)}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                            {taka(r.catalogDue)}
                          </td>
                          <td className="px-5 py-3.5">
                            {r.blocked ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-400">
                                <Lock className="h-3 w-3" /> Locked Access
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <Check className="h-3 w-3" /> Active
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Showing {Math.min((rosterPage - 1) * pageSize + 1, roster.length)} to{" "}
                    {Math.min(rosterPage * pageSize, roster.length)} of {roster.length} students
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={rosterPage === 1}
                      onClick={() => setRosterPage((p) => Math.max(1, p - 1))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Page {rosterPage} of {rosterTotalPages}
                    </span>
                    <button
                      type="button"
                      disabled={rosterPage >= rosterTotalPages}
                      onClick={() => setRosterPage((p) => Math.min(rosterTotalPages, p + 1))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Tab 5: History (Payment History) */}
      {tab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full sm:w-auto flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={payQ}
                  onChange={(e) => setPayQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadHistory()}
                  placeholder="Search receipt no or student name…"
                  className={`pl-9 ${inputCls}`}
                />
              </div>

              <CustomSelect
                value={payMethod}
                onChange={setPayMethod}
                options={[
                  { label: "All Methods", value: "ALL" },
                  { label: "Cash", value: "CASH" },
                  { label: "SSLCommerz", value: "SSL" },
                ]}
              />
            </div>

            <button
              type="button"
              onClick={loadHistory}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span>Search / Refresh</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs overflow-hidden">
            {loading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : payments.length === 0 ? (
              <div className="p-8 sm:p-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400">
                  <Inbox className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Payment Records Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  No completed or recorded payment transactions match your query parameters.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        {["Receipt No", "Student Name", "Fee Type", "Method", "Amount", "Status"].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                      {paginatedHistory.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors text-xs sm:text-sm"
                        >
                          <td className="px-5 py-3.5 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {p.receiptNo}
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                            {p.studentName}
                          </td>
                          <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                            {p.feeType} {p.month || ""}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 font-medium">
                            {p.methodLabel || p.gateway || p.method}
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                            {taka(p.amount)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-400">
                              {p.gatewayStatus || p.status || "VALID"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Showing {Math.min((historyPage - 1) * pageSize + 1, payments.length)} to{" "}
                    {Math.min(historyPage * pageSize, payments.length)} of {payments.length} records
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={historyPage === 1}
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Page {historyPage} of {historyTotalPages}
                    </span>
                    <button
                      type="button"
                      disabled={historyPage >= historyTotalPages}
                      onClick={() => setHistoryPage((p) => Math.min(historyTotalPages, p + 1))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Confirmation Modal for Monthly Rate Changes */}
      <AnimatePresence>
        {confirmModal && confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                    <SlidersHorizontal className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Confirm Rate Adjustment
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Review fee structure changes before saving
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  disabled={isSavingRate}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                    Target Class
                  </span>
                  <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {confirmModal.studentClass}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Current Rate</p>
                    <p className="mt-1 text-sm font-extrabold text-slate-700 dark:text-slate-300 line-through">
                      {taka(confirmModal.oldAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 p-3">
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">New Proposed Rate</p>
                    <p className="mt-1 text-base font-black text-emerald-700 dark:text-emerald-300">
                      {taka(confirmModal.newAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Updating this rate will adjust the default monthly tuition fee for all students in <strong className="text-slate-900 dark:text-slate-200">{confirmModal.studentClass}</strong> for session <strong className="text-slate-900 dark:text-slate-200">{year}</strong>.
              </p>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  disabled={isSavingRate}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmSaveRate}
                  disabled={isSavingRate}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSavingRate ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Confirm & Save</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* No Changes Detected Modal */}
      <AnimatePresence>
        {noChangeModal && noChangeModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No Changes Detected
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      The tuition rate remains unchanged
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNoChangeModal(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                    Target Class
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {noChangeModal.studentClass}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Current Saved Rate</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {taka(noChangeModal.amount)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You haven&apos;t modified the monthly tuition fee for <strong className="text-slate-900 dark:text-slate-200">{noChangeModal.studentClass}</strong>. It is already set to <strong className="text-slate-900 dark:text-slate-200">{taka(noChangeModal.amount)}</strong>. Please enter a different value to adjust the rate.
              </p>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setNoChangeModal(null)}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}