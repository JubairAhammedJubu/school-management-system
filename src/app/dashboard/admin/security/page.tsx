"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
  Search,
  Mail,
  KeyRound,
  RefreshCw,
  Sparkles,
  X,
  AlertTriangle,
} from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// Mirrors the bearer-token pattern in @/lib/auth-client so these plain
// fetches to our own /api/admin/* routes carry the same auth as the rest
// of the app (better-auth session cookie + localStorage bearer fallback).
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

interface LookedUpUser {
  name: string;
  email: string;
  twoFactorEnabled: boolean;
}

export default function AdminSecurityPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  const [searchEmail, setSearchEmail] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [foundUser, setFoundUser] = useState<LookedUpUser | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

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

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = searchEmail.trim().toLowerCase();
    if (!email || isLookingUp) return;

    setIsLookingUp(true);
    setLookupError("");
    setFoundUser(null);

    try {
      const response = await authedFetch(
        `/api/admin/user-2fa-status?email=${encodeURIComponent(email)}`,
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Could not find that user.");
      }
      setFoundUser(result.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not find that user.";
      setLookupError(message);
      toast.error(message);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleResetConfirmed = async () => {
    if (!foundUser || isResetting) return;
    setIsResetting(true);

    try {
      const response = await authedFetch("/api/admin/reset-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: foundUser.email }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to reset 2FA.");
      }
      toast.success(result.message ?? "2FA reset successfully.");
      setFoundUser({ ...foundUser, twoFactorEnabled: false });
      setShowConfirm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reset 2FA.";
      toast.error(message);
    } finally {
      setIsResetting(false);
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

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            ACCOUNT SECURITY
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Two-Factor Recovery
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            For a user who lost their authenticator app and has no backup
            codes. Resetting clears their old authenticator entirely — the
            old QR code can&apos;t be recovered. They&apos;ll simply be
            prompted to set up a brand-new authenticator the next time they
            log in with their email and password.
          </p>
        </div>
      </motion.div>

      {/* Lookup form */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl"
      >
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
              <Mail size={16} />
            </div>
            <input
              type="email"
              required
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="user@edunexus.std.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isLookingUp || !searchEmail.trim()}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/20 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLookingUp ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <>
                <Search size={15} />
                Look up
              </>
            )}
          </motion.button>
        </form>

        {lookupError && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400 mt-3 ml-1">
            {lookupError}
          </p>
        )}

        <AnimatePresence mode="wait">
          {foundUser && (
            <motion.div
              key={foundUser.email}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    foundUser.twoFactorEnabled
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {foundUser.twoFactorEnabled ? (
                    <ShieldCheck size={18} />
                  ) : (
                    <ShieldOff size={18} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {foundUser.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {foundUser.email}
                  </p>
                  <p
                    className={`text-[11px] font-semibold mt-0.5 ${
                      foundUser.twoFactorEnabled
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {foundUser.twoFactorEnabled
                      ? "Authenticator app enrolled"
                      : "No authenticator app enrolled"}
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={!foundUser.twoFactorEnabled}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-red-500/20 disabled:shadow-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <RefreshCw size={13} />
                {foundUser.twoFactorEnabled ? "Reset 2FA" : "Already reset"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirm && foundUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={() => !isResetting && setShowConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <button
                type="button"
                onClick={() => !isResetting && setShowConfirm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 mb-3">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset 2FA for {foundUser.name}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                This permanently removes their current authenticator secret
                — the old QR code cannot be recovered afterwards. On their
                next login, they&apos;ll go straight to setting up a brand
                new authenticator, same as a first-time login.
              </p>

              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={isResetting}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetConfirmed}
                  disabled={isResetting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isResetting ? (
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  ) : (
                    <>
                      <KeyRound size={14} />
                      Yes, reset it
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info footer */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 flex items-start gap-3"
      >
        <ShieldAlert
          size={18}
          className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
        />
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          There is no backup-code system in EduNexus, so this reset is the
          only recovery path for a lost authenticator. Only use it after
          verifying the request came from the actual account owner through
          another trusted channel.
        </p>
      </motion.div>
    </div>
  );
}
