"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  X,
  Loader2,
  Smartphone,
  Wallet,
  Search,
  GraduationCap,
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

const METHODS = [
  { id: "bkash", label: "bKash", icon: Smartphone },
  { id: "nagad", label: "Nagad", icon: Smartphone },
  { id: "rocket", label: "Rocket", icon: Smartphone },
  { id: "upay", label: "Upay", icon: Smartphone },
  { id: "cash", label: "Cash", icon: Wallet },
];

// Standard BD MFS TrxID format: exactly 10 alphanumeric characters
const TRX_PATTERN = /^[A-Z0-9]{10}$/;

function monthKey() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** Optional: pre-select student from roster */
  presetStudent?: { id: string; name: string; studentClass?: string | null };
};

export default function RecordPaymentModal({ isOpen, onClose, onSuccess, presetStudent }: Props) {
  const year = new Date().getFullYear().toString();
  const month = monthKey();

  const [q, setQ] = useState("");
  const [hits, setHits] = useState<any[]>([]);
  const [studentId, setStudentId] = useState(presetStudent?.id || "");
  const [studentLabel, setStudentLabel] = useState(
    presetStudent ? `${presetStudent.name} (${presetStudent.studentClass || "—"})` : ""
  );
  const [feeType, setFeeType] = useState("MONTHLY");
  const [method, setMethod] = useState("bkash");
  const [trx, setTrx] = useState("");
  const [receiptNote, setReceiptNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isCash = method === "cash";

  const searchStudents = async (text: string) => {
    setQ(text);
    setStudentId("");
    setStudentLabel("");
    if (text.trim().length < 2) return setHits([]);
    try {
      const res = await fetch(
        `${SERVER}/api/teacher/students?search=${encodeURIComponent(text)}&limit=8`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) setHits(data.students || []);
    } catch {
      /* ignore */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      toast.error("Select a student");
      return;
    }
    if (!isCash && !TRX_PATTERN.test(trx.trim())) {
      toast.error("TrxID must be exactly 10 letters/numbers, e.g. 8N7A5B3C2D");
      return;
    }
    if (isCash && receiptNote.trim().length < 3) {
      toast.error("Add a short receipt note, e.g. a slip number or office name");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/payments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          feeType,
          method,
          transactionRef: isCash ? receiptNote.trim() : trx.trim(),
          sessionYear: year,
          ...(feeType === "MONTHLY" ? { month } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record payment");

      toast.success(`Saved · ${data.payment?.receiptNo || "OK"}`);
      setTrx("");
      setReceiptNote("");
      setQ("");
      if (!presetStudent) {
        setStudentId("");
        setStudentLabel("");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Record Payment</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="px-5 py-4 space-y-4 overflow-y-auto">
          {/* Student search */}
          <div className="relative space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                value={studentLabel || q}
                onChange={(e) => searchStudents(e.target.value)}
                placeholder="Search name or email"
                disabled={Boolean(presetStudent)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-70"
              />
            </div>
            {hits.length > 0 && !studentId && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg max-h-40 overflow-auto">
                {hits.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => {
                      setStudentId(s.id);
                      setStudentLabel(`${s.name} (${s.studentClass || "—"})`);
                      setHits([]);
                    }}
                  >
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>
                      {s.name} <span className="text-slate-400">· {s.email}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fee type */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Fee type</label>
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white outline-none cursor-pointer focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="REGISTRATION">Registration</option>
              <option value="EXAM">Exam</option>
            </select>
          </div>

          {/* Method — icon chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Payment method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setMethod(m.id);
                      setTrx("");
                      setReceiptNote("");
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 transition-all cursor-pointer ${
                      active
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        active ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TrxID (MFS) or receipt note (cash) */}
          {isCash ? (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Receipt note
              </label>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3 py-2">
                Cash has no TrxID — note the slip number or which office collected it.
              </p>
              <input
                value={receiptNote}
                onChange={(e) => setReceiptNote(e.target.value.slice(0, 80))}
                placeholder="Slip #42 · Grade 8 front office"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Transaction ID
              </label>
              <input
                value={trx}
                onChange={(e) => setTrx(e.target.value.replace(/\s/g, "").toUpperCase().slice(0, 10))}
                maxLength={10}
                placeholder="e.g. 8N7A5B3C2D"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-mono font-semibold tracking-wider text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-sans dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
              <p
                className={`text-xs ${
                  trx.length === 10 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {trx.length}/10 characters
              </p>
            </div>
          )}
        </form>

        {/* Footer action */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            onClick={submit}
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save as paid"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}