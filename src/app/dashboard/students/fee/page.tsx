"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Sparkles, CheckCircle2, Clock3 } from "lucide-react";

interface FeeRecord {
  term: string;
  description: string;
  amount: string;
  dueDate: string;
  status: "paid" | "due";
}

const feeRecords: FeeRecord[] = [
  { term: "Term 1", description: "Tuition Fee", amount: "$450", dueDate: "Jul 10, 2026", status: "paid" },
  { term: "Term 1", description: "Library Fee", amount: "$20", dueDate: "Jul 10, 2026", status: "paid" },
  { term: "Term 2", description: "Tuition Fee", amount: "$450", dueDate: "Sep 10, 2026", status: "due" },
  { term: "Term 2", description: "Lab Fee", amount: "$70", dueDate: "Sep 10, 2026", status: "due" },
  { term: "Term 2", description: "Sports Fee", amount: "$30", dueDate: "Sep 10, 2026", status: "due" },
];

const statusStyles: Record
  FeeRecord["status"],
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  paid: {
    label: "Paid",
    className:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    icon: CheckCircle2,
  },
  due: {
    label: "Due",
    className:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
    icon: Clock3,
  },
};

export default function StudentFeesPage() {
  const totalDue = feeRecords
    .filter((f) => f.status === "due")
    .reduce((sum, f) => sum + Number(f.amount.replace("$", "")), 0);
  const totalPaid = feeRecords
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + Number(f.amount.replace("$", "")), 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 p-6 sm:p-8 text-slate-900 dark:text-white shadow-xs transition-colors duration-300"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-2xs shrink-0">
            <CreditCard className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <Sparkles className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                Student Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              Fees
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              View your fee dues and payment history.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors duration-300"
        >
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Total Paid
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
            ${totalPaid}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors duration-300"
        >
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Total Due
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 mt-1">
            ${totalDue}
          </p>
        </motion.div>
      </div>

      {/* Fee Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors duration-300 overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Fee Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Term
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Description
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Amount
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Due Date
                </th>
                <th className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map((row, idx) => {
                const style = statusStyles[row.status];
                const StatusIcon = style.icon;
                return (
                  <tr
                    key={`${row.description}-${idx}`}
                    className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                  >
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {row.term}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {row.description}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {row.amount}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {row.dueDate}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {style.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}