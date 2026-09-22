"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Clock3,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Coffee,
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const onDelete = async (id: string) => {
    if (!confirm("Remove this period?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${SERVER}/api/admin/periods/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      toast.success("Period removed");
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
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
              <Clock3 className="h-5 w-5" />
            </span>
            Periods
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            School-wide bell schedule used by class routines (e.g. 10:00–15:10).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Refresh
          </button>
          <button
            type="button"
            onClick={onSeed}
            disabled={seeding || periods.length > 0}
            title={
              periods.length > 0
                ? "Clear periods first to reseed"
                : "Create standard 7 periods + tiffin"
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {seeding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Seed standard
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
        <Stat label="Total slots" value={periods.length} />
        <Stat
          label="Teaching"
          value={periods.filter((p) => !p.isBreak).length}
          cls="text-indigo-600 dark:text-indigo-400"
        />
        <Stat
          label="Breaks"
          value={periods.filter((p) => p.isBreak).length}
          cls="text-amber-600 dark:text-amber-400"
        />
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
            <div className="py-14 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
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
                          onClick={() => onDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer disabled:opacity-50"
                          title="Remove"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
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