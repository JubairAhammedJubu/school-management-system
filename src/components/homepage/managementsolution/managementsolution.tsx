"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Users,
  CheckCircle2,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";

export default function ManagementSolutions() {
  const { data: session } = useSession();
  return (
    <section
      id="management-solutions"
      className="relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 px-4 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute left-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="mx-auto grid max-w-[1180px] items-center gap-10 sm:gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* =====================================================
            LEFT — REFERENCE-STYLE VISUAL
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto h-[380px] sm:h-[470px] w-full max-w-[540px]"
        >
          {/* Large lavender artwork background */}

          <div className="absolute left-0 top-[20px] sm:top-[42px] h-[270px] sm:h-[315px] w-full max-w-[390px] overflow-hidden rounded-[22px] sm:rounded-[26px] bg-gradient-to-br from-indigo-100/70 via-purple-50/50 to-slate-100 dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-950 border border-slate-200/60 dark:border-slate-800">
            {/* Grid */}

            <div
              className="absolute inset-0 opacity-40 dark:opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(99,102,241,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.3) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />

            {/* Soft curved decoration */}

            <div className="absolute -bottom-[110px] -left-[80px] h-[230px] w-[420px] rounded-[50%] border border-indigo-200/50 dark:border-indigo-800/30" />

            <div className="absolute -bottom-[135px] -left-[45px] h-[220px] w-[350px] rounded-[50%] border border-indigo-200/30 dark:border-indigo-800/20" />
          </div>

          {/* Main white dashboard */}

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="absolute left-3 sm:left-[28px] top-[45px] sm:top-[75px] z-20 w-[calc(100%-24px)] max-w-[430px] rounded-[16px] sm:rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-[18px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:shadow-[0_22px_50px_rgba(0,0,0,0.5)] text-slate-900 dark:text-slate-100"
          >
            {/* Dashboard header */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[7.5px] sm:text-[8px] font-semibold tracking-wider text-slate-400 dark:text-slate-500">
                  SCHOOL MANAGEMENT
                </p>

                <h3 className="mt-0.5 text-[12px] sm:text-[14px] font-bold text-slate-900 dark:text-white">
                  Today&apos;s Overview
                </h3>
              </div>

              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/50">
                <BookOpen
                  size={12}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>
            </div>

            {/* Dashboard content */}

            <div className="mt-3.5 sm:mt-5 grid grid-cols-[100px_1fr] sm:grid-cols-[125px_1fr] gap-3 sm:gap-5">
              {/* Progress */}

              <div className="relative flex h-[100px] w-[100px] sm:h-[125px] sm:w-[125px] items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full -rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="8"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    className="stroke-indigo-600 dark:stroke-indigo-500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="245"
                    strokeDashoffset="44"
                  />
                </svg>

                <div className="relative text-center">
                  <p className="text-[18px] sm:text-[22px] font-bold text-slate-900 dark:text-white">
                    82%
                  </p>

                  <p className="text-[7.5px] sm:text-[8px] font-medium text-slate-400 dark:text-slate-500">
                    Performance
                  </p>
                </div>
              </div>

              {/* Stats */}

              <div className="pt-0.5">
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white">
                  School Performance
                </p>

                <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-3">
                  <div className="flex items-center gap-1.5">
                    <BookOpen
                      size={10}
                      className="text-indigo-500 shrink-0"
                    />

                    <span className="text-[7.5px] sm:text-[8px] font-medium text-slate-600 dark:text-slate-400 truncate">
                      24 Classes
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock3
                      size={10}
                      className="text-purple-500 shrink-0"
                    />

                    <span className="text-[7.5px] sm:text-[8px] font-medium text-slate-600 dark:text-slate-400 truncate">
                      8:00 AM
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <BookOpen
                      size={10}
                      className="text-cyan-500 shrink-0"
                    />

                    <span className="text-[7.5px] sm:text-[8px] font-medium text-slate-600 dark:text-slate-400 truncate">
                      12 Subjects
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users
                      size={10}
                      className="text-blue-500 shrink-0"
                    />

                    <span className="text-[7.5px] sm:text-[8px] font-medium text-slate-600 dark:text-slate-400 truncate">
                      845 Students
                    </span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-5 flex gap-2">
                  <button
                    type="button"
                    className="h-6 sm:h-7 rounded-md border border-indigo-300 dark:border-indigo-700 px-3 sm:px-5 text-[7.5px] sm:text-[8px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="h-6 sm:h-7 rounded-md bg-indigo-600 hover:bg-indigo-700 px-3 sm:px-5 text-[7.5px] sm:text-[8px] font-semibold text-white shadow-xs transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* =================================================
              SMALL STAT CARD
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="absolute bottom-[10px] sm:bottom-[30px] left-[15px] sm:left-[70px] z-30 flex items-center gap-2.5 sm:gap-4 scale-90 sm:scale-100 origin-bottom-left"
          >
            {/* Circular progress */}

            <div className="relative h-[64px] w-[64px] sm:h-[76px] sm:w-[76px] rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1.5 sm:p-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="8"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  className="stroke-indigo-600 dark:stroke-indigo-400"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="239"
                  strokeDashoffset="95"
                />
              </svg>

              <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white">
                72%
              </span>
            </div>

            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3 py-2 sm:px-4 sm:py-3 shadow-[0_12px_30px_rgba(0,0,0,0.10)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
              <p className="text-[9.5px] sm:text-[10px] font-bold text-slate-900 dark:text-white">
                Attendance
              </p>

              <p className="mt-0.5 sm:mt-1 text-[7.5px] sm:text-[8px] text-slate-500 dark:text-slate-400">
                Real-time activity
              </p>
            </div>
          </motion.div>

          {/* =================================================
              FLOATING CHECK CARD
          ================================================= */}

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-0 sm:right-[5px] top-[10px] sm:top-[22px] z-30 flex h-[40px] w-[40px] sm:h-[48px] sm:w-[48px] items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-[0_12px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
          >
            <CheckCircle2
              size={18}
              className="text-indigo-600 dark:text-indigo-400 sm:size-[22px]"
              strokeWidth={1.7}
            />
          </motion.div>
        </motion.div>

        {/* =====================================================
            RIGHT — CONTENT
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.7,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="max-w-[520px]"
        >
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            School Management
          </p>

          <h2 className="mt-2 text-[26px] xs:text-[30px] font-extrabold leading-[1.12] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-[42px] lg:text-[48px]">
            Empower Your
            <br />
            Institution with Our
            <br />
            Management Solutions
          </h2>

          <p className="mt-3 sm:mt-4 max-w-[490px] text-[12px] leading-[1.65] text-slate-600 dark:text-slate-300 sm:text-[13px]">
            Experience a paradigm shift in school management with our
            cutting-edge solutions and unparalleled support. Empowering
            education for a brighter tomorrow.
          </p>

          {/* Buttons */}

          <div className="mt-6 flex flex-row items-center gap-3 sm:mt-7">
            {!session?.user && (
              <Link
                href="/login"
                className="group inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 sm:px-8 text-[12px] sm:text-[13px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40"
              >
                Get started

                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            )}

            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("how-it-works");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#how-it-works";
                }
              }}
              className="inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-white/30 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm px-5 sm:px-6 text-[12px] sm:text-[13px] font-semibold text-slate-700 dark:text-white transition-all duration-300 hover:border-indigo-600 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-white cursor-pointer"
            >
              See How it works
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 dark:border-white/80">
                <Play size={7} fill="currentColor" className="ml-[1px]" />
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}