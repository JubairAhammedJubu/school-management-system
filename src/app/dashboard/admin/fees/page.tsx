"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  CreditCard,
  Clock,
  Users,
  RefreshCw,
  Loader2,
  Save,
  Plus,
  Wallet,
  Search,
  ShieldCheck,
} from "lucide-react";
import RecordPaymentModal from "@/components/shared/RecordFeePaymentModal";
import VerifyPaymentModal from "@/components/shared/VerifyPaymentModal";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

const DEFAULT_FEES: Record<string, number> = {
  "Class 6": 1200,
  "Class 7": 1300,
  "Class 8": 1400,
  "Class 9": 1500,
  "Class 10": 1600,
};

function monthKey() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

type Tab = "claims" | "roster" | "structure";

export default function AdminFeesPage() {
  const year = new Date().getFullYear().toString();
  const month = monthKey();
  const [summary, setSummary] = useState({
    totalPaid: 0,
    totalDue: 0,
    remaining: 0,
    collectedPercent: 0,
    studentCount: 0,
    paidCount: 0,
    dueCount: 0,
  });
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterSection, setFilterSection] = useState("All Sections");
  const [rosterSearch, setRosterSearch] = useState("");

  const CLASS_OPTIONS = [
    "All Classes",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];
  const SECTION_OPTIONS = ["All Sections", "Section A", "Section B"];

  const [tab, setTab] = useState<Tab>("claims");
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState<any[]>([]);
  const [roster, setRoster] = useState<any[]>([]);
  const [amounts, setAmounts] = useState(DEFAULT_FEES);

  const [recordOpen, setRecordOpen] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState<{
    id: string;
    name: string;
    amount: number;
  } | null>(null);
  const [savingStructure, setSavingStructure] = useState(false);

  const loadClaims = useCallback(async () => {
    const res = await fetch(`${SERVER}/api/admin/fees/claims?status=PENDING`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load claims");
    setClaims(data.claims || []);
  }, []);

  const loadStructure = useCallback(async () => {
    const res = await fetch(
      `${SERVER}/api/admin/fees/structure?sessionYear=${year}`,
      { credentials: "include" },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load structure");
    const next = { ...DEFAULT_FEES };
    (data.structures || [])
      .filter((s: any) => s.feeType === "MONTHLY")
      .forEach((s: any) => {
        next[s.studentClass] = s.amount;
      });
    setAmounts(next);
  }, [year]);

  const loadRoster = useCallback(async () => {
    const params = new URLSearchParams({
      sessionYear: year,
      month,
    });
    if (rosterSearch.trim()) params.set("search", rosterSearch.trim());
    if (filterClass !== "All Classes") params.set("studentClass", filterClass);
    if (filterSection !== "All Sections")
      params.set("studentSection", filterSection);

    const res = await fetch(
      `${SERVER}/api/admin/fees/students?${params.toString()}`,
      { credentials: "include" },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load roster");

    setRoster(data.data || []);
    if (data.summary) {
      setSummary({
        totalPaid: data.summary.totalPaid ?? 0,
        totalDue: data.summary.totalDue ?? 0,
        remaining: data.summary.remaining ?? 0,
        collectedPercent: data.summary.collectedPercent ?? 0,
        studentCount: data.summary.studentCount ?? 0,
        paidCount: data.summary.paidCount ?? 0,
        dueCount: data.summary.dueCount ?? 0,
      });
    }
  }, [year, month, rosterSearch, filterClass, filterSection]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadClaims(), loadStructure(), loadRoster()]);
    } catch (e: any) {
      toast.error(e.message || "Refresh failed");
    } finally {
      setLoading(false);
    }
  }, [loadClaims, loadStructure, loadRoster]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Reload roster when class/section changes (while on roster tab is enough)
  useEffect(() => {
    if (tab !== "roster") return;
    loadRoster().catch(() => {});
  }, [filterClass, filterSection, tab, loadRoster]);
  // optional
  useEffect(() => {
    loadRoster().catch(() => {});
  }, [filterClass, filterSection]);

  const saveStructure = async () => {
    setSavingStructure(true);
    try {
      for (const [studentClass, amount] of Object.entries(amounts)) {
        const res = await fetch(`${SERVER}/api/admin/fees/structure`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentClass,
            feeType: "MONTHLY",
            amount: Number(amount),
            sessionYear: year,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Save failed");
      }
      toast.success("Monthly fee structure saved");
      await loadStructure();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSavingStructure(false);
    }
  };

  const seedStructure = async () => {
    try {
      const res = await fetch(
        `${SERVER}/api/admin/fees/structure/seed-monthly`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionYear: year }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      toast.success("Default fees applied (1200–1600)");
      await loadStructure();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    {
      id: "claims",
      label: "Pending claims",
      icon: Clock,
      count: claims.length,
    },
    { id: "roster", label: "Roster", icon: Users },
    { id: "structure", label: "Fee structure", icon: CreditCard },
  ];

  const paidCount = roster.filter((r) => r.monthly?.status === "PAID").length;
  const dueCount = roster.filter((r) => r.monthly?.status === "DUE").length;

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <Wallet className="h-5 w-5" />
            </span>
            Fees management
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Session {year} · Month {month} · Verify claims by TrxID · Office
            payments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setRecordOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Record payment
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total due
          </p>
          <p className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            ৳{summary.totalDue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total paid
          </p>
          <p className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            ৳{summary.totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Remaining
          </p>
          <p className="mt-1 text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            ৳{summary.remaining.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Collected
          </p>
          <p className="mt-1 text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {summary.collectedPercent}%
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {summary.paidCount} paid · {summary.dueCount} due ·{" "}
            {summary.studentCount} students
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {typeof t.count === "number" && t.count > 0 && (
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {tab === "claims" && (
          <motion.div
            key="claims"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md"
          >
            {claims.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No pending claims"
                text="Student submissions appear here. TrxID stays hidden until you verify it."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      {["Student", "Fee", "Method", "Phone", "Amount", ""].map(
                        (h) => (
                          <th
                            key={h || "action"}
                            className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-900/40"
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {c.studentName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {c.studentClass} · {c.studentEmail}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                          {c.feeType}
                          {c.month ? (
                            <span className="text-slate-400"> · {c.month}</span>
                          ) : null}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-semibold">
                          {c.gateway || c.method}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-mono text-slate-600">
                          {c.senderPhone || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-sm font-extrabold text-slate-900 dark:text-white">
                          ৳{c.amount}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setVerifyTarget({
                                id: c.id,
                                name: c.studentName,
                                amount: c.amount,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-700 cursor-pointer"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            Verify
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {tab === "roster" && (
          <motion.div
            key="roster"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-3"
          >
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <div className="relative flex-1 min-w-45 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadRoster()}
                  placeholder="Name, email or roll…"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-2 pl-9 pr-3 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-bold"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-bold"
              >
                {SECTION_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => loadRoster()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Search
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md">
              {roster.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No students found"
                  text="Try another class, section, or search term. Seed fee structure if amounts are 0."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        {[
                          "Student",
                          "Class / Section",
                          "Paid / Due",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {roster.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                        >
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {r.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {r.roll ? `Roll ${r.roll} · ` : ""}
                              {r.email}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                            {r.studentClass || "—"}
                            {r.studentSection ? ` · ${r.studentSection}` : ""}
                          </td>
                          <td className="px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white">
                            ৳{r.monthly?.paid ?? 0}
                            <span className="text-slate-400 font-medium">
                              {" "}
                              / ৳{r.monthly?.due ?? 0}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusPill status={r.monthly?.status || "DUE"} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tab === "structure" && (
          <motion.div
            key="structure"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="max-w-lg rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-md space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly fee structure
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Session {year} · amounts in BDT
                </p>
              </div>
              <button
                type="button"
                onClick={seedStructure}
                className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Seed 1200–1600
              </button>
            </div>

            <div className="space-y-2.5">
              {Object.keys(DEFAULT_FEES).map((cls) => (
                <div
                  key={cls}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 px-3.5 py-2.5"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {cls}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400">৳</span>
                    <input
                      type="number"
                      min={0}
                      value={amounts[cls] ?? 0}
                      onChange={(e) =>
                        setAmounts((p) => ({
                          ...p,
                          [cls]: Number(e.target.value),
                        }))
                      }
                      className="w-28 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-sm font-bold text-right outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={saveStructure}
              disabled={savingStructure}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              {savingStructure ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save structure
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <RecordPaymentModal
        isOpen={recordOpen}
        onClose={() => setRecordOpen(false)}
        onSuccess={() => {
          loadRoster();
          loadClaims();
        }}
      />

      <VerifyPaymentModal
        isOpen={Boolean(verifyTarget)}
        claimId={verifyTarget?.id ?? null}
        studentName={verifyTarget?.name}
        amount={verifyTarget?.amount}
        onClose={() => setVerifyTarget(null)}
        onSuccess={async () => {
          await Promise.all([loadClaims(), loadRoster()]);
        }}
      />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    PARTIAL:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    DUE: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
        map[status] || map.DUE
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </div>
  );
}
