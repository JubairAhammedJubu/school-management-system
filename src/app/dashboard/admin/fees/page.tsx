"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Wallet,
  Loader2,
  RefreshCw,
  Save,
  Plus,
  Banknote,
  Search,
  Lock,
} from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "";
const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTIONS = ["All Sections", "Section A", "Section B"];
const inputCls =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30";

type Tab = "structure" | "catalog" | "cash" | "roster" | "history";

export default function AdminFeesPage() {
  const year = new Date().getFullYear().toString();
  const [tab, setTab] = useState<Tab>("structure");
  const [loading, setLoading] = useState(false);

  const [structures, setStructures] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const [catalog, setCatalog] = useState<any[]>([]);
  const [catForm, setCatForm] = useState({
    title: "",
    feeType: "EXAM" as "EXAM" | "CUSTOM",
    amount: "",
    studentClass: "ALL",
    section: "",
    dueDate: "",
    description: "",
  });

  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [studentQ, setStudentQ] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [cashSource, setCashSource] = useState<"MONTHLY" | "EXAM" | "CATALOG">("MONTHLY");
  const [cashMonth, setCashMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
  );
  const [cashCatalogId, setCashCatalogId] = useState("");
  const [payFine, setPayFine] = useState(true);
  const [savingCash, setSavingCash] = useState(false);

  const [roster, setRoster] = useState<any[]>([]);
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterSection, setFilterSection] = useState("All Sections");
  const [payments, setPayments] = useState<any[]>([]);
  const [payQ, setPayQ] = useState("");
  const [payMethod, setPayMethod] = useState("ALL");

  const loadStructure = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/structure?sessionYear=${year}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStructures(data.structures || []);
      setSettings(data.settings);
      const map: Record<string, string> = {};
      (data.structures || []).forEach((s: any) => {
        map[s.studentClass] = String(s.amount);
      });
      setAmounts(map);
    } catch (e: any) {
      toast.error(e.message || "Failed to load structure");
    } finally {
      setLoading(false);
    }
  }, [year]);

  const loadCatalog = useCallback(async () => {
    const res = await fetch(`${SERVER}/api/admin/fees/catalog?sessionYear=${year}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) setCatalog(data.catalog || []);
  }, [year]);

  const loadStudents = useCallback(async () => {
    const res = await fetch(`${SERVER}/api/admin/fees/roster?sessionYear=${year}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) setAllStudents(data.roster || []);
  }, [year]);

  const loadRoster = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ sessionYear: year });
      if (filterClass !== "All Classes") qs.set("studentClass", filterClass);
      if (filterSection !== "All Sections") qs.set("section", filterSection);
      const res = await fetch(`${SERVER}/api/admin/fees/roster?${qs}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoster(data.roster || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load roster");
    } finally {
      setLoading(false);
    }
  }, [year, filterClass, filterSection]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ sessionYear: year, limit: "50" });
      if (payQ) qs.set("q", payQ);
      if (payMethod !== "ALL") qs.set("method", payMethod);
      if (filterClass !== "All Classes") qs.set("studentClass", filterClass);
      const res = await fetch(`${SERVER}/api/admin/fees/payments?${qs}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPayments(data.payments || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [year, payQ, payMethod, filterClass]);

  useEffect(() => {
    if (tab === "structure") loadStructure();
    if (tab === "catalog") loadCatalog();
    if (tab === "cash") {
      loadCatalog();
      loadStudents();
    }
    if (tab === "roster") loadRoster();
    if (tab === "history") loadHistory();
  }, [tab, loadStructure, loadCatalog, loadStudents, loadRoster, loadHistory]);

  const studentHits = useMemo(() => {
    const q = studentQ.trim().toLowerCase();
    if (q.length < 1 || student) return [];
    return allStudents
      .filter((s) => {
        const name = (s.name || "").toLowerCase();
        const email = (s.email || "").toLowerCase();
        return name.includes(q) || email.includes(q);
      })
      .slice(0, 12);
  }, [allStudents, studentQ, student]);

  const seed = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/fees/structure/seed`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionYear: year }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Seeded Class 6–10");
      await loadStructure();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const saveAmount = async (studentClass: string) => {
    const amount = Number(amounts[studentClass]);
    if (!amount) return toast.error("Invalid amount");
    const res = await fetch(`${SERVER}/api/admin/fees/structure`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentClass, amount, sessionYear: year }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    toast.success(`${studentClass} updated`);
    loadStructure();
  };

  const createCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.title.trim()) return toast.error("Title required");
    if (!Number(catForm.amount)) return toast.error("Amount required");
    const res = await fetch(`${SERVER}/api/admin/fees/catalog`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: catForm.title.trim(),
        feeType: catForm.feeType,
        amount: Number(catForm.amount),
        studentClass: catForm.studentClass,
        section: catForm.section || undefined,
        dueDate: catForm.dueDate || undefined,
        description: catForm.description || undefined,
        sessionYear: year,
      }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    toast.success("Fee created — students will see it");
    setCatForm({
      title: "",
      feeType: "EXAM",
      amount: "",
      studentClass: "ALL",
      section: "",
      dueDate: "",
      description: "",
    });
    loadCatalog();
  };

  const pickStudent = (s: any) => {
    setStudent({
      id: s.studentId || s.id,
      name: s.name,
      email: s.email,
    });
    setStudentQ("");
  };

  const submitCash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student?.id) return toast.error("Select a student from the list");
    if (cashSource !== "MONTHLY" && !cashCatalogId) {
      return toast.error("Select a fee from the list");
    }
    setSavingCash(true);
    try {
      const body: any = {
        studentId: student.id,
        source: cashSource,
        sessionYear: year,
        payFine,
      };
      if (cashSource === "MONTHLY") body.month = cashMonth;
      else body.catalogId = cashCatalogId;
      const res = await fetch(`${SERVER}/api/admin/fees/payments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Cash recorded");
      setStudent(null);
      setStudentQ("");
      setCashCatalogId("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingCash(false);
    }
  };

  const examCatalog = catalog.filter((c) => c.isActive && c.feeType === "EXAM");
  const customCatalog = catalog.filter((c) => c.isActive && c.feeType === "CUSTOM");
  const cashList = cashSource === "EXAM" ? examCatalog : cashSource === "CATALOG" ? customCatalog : [];

  const tabs: { id: Tab; label: string }[] = [
    { id: "structure", label: "Monthly rates" },
    { id: "catalog", label: "Create fee" },
    { id: "cash", label: "Record cash" },
    { id: "roster", label: "Student status" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
            <Wallet className="h-5 w-5" />
          </span>
          Fees
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          Monthly rates, extra fees, cash collection, student status.
          {settings && (
            <span>
              {" "}
              Fine ৳{settings.fineAmount} · lock after {settings.lockAfterMonths} unpaid months.
            </span>
          )}
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 cursor-pointer ${
              tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "structure" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <button type="button" onClick={seed} className="rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer">
            Seed Class 6–10 defaults
          </button>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
            {CLASSES.map((c) => (
              <div key={c} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="w-24 text-sm font-bold">{c}</span>
                <input
                  type="number"
                  value={amounts[c] ?? ""}
                  onChange={(e) => setAmounts((a) => ({ ...a, [c]: e.target.value }))}
                  className={`flex-1 ${inputCls}`}
                />
                <button
                  type="button"
                  onClick={() => saveAmount(c)}
                  className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" /> Save
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {tab === "catalog" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-4">
          <form onSubmit={createCatalog} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-4">
            <p className="text-sm font-bold flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-600" /> New fee
            </p>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Type</p>
              <div className="flex gap-2">
                {(["EXAM", "CUSTOM"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCatForm({ ...catForm, feeType: t })}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold cursor-pointer ${
                      catForm.feeType === t ? "bg-indigo-600 text-white" : "border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {t === "EXAM" ? "Exam" : "Custom"}
                  </button>
                ))}
              </div>
            </div>

            <input required placeholder="Title e.g. Half Yearly Exam" value={catForm.title} onChange={(e) => setCatForm({ ...catForm, title: e.target.value })} className={inputCls} />
            <input required type="number" placeholder="Amount ৳" value={catForm.amount} onChange={(e) => setCatForm({ ...catForm, amount: e.target.value })} className={inputCls} />

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Class</p>
              <div className="flex flex-wrap gap-2">
                {["ALL", ...CLASSES].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCatForm({ ...catForm, studentClass: c })}
                    className={`rounded-xl px-3 py-2 text-[11px] font-bold cursor-pointer ${
                      catForm.studentClass === c ? "bg-indigo-600 text-white" : "border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {c === "ALL" ? "All classes" : c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Section</p>
              <div className="flex flex-wrap gap-2">
                {["", "Section A", "Section B"].map((s) => (
                  <button
                    key={s || "all"}
                    type="button"
                    onClick={() => setCatForm({ ...catForm, section: s })}
                    className={`rounded-xl px-3 py-2 text-[11px] font-bold cursor-pointer ${
                      catForm.section === s ? "bg-indigo-600 text-white" : "border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {s || "All sections"}
                  </button>
                ))}
              </div>
            </div>

            <input type="date" value={catForm.dueDate} onChange={(e) => setCatForm({ ...catForm, dueDate: e.target.value })} className={inputCls} />
            <input placeholder="Description (optional)" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className={inputCls} />
            <button type="submit" className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white cursor-pointer">
              Create fee
            </button>
          </form>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
            {catalog.length === 0 ? (
              <p className="p-8 text-sm text-slate-500 text-center">No extra fees yet. Create one on the left.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {catalog.map((c) => (
                  <li key={c.id} className="px-4 py-3">
                    <p className="text-sm font-bold">{c.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {c.feeType} · {c.studentClass} · ৳{c.amount}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}

      {tab === "cash" && (
        <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submitCash} className="max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-3">
          <p className="text-sm font-bold flex items-center gap-2">
            <Banknote className="h-4 w-4 text-indigo-600" /> Record cash
          </p>

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Student</p>
            <input
              value={student ? `${student.name} (${student.email})` : studentQ}
              onChange={(e) => {
                setStudent(null);
                setStudentQ(e.target.value);
              }}
              placeholder="Type name or email…"
              className={inputCls}
              autoComplete="off"
            />
            {studentHits.length > 0 && (
              <ul className="absolute z-30 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-xl max-h-56 overflow-y-auto">
                {studentHits.map((s) => (
                  <li key={s.studentId || s.id}>
                    <button type="button" onClick={() => pickStudent(s)} className="w-full text-left px-3 py-2.5 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer">
                      <span className="font-bold">{s.name}</span>
                      <span className="text-slate-500"> · {s.email}</span>
                      <span className="text-slate-400"> · {s.studentClass}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {!student && studentQ.length > 0 && studentHits.length === 0 && (
              <p className="mt-1 text-[11px] text-slate-500">No match. Open Student status tab once so roster can load, or seed students first.</p>
            )}
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Fee type</p>
          <div className="flex gap-2">
            {(["MONTHLY", "EXAM", "CATALOG"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setCashSource(s);
                  setCashCatalogId("");
                }}
                className={`flex-1 rounded-xl py-2 text-[11px] font-bold cursor-pointer ${
                  cashSource === s ? "bg-indigo-600 text-white" : "border border-slate-200 dark:border-slate-700"
                }`}
              >
                {s === "MONTHLY" ? "Monthly" : s === "EXAM" ? "Exam" : "Created"}
              </button>
            ))}
          </div>

          {cashSource === "MONTHLY" ? (
            <input type="month" value={cashMonth} onChange={(e) => setCashMonth(e.target.value)} className={inputCls} />
          ) : cashList.length === 0 ? (
            <p className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-3 py-2">
              No {cashSource === "EXAM" ? "exam" : "custom"} fees yet. Go to <strong>Create fee</strong> and add one first.
            </p>
          ) : (
            <div className="space-y-1.5">
              {cashList.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCashCatalogId(c.id)}
                  className={`w-full flex justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-bold cursor-pointer ${
                    cashCatalogId === c.id ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span>{c.title}</span>
                  <span>৳{c.amount}</span>
                </button>
              ))}
            </div>
          )}

          {cashSource === "MONTHLY" && (
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" checked={payFine} onChange={(e) => setPayFine(e.target.checked)} />
              Collect ৳500 monthly fine if due
            </label>
          )}

          <button type="submit" disabled={savingCash} className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer">
            {savingCash ? "Saving…" : "Save cash payment"}
          </button>
        </motion.form>
      )}

      {tab === "roster" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex gap-2">
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className={inputCls}>
              <option>All Classes</option>
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className={inputCls}>
              {SECTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button type="button" onClick={loadRoster} className="rounded-xl border px-3 cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="rounded-2xl border overflow-x-auto bg-white dark:bg-slate-950 dark:border-slate-800">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {["Student", "Class", "Unpaid months", "Fine", "Catalog due", "Access"].map((h) => (
                      <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roster.map((r) => (
                    <tr key={r.studentId} className="border-b border-slate-50 dark:border-slate-800/60">
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold">{r.name}</p>
                        <p className="text-[10px] text-slate-400">{r.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {r.studentClass} {r.section}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold">{r.unpaidMonths}</td>
                      <td className="px-4 py-3 text-xs">৳{r.fineDue}</td>
                      <td className="px-4 py-3 text-xs">৳{r.catalogDue}</td>
                      <td className="px-4 py-3">
                        {r.blocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                            <Lock className="h-3 w-3" /> Locked
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600">Open</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}

      {tab === "history" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input value={payQ} onChange={(e) => setPayQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadHistory()} placeholder="Search…" className={`pl-9 ${inputCls}`} />
            </div>
            <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} className={inputCls}>
              <option value="ALL">All</option>
              <option value="CASH">Cash</option>
              <option value="SSL">SSLCommerz</option>
            </select>
            <button type="button" onClick={loadHistory} className="rounded-xl border px-3 text-xs font-bold cursor-pointer">
              Refresh
            </button>
          </div>
          <div className="rounded-2xl border overflow-x-auto bg-white dark:bg-slate-950 dark:border-slate-800">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {["Student", "Type", "Amount", "Method", "Status", "Receipt"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 dark:border-slate-800/60">
                    <td className="px-4 py-3 text-xs font-bold">{p.studentName}</td>
                    <td className="px-4 py-3 text-xs">
                      {p.feeType} {p.month || ""}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">৳{p.amount}</td>
                    <td className="px-4 py-3 text-xs">{p.methodLabel || p.gateway || p.method}</td>
                    <td className="px-4 py-3 text-xs">{p.gatewayStatus || p.status}</td>
                    <td className="px-4 py-3 text-[11px] font-mono">{p.receiptNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}