"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutivePaymentReceiptSlip } from "@/components/shared/ExecutivePaymentReceiptSlip";
import {
  CreditCard,
  RefreshCw,
  Calendar,
  AlertCircle,
  DollarSign,
  History,
  Receipt,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  ArrowRight,
  Ban,
  Check,
  Download,
  Printer,
  FileText,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type Payment = {
  id: string;
  feeType: string;
  month?: string | null;
  amount: number;
  gatewayAmount?: number | null;
  receiptNo: string;
  paidAt: string;
  status: string;
  methodLabel?: string;
};

type CatalogItem = {
  id: string;
  title: string;
  description?: string | null;
  feeType: string;
  amount: number;
  dueDate?: string | null;
  status: "PAID" | "PENDING" | "DUE";
};

type FeesData = {
  blocked: boolean;
  monthly: {
    month: string;
    amount: number;
    paid: number;
    due: number;
    status: "PAID" | "DUE";
  };
  unpaidMonths: string[];
  fine: { applicable: boolean; amount: number; paid: boolean; due: number };
  catalog: CatalogItem[];
  pending: Payment[];
  history: Payment[];
};

type TabType = "current" | "unpaid" | "fine" | "catalog" | "pending" | "history";

const taka = (n: number) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

function monthLabel(key?: string | null) {
  if (!key) return "-";
  const [y, m] = key.split("-").map(Number);
  if (isNaN(y) || isNaN(m)) return key;
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const STATUS_MESSAGES: Record<
  string,
  { text: string; tone: string; icon: React.ComponentType<{ className?: string }> }
> = {
  success: {
    text: "Payment successful! Your receipt has been recorded in payment history below.",
    tone: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60",
    icon: CheckCircle2,
  },
  fail: {
    text: "Payment failed. Please try again or select another payment option.",
    tone: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60",
    icon: AlertCircle,
  },
  cancel: {
    text: "Payment process was cancelled by the user.",
    tone: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60",
    icon: AlertTriangle,
  },
  error: {
    text: "An error occurred while verifying your payment. If your money was deducted, click refresh after a moment.",
    tone: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60",
    icon: AlertCircle,
  },
};

function FeeSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-950 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-7 w-56 sm:w-72 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-64 sm:w-96 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-7 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-2.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-60 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudentFeePage() {
  const [data, setData] = useState<FeesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [banner, setBanner] = useState<string | null>(null);

  // Dedicated Active Tab state
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const [historyPage, setHistoryPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setLoadError("");
    try {
      const res = await fetch(`${API}/api/student/fees`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load fees");
      setData(json);
    } catch (e: any) {
      setLoadError(e?.message || "Failed to load fees");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // SSL redirect status check -> Routes to dedicated Success / Cancel pages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const tran = params.get("tran") || params.get("tran_id") || "";
    if (status === "success") {
      window.location.href = `/dashboard/student/fee/success?status=success&tran=${encodeURIComponent(tran)}`;
      return;
    }
    if (status === "cancel" || status === "fail" || status === "error") {
      window.location.href = `/dashboard/student/fee/cancel?status=${status}&tran=${encodeURIComponent(tran)}`;
      return;
    }
    load();
  }, [load]);

  async function startPayment(key: string, body: Record<string, unknown>) {
    setBusyKey(key);
    setActionError("");
    try {
      const res = await fetch(`${API}/api/student/fees/ssl/init`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json?.message || json?.error || "Unable to initiate payment gateway");
      }
      window.location.href = json.url;
    } catch (e: any) {
      setActionError(e?.message || "Payment initiation failed");
      setBusyKey(null);
      load(true);
    }
  }

  async function cancelPending(paymentId: string) {
    setBusyKey(`cancel-${paymentId}`);
    setActionError("");
    try {
      const res = await fetch(`${API}/api/student/fees/ssl/cancel-pending`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to cancel payment");
      await load(true);
    } catch (e: any) {
      setActionError(e?.message || "Failed to cancel payment");
    } finally {
      setBusyKey(null);
    }
  }

  if (loading || (isRefreshing && !data)) {
    return <FeeSkeleton />;
  }

  if (loadError || !data) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-center shadow-xs dark:border-rose-900/60 dark:bg-rose-950/40">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-600 dark:text-rose-400" />
          <h2 className="mt-3 text-lg font-bold text-rose-900 dark:text-rose-200">
            Failed to Load Fee Records
          </h2>
          <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
            {loadError || "An unexpected error occurred while fetching your fee details."}
          </p>
          <button
            onClick={() => load()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    );
  }

  const { monthly, unpaidMonths, fine, catalog, pending, history, blocked } = data;
  const rate = monthly.amount;
  const hasPendingMonthly = (m: string) =>
    pending.some((p) => p.feeType === "MONTHLY" && p.month === m);

  // History Pagination (10 items per page)
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(Math.max(historyPage, 1), totalPages);
  const paginatedHistory = history.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // 4 Main Stat Cards mapped to 4 DISTINCT Tabs!
  const miniCards = [
    {
      id: "current" as TabType,
      label: `This Month (${monthLabel(monthly.month)})`,
      value: isRefreshing ? null : taka(rate),
      icon: Calendar,
      badge: monthly.status,
      badgeClass:
        monthly.status === "PAID"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
          : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
      detail: "View current month fee",
    },
    {
      id: "unpaid" as TabType,
      label: "Unpaid Months",
      value: isRefreshing ? null : String(unpaidMonths.length),
      icon: AlertCircle,
      badge: unpaidMonths.length > 0 ? `${unpaidMonths.length} Overdue` : "Clean",
      badgeClass: unpaidMonths.length > 0 ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200",
      detail: `Total Due: ${taka(unpaidMonths.length * rate)}`,
    },
    {
      id: "fine" as TabType,
      label: "Late Fine Due",
      value: isRefreshing ? null : taka(fine.due),
      icon: DollarSign,
      badge: fine.due > 0 ? "Fine Active" : "No Fine",
      badgeClass: fine.due > 0 ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200",
      detail: fine.paid
        ? "Fine Settled"
        : fine.applicable
          ? "Auto added on next pay"
          : "No fine applicable",
    },
    {
      id: "history" as TabType,
      label: "Payment Records",
      value: isRefreshing ? null : String(history.length),
      icon: History,
      badge: `${history.length} Receipts`,
      badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200",
      detail: "View verified receipts log",
    },
  ];

  const allTabs: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeStyle?: string;
  }[] = [
    {
      id: "current",
      label: "Current Month Fee",
      icon: Calendar,
      badge: monthly.status,
      badgeStyle: monthly.status === "PAID"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200"
        : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200",
    },
    {
      id: "unpaid",
      label: "Unpaid Months",
      icon: AlertCircle,
      badge: unpaidMonths.length > 0 ? unpaidMonths.length : undefined,
      badgeStyle: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200",
    },
    {
      id: "fine",
      label: "Late Fine Info",
      icon: DollarSign,
      badge: fine.due > 0 ? taka(fine.due) : undefined,
      badgeStyle: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200",
    },
    {
      id: "catalog",
      label: "Exam & Custom Fees",
      icon: Receipt,
      badge: catalog.length > 0 ? catalog.length : undefined,
      badgeStyle: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200",
    },
    {
      id: "pending",
      label: "Pending Sessions",
      icon: Clock,
      badge: pending.length > 0 ? pending.length : undefined,
      badgeStyle: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 animate-pulse",
    },
    {
      id: "history",
      label: "Payment Records",
      icon: History,
      badge: history.length,
      badgeStyle: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200",
    },
  ];

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
              <CreditCard className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Student Fee Portal
                </span>
                {blocked && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:border-rose-500/30 dark:bg-rose-950/60 dark:text-rose-400">
                    <Ban className="h-3 w-3" /> Restricted
                  </span>
                )}
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Fees & Financial Overview
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Pay monthly tuition fees, manage exam bills online via SSLCommerz gateway, and review your payment receipts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => load(true)}
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

      {/* SSL Status Banner */}
      <AnimatePresence>
        {banner && STATUS_MESSAGES[banner] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-start justify-between rounded-xl border p-4 text-xs sm:text-sm shadow-xs ${STATUS_MESSAGES[banner].tone}`}
          >
            <div className="flex items-center gap-2.5">
              {(() => {
                const IconComponent = STATUS_MESSAGES[banner].icon;
                return <IconComponent className="h-5 w-5 shrink-0" />;
              })()}
              <span className="font-medium">{STATUS_MESSAGES[banner].text}</span>
            </div>
            <button
              onClick={() => setBanner(null)}
              className="ml-4 rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Error Banner */}
      {actionError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="font-medium">{actionError}</span>
          </div>
          <button
            onClick={() => setActionError("")}
            className="ml-4 rounded-lg p-1 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Restricted Access Warning Banner */}
      {blocked && (
        <div className="relative overflow-hidden rounded-2xl border border-rose-300/80 bg-gradient-to-r from-rose-50 via-rose-50/80 to-amber-50 p-5 shadow-xs dark:border-rose-800/80 dark:from-rose-950/60 dark:via-rose-950/40 dark:to-amber-950/30">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Account Access Restricted
              </h2>
              <p className="mt-1 text-xs font-medium text-rose-700 dark:text-rose-300 leading-relaxed max-w-3xl">
                You have overdue monthly fees for 3 or more months. Please settle your due monthly fees below to restore full platform access (access auto-restores when unpaid months are 3 or less).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4 Mini Cards - EACH CARD SWITCHES TO ITS OWN UNIQUE TAB! */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {miniCards.map((item, idx) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              type="button"
              key={item.label}
              onClick={() => setActiveTab(item.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className={`relative overflow-hidden rounded-2xl border text-left p-4 shadow-xs backdrop-blur-xl transition-all duration-300 cursor-pointer ${
                isActive
                  ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 dark:border-indigo-500 ring-2 ring-indigo-500/30 scale-[1.02]"
                  : "border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-950 hover:border-indigo-500/50 hover:shadow-md active:scale-[0.99]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-2xs ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-700 dark:bg-indigo-500"
                    : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40"
                }`}>
                  <item.icon className="h-4 w-4" />
                </div>
                {item.badge && (
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                )}
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

              <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium flex items-center justify-between gap-1">
                <span>{item.detail}</span>
                <ArrowRight className={`h-3 w-3 shrink-0 ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-indigo-500"}`} />
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Animated Navigation Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        {allTabs.map((t) => {
          const isActive = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-950 dark:text-indigo-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
              <span>{t.label}</span>
              {t.badge !== undefined && (
                <span className={`ml-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${t.badgeStyle}`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Animated Tab View Panels */}
      <AnimatePresence mode="wait">
        {/* TAB 1: Current Month Fee */}
        {activeTab === "current" && (
          <motion.section
            key="current-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Current Month Fee Status ({monthLabel(monthly.month)})
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Tuition fee rate and payment status for the current academic month.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {monthLabel(monthly.month)} Tuition Fee
                    </span>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${
                      monthly.status === "PAID"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400"
                    }`}>
                      {monthly.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monthly Tuition Rate: <span className="font-bold text-slate-800 dark:text-slate-200">{taka(rate)}</span>
                  </p>
                </div>

                {monthly.status === "DUE" ? (
                  <button
                    disabled={busyKey !== null}
                    onClick={() => startPayment(`month-${monthly.month}`, { feeType: "MONTHLY", month: monthly.month })}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-xs font-bold text-white shadow-md hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {busyKey === `month-${monthly.month}` ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Redirecting...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay {taka(rate)} Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <Check className="h-4 w-4" /> Fully Settled
                  </span>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* TAB 2: Unpaid Months */}
        {activeTab === "unpaid" && (
          <motion.section
            key="unpaid-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Unpaid Overdue Months ({unpaidMonths.length})
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Pay starting from your oldest unpaid month. Any applicable late fine is automatically added to the first payment.
                  </p>
                </div>
              </div>
            </div>

            {unpaidMonths.length === 0 ? (
              <div className="p-6 text-center sm:p-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  All Monthly Fees Paid! 🎉
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  You have 0 overdue unpaid monthly fees.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {unpaidMonths.map((m, i) => {
                  const isPending = hasPendingMonthly(m);
                  const withFine = i === 0 ? fine.due : 0;
                  const key = `month-${m}`;
                  const isBusy = busyKey === key;

                  return (
                    <div
                      key={m}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {monthLabel(m)}
                          </p>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-400">
                              <Clock className="h-3 w-3" /> Pending Payment
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Amount: <span className="font-semibold text-slate-700 dark:text-slate-300">{taka(rate)}</span>
                          {withFine > 0 && (
                            <span className="ml-1 text-rose-600 dark:text-rose-400 font-medium">
                              + {taka(withFine)} fine
                            </span>
                          )}
                        </p>
                      </div>

                      <button
                        disabled={busyKey !== null}
                        onClick={() => startPayment(key, { feeType: "MONTHLY", month: m })}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {isBusy ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Redirecting...</span>
                          </>
                        ) : (
                          <>
                            <span>Pay {taka(rate + withFine)}</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        )}

        {/* TAB 3: Late Fine Info */}
        {activeTab === "fine" && (
          <motion.section
            key="fine-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Late Fine & Penalty Details
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Institutional late fine policy breakdown and status.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 space-y-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Late Fine Applicable Status</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {fine.due > 0 ? taka(fine.due) : "No Active Fine"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {fine.paid ? "Previous fines settled." : fine.applicable ? "Fine automatically applies after the 10th of every month." : "No penalty active on your profile."}
                  </p>
                </div>

                <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-800/60 dark:bg-amber-950/20 space-y-2">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">Late Payment Policy Note</span>
                  <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                    Late fine is calculated per unpaid monthly billing period and is appended to the payment total of your first pending monthly tuition transaction.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* TAB 4: Exam & Custom Fees */}
        {activeTab === "catalog" && (
          <motion.section
            key="catalog-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Exam & Custom Fees
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Required academic fees, exam enrollment, or institutional charges.
                  </p>
                </div>
              </div>
            </div>

            {catalog.length === 0 ? (
              <div className="p-6 text-center sm:p-8">
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  No exam or custom fee items currently assigned to your profile.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {catalog.map((c) => {
                  const key = `cat-${c.id}`;
                  const isBusy = busyKey === key;

                  return (
                    <div
                      key={c.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {c.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Amount: <span className="font-semibold text-slate-700 dark:text-slate-300">{taka(c.amount)}</span>
                          {c.dueDate && (
                            <span> · Due: {new Date(c.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          )}
                        </p>
                        {c.description && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {c.description}
                          </p>
                        )}
                      </div>

                      {c.status === "PAID" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-400">
                          <Check className="h-3.5 w-3.5" /> Paid
                        </span>
                      ) : c.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-400">
                          <Clock className="h-3.5 w-3.5" /> Pending
                        </span>
                      ) : (
                        <button
                          disabled={busyKey !== null}
                          onClick={() => startPayment(key, { feeType: c.feeType, catalogId: c.id })}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                        >
                          {isBusy ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Redirecting...</span>
                            </>
                          ) : (
                            <>
                              <span>Pay {taka(c.amount)}</span>
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        )}

        {/* TAB 5: Pending Sessions */}
        {activeTab === "pending" && (
          <motion.section
            key="pending-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-amber-200 bg-amber-50/40 dark:border-amber-800/60 dark:bg-amber-950/20 shadow-xs overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-amber-200/80 dark:border-amber-800/60">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-amber-950 dark:text-amber-200">
                    Pending Transactions
                  </h2>
                  <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-400">
                    Initiated payment sessions awaiting gateway confirmation. You can cancel pending sessions to retry.
                  </p>
                </div>
              </div>
            </div>

            {pending.length === 0 ? (
              <div className="p-6 text-center sm:p-8">
                <p className="text-xs sm:text-sm font-medium text-amber-900/80 dark:text-amber-300">
                  No active pending payment sessions.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-amber-200/60 dark:divide-amber-800/40">
                {pending.map((p) => {
                  const key = `cancel-${p.id}`;
                  const isBusy = busyKey === key;

                  return (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {p.feeType === "MONTHLY"
                            ? `Monthly Fee (${monthLabel(p.month)})`
                            : p.feeType}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Amount: <span className="font-semibold text-slate-700 dark:text-slate-300">{taka(p.gatewayAmount ?? p.amount)}</span>
                          <span> · Initiated: {new Date(p.paidAt).toLocaleString()}</span>
                        </p>
                      </div>

                      <button
                        disabled={busyKey !== null}
                        onClick={() => cancelPending(p.id)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-white px-4 text-xs font-bold text-rose-600 shadow-xs hover:bg-rose-50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/50 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {isBusy ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <span>Cancel Session</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        )}

        {/* TAB 6: Payment Records (History + Download Printable Slip) */}
        {activeTab === "history" && (
          <motion.section
            key="history-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs transition-colors duration-300 overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Payment History & Verified Receipts
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Verified transaction history with downloadable official payment receipts (10 items per page).
                  </p>
                </div>
              </div>
            </div>

            {history.length === 0 ? (
              <p className="px-5 sm:px-6 py-8 text-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                No completed payment transactions found.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Receipt No
                        </th>
                        <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Type
                        </th>
                        <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Month
                        </th>
                        <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Method
                        </th>
                        <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                          Amount
                        </th>
                        <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Date
                        </th>
                        <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                      {paginatedHistory.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors text-xs sm:text-sm"
                        >
                          <td className="px-5 sm:px-6 py-3.5 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {p.receiptNo}
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                            {p.feeType}
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-slate-600 dark:text-slate-400">
                            {p.month ? monthLabel(p.month) : "-"}
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-slate-600 dark:text-slate-400">
                            {p.methodLabel || "SSLCommerz"}
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                            {taka(p.amount)}
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400">
                            {new Date(p.paidAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(p)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 shadow-2xs hover:bg-indigo-100 hover:text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/80 transition-colors cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>View Slip</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* History Pagination Bar (10 per page) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Showing <span className="font-bold text-slate-900 dark:text-white">{(safePage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                    <span className="font-bold text-slate-900 dark:text-white">{Math.min(safePage * ITEMS_PER_PAGE, history.length)}</span> of{" "}
                    <span className="font-bold text-slate-900 dark:text-white">{history.length}</span> payment records
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Prev</span>
                    </button>

                    <div className="flex items-center gap-1 px-2">
                      <span className="font-bold text-slate-900 dark:text-white">{safePage}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-500 dark:text-slate-400">{totalPages}</span>
                    </div>

                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => setHistoryPage((p) => Math.min(totalPages, p + 1))}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Official Executive School Payment Slip Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <ExecutivePaymentReceiptSlip
            payment={selectedReceipt}
            onClose={() => setSelectedReceipt(null)}
            printableId="printable-receipt-slip"
          />
        )}
      </AnimatePresence>
    </div>
  );
}