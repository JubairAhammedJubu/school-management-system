"use client";
import { API_BASE_URL } from "@/lib/api-url";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ExecutivePaymentReceiptSlip } from "@/components/shared/ExecutivePaymentReceiptSlip";
import {
  Receipt,
  ArrowRight,
  LayoutDashboard,
  CreditCard,
  Printer,
  Building2,
  X,
  FileText,
  Copy,
  Check,
  Sparkles,
  Wallet,
  Trophy,
  Zap,
  FileCheck,
} from "lucide-react";

const rawApi = API_BASE_URL;
const API = rawApi.replace(/\/+$/, "");

type PaymentDetails = {
  id: string;
  receiptNo: string;
  feeType: string;
  month?: string | null;
  amount: number;
  gatewayAmount?: number | null; // <-- add
  paidAt: string;
  methodLabel?: string;
  gatewayTranId?: string;
};
const taka = (n: number) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

function monthLabel(key?: string | null) {
  if (!key) return "-";
  const [y, m] = key.split("-").map(Number);
  if (isNaN(y) || isNaN(m)) return key;
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Animated Counter Component
function AnimatedAmount({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1200; // ms
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easedProgress * value);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    }

    requestAnimationFrame(update);
  }, [value]);

  return <span>{taka(displayValue)}</span>;
}

// Cartoon Celebration Mascot (Pure SVG + Framer Motion)
function CartoonHappyMascot() {
  return (
    <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center select-none">
      {/* Background Radial Glow */}
      <motion.div
        animate={{ scale: [0.95, 1.2, 0.95], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-2 rounded-full bg-gradient-to-tr from-emerald-500/30 via-teal-400/25 to-indigo-500/30 blur-2xl"
      />

      {/* Floating Animated Celebration Stars */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none z-20"
      >
        <Sparkles className="absolute top-1 left-4 h-6 w-6 text-amber-400" />
        <Sparkles className="absolute top-2 right-4 h-5 w-5 text-emerald-400" />
        <Sparkles className="absolute bottom-6 left-2 h-5 w-5 text-indigo-400" />
        <Sparkles className="absolute bottom-4 right-2 h-6 w-6 text-pink-400" />
      </motion.div>

      {/* Main Cartoon Character Body with Happy Bounce */}
      <motion.div
        animate={{ y: [-8, 2, -8], rotate: [-1, 1, -1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xl overflow-visible"
        >
          {/* Shadow underneath */}
          <ellipse cx="100" cy="180" rx="48" ry="8" fill="rgba(0,0,0,0.12)" />

          {/* Cartoon Character Body */}
          <rect
            x="45"
            y="45"
            width="110"
            height="115"
            rx="32"
            fill="url(#emerald-grad)"
            stroke="#10b981"
            strokeWidth="4"
          />

          {/* Body Belly Badge */}
          <rect
            x="60"
            y="110"
            width="80"
            height="38"
            rx="16"
            fill="rgba(255,255,255,0.25)"
          />

          {/* Cute Cat/Robot Ears */}
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

          {/* Happy Starry Eyes */}
          <g>
            {/* Left Starry Eye */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.9, 0.93, 0.96, 1],
              }}
              style={{ originX: "72px", originY: "75px" }}
            >
              <circle cx="72" cy="75" r="14" fill="#ffffff" />
              <path
                d="M 72 67 L 74 72 L 79 73 L 75 77 L 76 82 L 72 79 L 68 82 L 69 77 L 65 73 L 70 72 Z"
                fill="#f59e0b"
              />
            </motion.g>

            {/* Right Starry Eye */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.9, 0.93, 0.96, 1],
              }}
              style={{ originX: "128px", originY: "75px" }}
            >
              <circle cx="128" cy="75" r="14" fill="#ffffff" />
              <path
                d="M 128 67 L 130 72 L 135 73 L 131 77 L 132 82 L 128 79 L 124 82 L 125 77 L 121 73 L 126 72 Z"
                fill="#f59e0b"
              />
            </motion.g>

            {/* Blushing Cheeks */}
            <ellipse
              cx="58"
              cy="88"
              rx="8"
              ry="5"
              fill="#f472b6"
              opacity="0.8"
            />
            <ellipse
              cx="142"
              cy="88"
              rx="8"
              ry="5"
              fill="#f472b6"
              opacity="0.8"
            />

            {/* Big Open Happy Smile */}
            <path d="M 82 92 Q 100 114 118 92 Z" fill="#0f172a" />
            {/* Tongue */}
            <path d="M 90 98 Q 100 114 110 98 Q 100 106 90 98" fill="#fb7185" />
          </g>

          {/* Raised Waving Celebration Arm holding Check Shield */}
          <motion.g
            animate={{ rotate: [-12, 12, -12] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "155px", originY: "110px" }}
          >
            <circle
              cx="170"
              cy="95"
              r="14"
              fill="#34d399"
              stroke="#059669"
              strokeWidth="2.5"
            />
            <path
              d="M 164 95 L 168 99 L 176 90"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Cartoon Feet */}
          <ellipse cx="75" cy="164" rx="14" ry="7" fill="#047857" />
          <ellipse cx="125" cy="164" rx="14" ry="7" fill="#047857" />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="emerald-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

// Framer Motion Confetti Particle Explosion Component
function ConfettiExplosion() {
  const particles = Array.from({ length: 36 });
  const colors = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f43f5e",
    "#6366f1",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-10">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const radius = 140 + Math.random() * 160;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        const color = colors[i % colors.length];
        const size = Math.random() * 8 + 4;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: [0, x * 0.7, x],
              y: [0, y * 0.7 + 40, y + 80],
              scale: [0, 1.3, 0.5],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: 1.8 + Math.random() * 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.15 + (i % 4) * 0.04,
            }}
            style={{
              position: "absolute",
              width: size,
              height: size * (i % 2 === 0 ? 1 : 1.8),
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
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
  },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tranId = searchParams.get("tran") || searchParams.get("tran_id") || "";
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fineAmount, setFineAmount] = useState(0);

  // Fine alada FINE row e thake, tai fee + fine jog kore total
  const totalPaid = payment
    ? fineAmount > 0
      ? payment.amount + fineAmount
      : (payment.gatewayAmount ?? payment.amount) // fine row na pele gateway er total
    : 0;
  const fineShown = payment ? Math.max(totalPaid - payment.amount, 0) : 0;

  useEffect(() => {
    // Fire canvas-confetti celebration burst
    try {
      import("canvas-confetti")
        .then((confettiModule) => {
          const confetti = confettiModule.default;
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#10b981", "#6366f1", "#f59e0b", "#3b82f6", "#ec4899"],
          });

          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 60,
              origin: { x: 0 },
              colors: ["#10b981", "#3b82f6", "#f59e0b"],
            });
            confetti({
              particleCount: 50,
              angle: 120,
              spread: 60,
              origin: { x: 1 },
              colors: ["#6366f1", "#ec4899", "#10b981"],
            });
          }, 300);
        })
        .catch(() => {});
    } catch {
      // fallback to framer-motion particles
    }

    async function fetchTrx() {
      if (!tranId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API}/api/student/fees`, {
          credentials: "include",
        });
        const json = await res.json();
        if (res.ok && json.history) {
          const history: PaymentDetails[] = json.history;
          const match =
            history.find(
              (h) =>
                h.gatewayTranId === tranId ||
                h.receiptNo === tranId ||
                h.id === tranId,
            ) || history[0];

          if (match) {
            setPayment(match);
            // Backend fine row er gatewayTranId = `${monthlyTranId}-FINE`
            const fineRow = history.find(
              (h) =>
                h.feeType === "FINE" &&
                h.gatewayTranId === `${match.gatewayTranId}-FINE`,
            );
            setFineAmount(fineRow?.amount ?? 0);
          }
        }
      } catch (e) {
        console.error("Failed to fetch receipt:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTrx();
  }, [tranId]);

  const handleCopyReceipt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-indigo-500/25 blur-3xl"
        />
      </div>

      {/* Particle Burst FX */}
      <ConfettiExplosion />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl dark:border-slate-800/90 dark:bg-slate-950/90 space-y-8 text-center"
      >
        {/* Cartoon Happy Mascot Hero */}
        <motion.div variants={itemVariants}>
          <CartoonHappyMascot />
        </motion.div>

        {/* Essential Status Copy */}
        <div className="space-y-2.5 max-w-lg mx-auto">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-black uppercase tracking-wider text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/80 dark:text-emerald-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              Payment Successful 🎉
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            Fee Payment Completed
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Your payment has been verified and successfully recorded into your
            official student ledger.
          </motion.p>
        </div>

        {/* Essential Transaction Summary Grid */}
        {payment ? (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto"
          >
            {/* Box 1: Receipt Number */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Receipt className="h-3 w-3 text-indigo-500" />
                Receipt No:
              </span>
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                  {payment.receiptNo}
                </span>
                <button
                  onClick={() => handleCopyReceipt(payment.receiptNo)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 dark:hover:text-white transition-colors text-[11px] font-sans font-bold cursor-pointer"
                  title="Copy Receipt No"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Box 2: Particulars */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Wallet className="h-3 w-3 text-emerald-500" />
                Fee Particular:
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-xs leading-snug">
                {payment.feeType === "MONTHLY"
                  ? `Monthly (${monthLabel(payment.month)})`
                  : payment.feeType === "FINE"
                    ? "Late Fine"
                    : payment.feeType}
                {fineShown > 0 && " + Late Fine"}
              </p>
            </div>

            {/* Box 3: Total Paid Amount */}
            <div className="rounded-2xl border border-emerald-300/80 bg-emerald-50/80 p-4 dark:border-emerald-800/80 dark:bg-emerald-950/40 space-y-1">
              <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Total Paid Amount:
              </span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                <AnimatedAmount value={totalPaid} />
              </p>
              {fineShown > 0 && (
                <p className="text-[11px] font-medium text-emerald-700/80 dark:text-emerald-400/80">
                  Fee {taka(payment.amount)} + Fine {taka(fineShown)}
                </p>
              )}
            </div>
          </motion.div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 space-y-2 text-left"
              >
                <div className="h-3 w-16 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-5 w-24 rounded-md bg-slate-300/80 dark:bg-slate-700/80 animate-pulse" />
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent pointer-events-none"
                />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900"
          >
            Payment recorded successfully. Reference Trx:{" "}
            <span className="font-mono font-bold text-indigo-600">
              {tranId || "Verified"}
            </span>
          </motion.div>
        )}

        {/* Clean Direct Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 pt-2 max-w-xl mx-auto"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => router.push("/dashboard/student")}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-slate-900 px-6 py-4 text-xs font-bold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all cursor-pointer group"
          >
            <LayoutDashboard className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
            <span>Student Dashboard</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => router.push("/dashboard/student/fee")}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl border border-indigo-200 bg-indigo-50/80 px-6 py-4 text-xs font-bold text-indigo-700 shadow-sm hover:bg-indigo-100 dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/80 transition-all cursor-pointer group"
          >
            <CreditCard className="h-4.5 w-4.5 transition-transform group-hover:rotate-12" />
            <span>View Fee Portal</span>
          </motion.button>

          {payment && (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setShowSlipModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-6 py-4 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-100 dark:border-emerald-800/80 dark:bg-emerald-950/80 dark:text-emerald-300 dark:hover:bg-emerald-900/90 transition-all cursor-pointer group"
            >
              <FileText className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Print E-Slip</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Official Payment Slip Modal */}
      <AnimatePresence>
        {showSlipModal && payment && (
          <ExecutivePaymentReceiptSlip
            payment={{ ...payment, amount: totalPaid }}
            onClose={() => setShowSlipModal(false)}
            printableId="printable-success-slip"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudentFeeSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent"
          />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
