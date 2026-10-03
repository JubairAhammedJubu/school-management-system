"use client";
import { API_BASE_URL } from "@/lib/api-url";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  X,
  Loader2,
  Smartphone,
  Wallet,
  Search,
  GraduationCap,
  ChevronDown,
  Check,
  Calendar,
  FileText,
  BookOpen,
} from "lucide-react";

const SERVER = API_BASE_URL || "";

const METHODS = [
  { id: "bkash", label: "bKash", icon: Smartphone },
  { id: "nagad", label: "Nagad", icon: Smartphone },
  { id: "rocket", label: "Rocket", icon: Smartphone },
  { id: "upay", label: "Upay", icon: Smartphone },
  { id: "cash", label: "Cash", icon: Wallet },
];

const FEE_TYPE_OPTIONS = [
  {
    value: "MONTHLY",
    label: "Monthly Fee",
    sublabel: "Regular monthly tuition fee",
    icon: Calendar,
  },
  {
    value: "REGISTRATION",
    label: "Registration Fee",
    sublabel: "Admission & annual registration",
    icon: FileText,
  },
  {
    value: "EXAM",
    label: "Exam Fee",
    sublabel: "Term examination fee",
    icon: BookOpen,
  },
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

function NiceSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
}: {
  value: string;
  onChange: (val: string) => void;
  options: typeof FEE_TYPE_OPTIONS;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white transition-all cursor-pointer shadow-xs focus:ring-2 focus:ring-indigo-500/20"
      >
        <div className="flex items-center gap-2 truncate">
          {selected?.icon && (
            <selected.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          )}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-1.5 z-40 max-h-56 overflow-y-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 shadow-xl backdrop-blur-xl space-y-1"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="h-4 w-4 text-indigo-500 shrink-0" />
                      <div className="truncate">
                        <span className="block font-bold truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="block text-[10px] text-slate-400 font-normal truncate">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RecordPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  presetStudent,
}: Props) {
  const year = new Date().getFullYear().toString();
  const month = monthKey();

  const [q, setQ] = useState("");
  const [hits, setHits] = useState<any[]>([]);
  const [studentId, setStudentId] = useState(presetStudent?.id || "");
  const [studentLabel, setStudentLabel] = useState(
    presetStudent
      ? `${presetStudent.name} (${presetStudent.studentClass || "—"})`
      : ""
  );
  const [feeType, setFeeType] = useState("MONTHLY");
  const [method, setMethod] = useState("bkash");
  const [trx, setTrx] = useState("");
  const [receiptNote, setReceiptNote] = useState("");
  const [loading, setLoading] = useState(false);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                  <Wallet className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Record Payment
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submit} className="px-5 py-4 space-y-4 overflow-y-auto">
              {/* Student search */}
              <div className="relative space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Student
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={studentLabel || q}
                    onChange={(e) => searchStudents(e.target.value)}
                    placeholder="Search name or email..."
                    disabled={Boolean(presetStudent)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-70"
                  />
                </div>
                {hits.length > 0 && !studentId && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl max-h-40 overflow-auto p-1">
                    {hits.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors cursor-pointer font-medium"
                        onClick={() => {
                          setStudentId(s.id);
                          setStudentLabel(`${s.name} (${s.studentClass || "—"})`);
                          setHits([]);
                        }}
                      >
                        <GraduationCap className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span>
                          {s.name} <span className="text-slate-400 font-normal">· {s.email}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fee type with NiceSelect */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Fee type
                </label>
                <NiceSelect
                  value={feeType}
                  onChange={setFeeType}
                  options={FEE_TYPE_OPTIONS}
                />
              </div>

              {/* Method — icon chips */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                        className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 py-3 transition-all cursor-pointer ${
                          active
                            ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                          }`}
                        />
                        <span className="text-xs font-bold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TrxID (MFS) or receipt note (cash) */}
              {isCash ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Receipt note
                  </label>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3.5 py-2 font-medium">
                    Cash has no TrxID — note the slip number or which office collected it.
                  </p>
                  <input
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value.slice(0, 80))}
                    placeholder="Slip #42 · Grade 8 front office"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Transaction ID
                  </label>
                  <input
                    value={trx}
                    onChange={(e) =>
                      setTrx(e.target.value.replace(/\s/g, "").toUpperCase().slice(0, 10))
                    }
                    maxLength={10}
                    placeholder="e.g. 8N7A5B3C2D"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-sans dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                  <p
                    className={`text-[11px] font-semibold ${
                      trx.length === 10
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
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
                className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}