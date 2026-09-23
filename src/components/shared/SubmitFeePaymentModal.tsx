"use client";

import { useState } from "react";
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
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

const METHODS = [
  { id: "bkash", label: "bKash", icon: Smartphone },
  { id: "nagad", label: "Nagad", icon: Smartphone },
  { id: "rocket", label: "Rocket", icon: Smartphone },
  { id: "upay", label: "Upay", icon: Smartphone },
  { id: "cash", label: "Cash", icon: Wallet },
];

/** Put real school wallet numbers here */
const SCHOOL_NUMBERS: Record<string, string> = {
  bkash: "01XXXXXXXXX",
  nagad: "01YYYYYYYYY",
  rocket: "01ZZZZZZZZZ",
  upay: "01WWWWWWWWW",
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

  const isCash = method === "cash";
  const needsPhone = ["bkash", "nagad", "rocket", "upay"].includes(method);

  const copyNumber = async () => {
    const num = SCHOOL_NUMBERS[method];
    if (!num) return;
    await navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // guard against double-submit

    if (needsPhone && !/^01\d{9}$/.test(phone.trim())) {
      toast.error("Phone must be 11 digits starting with 01", { toastId: "claim-phone-error" });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Submit Payment</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
              {feeType.toLowerCase()} fee
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form — now has an id so the footer button can be properly associated with it */}
        <form id="fee-claim-form" onSubmit={submit} className="px-5 py-4 space-y-4 overflow-y-auto">
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
                      setCashNote("");
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

          {/* School number to pay to */}
          {SCHOOL_NUMBERS[method] && (
            <div className="flex items-center justify-between rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-3.5 py-2.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-500 dark:text-indigo-400">
                  Pay to this {METHODS.find((m) => m.id === method)?.label} number
                </p>
                <p className="text-sm font-mono font-bold text-indigo-800 dark:text-indigo-300">
                  {SCHOOL_NUMBERS[method]}
                </p>
              </div>
              <button
                type="button"
                onClick={copyNumber}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}

          {/* Phone (MFS only) */}
          {needsPhone && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Your sender number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-sans outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          )}

          {/* TrxID (MFS) or cash note */}
          {needsPhone ? (
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
          ) : (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Payment note
              </label>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3 py-2">
                Cash has no TrxID — write who collected the money or the slip number.
              </p>
              <input
                value={cashNote}
                onChange={(e) => setCashNote(e.target.value.slice(0, 80))}
                placeholder="Received by Rahman · Slip #18"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          )}

          {/* Screenshot upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Screenshot <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3.5 py-3 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {file ? (
                  <ImageIcon className="h-4 w-4 text-indigo-500" />
                ) : (
                  <Upload className="h-4 w-4 text-slate-400" />
                )}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {file ? file.name : "Tap to upload proof of payment"}
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

        {/* Footer action — button is linked to the form via the "form" attribute
            instead of also having its own onClick, so only one submit path exists */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="submit"
            form="fee-claim-form"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit for review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}