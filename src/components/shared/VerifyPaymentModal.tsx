"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const showModal = isOpen && Boolean(claimId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trx.trim().length !== 10) {
      toast.error("Transaction ID must be exactly 10 characters, e.g. 8N7A5B3C2D");
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
    <AnimatePresence>
      {showModal && (
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
            className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verify payment
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enter TrxID from your bKash/Nagad statement
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(studentName || amount != null) && (
              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 text-xs space-y-1">
                {studentName && (
                  <p className="text-slate-700 dark:text-slate-200">
                    <span className="text-slate-500 font-medium">Student:</span>{" "}
                    <strong>{studentName}</strong>
                  </p>
                )}
                {amount != null && (
                  <p className="text-slate-700 dark:text-slate-200">
                    <span className="text-slate-500 font-medium">Amount:</span>{" "}
                    <strong>৳{amount}</strong>
                  </p>
                )}
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium pt-1">
                  Match student submission with your transaction records.
                </p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Transaction ID (TrxID)
                  </label>
                  <span
                    className={`text-[11px] font-mono font-medium ${
                      trx.length === 10 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"
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
                  autoComplete="off"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 uppercase transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}