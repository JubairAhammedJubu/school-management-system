"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Users,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ManagementSolutions() {
  return (
    <section
      id="management-solutions"
      className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute left-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-purple-100/50 blur-[120px]" />

      <div className="mx-auto grid max-w-[1180px] items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* =====================================================
            LEFT — REFERENCE-STYLE VISUAL
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto h-[470px] w-full max-w-[540px]"
        >
          {/* Large lavender artwork background */}

          <div className="absolute left-0 top-[42px] h-[315px] w-[390px] overflow-hidden rounded-[26px] bg-gradient-to-br from-[#eee7ff] via-[#f4eaf9] to-[#faeff4]">
            {/* Grid */}

            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.75) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.75) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />

            {/* Soft curved decoration */}

            <div className="absolute -bottom-[110px] -left-[80px] h-[230px] w-[420px] rounded-[50%] border border-white/70" />

            <div className="absolute -bottom-[135px] -left-[45px] h-[220px] w-[350px] rounded-[50%] border border-white/50" />
          </div>

          {/* Main white dashboard */}

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="absolute left-[28px] top-[75px] z-20 w-[430px] rounded-[18px] bg-white p-[18px] shadow-[0_22px_50px_rgba(49,38,76,0.14)]"
          >
            {/* Dashboard header */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-medium text-[#aaa5b0]">
                  SCHOOL MANAGEMENT
                </p>

                <h3 className="mt-1 text-[14px] font-bold text-[#343340]">
                  Today&apos;s Overview
                </h3>
              </div>

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50">
                <BookOpen
                  size={13}
                  className="text-[#9635f2]"
                />
              </div>
            </div>

            {/* Dashboard content */}

            <div className="mt-5 grid grid-cols-[125px_1fr] gap-5">
              {/* Progress */}

              <div className="relative flex h-[125px] w-[125px] items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full -rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    stroke="#edf0f4"
                    strokeWidth="8"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    stroke="#2478ea"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="245"
                    strokeDashoffset="44"
                  />
                </svg>

                <div className="relative text-center">
                  <p className="text-[22px] font-bold text-[#343340]">
                    82%
                  </p>

                  <p className="text-[8px] text-[#aaa5b0]">
                    Performance
                  </p>
                </div>
              </div>

              {/* Stats */}

              <div className="pt-1">
                <p className="text-[11px] font-bold text-[#343340]">
                  School Performance
                </p>

                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
                  <div className="flex items-center gap-1.5">
                    <BookOpen
                      size={10}
                      className="text-blue-500"
                    />

                    <span className="text-[8px] text-slate-500">
                      24 Classes
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock3
                      size={10}
                      className="text-purple-500"
                    />

                    <span className="text-[8px] text-slate-500">
                      8:00 AM
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <BookOpen
                      size={10}
                      className="text-cyan-500"
                    />

                    <span className="text-[8px] text-slate-500">
                      12 Subjects
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users
                      size={10}
                      className="text-indigo-500"
                    />

                    <span className="text-[8px] text-slate-500">
                      845 Students
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="h-7 rounded-md border border-[#4b8bea] px-5 text-[8px] font-semibold text-[#2478ea]"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="h-7 rounded-md bg-[#2478ea] px-5 text-[8px] font-semibold text-white"
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
            className="absolute bottom-[30px] left-[70px] z-30 flex items-center gap-4"
          >
            {/* Circular progress */}

            <div className="relative h-[76px] w-[76px] rounded-full bg-white p-2 shadow-[0_12px_30px_rgba(48,39,70,0.12)]">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#edf0f4"
                  strokeWidth="8"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#9635f2"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="239"
                  strokeDashoffset="95"
                />
              </svg>

              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#343340]">
                72%
              </span>
            </div>

            <div className="rounded-xl bg-white px-4 py-3 shadow-[0_12px_30px_rgba(48,39,70,0.1)]">
              <p className="text-[10px] font-bold text-[#343340]">
                Attendance
              </p>

              <p className="mt-1 text-[8px] text-slate-400">
                Real-time school activity
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
            className="absolute right-[5px] top-[22px] z-30 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white shadow-[0_12px_30px_rgba(48,39,70,0.12)]"
          >
            <CheckCircle2
              size={22}
              className="text-[#9635f2]"
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9635f2]">
            School Management
          </p>

          <h2 className="mt-4 text-[38px] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#383840] sm:text-[46px] lg:text-[50px]">
            Empower Your
            <br />
            Institution with Our
            <br />
            Management Solutions
          </h2>

          <p className="mt-6 max-w-[490px] text-[12px] leading-[1.75] text-[#77757e] sm:text-[13px]">
            Experience a paradigm shift in school management with our
            cutting-edge solutions and unparalleled support. Empowering
            education for a brighter tomorrow.
          </p>

          {/* Buttons */}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9635f2] to-[#a12ef3] px-7 text-[11px] font-semibold text-white shadow-[0_8px_22px_rgba(150,53,242,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(150,53,242,0.3)]"
            >
              Get started

              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#77777d] px-6 text-[11px] font-semibold text-[#4d4d55] transition-all duration-300 hover:border-[#9635f2] hover:text-[#9635f2]"
            >
              See How it works
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}