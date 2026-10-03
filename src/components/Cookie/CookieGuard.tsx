"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Cookie,
  RefreshCw,
  Smartphone,
  Globe,
  Lock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

// ============================================================================
// Premium Cartoon Mascot: Cookie Mascot
// ============================================================================
function CartoonCookieMascot() {
  return (
    <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center select-none shrink-0 my-0.5">
      {/* Background Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [0.95, 1.2, 0.95], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full blur-xl bg-gradient-to-tr from-indigo-500/35 via-purple-500/25 to-cyan-400/30"
      />

      {/* Floating Speech Bubble */}
      <motion.div
        animate={{ y: [-3, -8, -3], opacity: [0.7, 1, 0.7], scale: [0.92, 1.03, 0.92] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1.5 left-0 sm:left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-[9px] sm:text-[10px] md:text-[11px] px-2.5 py-0.5 rounded-full shadow-lg z-20 border border-indigo-300/40"
      >
        COOKIES NEEDED!
      </motion.div>

      <motion.div
        animate={{ y: [-2, -7, -2], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute top-0 right-0 sm:right-2 bg-gradient-to-tr from-amber-400 to-orange-400 text-amber-950 font-black text-[10px] sm:text-xs h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center shadow-lg z-20 border border-amber-200"
      >
        🍪
      </motion.div>

      {/* Main Cartoon Character Body */}
      <motion.div
        animate={{ y: [-2, 2, -2], rotate: [-1.2, 1.2, -1.2] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          <ellipse cx="100" cy="180" rx="45" ry="8" fill="rgba(0,0,0,0.12)" />

          <rect
            x="45"
            y="45"
            width="110"
            height="115"
            rx="20"
            fill="url(#indigo-cookie-grad)"
            stroke="#6366f1"
            strokeWidth="4"
          />

          <rect
            x="60"
            y="110"
            width="80"
            height="38"
            rx="10"
            fill="rgba(255,255,255,0.25)"
          />

          <path
            d="M 55 46 L 40 22 L 72 45 Z"
            fill="#4f46e5"
            stroke="#3730a3"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 145 46 L 160 22 L 128 45 Z"
            fill="#4f46e5"
            stroke="#3730a3"
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
              d="M 85 95 Q 100 90 115 95 Q 100 102 85 95"
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
            <circle cx="168" cy="95" r="14" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
            <circle cx="163" cy="91" r="2.5" fill="#451a03" />
            <circle cx="172" cy="94" r="2.5" fill="#451a03" />
            <circle cx="166" cy="100" r="2" fill="#451a03" />
          </motion.g>

          <ellipse cx="75" cy="164" rx="14" ry="7" fill="#3730a3" />
          <ellipse cx="125" cy="164" rx="14" ry="7" fill="#3730a3" />

          <defs>
            <linearGradient id="indigo-cookie-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0, 0, 0.2, 1] } },
};

export default function CookieGuard() {
  const [cookiesBlocked, setCookiesBlocked] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile" | "why">("desktop");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const verifyCookies = useCallback((): boolean => {
    if (typeof window === "undefined") return true;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("testCookies") === "true" || urlParams.get("blockCookies") === "true") {
        return false;
      }
    } catch { }

    if (!navigator.cookieEnabled) {
      return false;
    }

    try {
      const testKey = "edunexus_cookie_check";
      document.cookie = `${testKey}=1; path=/; SameSite=Lax`;
      const supported = document.cookie.indexOf(`${testKey}=1`) !== -1;
      document.cookie = `${testKey}=1; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      return supported;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isEnabled = verifyCookies();
    setCookiesBlocked(!isEnabled);
  }, [verifyCookies]);

  const handleRetry = () => {
    setIsTesting(true);
    setAlertMessage("Activating cookies & verifying session permissions...");

    try {
      document.cookie = "edunexus_cookie_consent=true; path=/; max-age=31536000; SameSite=Lax";
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("edunexus_cookies_enabled", "true");
      }
    } catch { }

    setTimeout(() => {
      const isEnabled = verifyCookies();
      setIsTesting(false);

      if (isEnabled) {
        setCookiesBlocked(false);
        setAlertMessage(null);
        try {
          const url = new URL(window.location.href);
          if (url.searchParams.has("testCookies") || url.searchParams.has("blockCookies")) {
            url.searchParams.delete("testCookies");
            url.searchParams.delete("blockCookies");
            window.location.href = url.toString();
          }
        } catch { }
      } else {
        setCookiesBlocked(true);
        setAlertMessage(
          "Cookies are still blocked. Please allow cookies via site settings (lock icon near address bar)."
        );
      }
    }, 550);
  };

  return (
    <AnimatePresence>
      {cookiesBlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99998] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 dark:bg-black/90 backdrop-blur-3xl overflow-y-auto"
        >
          {/* Ambient Mesh Glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="h-[340px] sm:h-[420px] w-[340px] sm:w-[420px] rounded-full blur-3xl bg-gradient-to-tr from-indigo-600/30 via-purple-500/20 to-cyan-500/25"
            />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative w-[94%] sm:w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[85vh] sm:max-h-[88vh] my-auto flex flex-col rounded-2xl border border-slate-200/90 bg-white/95 p-4 sm:p-5 md:p-6 shadow-2xl backdrop-blur-3xl dark:border-slate-800/90 dark:bg-slate-950/95 space-y-3 sm:space-y-4 text-center overflow-y-auto custom-scrollbar"
          >
            {/* Animated Gradient Accent Bar */}
            <div className="relative h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
              />
            </div>

            {/* Top Glass Badge */}
            <div className="flex items-center justify-center shrink-0">
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 shadow-sm backdrop-blur-md">
                  <Cookie className="h-3.5 w-3.5 text-indigo-500" />
                  Cookies Required
                </span>
              </motion.div>
            </div>

            {/* Mascot */}
            <motion.div variants={itemVariants} className="shrink-0">
              <CartoonCookieMascot />
            </motion.div>

            {/* Header & Copy */}
            <div className="space-y-1 max-w-sm mx-auto shrink-0">
              <motion.h2
                variants={itemVariants}
                className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading"
              >
                Enable Cookies to Continue
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
              >
                EduNexus relies on essential cookies for user authentication, session security, and dashboard features. Cookies are currently disabled in your browser.
              </motion.p>
            </div>

            {/* Primary CTA Button */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-2.5 pt-0.5 max-w-sm mx-auto shrink-0 w-full">
              <motion.button
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleRetry}
                disabled={isTesting}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-75"
              >
                <motion.div animate={isTesting ? { rotate: 360 } : {}} transition={isTesting ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}>
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                <span>{isTesting ? "Activating Cookies..." : "Enable Cookies & Refresh"}</span>
              </motion.button>
            </motion.div>

            {/* Alert Message */}
            {alertMessage && (
              <motion.div
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 text-center border border-indigo-200 dark:border-indigo-800/60 shrink-0"
              >
                {alertMessage}
              </motion.div>
            )}

            {/* Segmented Pill Tabs Navigation */}
            <motion.div variants={itemVariants} className="pt-1 shrink-0">
              <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveTab("desktop")}
                    className={`relative flex-1 py-1.5 px-2.5 text-[10px] sm:text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === "desktop"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Chrome & Edge</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("mobile")}
                    className={`relative flex-1 py-1.5 px-2.5 text-[10px] sm:text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === "mobile"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Safari & Mobile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("why")}
                    className={`relative flex-1 py-1.5 px-2.5 text-[10px] sm:text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === "why"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Why Needed?</span>
                  </button>
                </div>
              </div>

              {/* Tab Step Cards */}
              {activeTab === "desktop" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2.5 text-left text-xs">
                  <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" />
                      Chrome / Edge Instructions:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                      <li>Click the lock icon beside the address bar URL.</li>
                      <li>Select <strong>Site settings</strong> → <strong>Cookies</strong>.</li>
                      <li>Switch to <strong>Allow cookies</strong> and click Enable Cookies above.</li>
                    </ol>
                  </div>
                </motion.div>
              )}

              {activeTab === "mobile" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2.5 text-left text-xs">
                  <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                      Safari & Mobile Devices:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                      <li>Open device <strong>Settings</strong> → <strong>Safari</strong>.</li>
                      <li>Turn off <strong>Block All Cookies</strong> & <strong>Prevent Cross-Site Tracking</strong>.</li>
                      <li>Re-open your browser and tap Enable Cookies above.</li>
                    </ol>
                  </div>
                </motion.div>
              )}

              {activeTab === "why" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2.5 text-left text-xs">
                  <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed space-y-1">
                    <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Security & Session Control:
                    </p>
                    <p>EduNexus uses encrypted HTTP-only session cookies to verify student, teacher, and admin logins safely without transmitting raw credentials.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
