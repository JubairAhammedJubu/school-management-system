"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Receipt,
  Loader2,
  Wallet,
} from "lucide-react";
import SubmitFeePaymentModal from "@/components/shared/SubmitFeePaymentModal";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

type FeeStatus = "PAID" | "PARTIAL" | "DUE";

type FeeData = {
  monthly: {
    month: string;
    paid: number;
    due: number;
    status: FeeStatus;
  };
  /** Extra structures admin created (not MONTHLY) — optional */
  otherFees?: {
    feeType: string;
    label: string;
    paid: number;
    due: number;
    status: FeeStatus;
  }[];
  history: any[];
  pendingClaims: any[];
};

export default function StudentFeePage() {
  
  function StatusPill({ status }: { status: FeeStatus }) {
    const map = {
      PAID: {
        icon: CheckCircle2,
        cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
        label: "Paid",
      },
      PARTIAL: {
        icon: AlertCircle,
        cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
        label: "Partial",
      },
      DUE: {
        icon: XCircle,
        cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
        label: "Due",
      },
    }[status];
    const Icon = map.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${map.cls}`}
      >
        <Icon className="h-3 w-3" />
        {map.label}
      </span>
    );
  }
  const [data, setData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    feeType: "MONTHLY" | "EXAM" | "REGISTRATION";
  } | null>(null);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/student/fees`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load fees");
      setData(json);
    } catch (e: any) {
      toast.error(e.message || "Could not load fees");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  if (loading) {
    return (
      <div className="p-5 sm:p-6 lg:p-8 space-y-6">
        <div className="h-8 w-48 rounded-lg skeleton-shimmer" />
        <div className="h-36 w-full rounded-2xl skeleton-shimmer" />
        <div className="h-48 w-full rounded-2xl skeleton-shimmer" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-5 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Could not load your fee information.
          </p>
          <button
            type="button"
            onClick={fetchFees}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { monthly } = data;
  const otherFees = data.otherFees || [];

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <Wallet className="h-5 w-5" />
            </span>
            My Fees
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monthly school fee status and payment history.
          </p>
        </div>
      </motion.div>

      {/* Monthly card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-md dark:shadow-xl dark:shadow-black/40"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Monthly fee · {monthly.month}
            </p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {monthly.due > 0
                ? `৳${monthly.paid} / ৳${monthly.due}`
                : `৳${monthly.paid}`}
            </p>
            <StatusPill status={monthly.status} />
          </div>

          <button
            type="button"
            disabled={monthly.status === "PAID"}
            onClick={() => setModal({ feeType: "MONTHLY" })}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <CreditCard className="h-4 w-4" />
            Submit payment
          </button>
        </div>
      </motion.div>

      {/* Extra fees admin added (registration / other) */}
      {otherFees.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md"
        >
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Other fees
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Added by school administration
            </p>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {otherFees.map((f) => (
              <li
                key={f.feeType}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {f.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ৳{f.paid} / ৳{f.due}
                  </p>
                  <div className="mt-1.5">
                    <StatusPill status={f.status} />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={f.status === "PAID"}
                  onClick={() =>
                    setModal({
                      feeType:
                        f.feeType === "REGISTRATION" ? "REGISTRATION" : "EXAM",
                    })
                  }
                  className="text-xs font-bold text-indigo-600 hover:underline disabled:opacity-40"
                >
                  Submit payment
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Pending */}
      {(data.pendingClaims || []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl border border-amber-200/80 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/10 overflow-hidden"
        >
          <div className="px-5 sm:px-6 py-4 border-b border-amber-200/60 dark:border-amber-500/15">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Pending review
            </h2>
          </div>
          <ul className="divide-y divide-amber-200/50 dark:divide-amber-500/10">
            {data.pendingClaims.map((c: any) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {c.feeType}
                    {c.month ? ` · ${c.month}` : ""} — ৳{c.amount}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {c.gateway || c.method}
                    {c.transactionRef ? ` · Trx ${c.transactionRef}` : ""}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-300/80 dark:border-amber-500/30 bg-white/80 dark:bg-slate-950/40 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  <Clock className="h-3 w-3" />
                  Awaiting
                </span>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* History */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md"
      >
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Payment history
          </h2>
        </div>

        {(data.history || []).length === 0 ? (
          <p className="px-5 sm:px-6 py-10 text-sm text-slate-500 dark:text-slate-400 text-center">
            No approved payments yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {["Receipt", "Type", "Amount", "Method", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.history.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                  >
                    <td className="px-5 sm:px-6 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">
                        <Receipt className="h-3.5 w-3.5 text-slate-400" />
                        {p.receiptNo}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {p.feeType}
                      {p.month ? ` (${p.month})` : ""}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      ৳{p.amount}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {p.gateway || p.method}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-500">
                      {new Date(p.paidAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>

      {modal && (
        <SubmitFeePaymentModal
          feeType={modal.feeType}
          onClose={() => setModal(null)}
          onSuccess={fetchFees}
        />
      )}
    </div>
  );
}
