"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check, X, Loader2, Inbox } from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

type RequestRow = {
  id: string;
  teacherName: string;
  teacherEmail: string;
  grade: string;
  section: string;
  subject: string;
  group: string | null;
  room: string | null;
  schedule: string | null;
  time: string | null;
  reason: string | null;
  createdAt: string;
};

export default function AdminSubjectRequestsPage() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/subject-requests?status=PENDING`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRequests(data.requests || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`${SERVER}/api/admin/subject-requests/${id}/approve`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve");
      toast.success("Approved — teacher assigned to the subject");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const reject = async () => {
    if (!rejectingId || !rejectReason.trim()) {
      toast.error("A reason is required");
      return;
    }
    setBusyId(rejectingId);
    try {
      const res = await fetch(`${SERVER}/api/admin/subject-requests/${rejectingId}/reject`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminFeedback: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject");
      toast.success("Request rejected");
      setRejectingId(null);
      setRejectReason("");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
        <Inbox className="h-5 w-5 text-indigo-600" />
        Subject Assignment Requests
      </h1>

      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
      ) : requests.length === 0 ? (
        <p className="text-sm text-slate-500">No pending requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {r.teacherName} <span className="text-slate-400 font-normal">({r.teacherEmail})</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {r.subject}{r.group ? ` (${r.group})` : ""} — {r.grade} {r.section}
                  </p>
                  {(r.room || r.schedule || r.time) && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {[r.room, r.schedule, r.time].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {r.reason && <p className="text-[11px] text-slate-500 italic mt-1">"{r.reason}"</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => approve(r.id)}
                    disabled={busyId === r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => setRejectingId(r.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setRejectingId(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-950 p-5 shadow-xl">
            <h3 className="text-sm font-bold mb-3">Reason for rejection</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm resize-none"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRejectingId(null)} className="px-4 py-2 text-xs font-bold text-slate-600">
                Cancel
              </button>
              <button
                onClick={reject}
                disabled={busyId === rejectingId}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}