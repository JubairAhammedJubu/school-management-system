"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

type Section = { id: string; name: string; isActive?: boolean };
type SchoolClass = {
  id: string;
  name: string;
  hasGroups?: boolean;
  sections?: Section[];
};
type Subject = {
  id: string;
  name: string;
  code?: string;
  subjectCode?: string;
  isCore?: boolean;
  groupId?: string | null;
  group?: { id: string; name: string } | null;
};

type SubjectRequest = {
  id: string;
  grade: string;
  section: string;
  subject: string;
  subjectCode: string;
  group?: string | null;
  room?: string | null;
  schedule?: string | null;
  time?: string | null;
  reason?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminFeedback?: string | null;
  createdAt: string;
};

const STATUS_STYLE: Record<
  string,
  { label: string; className: string; icon: typeof Clock3 }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    icon: Clock3,
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    icon: XCircle,
  },
};

export default function TeacherSubjectRequestsPage() {
  const { data: session } = useSession();

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [requests, setRequests] = useState<SubjectRequest[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // form
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [group, setGroup] = useState("");
  const [room, setRoom] = useState("");
  const [schedule, setSchedule] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const selectedClass = useMemo(
    () => classes.find((c) => c.name === grade),
    [classes, grade],
  );

  const sections = selectedClass?.sections || [];
  const needsGroup = Boolean(selectedClass?.hasGroups);

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.id === subjectId),
    [subjects, subjectId],
  );

  const loadClasses = useCallback(async () => {
    const res = await fetch(`${SERVER}/api/teacher/meta/classes`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load classes");
    setClasses(data.classes || []);
  }, []);

  const loadSubjects = useCallback(async (groupId?: string) => {
    const q = groupId ? `?groupId=${encodeURIComponent(groupId)}` : "";
    const res = await fetch(`${SERVER}/api/teacher/meta/subjects${q}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load subjects");
    setSubjects(data.subjects || []);
  }, []);

  const loadRequests = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${SERVER}/api/teacher/subject-requests`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load requests");
      setRequests(data.requests || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load requests");
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadMeta = useCallback(async () => {
    setLoadingMeta(true);
    try {
      await Promise.all([loadClasses(), loadSubjects()]);
    } catch (e: any) {
      toast.error(e.message || "Failed to load form data");
    } finally {
      setLoadingMeta(false);
    }
  }, [loadClasses, loadSubjects]);

  useEffect(() => {
    loadMeta();
    loadRequests();
  }, [loadMeta, loadRequests]);

  // class change → reset section / group
  useEffect(() => {
    setSection("");
    setGroup("");
  }, [grade]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!grade || !section || !selectedSubject) {
      toast.error("Class, section, and subject are required.");
      return;
    }
    if (needsGroup && !group.trim()) {
      toast.error("Group is required for this class.");
      return;
    }

    const subjectName = selectedSubject.name;
    const subjectCode =
      selectedSubject.subjectCode ||
      selectedSubject.code ||
      subjectName.slice(0, 6).toUpperCase();

    setSubmitting(true);
    try {
      const res = await fetch(`${SERVER}/api/teacher/subject-requests`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          section,
          subject: subjectName,
          subjectCode,
          group: needsGroup ? group.trim() : null,
          room: room.trim() || null,
          schedule: schedule.trim() || null,
          time: time.trim() || null,
          reason: reason.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");

      toast.success("Request submitted. Waiting for admin approval.");
      setSubjectId("");
      setRoom("");
      setSchedule("");
      setTime("");
      setReason("");
      await loadRequests();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <BookOpen className="h-5 w-5" />
            </span>
            Subject requests
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Request a class & subject assign. Admin will approve before it
            becomes active.
            {session?.user?.name ? ` · ${session.user.name}` : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            loadMeta();
            loadRequests();
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
        >
          {loadingMeta || loadingList ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </button>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="lg:col-span-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-md space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600">
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                New request
              </h2>
              <p className="text-[11px] text-slate-500">
                Class, section & subject required
              </p>
            </div>
          </div>

          {loadingMeta ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              <Field label="Class">
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Section">
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                  disabled={!grade}
                  className={inputClass}
                >
                  <option value="">Select section</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>

              {needsGroup && (
                <Field label="Group">
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    required
                    className={inputClass}
                  >
                    <option value="">Select group</option>
                    <option value="Science">Science</option>
                    <option value="Business Studies">Business Studies</option>
                    <option value="Humanities">Humanities</option>
                  </select>
                </Field>
              )}

              <Field label="Subject">
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      {s.group?.name ? ` (${s.group.name})` : ""}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Room (optional)">
                  <input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. 201"
                    className={inputClass}
                  />
                </Field>
                <Field label="Time (optional)">
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Schedule (optional)">
                <input
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="e.g. Sun, Tue, Thu"
                  className={inputClass}
                />
              </Field>

              <Field label="Reason (optional)">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Why you should teach this class…"
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit request
              </button>
            </>
          )}
        </motion.form>

        {/* My requests */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md"
        >
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-slate-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                My requests
              </h2>
              <p className="text-[11px] text-slate-500">
                {requests.length} total
              </p>
            </div>
          </div>

          {loadingList ? (
            <div className="py-14 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : requests.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400">
                <ClipboardList className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                No requests yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                Submit a class & subject request from the form. Status will show
                here after admin review.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {["Assign", "Schedule", "Status", "Submitted"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => {
                    const st = STATUS_STYLE[r.status] || STATUS_STYLE.PENDING;
                    const Icon = st.icon;
                    return (
                      <tr
                        key={r.id}
                        className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {r.subject}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {r.grade} · {r.section}
                            {r.group ? ` · ${r.group}` : ""}
                            {r.subjectCode ? ` · ${r.subjectCode}` : ""}
                          </p>
                          {r.adminFeedback && (
                            <p className={`mt-1 text-[11px] font-semibold ${r.adminFeedback==="Approved"?"text-green-500":"text-red-400"}`}>
                              Admin: {r.adminFeedback}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                          {r.room || r.schedule || r.time ? (
                            <>
                              {r.room && <span>Room {r.room}</span>}
                              {r.schedule && (
                                <span className="block">{r.schedule}</span>
                              )}
                              {r.time && (
                                <span className="block text-slate-400">
                                  {r.time}
                                </span>
                              )}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${st.className}`}
                          >
                            <Icon className="h-3 w-3" />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}