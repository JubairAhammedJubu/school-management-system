"use client";

// Place at: app/dashboard/student/fee/page.tsx
// (pages router hole "use client" muche default export page e boshao)

import { useCallback, useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Payment = {
  id: string;
  feeType: string;
  month?: string | null;
  amount: number;
  gatewayAmount?: number | null;
  receiptNo: string;
  paidAt: string;
  status: string;
  methodLabel?: string;
};

type CatalogItem = {
  id: string;
  title: string;
  description?: string | null;
  feeType: string;
  amount: number;
  dueDate?: string | null;
  status: "PAID" | "PENDING" | "DUE";
};

type FeesData = {
  blocked: boolean;
  monthly: {
    month: string;
    amount: number;
    paid: number;
    due: number;
    status: "PAID" | "DUE";
  };
  unpaidMonths: string[];
  fine: { applicable: boolean; amount: number; paid: boolean; due: number };
  catalog: CatalogItem[];
  pending: Payment[];
  history: Payment[];
};

const taka = (n: number) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

function monthLabel(key?: string | null) {
  if (!key) return "-";
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const STATUS_MESSAGES: Record<string, { text: string; tone: string }> = {
  success: {
    text: "Payment successful! Receipt niche history te pabe.",
    tone: "bg-green-50 text-green-800 border-green-200",
  },
  fail: {
    text: "Payment fail hoyeche. Abar try koro.",
    tone: "bg-red-50 text-red-800 border-red-200",
  },
  cancel: {
    text: "Payment cancel kora hoyeche.",
    tone: "bg-yellow-50 text-yellow-800 border-yellow-200",
  },
  error: {
    text: "Payment verify korte somoshya hoyeche. Pending e thakle kichukkhon por refresh koro.",
    tone: "bg-red-50 text-red-800 border-red-200",
  },
};

export default function StudentFeePage() {
  const [data, setData] = useState<FeesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [banner, setBanner] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/student/fees`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load fees");
      setData(json);
      setLoadError("");
    } catch (e: any) {
      setLoadError(e?.message || "Failed to load fees");
    } finally {
      setLoading(false);
    }
  }, []);

  // SSL redirect theke ashle ?status=... dekhao, URL clean koro
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status && STATUS_MESSAGES[status]) {
      setBanner(status);
      window.history.replaceState({}, "", window.location.pathname);
    }
    load();
  }, [load]);

  async function startPayment(
    key: string,
    body: Record<string, unknown>,
  ) {
    setBusyKey(key);
    setActionError("");
    try {
      const res = await fetch(`${API}/api/student/fees/ssl/init`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json?.message || json?.error || "Payment start hoy ni");
      }
      window.location.href = json.url; // SSLCommerz gateway
    } catch (e: any) {
      setActionError(e?.message || "Payment start hoy ni");
      setBusyKey(null);
      load(); // 409 hole state refresh
    }
  }

  async function cancelPending(paymentId: string) {
    setBusyKey(`cancel-${paymentId}`);
    setActionError("");
    try {
      const res = await fetch(`${API}/api/student/fees/ssl/cancel-pending`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Cancel hoy ni");
      await load();
    } catch (e: any) {
      setActionError(e?.message || "Cancel hoy ni");
    } finally {
      setBusyKey(null);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Loading fees...</div>;
  }
  if (loadError || !data) {
    return (
      <div className="p-6">
        <p className="text-red-600">{loadError || "Something went wrong"}</p>
        <button
          onClick={() => {
            setLoading(true);
            load();
          }}
          className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const { monthly, unpaidMonths, fine, catalog, pending, history, blocked } =
    data;
  const rate = monthly.amount;
  const hasPendingMonthly = (m: string) =>
    pending.some((p) => p.feeType === "MONTHLY" && p.month === m);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">My Fees</h1>

      {banner && (
        <div
          className={`flex items-start justify-between rounded-lg border p-3 text-sm ${STATUS_MESSAGES[banner].tone}`}
        >
          <span>{STATUS_MESSAGES[banner].text}</span>
          <button onClick={() => setBanner(null)} className="ml-4 font-bold">
            ×
          </button>
        </div>
      )}

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {actionError}
        </div>
      )}

      {blocked && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Account access restricted</p>
          <p className="mt-1">
            3 mashe er beshi monthly fee baki. Niche theke baki fee pay korle
            access abar chalu hobe (3 ba tar kom baki thakle).
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">
            This month ({monthLabel(monthly.month)})
          </p>
          <p className="mt-1 text-xl font-semibold">{taka(rate)}</p>
          <span
            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              monthly.status === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {monthly.status}
          </span>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Unpaid months</p>
          <p className="mt-1 text-xl font-semibold">{unpaidMonths.length}</p>
          <p className="mt-2 text-xs text-gray-500">
            Total: {taka(unpaidMonths.length * rate)}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Late fine</p>
          <p className="mt-1 text-xl font-semibold">{taka(fine.due)}</p>
          <p className="mt-2 text-xs text-gray-500">
            {fine.paid
              ? "Paid"
              : fine.applicable
                ? "Pay korar shomoy auto add hobe"
                : "No fine"}
          </p>
        </div>
      </div>

      {/* Unpaid months */}
      <section className="rounded-xl border">
        <div className="border-b p-4">
          <h2 className="font-medium">Monthly fee</h2>
          <p className="text-xs text-gray-500">
            Purono month theke pay koro. Fine thakle prothom payment e add hoy.
          </p>
        </div>
        {unpaidMonths.length === 0 ? (
          <p className="p-4 text-sm text-green-700">
            Shob monthly fee paid. 🎉
          </p>
        ) : (
          <ul className="divide-y">
            {unpaidMonths.map((m, i) => {
              const isPending = hasPendingMonthly(m);
              const withFine = i === 0 ? fine.due : 0; // backend e fine prothom payment e jay
              const key = `month-${m}`;
              return (
                <li
                  key={m}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="font-medium">{monthLabel(m)}</p>
                    <p className="text-xs text-gray-500">
                      {taka(rate)}
                      {withFine > 0 && ` + ${taka(withFine)} fine`}
                      {isPending && " · Pending payment ache"}
                    </p>
                  </div>
                  <button
                    disabled={busyKey !== null}
                    onClick={() =>
                      startPayment(key, { feeType: "MONTHLY", month: m })
                    }
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {busyKey === key
                      ? "Redirecting..."
                      : `Pay ${taka(rate + withFine)}`}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Other fees (exam / custom) */}
      {catalog.length > 0 && (
        <section className="rounded-xl border">
          <div className="border-b p-4">
            <h2 className="font-medium">Exam & other fees</h2>
          </div>
          <ul className="divide-y">
            {catalog.map((c) => {
              const key = `cat-${c.id}`;
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-gray-500">
                      {taka(c.amount)}
                      {c.dueDate &&
                        ` · Due ${new Date(c.dueDate).toLocaleDateString()}`}
                    </p>
                    {c.description && (
                      <p className="mt-1 text-xs text-gray-400">
                        {c.description}
                      </p>
                    )}
                  </div>
                  {c.status === "PAID" ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Paid
                    </span>
                  ) : c.status === "PENDING" ? (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                      Pending
                    </span>
                  ) : (
                    <button
                      disabled={busyKey !== null}
                      onClick={() =>
                        startPayment(key, {
                          feeType: c.feeType,
                          catalogId: c.id,
                        })
                      }
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {busyKey === key
                        ? "Redirecting..."
                        : `Pay ${taka(c.amount)}`}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <section className="rounded-xl border border-yellow-200 bg-yellow-50/50">
          <div className="border-b border-yellow-200 p-4">
            <h2 className="font-medium">Pending payments</h2>
            <p className="text-xs text-gray-600">
              Gateway theke back korle ekhane atke thake. Cancel kore abar
              pay korte paro. Taka kete thakle cancel korar age verify hoy.
            </p>
          </div>
          <ul className="divide-y divide-yellow-200">
            {pending.map((p) => {
              const key = `cancel-${p.id}`;
              return (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="font-medium">
                      {p.feeType === "MONTHLY"
                        ? `Monthly · ${monthLabel(p.month)}`
                        : p.feeType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {taka(p.gatewayAmount ?? p.amount)} ·{" "}
                      {new Date(p.paidAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    disabled={busyKey !== null}
                    onClick={() => cancelPending(p.id)}
                    className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {busyKey === key ? "Cancelling..." : "Cancel"}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* History */}
      <section className="rounded-xl border">
        <div className="border-b p-4">
          <h2 className="font-medium">Payment history</h2>
        </div>
        {history.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">Ekhono kono payment nai.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">Receipt</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Month</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {history.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 font-mono text-xs">
                      {p.receiptNo}
                    </td>
                    <td className="px-4 py-2">{p.feeType}</td>
                    <td className="px-4 py-2">
                      {p.month ? monthLabel(p.month) : "-"}
                    </td>
                    <td className="px-4 py-2">{p.methodLabel || "-"}</td>
                    <td className="px-4 py-2 text-right">{taka(p.amount)}</td>
                    <td className="px-4 py-2">
                      {new Date(p.paidAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}