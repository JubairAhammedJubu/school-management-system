"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  RefreshCw,
  LayoutDashboard,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

// Animated Cartoon "Oops" Mascot (Pure SVG + Framer Motion)
function CartoonOopsMascot({ isFailed }: { isFailed: boolean }) {
  return (
    <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center select-none">
      {/* Background Pulsing Aura */}
      <motion.div
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-2 rounded-full blur-2xl ${isFailed
            ? "bg-gradient-to-tr from-rose-500/30 to-red-400/20"
            : "bg-gradient-to-tr from-amber-500/30 to-orange-400/20"
          }`}
      />

      {/* Floating Animated Question / Exclamation Mark Bubbles */}
      <motion.div
        animate={{ y: [-6, -16, -6], opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1 left-6 bg-amber-400 dark:bg-amber-500 text-amber-950 font-black text-xs px-2 py-0.5 rounded-full shadow-md z-20"
      >
        {isFailed ? "ERROR!" : "OOPS!"}
      </motion.div>

      <motion.div
        animate={{ y: [-4, -12, -4], opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute top-2 right-6 bg-rose-400 text-white font-black text-xs h-6 w-6 rounded-full flex items-center justify-center shadow-md z-20"
      >
        ?
      </motion.div>

      {/* Main Cartoon Character Body */}
      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          {/* Shadow underneath */}
          <ellipse cx="100" cy="180" rx="45" ry="8" fill="rgba(0,0,0,0.12)" />

          {/* Cartoon Robot/Wallet Body */}
          <rect
            x="45"
            y="45"
            width="110"
            height="115"
            rx="32"
            fill={isFailed ? "url(#rose-grad)" : "url(#amber-grad)"}
            stroke={isFailed ? "#f43f5e" : "#f59e0b"}
            strokeWidth="4"
          />

          {/* Body Belly Plate */}
          <rect
            x="60"
            y="110"
            width="80"
            height="38"
            rx="16"
            fill="rgba(255,255,255,0.25)"
          />

          {/* Cute Cat-like Ears / Horns */}
          <path
            d="M 55 46 L 40 22 L 72 45 Z"
            fill={isFailed ? "#e11d48" : "#d97706"}
            stroke={isFailed ? "#9f1239" : "#92400e"}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 145 46 L 160 22 L 128 45 Z"
            fill={isFailed ? "#e11d48" : "#d97706"}
            stroke={isFailed ? "#9f1239" : "#92400e"}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Cartoon Face Eyes Container */}
          <g>
            {/* Left Eye (Animated Blink) */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
              style={{ originX: "72px", originY: "75px" }}
            >
              <circle cx="72" cy="75" r="14" fill="#ffffff" />
              {isFailed ? (
                /* Cross Eye for Error */
                <path d="M 66 69 L 78 81 M 78 69 L 66 81" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              ) : (
                /* Sad Puppy Eye */
                <>
                  <circle cx="72" cy="76" r="8" fill="#0f172a" />
                  <circle cx="75" cy="73" r="3" fill="#ffffff" />
                </>
              )}
            </motion.g>

            {/* Right Eye (Animated Blink) */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
              style={{ originX: "128px", originY: "75px" }}
            >
              <circle cx="128" cy="75" r="14" fill="#ffffff" />
              {isFailed ? (
                /* Cross Eye for Error */
                <path d="M 122 69 L 134 81 M 134 69 L 122 81" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              ) : (
                /* Sad Puppy Eye */
                <>
                  <circle cx="128" cy="76" r="8" fill="#0f172a" />
                  <circle cx="131" cy="73" r="3" fill="#ffffff" />
                </>
              )}
            </motion.g>

            {/* Blushing Cheeks */}
            <ellipse cx="60" cy="88" rx="7" ry="4" fill="#fb7185" opacity="0.6" />
            <ellipse cx="140" cy="88" rx="7" ry="4" fill="#fb7185" opacity="0.6" />

            {/* Wavy "Oops" Mouth */}
            <path
              d={isFailed ? "M 85 96 Q 100 88 115 96" : "M 85 95 Q 100 90 115 95 Q 100 102 85 95"}
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>

          {/* Animated Cartoon Sweat Drop */}
          <motion.path
            d="M 152 65 C 152 60, 158 54, 158 54 C 158 54, 164 60, 164 65 C 164 68, 158 72, 152 65 Z"
            fill="#38bdf8"
            animate={{ y: [0, 12, 24], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Cartoon Feet */}
          <ellipse cx="75" cy="164" rx="14" ry="7" fill={isFailed ? "#9f1239" : "#92400e"} />
          <ellipse cx="125" cy="164" rx="14" ry="7" fill={isFailed ? "#9f1239" : "#92400e"} />

          {/* Gradients */}
          <defs>
            <linearGradient id="amber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="rose-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
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
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0, 0, 0.2, 1] } },
};

function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status") || "cancel";
  const tranId = searchParams.get("tran") || searchParams.get("tran_id") || "";
  const [copied, setCopied] = useState(false);

  const isFailed = status === "fail" || status === "error";

  const handleCopyTran = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`h-[500px] w-[500px] rounded-full blur-3xl ${isFailed
              ? "bg-gradient-to-tr from-rose-500/25 to-red-500/15"
              : "bg-gradient-to-tr from-amber-500/25 to-orange-500/15"
            }`}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl dark:border-slate-800/90 dark:bg-slate-950/90 space-y-8 text-center"
      >
        {/* Cartoon Mascot Hero */}
        <motion.div variants={itemVariants}>
          <CartoonOopsMascot isFailed={isFailed} />
        </motion.div>

        {/* Essential Status Copy (Direct & Concise) */}
        <div className="space-y-2 max-w-lg mx-auto">
          <motion.div variants={itemVariants}>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1 text-xs font-black uppercase tracking-wider shadow-xs ${isFailed
                  ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/80 dark:bg-rose-950/80 dark:text-rose-300"
                  : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/80 dark:text-amber-300"
                }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              {isFailed ? "Payment Failed" : "Payment Cancelled"}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            {isFailed ? "Payment Could Not Be Processed" : "Payment Session Cancelled"}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            {isFailed
              ? "Your transaction was declined by the bank or payment gateway. Deducted funds auto-refund in 3-5 days."
              : "You closed the gateway session before completing payment. No money was charged."}
          </motion.p>
        </div>

        {/* Reference ID Component */}
        {tranId && (
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 font-mono shadow-inner"
          >
            <span className="text-slate-400 text-[11px] font-sans font-semibold uppercase tracking-wider">
              Ref ID:
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{tranId}</span>
            <button
              type="button"
              onClick={() => handleCopyTran(tranId)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer text-[11px] font-sans font-bold"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Clean Direct Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-2 max-w-xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => router.push("/dashboard/student/fee")}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-6 py-4 text-xs font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer group"
          >
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
              <RefreshCw className="h-4.5 w-4.5" />
            </motion.div>
            <span>Retry Fee Payment</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => router.push("/dashboard/student")}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer group"
          >
            <LayoutDashboard className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
            <span>Student Dashboard</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function StudentFeeCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 rounded-full border-4 border-amber-600 border-t-transparent"
          />
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
