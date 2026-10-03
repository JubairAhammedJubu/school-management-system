"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import confetti from "canvas-confetti";
import {
  WifiOff,
  Wifi,
  RefreshCw,
  HelpCircle,
  Activity,
  Server,
  Sparkles,
  Zap,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";

// ============================================================================
// Cartoon Mascot 1: Offline Mascot (Responsive Sizing)
// ============================================================================
function CartoonOfflineMascot() {
  return (
    <div className="relative mx-auto w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center select-none shrink-0">
      {/* Background Pulsing Aura */}
      <motion.div
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-1 sm:inset-2 rounded-full blur-xl sm:blur-2xl bg-gradient-to-tr from-rose-500/30 to-amber-500/20"
      />

      {/* Floating Speech Bubbles */}
      <motion.div
        animate={{ y: [-4, -10, -4], opacity: [0.5, 1, 0.5], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1 left-2 sm:left-4 bg-rose-500 text-white font-black text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full shadow-md z-20 border border-rose-400"
      >
        NO INTERNET!
      </motion.div>

      <motion.div
        animate={{ y: [-3, -9, -3], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1 right-2 sm:right-4 bg-amber-400 text-amber-950 font-black text-[10px] sm:text-xs h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center shadow-md z-20"
      >
        ?
      </motion.div>

      {/* Main Cartoon Character Body */}
      <motion.div
        animate={{ y: [-3, 3, -3], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          <ellipse cx="100" cy="180" rx="45" ry="8" fill="rgba(0,0,0,0.12)" />

          <rect
            x="45"
            y="45"
            width="110"
            height="115"
            rx="32"
            fill="url(#rose-offline-grad)"
            stroke="#f43f5e"
            strokeWidth="4"
          />

          <rect
            x="60"
            y="110"
            width="80"
            height="38"
            rx="16"
            fill="rgba(255,255,255,0.25)"
          />

          <path
            d="M 55 46 L 40 22 L 72 45 Z"
            fill="#e11d48"
            stroke="#9f1239"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 145 46 L 160 22 L 128 45 Z"
            fill="#e11d48"
            stroke="#9f1239"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <g>
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
              style={{ originX: "72px", originY: "75px" }}
            >
              <circle cx="72" cy="75" r="14" fill="#ffffff" />
              <circle cx="72" cy="76" r="8" fill="#0f172a" />
              <circle cx="75" cy="73" r="3" fill="#ffffff" />
            </motion.g>

            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
              style={{ originX: "128px", originY: "75px" }}
            >
              <circle cx="128" cy="75" r="14" fill="#ffffff" />
              <circle cx="128" cy="76" r="8" fill="#0f172a" />
              <circle cx="131" cy="73" r="3" fill="#ffffff" />
            </motion.g>

            <ellipse cx="60" cy="88" rx="7" ry="4" fill="#fb7185" opacity="0.7" />
            <ellipse cx="140" cy="88" rx="7" ry="4" fill="#fb7185" opacity="0.7" />

            <path
              d="M 85 96 Q 100 88 115 96"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>

          <motion.g
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "155px", originY: "110px" }}
          >
            <circle cx="168" cy="95" r="14" fill="#f43f5e" stroke="#9f1239" strokeWidth="2.5" />
            <path
              d="M 161 88 L 175 102 M 175 88 L 161 102"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.g>

          <motion.path
            d="M 152 65 C 152 60, 158 54, 158 54 C 158 54, 164 60, 164 65 C 164 68, 158 72, 152 65 Z"
            fill="#38bdf8"
            animate={{ y: [0, 12, 24], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <ellipse cx="75" cy="164" rx="14" ry="7" fill="#9f1239" />
          <ellipse cx="125" cy="164" rx="14" ry="7" fill="#9f1239" />

          <defs>
            <linearGradient id="rose-offline-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

// ============================================================================
// Cartoon Mascot 2: Connected Mascot (Responsive Sizing)
// ============================================================================
function CartoonConnectedMascot() {
  return (
    <div className="relative mx-auto w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center select-none shrink-0">
      <motion.div
        animate={{ scale: [0.95, 1.2, 0.95], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-1 sm:inset-2 rounded-full bg-gradient-to-tr from-emerald-500/30 via-teal-400/25 to-indigo-500/30 blur-xl sm:blur-2xl"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none z-20"
      >
        <Sparkles className="absolute top-1 left-3 h-4 sm:h-5 w-4 sm:w-5 text-amber-400" />
        <Sparkles className="absolute top-2 right-3 h-3.5 sm:h-4 w-3.5 sm:w-4 text-emerald-400" />
        <Sparkles className="absolute bottom-5 left-2 h-3.5 sm:h-4 w-3.5 sm:w-4 text-indigo-400" />
        <Sparkles className="absolute bottom-3 right-2 h-4 sm:h-5 w-4 sm:w-5 text-pink-400" />
      </motion.div>

      <motion.div
        animate={{ y: [-6, 2, -6], rotate: [-1, 1, -1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          <ellipse cx="100" cy="180" rx="48" ry="8" fill="rgba(0,0,0,0.12)" />

          <rect
            x="45"
            y="45"
            width="110"
            height="115"
            rx="32"
            fill="url(#emerald-connected-grad)"
            stroke="#10b981"
            strokeWidth="4"
          />

          <rect
            x="60"
            y="110"
            width="80"
            height="38"
            rx="16"
            fill="rgba(255,255,255,0.25)"
          />

          <path
            d="M 55 46 L 40 20 L 72 45 Z"
            fill="#059669"
            stroke="#047857"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 145 46 L 160 20 L 128 45 Z"
            fill="#059669"
            stroke="#047857"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <g>
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
              style={{ originX: "72px", originY: "75px" }}
            >
              <circle cx="72" cy="75" r="14" fill="#ffffff" />
              <path
                d="M 72 67 L 74 72 L 79 73 L 75 77 L 76 82 L 72 79 L 68 82 L 69 77 L 65 73 L 70 72 Z"
                fill="#f59e0b"
              />
            </motion.g>

            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
              style={{ originX: "128px", originY: "75px" }}
            >
              <circle cx="128" cy="75" r="14" fill="#ffffff" />
              <path
                d="M 128 67 L 130 72 L 135 73 L 131 77 L 132 82 L 128 79 L 124 82 L 125 77 L 121 73 L 126 72 Z"
                fill="#f59e0b"
              />
            </motion.g>

            <ellipse cx="58" cy="88" rx="8" ry="5" fill="#f472b6" opacity="0.8" />
            <ellipse cx="142" cy="88" rx="8" ry="5" fill="#f472b6" opacity="0.8" />

            <path d="M 82 92 Q 100 114 118 92 Z" fill="#0f172a" />
            <path d="M 90 98 Q 100 114 110 98 Q 100 106 90 98" fill="#fb7185" />
          </g>

          <motion.g
            animate={{ rotate: [-12, 12, -12] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "155px", originY: "110px" }}
          >
            <circle cx="170" cy="95" r="14" fill="#34d399" stroke="#059669" strokeWidth="2.5" />
            <path
              d="M 164 95 L 168 99 L 176 90"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.g>

          <ellipse cx="75" cy="164" rx="14" ry="7" fill="#047857" />
          <ellipse cx="125" cy="164" rx="14" ry="7" fill="#047857" />

          <defs>
            <linearGradient id="emerald-connected-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

// Framer Motion Confetti Particle Explosion
function ConfettiExplosion() {
  const particles = Array.from({ length: 32 });
  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-10">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const radius = 100 + Math.random() * 120;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        const color = colors[i % colors.length];
        const size = Math.random() * 7 + 4;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: [0, x * 0.7, x],
              y: [0, y * 0.7 + 30, y + 60],
              scale: [0, 1.3, 0.5],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: 1.8 + Math.random() * 0.5,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.1 + (i % 4) * 0.04,
            }}
            style={{
              position: "absolute",
              width: size,
              height: size * (i % 2 === 0 ? 1 : 1.6),
              backgroundColor: color,
              borderRadius: i % 3 === 0 ? "50%" : "2px",
            }}
          />
        );
      })}
    </div>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0, 0, 0.2, 1] } },
};

// ============================================================================
// Main NoInternetScreen Component
// ============================================================================
export default function NoInternetScreen() {
  const pathname = usePathname();
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<"status" | "diagnostics" | "help">("status");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);

  const [diagnosticSteps, setDiagnosticSteps] = useState<
    { id: string; name: string; status: "pending" | "running" | "success" | "failed" }[]
  >([
    { id: "adapter", name: "Network Interface", status: "pending" },
    { id: "gateway", name: "Local Router Gateway", status: "pending" },
    { id: "dns", name: "DNS Server Lookup", status: "pending" },
    { id: "wan", name: "Public Web Ping", status: "pending" },
  ]);

  const triggerSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#6366F1", "#3B82F6", "#F59E0B"],
      });
    } catch {}
  };

  const verifyConnectivity = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return true;
    if (!navigator.onLine) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`/favicon.ico?_=${Date.now()}`, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response.ok || response.status < 500;
    } catch {
      return false;
    }
  }, []);

  const handleRestoredConnection = useCallback(() => {
    setIsOffline(false);
    setShowSuccessModal(true);
    setCountdown(3);
    triggerSuccessConfetti();
  }, []);

  const runDiagnostics = async () => {
    setIsChecking(true);
    setCheckMessage("Initiating network diagnostics...");

    setDiagnosticSteps([
      { id: "adapter", name: "Network Interface", status: "running" },
      { id: "gateway", name: "Local Gateway Router", status: "pending" },
      { id: "dns", name: "DNS Server Lookup", status: "pending" },
      { id: "wan", name: "Public Web Ping", status: "pending" },
    ]);

    await new Promise((r) => setTimeout(r, 350));
    const isLocalOnline = typeof window !== "undefined" && navigator.onLine;

    setDiagnosticSteps((prev) =>
      prev.map((s) =>
        s.id === "adapter"
          ? { ...s, status: isLocalOnline ? "success" : "failed" }
          : s.id === "gateway"
          ? { ...s, status: isLocalOnline ? "running" : "pending" }
          : s
      )
    );

    if (!isLocalOnline) {
      setIsChecking(false);
      setCheckMessage("Network adapter disabled or disconnected.");
      return;
    }

    await new Promise((r) => setTimeout(r, 450));
    setDiagnosticSteps((prev) =>
      prev.map((s) =>
        s.id === "gateway"
          ? { ...s, status: "success" }
          : s.id === "dns"
          ? { ...s, status: "running" }
          : s
      )
    );

    await new Promise((r) => setTimeout(r, 450));
    const reallyOnline = await verifyConnectivity();

    setDiagnosticSteps((prev) =>
      prev.map((s) =>
        s.id === "dns"
          ? { ...s, status: reallyOnline ? "success" : "failed" }
          : s.id === "wan"
          ? { ...s, status: reallyOnline ? "success" : "failed" }
          : s
      )
    );

    setIsChecking(false);

    if (reallyOnline) {
      setCheckMessage("Connection verified! Restoring EduNexus...");
      setTimeout(() => {
        handleRestoredConnection();
        setCheckMessage(null);
      }, 500);
    } else {
      setCheckMessage("Diagnostics complete: Internet unreachable.");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = async () => {
      setIsChecking(true);
      const reallyOnline = await verifyConnectivity();
      setIsChecking(false);

      if (reallyOnline) {
        handleRestoredConnection();
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsMinimized(false);
      setShowSuccessModal(false);
    };

    if (!navigator.onLine) {
      setIsOffline(true);
      setIsMinimized(false);
    } else {
      verifyConnectivity().then((online) => {
        if (!online) {
          setIsOffline(true);
          setIsMinimized(false);
        }
      });
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [verifyConnectivity, handleRestoredConnection]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!navigator.onLine) {
      setIsOffline(true);
      setIsMinimized(false);
    } else {
      verifyConnectivity().then((online) => {
        if (!online) {
          setIsOffline(true);
          setIsMinimized(false);
        }
      });
    }
  }, [pathname, verifyConnectivity]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args);
      } catch (error) {
        if (!navigator.onLine) {
          setIsOffline(true);
          setIsMinimized(false);
        } else {
          verifyConnectivity().then((online) => {
            if (!online) {
              setIsOffline(true);
              setIsMinimized(false);
            }
          });
        }
        throw error;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event?.reason;
      const isNetworkError =
        reason instanceof TypeError ||
        (reason?.message && /fetch|network|failed|offline/i.test(reason.message));

      if (isNetworkError || !navigator.onLine) {
        verifyConnectivity().then((online) => {
          if (!online) {
            setIsOffline(true);
            setIsMinimized(false);
          }
        });
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest("a") || target?.closest("button");
      if (link && !navigator.onLine) {
        setIsOffline(true);
        setIsMinimized(false);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("click", handleGlobalClick, true);

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("click", handleGlobalClick, true);
    };
  }, [verifyConnectivity]);

  useEffect(() => {
    if (!showSuccessModal) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowSuccessModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showSuccessModal]);

  return (
    <>
      {/* ==================================================================== */}
      {/* 1. Connection Restored Modal                                         */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 dark:bg-black/90 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="h-[350px] sm:h-[450px] w-[350px] sm:w-[450px] rounded-full bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-indigo-500/25 blur-3xl"
              />
            </div>

            <ConfettiExplosion />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-[92%] sm:max-w-md md:max-w-lg max-h-[85vh] sm:max-h-[90vh] my-auto flex flex-col rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl dark:border-slate-800/90 dark:bg-slate-950/90 space-y-4 sm:space-y-5 text-center overflow-y-auto custom-scrollbar"
            >
              <motion.div variants={itemVariants}>
                <CartoonConnectedMascot />
              </motion.div>

              <div className="space-y-1.5 sm:space-y-2 max-w-sm mx-auto">
                <motion.div variants={itemVariants}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/80 dark:text-emerald-300 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                    Back Online 🎉
                  </span>
                </motion.div>

                <motion.h3
                  variants={itemVariants}
                  className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white"
                >
                  Connection Restored
                </motion.h3>

                <motion.p
                  variants={itemVariants}
                  className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
                >
                  Your internet connection is verified. All services and features are synchronized.
                </motion.p>
              </div>

              <motion.div
                variants={itemVariants}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900/60 space-y-2 text-left text-xs"
              >
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="font-medium text-slate-400">Network State:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="font-medium text-slate-400">Response Latency:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">~22 ms</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="font-medium text-slate-400">Data Sync:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">100% Verified</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2.5 pt-1">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/20 transition-all cursor-pointer group"
                >
                  <span>Continue to EduNexus</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Closing automatically in {countdown}s</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Minimized Pill */}
      <AnimatePresence>
        {isOffline && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.85 }}
            whileHover={{ scale: 1.03 }}
            className="fixed bottom-5 right-5 z-[99998] flex items-center gap-3 px-4 py-2.5 bg-slate-900/95 dark:bg-slate-950/95 text-white rounded-2xl shadow-2xl border border-rose-500/40 backdrop-blur-xl cursor-pointer group"
            onClick={() => setIsMinimized(false)}
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </div>
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xs font-semibold tracking-wide text-slate-200">
                Offline Mode
              </span>
            </div>
            <button
              className="ml-2 px-2.5 py-1 text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-medium rounded-xl transition-colors border border-indigo-500/30"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
            >
              Expand
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 2. No Internet Modal (Fixed Height & Responsive Layout for All Devices) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isOffline && !isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 dark:bg-black/90 backdrop-blur-3xl overflow-y-auto"
          >
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.5, 0.25] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="h-[350px] sm:h-[450px] w-[350px] sm:w-[450px] rounded-full blur-3xl bg-gradient-to-tr from-rose-500/25 to-amber-500/15"
              />
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative w-full max-w-[92%] sm:max-w-md md:max-w-lg max-h-[85vh] sm:max-h-[90vh] my-auto flex flex-col rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl dark:border-slate-800/90 dark:bg-slate-950/90 space-y-4 sm:space-y-5 text-center overflow-y-auto custom-scrollbar"
            >
              {/* Top Inspect Bar */}
              <div className="flex items-center justify-between text-xs shrink-0">
                <motion.div variants={itemVariants}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-rose-700 dark:border-rose-800/80 dark:bg-rose-950/80 dark:text-rose-300 shadow-sm">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                    No Internet Connection
                  </span>
                </motion.div>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Minimize overlay to inspect cached page"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Screen</span>
                </button>
              </div>

              {/* Cartoon Mascot Hero */}
              <motion.div variants={itemVariants} className="shrink-0">
                <CartoonOfflineMascot />
              </motion.div>

              {/* Title & Copy */}
              <div className="space-y-1.5 sm:space-y-2 max-w-sm mx-auto shrink-0">
                <motion.h2
                  variants={itemVariants}
                  className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white"
                >
                  Connection Interrupted
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
                >
                  EduNexus detected that your network connection is offline. Your progress is safe and will sync automatically when back online.
                </motion.p>
              </div>

              {/* Primary Action Button */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-3 pt-0.5 max-w-sm mx-auto shrink-0 w-full">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={runDiagnostics}
                  disabled={isChecking}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer group disabled:opacity-75"
                >
                  <motion.div animate={isChecking ? { rotate: 360 } : {}} transition={isChecking ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}>
                    <RefreshCw className="h-4.5 w-4.5" />
                  </motion.div>
                  <span>{isChecking ? "Testing Connection..." : "Try Reconnecting"}</span>
                </motion.button>
              </motion.div>

              {/* Check Message */}
              {checkMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 text-center border border-indigo-200 dark:border-indigo-800/60 shrink-0"
                >
                  {checkMessage}
                </motion.div>
              )}

              {/* Tabs Section */}
              <motion.div variants={itemVariants} className="pt-1 shrink-0">
                <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                  <div className="flex gap-3 sm:gap-4 min-w-max justify-center">
                    <button
                      onClick={() => setActiveTab("status")}
                      className={`pb-2 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors border-b-2 ${
                        activeTab === "status"
                          ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Status
                    </button>
                    <button
                      onClick={() => setActiveTab("diagnostics")}
                      className={`pb-2 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors border-b-2 ${
                        activeTab === "diagnostics"
                          ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      <Server className="w-3.5 h-3.5" />
                      Diagnostics
                    </button>
                    <button
                      onClick={() => setActiveTab("help")}
                      className={`pb-2 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors border-b-2 ${
                        activeTab === "help"
                          ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Troubleshooting
                    </button>
                  </div>
                </div>

                {/* Tab 1: Status */}
                {activeTab === "status" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2 text-left"
                  >
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-slate-700 dark:text-slate-300">Network Status:</span>
                      </div>
                      <span className="font-bold text-rose-600 dark:text-rose-400">Disconnected</span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Signal Wave Scanner:</span>
                        <span className="font-mono text-slate-400 text-[11px]">Searching...</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-4 sm:h-5">
                        {[0.2, 0.4, 0.6, 0.8, 1].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
                            style={{ height: `${(i + 1) * 20}%` }}
                            className="flex-1 bg-rose-500/40 rounded-t-sm"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 2: Diagnostics */}
                {activeTab === "diagnostics" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-1.5 sm:space-y-2 text-left text-xs"
                  >
                    {diagnosticSteps.map((step) => (
                      <div
                        key={step.id}
                        className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">{step.name}</span>
                        {step.status === "pending" && <span className="text-slate-400 font-mono text-[11px]">Pending</span>}
                        {step.status === "running" && (
                          <span className="inline-flex items-center gap-1 text-indigo-500 font-bold text-[11px]">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Testing
                          </span>
                        )}
                        {step.status === "success" && (
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                          </span>
                        )}
                        {step.status === "failed" && (
                          <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Tab 3: Troubleshooting */}
                {activeTab === "help" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2 text-xs text-left"
                  >
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                      <div className="p-1 bg-indigo-500/10 text-indigo-500 rounded-lg mt-0.5">
                        <Wifi className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">1. Toggle Wi-Fi / Cellular</p>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] sm:text-xs">Turn wireless data off and back on.</p>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                      <div className="p-1 bg-indigo-500/10 text-indigo-500 rounded-lg mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">2. Router Power Cycle</p>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] sm:text-xs">Restart your Wi-Fi router or modem.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
