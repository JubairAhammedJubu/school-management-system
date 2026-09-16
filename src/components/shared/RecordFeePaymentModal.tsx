"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  student: {
    id: string;
    name: string;
    studentClass: string;
  };
  onClose: () => void;
  onSuccess: () => void;
};

const FEE_TYPES = ["MONTHLY", "EXAM", "REGISTRATION", "OTHER"] as const;
const METHODS = ["CASH", "BANK", "MOBILE_BANKING"] as const;

export default function RecordFeePaymentModal({ student, onClose, onSuccess }: Props) {
  const [feeType, setFeeType] = useState<(typeof FEE_TYPES)[number]>("MONTHLY");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<(typeof METHODS)[number]>("CASH");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [examId, setExamId] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (feeType === "EXAM" && !examId) {
      toast.error("Exam ID is required for exam fee payments");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${serverUrl}/api/admin/fees/payments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          feeType,
          amount: Number(amount),
          method,
          sessionYear: new Date().getFullYear().toString(),
          month: feeType === "MONTHLY" ? month : undefined,
          examId: feeType === "EXAM" ? examId : undefined,
          note: note || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error(`Already recorded — receipt ${data.existingReceiptNo}`);
        } else {
          toast.error(data.error ?? "Failed to record payment");
        }
        return;
      }

      toast.success(`Payment recorded — receipt ${data.receiptNo}`);
      onSuccess();
    } catch (err) {
      toast.error("Something went wrong while recording the payment");
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
            <h2 className="text-lg font-heading font-semibold">Record Payment</h2>
            <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-foreground/60 mb-4">
            {student.name} · {student.studentClass}
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground/60">Fee Type</label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
              >
                {FEE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
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

            {feeType === "EXAM" && (
              <div>
                <label className="text-xs font-medium text-foreground/60">Exam ID</label>
                <input
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  placeholder="Paste the exam's ID"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-foreground/60">Amount</label>
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
                  <option key={m} value={m}>
                    {m.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground/60">Note (optional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. cheque no., reference"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
              />
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
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Payment"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}