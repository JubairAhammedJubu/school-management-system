"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {  
  CreditCard, 
  Search, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  DollarSign,
  Receipt,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Wallet
} from "lucide-react";

export default function AdminFeesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  if (isPending) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (!session?.user || rawRole !== "admin") {
    return null;
  }

  // Enhanced fee records data with payment method and breakdown details
  const feeRecords = [
    { id: "INV-2026-001", student: "Tanvir Ahmed", class: "Grade 10 A", type: "Tuition Fee (Aug)", amount: "$450", rawAmount: 450, date: "Aug 25, 2026", method: "Online Gateway", status: "Paid" },
    { id: "INV-2026-002", student: "Sadia Sultana", class: "Grade 9 B", type: "Lab Fee", amount: "$120", rawAmount: 120, date: "Aug 24, 2026", method: "Cash (Office)", status: "Paid" },
    { id: "INV-2026-003", student: "Rakibul Hasan", class: "Grade 8 A", type: "Tuition Fee (Aug)", amount: "$400", rawAmount: 400, date: "Due Aug 31", method: "Unpaid", status: "Pending" },
    { id: "INV-2026-004", student: "Nusrat Jahan", class: "Grade 10 B", type: "Library Fee", amount: "$50", rawAmount: 50, date: "Aug 22, 2026", method: "Bank Transfer", status: "Paid" },
    { id: "INV-2026-005", student: "Imran Khan", class: "Grade 7 C", type: "Sports Fee", amount: "$75", rawAmount: 75, date: "Due Aug 15", method: "Unpaid", status: "Overdue" },
  ];

  // Filtering logic based on search term and selected status tab
  const filteredFees = feeRecords.filter((record) => {
    const matchesSearch = 
      record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "All" || record.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate quick summary metrics
  const totalCollectedAmount = feeRecords
    .filter(r => r.status === "Paid")
    .reduce((acc, curr) => acc + curr.rawAmount, 0);

  const totalPendingAmount = feeRecords
    .filter(r => r.status === "Pending" || r.status === "Overdue")
    .reduce((acc, curr) => acc + curr.rawAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
            ADMIN FINANCE HUB
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Fee &amp; Payment Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor revenue streams, track paid/unpaid invoices, and handle financial records.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/fees/collect")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Collect Fee / Invoice
        </button>
      </motion.div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Collected (Aug)</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">${totalCollectedAmount}</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% from last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending / Overdue Dues</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">${totalPendingAmount}</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
              <Clock className="w-3 h-3" /> Requires attention
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Invoices Generated</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{feeRecords.length} Active</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-1">
              <ShieldCheck className="w-3 h-3" /> 100% Secure Logs
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Status Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, class or invoice ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all shadow-sm backdrop-blur-xl"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["All", "Paid", "Pending", "Overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border shadow-sm shrink-0 ${
                selectedStatus === status
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Fees Transactions Table Section */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fee Transactions &amp; Invoices</h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing: <strong className="text-emerald-600 dark:text-emerald-400">{filteredFees.length}</strong> entries
          </span>
        </div>

        {filteredFees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:px-6">Invoice &amp; Student</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Fee Type &amp; Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-sm">
                {filteredFees.map((record, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{record.student}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{record.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-slate-600 dark:text-slate-300">
                      {record.class}
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{record.type}</p>
                      <span className="inline-block mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Via: {record.method}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {record.amount}
                    </td>

                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {record.date}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        record.status === "Paid" 
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40" 
                          : record.status === "Pending"
                          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40"
                          : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40"
                      }`}>
                        {record.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button 
                        onClick={() => router.push(`/admin/fees/${record.id}`)}
                        className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer shadow-sm inline-flex items-center justify-center" 
                        title="View Fee Details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Invoices Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              We couldn't find any fee transactions matching your search term or status filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}