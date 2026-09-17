"use client";

import { useState } from "react";
import { X, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

type Props = {
  isOpen: boolean;
  claimId: string | null;
  studentName?: string;
  amount?: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function VerifyPaymentModal({
  isOpen,
  claimId,
  studentName,
  amount,
  onClose,
  onSuccess,
}: Props) {
  const [trx, setTrx] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !claimId) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trx.trim().length < 5) {
      toast.error("Enter the TrxID from your payment statement");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${SERVER}/api/admin/fees/claims/${claimId}/verify`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionRef: trx.trim() }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      toast.success("Payment verified");
      setTrx("");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "TrxID does not match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Verify payment
              </h3>
              <p className="text-[11px] text-slate-500">
                Enter TrxID from your bKash/Nagad statement
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={loading}>
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {(studentName || amount != null) && (
          <div className="mb-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-xs">
            {studentName && (
              <p>
                <span className="text-slate-500">Student:</span>{" "}
                <strong>{studentName}</strong>
              </p>
            )}
            {amount != null && (
              <p>
                <span className="text-slate-500">Amount:</span>{" "}
                <strong>৳{amount}</strong>
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-400">
              Student TrxID is hidden. Match it by entering the ID from your
              account history.
            </p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              TrxID
            </label>
            <input
              value={trx}
              onChange={(e) => setTrx(e.target.value.trim())}
              placeholder="Paste TrxID from statement"
              autoComplete="off"
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Verify & approve
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}