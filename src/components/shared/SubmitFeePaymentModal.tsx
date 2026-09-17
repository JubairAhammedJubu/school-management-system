"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { X, Loader2 } from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

const METHODS = [
  { id: "bkash", label: "bKash" },
  { id: "nagad", label: "Nagad" },
  { id: "rocket", label: "Rocket" },
  { id: "upay", label: "Upay" },
  { id: "bank", label: "Bank" },
  { id: "cash", label: "Cash" },
];

/** Put real school wallet numbers here */
const SCHOOL_NUMBERS: Record<string, string> = {
  bkash: "01XXXXXXXXX",
  nagad: "01YYYYYYYYY",
  rocket: "01ZZZZZZZZZ",
  upay: "01WWWWWWWWW",
};

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

export default function SubmitFeePaymentModal({
  feeType,
  examId,
  onClose,
  onSuccess,
}: Props) {
  const [method, setMethod] = useState("bkash");
  const [phone, setPhone] = useState("");
  const [trx, setTrx] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const needsPhone = ["bkash", "nagad", "rocket", "upay"].includes(method);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (needsPhone && !/^01\d{9}$/.test(phone.trim())) {
      toast.error("Phone must be 11 digits starting with 01");
      return;
    }
    if (trx.trim().length < 5) {
      toast.error("Enter a valid TrxID");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("feeType", feeType);
      form.append("method", method);
      form.append("sessionYear", new Date().getFullYear().toString());
      form.append("transactionRef", trx.trim());
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
      if (!ct.includes("application/json")) {
        throw new Error("Server returned invalid response");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");

      toast.success("Submitted — waiting for admin review");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold">Submit payment</h3>
            <p className="text-xs text-slate-500">{feeType}</p>
          </div>
          <button type="button" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-bold">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              {METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {SCHOOL_NUMBERS[method] && (
            <p className="text-xs rounded-xl bg-indigo-50 dark:bg-indigo-500/10 px-3 py-2">
              Pay to <strong className="font-mono">{SCHOOL_NUMBERS[method]}</strong>
            </p>
          )}

          {needsPhone && (
            <div>
              <label className="text-xs font-bold">Your sender number</label>
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                }
                placeholder="01XXXXXXXXX"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold">TrxID</label>
            <input
              value={trx}
              onChange={(e) => setTrx(e.target.value.trim())}
              placeholder="Transaction ID"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold">Screenshot (optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 w-full text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white disabled:opacity-50 inline-flex items-center justify-center gap-2"
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
        </form>
      </div>
    </div>
  );
}