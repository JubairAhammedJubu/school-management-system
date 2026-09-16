"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Receipt,
  Download,
  Clock,
} from "lucide-react";
import SubmitFeePaymentModal from "@/components/shared/SubmitFeePaymentModal";

type FeeStatus = "PAID" | "PARTIAL" | "DUE";

type FeeSummary = { paid: number; due: number; status: FeeStatus };

type ExamFee = {
  examId: string;
  title: string;
  date: string;
  due: number;
  paid: number;
  status: FeeStatus;
};

type Payment = {
  id: string;
  feeType: string;
  amount: number;
  method: string;
  month: string | null;
  examId: string | null;
  receiptNo: string;
  paidAt: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  transactionRef?: string;
  screenshotUrl?: string;
};

type FeeData = {
  monthly: FeeSummary & { month: string };
  registration: FeeSummary;
  exams: ExamFee[];
  history: Payment[];
  pendingClaims: Payment[];
};

export default function StudentFeePage() {
  const [data, setData] = useState<FeeData | null>(null);
  const [claimModal, setClaimModal] = useState<{
    feeType: "MONTHLY" | "EXAM" | "REGISTRATION";
    examId?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/api/student/fees`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load fee status");
      const json = await res.json();

      // Guard against a stale/mismatched backend shape instead of crashing.
      if (
        !json ||
        typeof json !== "object" ||
        Array.isArray(json) ||
        !json.monthly
      ) {
        console.error("Unexpected /api/student/fees response shape:", json);
        throw new Error("Unexpected response shape");
      }

      setData(json);
    } catch (err) {
      toast.error("Could not load your fee status", {
        toastId: "student-fee-load-error",
      });
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const downloadEntryForm = async (examId: string) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/student/exams/${examId}/entry-form`,
        {
          credentials: "include",
        },
      );
      const json = await res.json();

      if (!res.ok) {
        if (json.error === "EXAM_FEE_UNPAID") {
          toast.error(
            "Exam fee hasn't been recorded as paid yet — contact the office.",
            {
              toastId: "exam-fee-unpaid",
            },
          );
        } else {
          toast.error(json.error ?? "Could not fetch entry form", {
            toastId: "entry-form-error",
          });
        }
        return;
      }

      // Placeholder: hand off `json` (exam + receiptNo + student) to whatever
      // renders/prints the actual admit card, matching the receipt generator
      // used by /api/admin/receipts/generate-pdf.
      toast.success("Entry form ready", { toastId: "entry-form-ready" });
      console.log("Entry form payload:", json);
    } catch (err) {
      toast.error("Something went wrong fetching the entry form", {
        toastId: "entry-form-network-error",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 skeleton-shimmer rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 skeleton-shimmer rounded-xl" />
          <div className="h-28 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-sm text-foreground/60">
        Could not load your fee information right now.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-foreground">
          My Fees
        </h1>
        <p className="text-sm text-foreground/60">
          Your monthly, registration, and exam fee status and payment history.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard
          title={`Monthly Fee — ${data.monthly.month}`}
          status={data.monthly.status}
          paid={data.monthly.paid}
          due={data.monthly.due}
          onPay={() => setClaimModal({ feeType: "MONTHLY" })}
        />
        <SummaryCard
          title="Registration Fee"
          status={data.registration.status}
          paid={data.registration.paid}
          due={data.registration.due}
          onPay={() => setClaimModal({ feeType: "REGISTRATION" })}
        />
      </div>

      {/* Exam fees */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-3">Exam Fees</h2>
        {data.exams.length === 0 ? (
          <p className="text-sm text-foreground/50">
            No exams scheduled for your class yet.
          </p>
        ) : (
          <div className="rounded-xl border border-foreground/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-foreground/5 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Exam</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Fee Status</th>
                  <th className="px-4 py-3 font-medium text-right">
                    Entry Form
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Pay</th>
                </tr>
              </thead>
              <tbody>
                {data.exams.map((exam) => (
                  <tr
                    key={exam.examId}
                    className="border-t border-foreground/5"
                  >
                    <td className="px-4 py-3 font-medium">{exam.title}</td>
                    <td className="px-4 py-3">{exam.date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={exam.status}
                        paid={exam.paid}
                        due={exam.due}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => downloadEntryForm(exam.examId)}
                        disabled={exam.status !== "PAID"}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          setClaimModal({ feeType: "EXAM", examId: exam.examId })
                        }
                        disabled={exam.status === "PAID"}
                        className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-40 disabled:no-underline"
                      >
                        Submit Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment history */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-3">
          Payment History
        </h2>
        {data.history.length === 0 ? (
          <p className="text-sm text-foreground/50">
            No payments recorded yet.
          </p>
        ) : (
          <div className="rounded-xl border border-foreground/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-foreground/5 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Receipt No</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.history.map((p) => (
                  <tr key={p.id} className="border-t border-foreground/5">
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-foreground/40" />
                      {p.receiptNo}
                    </td>
                    <td className="px-4 py-3">
                      {p.feeType}
                      {p.month ? ` (${p.month})` : ""}
                    </td>
                    <td className="px-4 py-3">{p.amount}</td>
                    <td className="px-4 py-3">{p.method.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      {new Date(p.paidAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending claims */}
      {data.pendingClaims?.length > 0 && (
        <div>
          <h2 className="text-lg font-heading font-semibold mb-3">
            Pending Review
          </h2>
          <div className="space-y-2">
            {data.pendingClaims.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {c.feeType}
                    {c.month ? ` (${c.month})` : ""} — {c.amount}
                  </p>
                  <p className="text-xs text-foreground/50">
                    Ref: {c.transactionRef}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-yellow-600 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Awaiting review
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {claimModal && (
        <SubmitFeePaymentModal
          defaultFeeType={claimModal.feeType}
          defaultExamId={claimModal.examId}
          onClose={() => setClaimModal(null)}
          onSuccess={() => {
            setClaimModal(null);
            fetchFees();
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({
  title,
  status,
  paid,
  due,
  onPay,
}: {
  title: string;
  status: FeeStatus;
  paid: number;
  due: number;
  onPay: () => void;
}) {
  const config = {
    PAID: {
      icon: CheckCircle2,
      cls: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    PARTIAL: {
      icon: AlertCircle,
      cls: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
    DUE: { icon: XCircle, cls: "bg-red-500/10 text-red-600 border-red-500/20" },
  }[status];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-4 ${config.cls}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-heading font-semibold text-foreground">
        {due > 0 ? `${paid} / ${due}` : paid}
      </p>
      <p className="text-xs mt-1 font-medium">
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </p>
      <button
        onClick={onPay}
        disabled={status === "PAID"}
        className="mt-2 text-xs font-medium text-blue-600 hover:underline disabled:opacity-40 disabled:no-underline"
      >
        Submit Payment
      </button>
    </div>
  );
}

function StatusBadge({
  status,
  paid,
  due,
}: {
  status: FeeStatus;
  paid: number;
  due: number;
}) {
  const config = {
    PAID: { icon: CheckCircle2, cls: "bg-green-500/10 text-green-600" },
    PARTIAL: { icon: AlertCircle, cls: "bg-yellow-500/10 text-yellow-600" },
    DUE: { icon: XCircle, cls: "bg-red-500/10 text-red-600" },
  }[status];
  const Icon = config.icon;

  return (
    <span
      title={due > 0 ? `${paid} / ${due} paid` : undefined}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.cls}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}