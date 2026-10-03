"use client";
import { API_BASE_URL } from "@/lib/api-url";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Clock3,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Coffee,
  AlertTriangle,
  X,
} from "lucide-react";

const SERVER = API_BASE_URL;

type Period = {
  id: string;
  periodNumber: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
};

const emptyForm = {
  periodNumber: "",
  label: "",
  startTime: "",
  endTime: "",
  isBreak: false,
};

export default function AdminPeriodsPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState<Period | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/periods`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load periods");
      setPeriods(data.periods || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load periods");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.periodNumber ||
      !form.label.trim() ||
      !form.startTime ||
      !form.endTime
    ) {
      toast.error("Number, label, start and end time are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/periods`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periodNumber: Number(form.periodNumber),
          label: form.label.trim(),
          startTime: form.startTime,
          endTime: form.endTime,
          isBreak: form.isBreak,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      toast.success("Period added");
      setForm(emptyForm);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/periods/seed-standard`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      toast.success(data.message || "Standard schedule created");
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSeeding(false);
    }
  };

  const confirmDelete = async () => {
    if (!periodToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/periods/${periodToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      toast.success("Period removed");
      setPeriodToDelete(null);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate overall school schedule span
  const scheduleSpan = periods.length > 0
    ? `${periods[0]?.startTime || "10:00"} - ${periods[periods.length - 1]?.endTime || "15:10"}`
    : "10:00 - 15:10";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-indigo-50/30 to-white/90 dark:from-slate-950/90 dark:via-indigo-950/30 dark:to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
      >
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              BELL SCHEDULE MANAGEMENT
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Period &amp; Timings Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Configure school-wide daily timing slots, period durations, teaching classes, and tiffin recess breaks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onSeed}
              disabled={seeding || periods.length > 0}
              title={
                periods.length > 0
                  ? "Clear periods first to reseed"
                  : "Create standard 7 periods + tiffin"
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer active:scale-[0.98]"
            >
              {seeding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Seed Standard</span>
            </button>

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all disabled:opacity-60 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Slots */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Slots</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {loading ? <span className="inline-block h-7 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /> : periods.length}
            </h3>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Daily periods</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <Clock3 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Teaching Slots */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Teaching Slots</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {loading ? <span className="inline-block h-7 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /> : periods.filter((p) => !p.isBreak).length}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Academic classes</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Break Recess */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Recess / Tiffin</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {loading ? <span className="inline-block h-7 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /> : periods.filter((p) => p.isBreak).length}
            </h3>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Break slot</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
            <Coffee className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Schedule Span */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Daily Span</p>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 truncate max-w-36">
              {loading ? <span className="inline-block h-6 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /> : scheduleSpan}
            </h3>
            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">Operating hours</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-inner">
            <Clock3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Create form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onCreate}
          className="lg:col-span-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-md space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600">
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Add period
              </h2>
              <p className="text-[11px] text-slate-500">
                Custom slot or break
              </p>
            </div>
          </div>

          <Field label="Period number">
            <input
              type="number"
              min={1}
              value={form.periodNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, periodNumber: e.target.value }))
              }
              placeholder="e.g. 1"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Label">
            <input
              value={form.label}
              onChange={(e) =>
                setForm((f) => ({ ...f, label: e.target.value }))
              }
              placeholder="Period 1 or Tiffin"
              className={inputClass}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startTime: e.target.value }))
                }
                className={inputClass}
                required
              />
            </Field>
            <Field label="End">
              <input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endTime: e.target.value }))
                }
                className={inputClass}
                required
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isBreak}
              onChange={(e) =>
                setForm((f) => ({ ...f, isBreak: e.target.checked }))
              }
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              This is a break (tiffin / recess)
            </span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Create period
          </button>
        </motion.form>

        {/* List */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-md"
        >
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily schedule
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Ordered by period number · used in student/teacher routines
            </p>
          </div>

          {loading ? (
            <div className="p-6 space-y-3 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          ) : periods.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400">
                <Clock3 className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                No periods yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Use <strong>Seed standard</strong> for 10:00–15:10 with tiffin,
                or add custom slots on the left.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {["#", "Label", "Time", "Type", ""].map((h) => (
                      <th
                        key={h || "a"}
                        className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                    >
                      <td className="px-5 py-3.5 text-sm font-extrabold text-slate-900 dark:text-white">
                        {p.periodNumber}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        <span className="inline-flex items-center gap-1.5">
                          {p.isBreak && (
                            <Coffee className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          {p.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono text-slate-600 dark:text-slate-300">
                        {p.startTime} – {p.endTime}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                            p.isBreak
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                              : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                          }`}
                        >
                          {p.isBreak ? "Break" : "Class"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setPeriodToDelete(p)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
                          title="Remove Period"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {periodToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setPeriodToDelete(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 z-10 p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 shrink-0">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      Delete Class Period?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      This action will remove the timing slot
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setPeriodToDelete(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    {periodToDelete.isBreak && <Coffee className="h-4 w-4 text-amber-500" />}
                    {periodToDelete.label}
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                      periodToDelete.isBreak
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                    }`}
                  >
                    {periodToDelete.isBreak ? "Break" : "Class"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs pt-0.5">
                  <span>Slot #{periodToDelete.periodNumber}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    {periodToDelete.startTime} – {periodToDelete.endTime}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Are you sure you want to delete period{" "}
                <strong className="text-slate-900 dark:text-slate-100">
                  {periodToDelete.label}
                </strong>
                ? Existing routines using this slot may need to be adjusted.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setPeriodToDelete(null)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/30";

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

function Stat({
  label,
  value,
  cls = "text-slate-900 dark:text-white",
}: {
  label: string;
  value: number;
  cls?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-extrabold ${cls}`}>{value}</p>
    </div>
  );
}