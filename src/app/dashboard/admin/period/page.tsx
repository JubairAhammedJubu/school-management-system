"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Clock, Loader2, Sparkles, Trash2, Plus } from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";

type Period = {
  id: string;
  periodNumber: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
};

export default function AdminPeriodsPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/periods`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load periods");
      setPeriods(data.periods || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const seedStandard = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/periods/seed-standard`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      toast.success("Standard schedule created — 7 periods + tiffin");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSeeding(false);
    }
  };

  const removePeriod = async (id: string) => {
    try {
      const res = await fetch(`${SERVER}/api/admin/periods/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove period");
      toast.success("Period removed");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
            <Clock className="h-5 w-5" />
          </span>
          School Periods
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Set the daily period/time structure once — every section's weekly routine uses this same schedule.
        </p>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : periods.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No periods set up yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Click below to create the standard single-shift schedule (10:00 AM–3:10 PM, 7 periods + tiffin break),
            or add custom periods manually.
          </p>
          <button
            onClick={seedStandard}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Seed Standard Schedule
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {periods.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold ${
                      p.isBreak
                        ? "bg-amber-50 dark:bg-amber-500/15 text-amber-600"
                        : "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600"
                    }`}
                  >
                    {p.periodNumber}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{p.label}</p>
                    <p className="text-[11px] text-slate-500">{p.startTime} – {p.endTime}</p>
                  </div>
                </div>
                <button onClick={() => removePeriod(p.id)} className="text-slate-400 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}