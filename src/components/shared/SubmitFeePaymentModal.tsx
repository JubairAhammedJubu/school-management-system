"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  defaultFeeType?: "MONTHLY" | "EXAM" | "REGISTRATION";
  defaultExamId?: string;
  onClose: () => void;
  onSuccess: () => void;
};

const FEE_TYPES = ["MONTHLY", "EXAM", "REGISTRATION"] as const;
const METHODS = ["CASH", "BANK", "MOBILE_BANKING"] as const;

export default function SubmitFeePaymentModal({ defaultFeeType, defaultExamId, onClose, onSuccess }: Props) {
  const [feeType, setFeeType] = useState<(typeof FEE_TYPES)[number]>(defaultFeeType ?? "MONTHLY");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<(typeof METHODS)[number]>("MOBILE_BANKING");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [examId, setExamId] = useState(defaultExamId ?? "");
  const [transactionRef, setTransactionRef] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount", { toastId: "claim-amount-error" });
      return;
    }
    if (!transactionRef.trim()) {
      toast.error("Enter your transaction/reference ID", { toastId: "claim-ref-error" });
      return;
    }
    if (feeType === "EXAM" && !examId) {
      toast.error("Exam is required for an exam fee claim", { toastId: "claim-exam-error" });
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("feeType", feeType);
      form.append("amount", amount);
      form.append("method", method);
      form.append("sessionYear", new Date().getFullYear().toString());
      if (feeType === "MONTHLY") form.append("month", month);
      if (feeType === "EXAM") form.append("examId", examId);
      form.append("transactionRef", transactionRef);
      if (screenshot) form.append("screenshot", screenshot);

      const res = await fetch(`${serverUrl}/api/student/fees/claim`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to submit claim", { toastId: "claim-submit-error" });
        return;
      }

      toast.success("Payment claim submitted — awaiting admin review", { toastId: "claim-submit-success" });
      onSuccess();
    } catch (err) {
      toast.error("Something went wrong submitting your claim", { toastId: "claim-network-error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl bg-background border border-foreground/10 p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold">Submit Payment</h2>
            <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-foreground/60 mb-4">
            Pay via cash, bank, or mobile banking, then submit the reference here for admin verification.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground/60">Fee Type</label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value as any)}
                disabled={!!defaultFeeType}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm disabled:opacity-60"
              >
                {FEE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {feeType === "MONTHLY" && (
              <div>
                <label className="text-xs font-medium text-foreground/60">Month</label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
                />
              </div>
            )}

            {feeType === "EXAM" && !defaultExamId && (
              <div>
                <label className="text-xs font-medium text-foreground/60">Exam ID</label>
                <input
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  placeholder="Exam ID"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-foreground/60">Amount Paid</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground/60">Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>{m.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground/60">
                Transaction / Reference ID
              </label>
              <input
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. bKash TrxID, bank slip no."
                className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground/60">Screenshot (optional)</label>
              <label className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-foreground/20 text-sm text-foreground/60 cursor-pointer hover:border-foreground/40">
                <Upload className="w-4 h-4" />
                {screenshot ? screenshot.name : "Upload proof of payment"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-foreground/5"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}