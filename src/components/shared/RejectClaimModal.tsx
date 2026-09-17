"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  claimId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function RejectClaimModal({ claimId, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Enter a reason for rejection", { toastId: "reject-reason-required" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${serverUrl}/api/admin/fees/claims/${claimId}/reject`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to reject claim", { toastId: "reject-claim-error" });
        return;
      }

      toast.success("Claim rejected", { toastId: "reject-claim-success" });
      onSuccess();
    } catch (err) {
      toast.error("Something went wrong rejecting the claim", { toastId: "reject-claim-network-error" });
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
          className="w-full max-w-sm rounded-2xl bg-background border border-foreground/10 p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold">Reject Claim</h2>
            <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <label className="text-xs font-medium text-foreground/60">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Transaction ID doesn't match any received payment"
            className="w-full mt-1 px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm resize-none"
          />

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-foreground/5"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Rejecting..." : "Reject Claim"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}