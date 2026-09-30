"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  CreditCard,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Wallet,
  Receipt,
  Banknote,
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

type Payment = {
  id: string;
  studentName: string;
  studentEmail: string;
  studentClass: string;
  feeType: string;
  month?: string | null;
  amount: number;
  method: string;
  gateway?: string | null;
  gatewayStatus?: string | null;
  gatewayTranId?: string | null;
  transactionRef?: string | null;
  status: string;
  receiptNo: string;
  paidAt: string;
  recordedByAdminEmail?: string | null;
  submittedByStudent?: boolean;
  methodLabel?: string;
};

type StudentOption = {
  id: string;
  name: string;
  email: string;
  studentClass?: string | null;
};

function monthKey() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

function displayMethod(p: Payment) {
  if (p.methodLabel) return p.methodLabel;
  if (p.gateway === "SSLCommerz" || p.gatewayStatus) return "SSLCommerz";
  if (p.method === "CASH") return "Cash";
  return p.gateway || p.method || "—";
}

export default function AdminFeesPage() {
  const year = new Date().getFullYear().toString();
  const [tab, setTab] = useState<"record" | "history">("record");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // history
  const [payments, setPayments] = useState<Payment[]>([]);
  const [q, setQ] = useState("");
  const [filterMethod, setFilterMethod] = useState("ALL");
  const [filterClass, setFilterClass] = useState("All Classes");

  // record form
  const [studentQuery, setStudentQuery] = useState("");
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);
  const [feeType, setFeeType] = useState("MONTHLY");
  const [month, setMonth] = useState(monthKey());
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("sessionYear", year);
      if (q.trim()) params.set("q", q.trim());
      if (filterMethod !== "ALL") params.set("method", filterMethod);
      if (filterClass !== "All Classes") params.set("studentClass", filterClass);
      params.set("limit", "40");

      const res = await fetch(
        `${SERVER}/api/admin/fees/payments?${params.toString()}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load payments");
      setPayments(data.payments || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [year, q, filterMethod, filterClass]);

  useEffect(() => {
    if (tab === "history") loadHistory();
  }, [tab, loadHistory]);

  // simple student search — adjust endpoint if yours differs
  const searchStudents = async (term: string) => {
    setStudentQuery(term);
    if (term.trim().length < 2) {
      setStudents([]);
      return;
    }
    try {
      const res = await fetch(
        `${SERVER}/api/admin/students?search=${encodeURIComponent(term)}&limit=10`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || data.data || []);
      }
    } catch {
      /* ignore */
    }
  };

  const submitCash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error("Select a student");
      return;
    }
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (feeType === "MONTHLY" && !month) {
      toast.error("Month is required for monthly fees");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/payments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          feeType,
          amount: num,
          sessionYear: year,
          month: feeType === "MONTHLY" ? month : undefined,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record payment");

      toast.success("Cash payment recorded");
      setAmount("");
      setNote("");
      setSelectedStudent(null);
      setStudentQuery("");
      setStudents([]);
      if (tab === "history") loadHistory();
      else setTab("history");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <Wallet className="h-5 w-5" />
            </span>
            Fees
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Record cash payments and view how students paid (Cash / SSLCommerz).
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        {(
          [
            { id: "record" as const, label: "Record cash", icon: Banknote },
            { id: "history" as const, label: "Payment history", icon: Receipt },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              tab === id
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Record cash */}
      {tab === "record" && (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submitCash}
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-md space-y-4 max-w-xl"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Plus className="h-4 w-4 text-indigo-600" />
            Record cash payment
          </div>
          <p className="text-xs text-slate-500">
            Method is fixed to <strong>Cash</strong>. Online pays appear under history as SSLCommerz.
          </p>

          <div className="relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Student
            </label>
            <input
              value={selectedStudent ? `${selectedStudent.name} (${selectedStudent.email})` : studentQuery}
              onChange={(e) => {
                setSelectedStudent(null);
                searchStudents(e.target.value);
              }}
              placeholder="Search name or email…"
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
              required={!selectedStudent}
            />
            {students.length > 0 && !selectedStudent && (
              <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-lg">
                {students.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStudent(s);
                        setStudents([]);
                        setStudentQuery("");
                      }}
                      className="w-full text-left px-3 py-2.5 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {s.name}
                      </span>
                      <span className="text-slate-500"> · {s.email}</span>
                      {s.studentClass && (
                        <span className="text-slate-400"> · {s.studentClass}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Fee type
              </label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="REGISTRATION">Registration</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            {feeType === "MONTHLY" && (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Month
                </label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Amount (৳)
            </label>
            <input
              type="number"
              min={1}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1600"
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/30"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Note (optional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Paid at office counter"
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Banknote className="h-4 w-4" />
            )}
            Save cash payment
          </button>
        </motion.form>
      )}

      {/* History */}
      {tab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadHistory()}
                placeholder="Search name, email, receipt…"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">All methods</option>
              <option value="CASH">Cash</option>
              <option value="BANK">Online / Bank</option>
            </select>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs font-semibold cursor-pointer"
            >
              <option>All Classes</option>
              {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
            <button
              type="button"
              onClick={loadHistory}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md">
            {loading ? (
              <div className="flex justify-center py-16">
                 <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : payments.length === 0 ? (
              <p className="py-14 text-center text-sm text-slate-500">
                No payments found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      {[
                        "Student",
                        "Class",
                        "Type",
                        "Amount",
                        "Method",
                        "Status",
                        "Receipt",
                        "Date",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {p.studentName}
                          </p>
                          <p className="text-[10px] text-slate-400">{p.studentEmail}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                          {p.studentClass}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                          {p.feeType}
                          {p.month ? ` · ${p.month}` : ""}
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-900 dark:text-white">
                          ৳{p.amount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                              displayMethod(p) === "Cash"
                                ? "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                            }`}
                          >
                            {displayMethod(p)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          {p.gatewayStatus || p.status}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-slate-500">
                          {p.receiptNo}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {new Date(p.paidAt).toLocaleDateString()}
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
    </div>
  );
}