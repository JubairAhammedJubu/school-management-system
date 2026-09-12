"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
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
  Wallet,
  X,
  CheckCircle2,
  Printer
} from "lucide-react";

interface FeeRecord {
  id: string;
  student: string;
  class: string;
  type: string;
  amount: string;
  rawAmount: number;
  date: string;
  method: string;
  status: "Paid" | "Pending" | "Partially Paid" | "Overdue";
}

export default function AdminFeesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([
    { id: "INV-2026-001", student: "Tanvir Ahmed", class: "Grade 10 A", type: "Tuition Fee (Aug)", amount: "$450", rawAmount: 450, date: "Aug 25, 2026", method: "Online Gateway", status: "Paid" },
    { id: "INV-2026-002", student: "Sadia Sultana", class: "Grade 9 B", type: "Lab Fee", amount: "$120", rawAmount: 120, date: "Aug 24, 2026", method: "Cash (Office)", status: "Paid" },
    { id: "INV-2026-003", student: "Rakibul Hasan", class: "Grade 8 A", type: "Tuition Fee (Aug)", amount: "$400", rawAmount: 400, date: "Due Aug 31", method: "Unpaid", status: "Pending" },
    { id: "INV-2026-004", student: "Nusrat Jahan", class: "Grade 10 B", type: "Library Fee", amount: "$50", rawAmount: 50, date: "Aug 22, 2026", method: "Bank Transfer", status: "Paid" },
    { id: "INV-2026-005", student: "Imran Khan", class: "Grade 7 C", type: "Sports Fee", amount: "$75", rawAmount: 75, date: "Due Aug 15", method: "Unpaid", status: "Overdue" },
  ]);

  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);

  // New Invoice form state
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [feeType, setFeeType] = useState("Tuition Fee");
  const [amountVal, setAmountVal] = useState("350");
  const [paymentMethod, setPaymentMethod] = useState("Cash (Office)");
  const [statusVal, setStatusVal] = useState<"Paid" | "Pending" | "Partially Paid">("Paid");

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentClass.trim()) {
      toast.error("Please fill in student name and class.");
      return;
    }

    const numAmt = parseFloat(amountVal) || 0;
    const newRecord: FeeRecord = {
      id: `INV-2026-00${feeRecords.length + 1}`,
      student: studentName.trim(),
      class: studentClass.trim(),
      type: feeType,
      amount: `$${numAmt}`,
      rawAmount: numAmt,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      method: statusVal === "Paid" ? paymentMethod : "Unpaid",
      status: statusVal,
    };

    setFeeRecords((prev) => [newRecord, ...prev]);
    toast.success(`Fee invoice ${newRecord.id} recorded!`);
    setShowCollectModal(false);
    setStudentName("");
    setStudentClass("");
  };

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

  const filteredFees = feeRecords.filter((record) => {
    const matchesSearch = 
      record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "All" || record.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

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
          onClick={() => setShowCollectModal(true)}
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

      {/* Search & Status Filter Bar */}
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
          {["All", "Paid", "Pending", "Partially Paid", "Overdue"].map((status) => (
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
                          : record.status === "Partially Paid"
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40"
                          : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40"
                      }`}>
                        {record.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedRecord(record)}
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
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Invoices Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              We couldn't find any fee transactions matching your search term.
            </p>
          </div>
        )}
      </div>

      {/* Collect Fee Modal */}
      <AnimatePresence>
        {showCollectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setShowCollectModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" /> Record Fee Collection / Invoice
              </h3>

              <form onSubmit={handleCreateInvoice} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mahfuzur Rahman"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Class
                    </label>
                    <input
                      type="text"
                      placeholder="Grade 10 A"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      placeholder="350"
                      value={amountVal}
                      onChange={(e) => setAmountVal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Cash (Office)">Cash (Office)</option>
                      <option value="Online Gateway">Online Gateway</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Status
                    </label>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value as "Paid" | "Pending")}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCollectModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                  >
                    Save Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Details Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Invoice Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {selectedRecord.id}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-y border-slate-100 dark:border-slate-800 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.student}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Type:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{selectedRecord.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status &amp; Method:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.status} ({selectedRecord.method})</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const printWin = window.open("", "_blank");
                    if (printWin) {
                      printWin.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Fee_Receipt_${selectedRecord.id}</title>
                            <style>
                              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0f172a; background: #f8fafc; margin: 0; }
                              .card { background: #ffffff; border: 2px solid #e2e8f0; border-radius: 24px; padding: 36px; max-width: 600px; margin: 0 auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }
                              .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 24px; margin-bottom: 24px; }
                              .brand { font-size: 24px; font-weight: 900; color: #059669; }
                              .sub { font-size: 13px; color: #64748b; margin-top: 4px; }
                              .stamp { background: #dcfce7; color: #15803d; border: 1px solid #86efac; padding: 6px 16px; border-radius: 99px; font-weight: 800; font-size: 12px; text-transform: uppercase; }
                              .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
                              .label { color: #64748b; font-weight: 600; }
                              .value { font-weight: 700; color: #0f172a; }
                              .total { display: flex; justify-content: space-between; padding: 16px 0; margin-top: 16px; border-top: 2px solid #0f172a; font-size: 18px; font-weight: 900; }
                              .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; }
                            </style>
                          </head>
                          <body>
                            <div class="card">
                              <div class="header">
                                <div>
                                  <div class="brand">🎓 EduNexus Smart Campus</div>
                                  <div class="sub">Official Payment Receipt &amp; Invoice</div>
                                </div>
                                <div class="stamp">${selectedRecord.status}</div>
                              </div>
                              <div class="row"><span class="label">Invoice ID:</span><span class="value">${selectedRecord.id}</span></div>
                              <div class="row"><span class="label">Student Name:</span><span class="value">${selectedRecord.student}</span></div>
                              <div class="row"><span class="label">Class / Grade:</span><span class="value">${selectedRecord.class}</span></div>
                              <div class="row"><span class="label">Fee Particulars:</span><span class="value">${selectedRecord.type}</span></div>
                              <div class="row"><span class="label">Payment Mode:</span><span class="value">${selectedRecord.method}</span></div>
                              <div class="row"><span class="label">Payment Date:</span><span class="value">${selectedRecord.date}</span></div>
                              <div class="total"><span>Total Paid Amount:</span><span style="color: #059669;">${selectedRecord.amount}</span></div>
                              <div class="footer"><p>Official Computer Generated Payment Document • EduNexus Admin Hub</p></div>
                            </div>
                            <script>
                              window.onload = function() { window.print(); };
                            </script>
                          </body>
                        </html>
                      `);
                      printWin.document.close();
                    }
                    toast.success("PDF receipt window launched!");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Download PDF Receipt
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}