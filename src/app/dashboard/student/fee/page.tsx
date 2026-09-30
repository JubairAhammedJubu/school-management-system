"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Receipt,
  Wallet,
  RefreshCw,
  Download,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useSession } from "@/lib/auth-client";
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

function HistoryTableSkeleton() {
  return (
    <div className="overflow-x-auto p-5 sm:p-6 animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0 gap-4"
          >
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentFeePage() {
  const { data: session } = useSession();
  const [data, setData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modal, setModal] = useState<{
    feeType: "MONTHLY" | "EXAM" | "REGISTRATION";
  } | null>(null);

  const fetchFees = useCallback(async (refresh = false) => {
    setLoading(true);
    if (refresh) setIsRefreshing(true);
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
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

function numberToWords(amount: number): string {
  const num = Math.floor(Math.abs(amount));
  if (num === 0) return "Zero Taka Only";

  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convert(n: number): string {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
    if (n < 1000) return units[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  }

  return `${convert(num)} Taka Only`;
}

  const handleDownloadReceipt = (payment: any) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const studentName = session?.user?.name || "Student";
      const studentEmail = session?.user?.email || "N/A";
      const studentClass = (session?.user as any)?.studentClass || (session?.user as any)?.class || "N/A";
      const studentSection = (session?.user as any)?.studentSection || (session?.user as any)?.section || "";
      const studentRoll = (session?.user as any)?.roll || (session?.user as any)?.studentId || "N/A";

      const formattedDate = payment.paidAt
        ? new Date(payment.paidAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

      const issueTime = payment.paidAt
        ? new Date(payment.paidAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      // Palette
      const darkNavy = [15, 23, 42]; // #0f172a
      const primaryIndigo = [79, 70, 229]; // #4f46e5
      const secondaryIndigo = [67, 56, 202]; // #4338ca
      const mutedText = [100, 116, 139]; // #64748b
      const lightBg = [248, 250, 252]; // #f8fafc
      const borderSlate = [226, 232, 240]; // #e2e8f0
      const emeraldGreen = [16, 185, 129]; // #10b981
      const emeraldBg = [236, 253, 245]; // #ecfdf5

      // 1. TOP HEADER BANNER (y: 0 to 46)
      doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.rect(0, 0, 210, 46, "F");

      // Accent strip
      doc.setFillColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      doc.rect(0, 44, 210, 2, "F");

      // Header Brand Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("EduNexus Academy", 14, 20);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(203, 213, 225); // Slate 300
      doc.text("Excellence in Academic Management & Learning", 14, 26);
      doc.text("School Road, Dhaka-1212, Bangladesh | Support: +880 1326-107950", 14, 31);
      doc.text("Email: accounts@edunexus.edu.bd | Web: www.edunexus.edu.bd", 14, 36);

      // Top Right Document Title Box
      doc.setFillColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      doc.roundedRect(132, 10, 64, 28, 2, 2, "F");

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("OFFICIAL MONEY RECEIPT", 164, 18, { align: "center" });

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(224, 231, 255);
      doc.text(`Receipt No: ${payment.receiptNo || "REC-" + String(payment.id || Date.now()).slice(-8)}`, 164, 24, { align: "center" });
      doc.text(`Issued: ${formattedDate}`, 164, 30, { align: "center" });

      // 2. VERIFIED STATUS BADGE (y: 52)
      doc.setFillColor(emeraldBg[0], emeraldBg[1], emeraldBg[2]);
      doc.setDrawColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
      doc.roundedRect(14, 50, 182, 10, 1.5, 1.5, "FD");

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
      doc.text("PAYMENT STATUS: APPROVED & VERIFIED BY ACCOUNTS DIVISION", 18, 56.5);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text(`Verified On: ${formattedDate} at ${issueTime}`, 192, 56.5, { align: "right" });

      // 3. STUDENT & PAYMENT METADATA BOXES (y: 64 to 102)
      // Left Box: Student Information
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.roundedRect(14, 64, 89, 38, 2, 2, "FD");

      // Left Box Header
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(14, 64, 89, 8, 2, 2, "F");
      doc.rect(14, 70, 89, 2, "F");
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      doc.text("STUDENT INFORMATION", 18, 69.5);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text("Student Name:", 18, 77);
      doc.text("Class & Section:", 18, 83);
      doc.text("Roll / ID:", 18, 89);
      doc.text("Email / Contact:", 18, 95);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text(studentName, 44, 77);
      doc.text(`${studentClass}${studentSection ? ` (${studentSection})` : ""}`, 44, 83);
      doc.text(String(studentRoll), 44, 89);
      doc.text(studentEmail, 44, 95);

      // Right Box: Payment Details
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.roundedRect(107, 64, 89, 38, 2, 2, "FD");

      // Right Box Header
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(107, 64, 89, 8, 2, 2, "F");
      doc.rect(107, 70, 89, 2, "F");
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      doc.text("PAYMENT DETAILS", 111, 69.5);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text("Payment Method:", 111, 77);
      doc.text("Transaction Ref:", 111, 83);
      doc.text("Session / Month:", 111, 89);
      doc.text("Receipt Date:", 111, 95);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      const payMethodLabel = (payment.gateway || payment.method || "Online").toUpperCase();
      const trxRefLabel = payment.transactionRef || payment.senderPhone || "N/A";
      const monthLabel = payment.month || `${new Date().getFullYear()}`;

      doc.text(payMethodLabel, 140, 77);
      doc.text(trxRefLabel, 140, 83);
      doc.text(monthLabel, 140, 89);
      doc.text(formattedDate, 140, 95);

      // 4. ITEMIZED PARTICULARS TABLE (y: 108 to 131)
      // Table Header Bar
      doc.setFillColor(secondaryIndigo[0], secondaryIndigo[1], secondaryIndigo[2]);
      doc.rect(14, 108, 182, 9, "F");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("SL", 18, 114);
      doc.text("FEE DESCRIPTION / PARTICULARS", 32, 114);
      doc.text("SESSION / PERIOD", 110, 114);
      doc.text("METHOD", 148, 114);
      doc.text("AMOUNT (BDT)", 192, 114, { align: "right" });

      // Table Row 1
      doc.setFillColor(255, 255, 255);
      doc.rect(14, 117, 182, 14, "F");
      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.rect(14, 117, 182, 14, "D");

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text("01", 18, 125.5);

      doc.setFont("helvetica", "bold");
      const feeTypeName = `${payment.feeType || "TUITION"} FEE${payment.month ? ` (${payment.month})` : ""}`;
      doc.text(feeTypeName, 32, 125.5);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text(monthLabel, 110, 125.5);
      doc.text(payMethodLabel, 148, 125.5);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      const amountVal = Number(payment.amount || 0);
      doc.text(`BDT ${amountVal.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 192, 125.5, { align: "right" });

      // 5. SUMMARY BOX & AMOUNT IN WORDS (y: 136 to 166)
      // Left Box: Amount in Words
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.roundedRect(14, 136, 108, 30, 2, 2, "FD");

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text("Amount in Words:", 18, 143);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      const words = numberToWords(amountVal);
      doc.text(words, 18, 149, { maxWidth: 100 });

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text("Note: Keep this official payment receipt for academic records.", 18, 160);

      // Right Box: Total Summary
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.roundedRect(126, 136, 70, 30, 2, 2, "FD");

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text("Subtotal:", 130, 143);
      doc.text("Discount / Fee Waiver:", 130, 149);

      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text(`BDT ${amountVal.toFixed(2)}`, 192, 143, { align: "right" });
      doc.text("BDT 0.00", 192, 149, { align: "right" });

      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.line(130, 152, 192, 152);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      doc.text("TOTAL PAID:", 130, 160);
      doc.text(`BDT ${amountVal.toFixed(2)}`, 192, 160, { align: "right" });

      // 6. OFFICIAL SEAL & SIGNATURES SECTION (y: 180 to 220)
      // Stamp Badge Graphic (Concentric Circles)
      doc.setDrawColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      doc.setLineWidth(0.8);
      doc.circle(105, 194, 14);
      doc.setLineWidth(0.3);
      doc.circle(105, 194, 12);

      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      doc.text("EDUNEXUS ACADEMY", 105, 189, { align: "center" });
      doc.setFontSize(8);
      doc.text("OFFICIAL SEAL", 105, 194, { align: "center" });
      doc.setFontSize(6);
      doc.text("VERIFIED & PAID", 105, 199, { align: "center" });

      // Left Signature: Student / Depositor
      doc.setDrawColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(18, 204, 70, 204);
      doc.setLineDashPattern([], 0);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text("Student / Depositor Signature", 44, 209, { align: "center" });

      // Right Signature: Accounts Officer
      doc.setLineDashPattern([1, 1], 0);
      doc.line(140, 204, 192, 204);
      doc.setLineDashPattern([], 0);

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text("Authorized Accounts Officer", 166, 209, { align: "center" });
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text("EduNexus Accounts Division", 166, 213, { align: "center" });

      // 7. FOOTER BAR (y: 228)
      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.line(14, 222, 196, 222);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text("This document is an electronically generated official payment receipt issued by EduNexus Academy System.", 105, 227, { align: "center" });
      doc.text("For verification or queries, please contact accounts@edunexus.edu.bd with your Receipt Number.", 105, 231, { align: "center" });

      // Save PDF file
      const filename = `Receipt_${payment.receiptNo || "Payment"}.pdf`;
      doc.save(filename);
      toast.success(`Downloaded ${filename}`);
    } catch (err: any) {
      console.error("Error generating PDF receipt:", err);
      toast.error("Failed to generate PDF receipt.");
    }
  };

  const monthly = data?.monthly;
  const otherFees = data?.otherFees || [];

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-emerald-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Wallet className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Student Workspace
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {monthly?.month || "Tuition Dues"}
                </span>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                My Tuition Fees & Receipts
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Track monthly tuition dues, submit payment claims with receipts, and review verified transactions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 md:pt-0">
            <button
              type="button"
              onClick={() => fetchFees(true)}
              disabled={loading || isRefreshing}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isRefreshing
                    ? "animate-spin text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              disabled={!monthly || monthly.status === "PAID"}
              onClick={() => setModal({ feeType: "MONTHLY" })}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Submit Payment</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* High-Contrast Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Monthly Fee Status",
            value: loading || isRefreshing || !monthly ? null : monthly.status,
            icon: Wallet,
            detail: `${monthly?.month || "Current"} status`,
          },
          {
            label: "Total Amount Paid",
            value:
              loading || isRefreshing || !monthly
                ? null
                : `৳${monthly.paid.toLocaleString()}`,
            icon: CheckCircle2,
            detail: "Verified payment total",
          },
          {
            label: "Remaining Dues",
            value:
              loading || isRefreshing || !monthly
                ? null
                : `৳${monthly.due.toLocaleString()}`,
            icon: AlertCircle,
            detail: "Outstanding balance",
          },
          {
            label: "Pending Claims",
            value:
              loading || isRefreshing || !data
                ? null
                : String(data.pendingClaims?.length || 0),
            icon: Clock,
            detail: "Awaiting admin verification",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl hover:border-indigo-500/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
                <item.icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {item.label}
            </p>

            {item.value === null ? (
              <div className="mt-1 h-7 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : (
              <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {item.value}
              </p>
            )}

            <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {!loading && !isRefreshing && (!data || !monthly) ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Could not load your fee information.
          </p>
          <button
            type="button"
            onClick={() => fetchFees(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
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
                  Monthly fee · {monthly?.month || "Current Month"}
                </p>
                {loading || isRefreshing || !monthly ? (
                  <div className="h-8 w-44 rounded bg-slate-200 dark:bg-slate-800 animate-pulse my-1" />
                ) : (
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {monthly.due > 0
                      ? `৳${monthly.paid} / ৳${monthly.due}`
                      : `৳${monthly.paid}`}
                  </p>
                )}
                {loading || isRefreshing || !monthly ? (
                  <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                ) : (
                  <StatusPill status={monthly.status} />
                )}
              </div>

              <button
                type="button"
                disabled={!monthly || monthly.status === "PAID"}
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
                            f.feeType === "REGISTRATION"
                              ? "REGISTRATION"
                              : "EXAM",
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

          {/* Pending claims */}
          {(data?.pendingClaims || []).length > 0 && (
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
                {data?.pendingClaims.map((c: any) => (
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

          {/* Payment History Section */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md"
          >
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Payment history
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified payment receipts available for download
                </p>
              </div>
            </div>

            {loading || isRefreshing ? (
              <HistoryTableSkeleton />
            ) : (data?.history || []).length === 0 ? (
              <p className="px-5 sm:px-6 py-10 text-sm text-slate-500 dark:text-slate-400 text-center">
                No approved payments yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      {["Receipt", "Type", "Amount", "Method", "Date", "Action"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-5 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.history.map((p: any) => (
                      <tr
                        key={p.id}
                        className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
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
                        <td className="px-5 sm:px-6 py-3.5 text-xs sm:text-sm">
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(p)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 shadow-2xs hover:bg-indigo-100 hover:text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                            title="Download Official Receipt PDF"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.section>
        </>
      )}

      <AnimatePresence>
        {modal && (
          <SubmitFeePaymentModal
            feeType={modal.feeType}
            onClose={() => setModal(null)}
            onSuccess={() => fetchFees(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}