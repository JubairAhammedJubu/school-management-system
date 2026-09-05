"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Sparkles,
  Mail,
  Clock,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  Inbox,
} from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// Same bearer-token fallback pattern used on the Security admin page.
function authedFetch(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("better-auth.session_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${SERVER_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
}

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

function roleBadge(role: string) {
  const normalized = role.toLowerCase();
  if (normalized === "teacher") {
    return {
      icon: Briefcase,
      classes:
        "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border-purple-100 dark:border-purple-900/40",
    };
  }
  return {
    icon: GraduationCap,
    classes:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-100 dark:border-blue-900/40",
  };
}

export default function AdminApprovalsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  const loadPendingUsers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await authedFetch("/api/admin/pending-users");
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Could not load pending users.");
      }
      setPendingUsers(result.users ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load pending users.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user && rawRole === "admin") {
      loadPendingUsers();
    }
  }, [session, rawRole, loadPendingUsers]);

  if (isPending) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (!session?.user || rawRole !== "admin") {
    return null;
  }

  const handleApprove = async (user: PendingUser) => {
    if (approvingId) return;
    setApprovingId(user.id);

    try {
      const response = await authedFetch("/api/admin/approve-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to approve user.");
      }
      toast.success(`${user.name} can now log in.`);
      setPendingUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to approve user.";
      toast.error(message);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-blue-50/30 to-white/90 dark:from-slate-900/90 dark:via-blue-950/20 dark:to-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl"
      >
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              ACCOUNT ACCESS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Pending Approvals
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              New registrations can&apos;t log in until you approve them
              here. Their login button stays disabled and switches on
              automatically the moment you approve.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPendingUsers}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-60"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* List */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl"
      >
        {loadError && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400 mb-4">
            {loadError}
          </p>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10 gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Inbox size={20} />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              All caught up
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No accounts are waiting on approval right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {pendingUsers.map((user) => {
                const badge = roleBadge(user.role);
                const BadgeIcon = badge.icon;
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 sm:p-5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-extrabold shadow-md shadow-blue-500/20">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.classes}`}
                          >
                            <BadgeIcon size={10} />
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                          <Mail size={11} className="shrink-0" />
                          {user.email}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock size={10} className="shrink-0" />
                          Registered{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={() => handleApprove(user)}
                      disabled={approvingId === user.id}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-emerald-500/20 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                    >
                      {approvingId === user.id ? (
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck size={13} />
                          Approve
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
