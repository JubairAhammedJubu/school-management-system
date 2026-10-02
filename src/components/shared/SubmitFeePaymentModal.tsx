"use client";
import { API_BASE_URL } from "@/lib/api-url";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  X,
  Loader2,
  Smartphone,
  Wallet,
  Copy,
  Check,
  Upload,
  ImageIcon,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

const SERVER = API_BASE_URL || "";

type MethodConfig = {
  id: string;
  label: string;
  icon: any;
  activeBorderClass: string;
  activeBgClass: string;
  activeTextClass: string;
  ringClass: string;
  badge: string;
};

const METHODS: MethodConfig[] = [
  {
    id: "bkash",
    label: "bKash",
    icon: Smartphone,
    activeBorderClass: "border-pink-500",
    activeBgClass: "bg-pink-50/80 dark:bg-pink-500/10",
    activeTextClass: "text-pink-600 dark:text-pink-400",
    ringClass: "ring-2 ring-pink-500/20",
    badge: "Instant",
  },
  {
    id: "nagad",
    label: "Nagad",
    icon: Smartphone,
    activeBorderClass: "border-orange-500",
    activeBgClass: "bg-orange-50/80 dark:bg-orange-500/10",
    activeTextClass: "text-orange-600 dark:text-orange-400",
    ringClass: "ring-2 ring-orange-500/20",
    badge: "MFS",
  },
  {
    id: "rocket",
    label: "Rocket",
    icon: Smartphone,
    activeBorderClass: "border-purple-500",
    activeBgClass: "bg-purple-50/80 dark:bg-purple-500/10",
    activeTextClass: "text-purple-600 dark:text-purple-400",
    ringClass: "ring-2 ring-purple-500/20",
    badge: "DBBL",
  },
  {
    id: "upay",
    label: "Upay",
    icon: Smartphone,
    activeBorderClass: "border-cyan-500",
    activeBgClass: "bg-cyan-50/80 dark:bg-cyan-500/10",
    activeTextClass: "text-cyan-600 dark:text-cyan-400",
    ringClass: "ring-2 ring-cyan-500/20",
    badge: "UCB",
  },
  {
    id: "cash",
    label: "Cash",
    icon: Wallet,
    activeBorderClass: "border-emerald-500",
    activeBgClass: "bg-emerald-50/80 dark:bg-emerald-500/10",
    activeTextClass: "text-emerald-600 dark:text-emerald-400",
    ringClass: "ring-2 ring-emerald-500/20",
    badge: "Manual",
  },
];

/** School MFS merchant / personal numbers */
const SCHOOL_NUMBERS: Record<string, string> = {
  bkash: "01310203040",
  nagad: "01310203040",
  rocket: "01310203040",
  upay: "01310203040",
};

// Standard BD MFS TrxID format: exactly 10 alphanumeric characters, e.g. 8N7A5B3C2D
const TRX_PATTERN = /^[A-Z0-9]{10}$/;

function monthKey() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

type Props = {
  feeType: "MONTHLY" | "EXAM" | "REGISTRATION";
  examId?: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function SubmitFeePaymentModal({ feeType, examId, onClose, onSuccess }: Props) {
  const [method, setMethod] = useState("bkash");
  const [phone, setPhone] = useState("");
  const [trx, setTrx] = useState("");
  const [cashNote, setCashNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentMethod = METHODS.find((m) => m.id === method) || METHODS[0];
  const isCash = method === "cash";
  const needsPhone = ["bkash", "nagad", "rocket", "upay"].includes(method);

  const copyNumber = async () => {
    const num = SCHOOL_NUMBERS[method];
    if (!num) return;
    await navigator.clipboard.writeText(num.replace(/\D/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, "");
    if (digits.length > 0) {
      if (!digits.startsWith("0")) {
        digits = "01" + digits;
      } else if (digits.length >= 2 && !digits.startsWith("01")) {
        digits = "01" + digits.slice(1);
      }
    }
    setPhone(digits.slice(0, 11));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // guard against double-submit

    if (needsPhone && (!phone.trim().startsWith("01") || phone.trim().length !== 11)) {
      toast.error("Phone number must be 11 digits starting with 01", { toastId: "claim-phone-error" });
      return;
    }
    if (needsPhone && !TRX_PATTERN.test(trx.trim())) {
      toast.error("TrxID must be exactly 10 letters/numbers, e.g. 8N7A5B3C2D", { toastId: "claim-trx-error" });
      return;
    }
    if (isCash && cashNote.trim().length < 3) {
      toast.error("Add a short note — who collected it or a slip number", { toastId: "claim-note-error" });
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("feeType", feeType);
      form.append("method", method);
      form.append("sessionYear", new Date().getFullYear().toString());
      form.append("transactionRef", isCash ? cashNote.trim() : trx.trim());
      if (needsPhone) form.append("senderPhone", phone.trim());
      if (feeType === "MONTHLY") form.append("month", monthKey());
      if (feeType === "EXAM" && examId) form.append("examId", examId);
      if (file) form.append("screenshot", file);

      const res = await fetch(`${SERVER}/api/student/fees/claim`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error("Server returned invalid response");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");

      toast.success("Submitted — waiting for admin review", { toastId: "claim-submit-success" });
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed", { toastId: "claim-submit-error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Submit Fee Payment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {feeType.toLowerCase()} fee claim
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form id="fee-claim-form" onSubmit={submit} className="px-5 py-4 space-y-4 overflow-y-auto">
          {/* Method — interactive icon chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Payment method
              </label>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                Select your provider
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
                      setCashNote("");
                    }}
                    className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 py-3 px-1 transition-all cursor-pointer ${active
                      ? `${m.activeBorderClass} ${m.activeBgClass} ${m.ringClass}`
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${active ? m.activeTextClass : "text-slate-400 dark:text-slate-500"
                        }`}
                    />
                    <span
                      className={`text-xs font-bold ${active ? m.activeTextClass : "text-slate-600 dark:text-slate-300"
                        }`}
                    >
                      {m.label}
                    </span>
                    {active && (
                      <span className="absolute -top-1.5 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* School number display (MFS only) */}
          {SCHOOL_NUMBERS[method] && (
            <div className={`flex items-center justify-between rounded-xl border px-3.5 py-3 transition-colors ${currentMethod.activeBorderClass}/40 ${currentMethod.activeBgClass}`}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  School Merchant Number ({currentMethod.label})
                </p>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  {SCHOOL_NUMBERS[method]}
                </p>
              </div>
              <button
                type="button"
                onClick={copyNumber}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Sender Phone (MFS only) */}
          {needsPhone && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your Mobile Number <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono font-medium ${phone.length === 11 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"
                    }`}
                >
                  {phone.length}/11 digits
                </span>
              </div>
              <input
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={11}
                placeholder="e.g. 017XXXXXXXX"
                className={`w-full rounded-xl border ${
                  phone.length === 11 && phone === (SCHOOL_NUMBERS[method] || "").replace(/\D/g, "")
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/10"
                } bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-4 transition-all`}
              />
              {phone.length === 11 && phone === (SCHOOL_NUMBERS[method] || "").replace(/\D/g, "") && (
                <p className="text-[11px] font-medium text-rose-500">
                  Sender number cannot be identical to the school merchant number.
                </p>
              )}
            </div>
          )}

          {/* TrxID (MFS) or Cash Note */}
          {needsPhone ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Transaction ID (TrxID) <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono font-medium ${trx.length === 10 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"
                    }`}
                >
                  {trx.length}/10 chars
                </span>
              </div>
              <input
                value={trx}
                onChange={(e) => setTrx(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 10))}
                maxLength={10}
                placeholder="e.g. 8N7A5B3C2D"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-mono font-bold tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Payment Collector Note / Slip # <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3.5 py-2">
                Cash has no TrxID — specify who collected your cash or provide the printed receipt slip number.
              </p>
              <input
                value={cashNote}
                onChange={(e) => setCashNote(e.target.value.slice(0, 80))}
                placeholder="e.g. Paid cash to Mr. Rahman (Slip #1042)"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          )}

          {/* Screenshot upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Payment Proof Screenshot</span>
              <span className="font-normal text-slate-400 text-[11px]">(Optional)</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 px-3.5 py-3 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {file ? (
                  <ImageIcon className="h-4 w-4 text-indigo-500" />
                ) : (
                  <Upload className="h-4 w-4 text-slate-400" />
                )}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {file ? file.name : "Attach screenshot or photo of transaction"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
        </form>

        {/* Footer action */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
          <button
            type="submit"
            form="fee-claim-form"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting Claim...
              </>
            ) : (
              "Submit Payment Claim"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}