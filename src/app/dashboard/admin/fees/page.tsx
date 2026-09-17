"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Wallet,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  X as XIcon,
  Image as ImageIcon,
} from "lucide-react";
import RecordFeePaymentModal from "@/components/shared/RecordFeePaymentModal";
import RejectClaimModal from "@/components/shared/RejectClaimModal";

type FeeStatus = "PAID" | "PARTIAL" | "DUE";

type StudentFeeRow = {
  id: string;
  name: string;
  email: string;
  studentClass: string;
  studentSection: string;
  roll: number;
  monthly: { month: string; paid: number; due: number; status: FeeStatus };
  registration: { paid: number; due: number; status: FeeStatus };
  examsPaid: string[];
};

type Claim = {
  id: string;
  studentName: string;
  studentEmail: string;
  studentClass: string;
  feeType: string;
  amount: number;
  method: string;
  month: string | null;
  examId: string | null;
  transactionRef: string | null;
  screenshotUrl: string | null;
  paidAt: string;
};

const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTIONS = ["Section A", "Section B"];
const STATUSES: { value: FeeStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "PAID", label: "Paid" },
  { value: "PARTIAL", label: "Partial" },
  { value: "DUE", label: "Due" },
];

export default function AdminFeesPage() {
  const [tab, setTab] = useState<"roster" | "claims">("roster");

  return (
    <div className="p-6">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-heading font-semibold text-foreground">
          Fee Management
        </h1>
        <p className="text-sm text-foreground/60">
          Track monthly, exam, and registration fee payments by student.
        </p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-foreground/10">
        <TabButton active={tab === "roster"} onClick={() => setTab("roster")}>
          Roster
        </TabButton>
        <TabButton active={tab === "claims"} onClick={() => setTab("claims")}>
          Pending Claims
        </TabButton>
      </div>

      {tab === "roster" ? <RosterTab /> : <ClaimsTab />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-foreground/50 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// ── Roster tab ──────────────────────────────────────────────────────────

function RosterTab() {
  const [rows, setRows] = useState<StudentFeeRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<FeeStatus | "">("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [selectedStudent, setSelectedStudent] = useState<StudentFeeRow | null>(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [classFilter, sectionFilter, statusFilter, debouncedSearch]);

  const fetchRoster = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (classFilter) params.set("studentClass", classFilter);
      if (sectionFilter) params.set("studentSection", sectionFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`${serverUrl}/api/admin/fees/students?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load fee roster");
      const data = await res.json();
      setRows(data.data);
      setTotal(data.total);
    } catch (err) {
      toast.error("Could not load student fee status", { toastId: "fee-roster-load-error" });
    } finally {
      setLoading(false);
    }
  }, [classFilter, sectionFilter, statusFilter, debouncedSearch, page, serverUrl]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
        >
          <option value="">All Classes</option>
          {CLASSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
        >
          <option value="">All Sections</option>
          {SECTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FeeStatus | "")}
          className="px-3 py-2 rounded-lg border border-foreground/10 bg-background text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-foreground/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Roll</th>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Class / Section</th>
              <th className="px-4 py-3 font-medium">Monthly</th>
              <th className="px-4 py-3 font-medium">Registration</th>
              <th className="px-4 py-3 font-medium">Exams Paid</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-foreground/50">
                  Loading roster...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-foreground/50">
                  No students match these filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-foreground/5">
                  <td className="px-4 py-3">{row.roll}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-foreground/50">{row.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {row.studentClass} / {row.studentSection}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.monthly.status} paid={row.monthly.paid} due={row.monthly.due} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.registration.status} paid={row.registration.paid} due={row.registration.due} />
                  </td>
                  <td className="px-4 py-3">{row.examsPaid.length}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedStudent(row)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:opacity-90 transition"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      Record Payment
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-foreground/60">
        <span>
          {total === 0 ? "0 results" : `Page ${page} of ${totalPages} · ${total} students`}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg border border-foreground/10 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-lg border border-foreground/10 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedStudent && (
        <RecordFeePaymentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSuccess={() => {
            setSelectedStudent(null);
            fetchRoster();
          }}
        />
      )}
    </>
  );
}

// ── Claims tab ──────────────────────────────────────────────────────────

function ClaimsTab() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingClaim, setRejectingClaim] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/api/admin/fees/claims?status=PENDING`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load claims");
      const data = await res.json();
      setClaims(data);
    } catch (err) {
      toast.error("Could not load pending claims", { toastId: "claims-load-error" });
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await fetch(`${serverUrl}/api/admin/fees/claims/${id}/approve`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to approve claim", { toastId: "approve-claim-error" });
        return;
      }
      toast.success("Claim approved", { toastId: "approve-claim-success" });
      fetchClaims();
    } catch (err) {
      toast.error("Something went wrong approving the claim", { toastId: "approve-claim-network-error" });
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <>
      {loading ? (
        <p className="text-sm text-foreground/50 py-8 text-center">Loading pending claims...</p>
      ) : claims.length === 0 ? (
        <p className="text-sm text-foreground/50 py-8 text-center">
          No payment claims waiting for review.
        </p>
      ) : (
        <div className="space-y-3">
          {claims.map((c) => (
            <div
              key={c.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-foreground/10 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {c.studentName}{" "}
                  <span className="text-foreground/40 font-normal">({c.studentEmail})</span>
                </p>
                <p className="text-xs text-foreground/60 mt-0.5">
                  {c.feeType}
                  {c.month ? ` · ${c.month}` : ""} · {c.studentClass} · Amount:{" "}
                  <span className="font-medium text-foreground">{c.amount}</span> ·{" "}
                  {c.method.replace("_", " ")}
                </p>
                <p className="text-xs text-foreground/50 mt-0.5">
                  Ref: {c.transactionRef} · Submitted{" "}
                  {new Date(c.paidAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {c.screenshotUrl && (
                  <button
                    onClick={() => setPreview(c.screenshotUrl)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/10 text-xs font-medium hover:bg-foreground/5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    View Proof
                  </button>
                )}
                <button
                  onClick={() => handleApprove(c.id)}
                  disabled={approvingId === c.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:opacity-90 disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  {approvingId === c.id ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => setRejectingClaim(c.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:opacity-90"
                >
                  <XIcon className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screenshot preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="Payment proof"
            className="max-h-[85vh] max-w-full rounded-lg border border-foreground/10"
          />
        </div>
      )}

      {rejectingClaim && (
        <RejectClaimModal
          claimId={rejectingClaim}
          onClose={() => setRejectingClaim(null)}
          onSuccess={() => {
            setRejectingClaim(null);
            fetchClaims();
          }}
        />
      )}
    </>
  );
}

function StatusBadge({ status, paid, due }: { status: FeeStatus; paid: number; due: number }) {
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