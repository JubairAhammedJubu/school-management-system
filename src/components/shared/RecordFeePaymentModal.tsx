"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { X, Loader2 } from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

const METHODS = [
  { id: "bkash", label: "bKash" },
  { id: "nagad", label: "Nagad" },
  { id: "rocket", label: "Rocket" },
  { id: "upay", label: "Upay" },
  { id: "bank", label: "Bank" },
  { id: "cash", label: "Cash" },
];

function monthKey() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** Optional: pre-select student from roster */
  presetStudent?: { id: string; name: string; studentClass?: string | null };
};

export default function RecordPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  presetStudent,
}: Props) {
  const year = new Date().getFullYear().toString();
  const month = monthKey();

  const [q, setQ] = useState("");
  const [hits, setHits] = useState<any[]>([]);
  const [studentId, setStudentId] = useState(presetStudent?.id || "");
  const [studentLabel, setStudentLabel] = useState(
    presetStudent
      ? `${presetStudent.name} (${presetStudent.studentClass || "—"})`
      : "",
  );
  const [feeType, setFeeType] = useState("MONTHLY");
  const [method, setMethod] = useState("bkash");
  const [trx, setTrx] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const searchStudents = async (text: string) => {
    setQ(text);
    setStudentId("");
    setStudentLabel("");
    if (text.trim().length < 2) return setHits([]);
    try {
      const res = await fetch(
        `${SERVER}/api/teacher/students?search=${encodeURIComponent(text)}&limit=8`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (res.ok) setHits(data.students || []);
    } catch {
      /* ignore */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      toast.error("Select a student");
      return;
    }
    if (trx.trim().length < 5) {
      toast.error("Enter a valid TrxID");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/payments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          feeType,
          method,
          transactionRef: trx.trim(),
          sessionYear: year,
          ...(feeType === "MONTHLY" ? { month } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record payment");

      toast.success(`Saved · ${data.payment?.receiptNo || "OK"}`);
      setTrx("");
      setQ("");
      if (!presetStudent) {
        setStudentId("");
        setStudentLabel("");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Record payment
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <label className="text-xs font-bold">Student</label>
            <input
              value={studentLabel || q}
              onChange={(e) => searchStudents(e.target.value)}
              placeholder="Search name or email"
              disabled={Boolean(presetStudent)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm disabled:opacity-70"
            />
            {hits.length > 0 && !studentId && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border bg-white dark:bg-slate-900 shadow-lg max-h-40 overflow-auto">
                {hits.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="block w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => {
                      setStudentId(s.id);
                      setStudentLabel(
                        `${s.name} (${s.studentClass || "—"})`,
                      );
                      setHits([]);
                    }}
                  >
                    {s.name} · {s.email}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold">Fee type</label>
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="REGISTRATION">Registration</option>
              <option value="EXAM">Exam</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              {METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold">TrxID</label>
            <input
              value={trx}
              onChange={(e) => setTrx(e.target.value)}
              placeholder="Transaction ID only"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save as paid"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}