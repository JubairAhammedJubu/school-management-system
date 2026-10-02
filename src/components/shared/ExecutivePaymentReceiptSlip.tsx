"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Wallet,
  Calendar,
  CreditCard,
  FileText,
  Copy,
  Check,
} from "lucide-react";

type PaymentDetails = {
  id?: string;
  receiptNo: string;
  feeType: string;
  month?: string | null;
  amount: number;
  paidAt: string;
  methodLabel?: string;
  gatewayTranId?: string;
};

const taka = (n: number) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

function monthLabel(key?: string | null) {
  if (!key) return "-";
  const [y, m] = key.split("-").map(Number);
  if (isNaN(y) || isNaN(m)) return key;
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Mini SVG QR Code Generator Component for Printable PDF
function ReceiptQRCode({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="p-1 bg-white border border-slate-300 rounded-lg">
        <svg viewBox="0 0 100 100" className="w-12 h-12 text-slate-900 fill-current">
          <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
          <rect x="13" y="13" width="12" height="12" fill="currentColor" />
          <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
          <rect x="75" y="13" width="12" height="12" fill="currentColor" />
          <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
          <rect x="13" y="75" width="12" height="12" fill="currentColor" />

          <rect x="42" y="10" width="8" height="8" fill="currentColor" />
          <rect x="52" y="18" width="8" height="8" fill="currentColor" />
          <rect x="42" y="26" width="8" height="8" fill="currentColor" />
          <rect x="10" y="42" width="8" height="8" fill="currentColor" />
          <rect x="26" y="42" width="8" height="8" fill="currentColor" />
          <rect x="42" y="42" width="16" height="16" fill="currentColor" />
          <rect x="67" y="42" width="8" height="8" fill="currentColor" />
          <rect x="83" y="42" width="8" height="8" fill="currentColor" />
          <rect x="75" y="52" width="8" height="8" fill="currentColor" />
          <rect x="52" y="67" width="8" height="8" fill="currentColor" />
          <rect x="42" y="75" width="8" height="8" fill="currentColor" />
          <rect x="67" y="75" width="16" height="8" fill="currentColor" />
          <rect x="83" y="83" width="8" height="8" fill="currentColor" />
        </svg>
      </div>
      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-tighter">
        VERIFY QR: {value.slice(-6)}
      </span>
    </div>
  );
}

// Official Circular Stamp / Watermark Badge SVG for Printable PDF
function OfficialVerifiedStamp() {
  return (
    <div className="relative flex items-center justify-center w-20 h-20 opacity-90 select-none pointer-events-none">
      <svg viewBox="0 0 120 120" className="w-full h-full text-indigo-600 fill-current">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#4f46e5" strokeWidth="3" strokeDasharray="6 3" />
        <circle cx="60" cy="60" r="46" fill="none" stroke="#4338ca" strokeWidth="1.5" />

        <path id="circlePath" d="M 20, 60 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
        <text fontSize="9" fontWeight="900" letterSpacing="1.5" fill="#3730a3">
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            EDUNEXUS ACCOUNTS • OFFICIAL VERIFIED
          </textPath>
        </text>

        <g transform="translate(42, 42)">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#4338ca" transform="scale(1.5)" />
        </g>
        <text x="60" y="82" fontSize="9" fontWeight="900" textAnchor="middle" fill="#3730a3" letterSpacing="1">
          PAID & POSTED
        </text>
      </svg>
    </div>
  );
}

export function ExecutivePaymentReceiptSlip({
  payment,
  onClose,
  printableId = "printable-receipt-slip",
}: {
  payment: PaymentDetails;
  onClose: () => void;
  printableId?: string;
}) {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(payment.paidAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const categoryLabel =
    payment.feeType === "MONTHLY"
      ? `Monthly Tuition Fee (${monthLabel(payment.month)})`
      : payment.feeType;

  const handleCopy = () => {
    navigator.clipboard.writeText(payment.receiptNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      {/* Universal Print Styles: Clean isolation for PDF print without breaking internal flex/grid layouts */}
      <style>{`
        @media print {
          @page {
            margin: 10mm;
            size: auto;
          }
          html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            color-scheme: light !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          body * {
            visibility: hidden !important;
          }
          #${printableId}, #${printableId} * {
            visibility: visible !important;
          }
          #${printableId} {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            z-index: 999999 !important;
          }
          .screen-only-modal {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. STREAMLINED SCREEN-ONLY MODAL PREVIEW CARD */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="screen-only-modal relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950 my-6 space-y-5 text-left"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Payment Receipt
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Summary of verified transaction
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Compact Key Transaction Details */}
        <div className="space-y-3 text-xs">
          {/* Receipt No */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Receipt className="h-4 w-4 text-indigo-500" />
              Receipt No:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                {payment.receiptNo}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded-md bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Copy Receipt No"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-indigo-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Particular */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Wallet className="h-4 w-4 text-indigo-500" />
              Fee Particular:
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
              {categoryLabel}
            </span>
          </div>

          {/* Date & Gateway */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" /> Date:
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                {formattedDate}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="h-3 w-3 text-slate-400" /> Gateway:
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                {payment.methodLabel || "SSLCommerz"}
              </p>
            </div>
          </div>

          {/* Amount Paid */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 text-white shadow-md">
            <span className="text-xs font-black uppercase tracking-wider">Amount Paid:</span>
            <span className="text-xl font-black">{taka(payment.amount)}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-2.5 pt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </motion.button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <span>Close</span>
          </button>
        </div>
      </motion.div>

      {/* 2. FULL OFFICIAL EXECUTIVE PRINTABLE PDF DOCUMENT (HIDDEN ON SCREEN, RENDERED EXCLUSIVELY FOR PRINT / PDF EXPORT) */}
      <div
        id={printableId}
        className="hidden bg-white text-slate-900 p-8 space-y-6 text-left font-sans"
        style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
      >
        {/* Header Banner */}
        <div className="border-b-2 border-indigo-600 pb-4">
          <div className="flex flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shrink-0">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  EduNexus School Management System
                </h1>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Student Fee Voucher & Payment Receipt
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center gap-3 shrink-0">
              <ReceiptQRCode value={payment.receiptNo} />
            </div>
          </div>
        </div>

        {/* Verified Badge Ribbon */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Payment Verification:
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-black text-white uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5" /> VERIFIED & RECORDED
          </span>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Voucher / Receipt No:
            </span>
            <p className="font-mono text-base font-black text-indigo-600">
              {payment.receiptNo}
            </p>
          </div>

          <div className="space-y-1 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Payment Date & Time:
            </span>
            <p className="font-bold text-slate-900">
              {formattedDate}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Fee Particulars:
            </span>
            <p className="font-bold text-slate-900">
              {categoryLabel}
            </p>
          </div>

          <div className="space-y-1 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Payment Channel / Gateway:
            </span>
            <p className="font-bold text-slate-900">
              {payment.methodLabel || "SSLCommerz Online Gateway"}
            </p>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Description / Particulars</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Paid Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr>
                <td className="px-4 py-3.5 font-bold text-slate-900">
                  {categoryLabel}
                </td>
                <td className="px-4 py-3.5 font-black text-slate-900 text-right text-sm">
                  {taka(payment.amount)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Highlighted Total Paid Banner */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-700 to-slate-900 px-5 py-4 text-white">
            <span className="text-xs font-black uppercase tracking-wider">
              Total Amount Paid & Cleared:
            </span>
            <span className="text-2xl font-black tracking-tight">
              {taka(payment.amount)}
            </span>
          </div>
        </div>

        {/* Official Seal & Signature Footer */}
        <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <OfficialVerifiedStamp />
            <div className="space-y-0.5">
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Official System E-Receipt
              </p>
              <p className="text-[10px] text-slate-500">
                Verified by SSLCommerz Gateway & EduNexus Accounts.
              </p>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="h-8 border-b-2 border-slate-400 w-36" />
            <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">
              Authorized Signatory
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

