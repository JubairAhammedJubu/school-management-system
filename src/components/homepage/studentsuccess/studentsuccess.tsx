"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentSuccess() {
  return (
    <section
      id="student-success"
      className="relative overflow-hidden bg-white dark:bg-black text-slate-900 dark:text-slate-100 border-y border-slate-200/60 dark:border-slate-800 transition-colors duration-300 px-4 sm:px-6 lg:px-8 py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-10 lg:gap-16">
        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-[430px]"
        >
          <h2 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.045em] text-slate-900 dark:text-white sm:text-[39px]">
            Institution, Elevate
            <br />
            Student Success, and
            <br />
            Streamline
          </h2>

          <p className="mt-4 max-w-[390px] text-[11px] leading-[1.65] text-slate-600 dark:text-slate-300 sm:text-[12px]">
            Empower Your Institution, Elevate Student Success, and Streamline
            Operations with Our Comprehensive Suite of Tools and Support.
          </p>

          <Link
            href="/about"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-7 text-[10px] font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-indigo-500/40"
          >
            Learn More

            <ArrowRight
              size={12}
              className="ml-2"
            />
          </Link>
        </motion.div>

        {/* =====================================================
            RIGHT — LEARNING ACTIVITY CHART
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.65,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="relative mx-auto h-[285px] w-full max-w-[500px]"
        >
          {/* Background rounded shape */}

          <div className="absolute right-0 top-0 h-[285px] w-full max-w-[375px] rounded-[15px] bg-gradient-to-br from-indigo-100/60 via-purple-50/30 to-slate-100 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-950 border border-slate-200/60 dark:border-slate-800" />

          {/* Soft glow */}

          <div className="absolute right-[30px] top-[30px] h-[150px] w-[250px] rounded-full bg-indigo-500/10 blur-[60px]" />

          {/* Chart card */}

          <div className="absolute right-0 top-[30px] h-[245px] w-full rounded-[12px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-4 shadow-[0_15px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] sm:w-[410px]">
            {/* Title */}

            <h3 className="text-[12px] font-bold text-slate-900 dark:text-white">
              Learning Activity
            </h3>

            {/* Chart */}

            <div className="relative mt-4 h-[165px]">
              {/* Horizontal grid lines */}

              <div className="absolute inset-0 flex flex-col justify-between">
                {[80, 60, 40, 20, 0].map((value) => (
                  <div
                    key={value}
                    className="flex items-center gap-2"
                  >
                    <span className="w-[15px] text-[7px] font-medium text-slate-400 dark:text-slate-500">
                      {value}
                    </span>

                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>

              {/* Chart SVG */}

              <svg
                viewBox="0 0 330 165"
                preserveAspectRatio="none"
                className="absolute left-[30px] top-0 h-[150px] w-[calc(100%-30px)] overflow-visible"
              >
                {/* Orange area */}

                <path
                  d="M0 58 C35 63 45 70 75 75 C105 80 125 79 150 73 C180 65 195 60 215 63 C245 67 260 58 275 61 C295 65 312 78 330 86 L330 150 L0 150 Z"
                  fill="url(#orangeFill)"
                  opacity="0.12"
                />

                {/* Blue area */}

                <path
                  d="M0 66 C25 55 45 48 62 52 C83 56 95 72 112 91 C130 111 145 119 165 117 C190 114 205 97 220 79 C240 55 258 46 278 52 C300 59 315 59 330 62 L330 150 L0 150 Z"
                  fill="url(#blueFill)"
                  opacity="0.10"
                />

                {/* Orange line */}

                <path
                  d="M0 58 C35 63 45 70 75 75 C105 80 125 79 150 73 C180 65 195 60 215 63 C245 67 260 58 275 61 C295 65 312 78 330 86"
                  fill="none"
                  stroke="#ff7629"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Blue line */}

                <path
                  d="M0 66 C25 55 45 48 62 52 C83 56 95 72 112 91 C130 111 145 119 165 117 C190 114 205 97 220 79 C240 55 258 46 278 52 C300 59 315 59 330 62"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* March dotted marker */}

                <line
                  x1="296"
                  y1="0"
                  x2="296"
                  y2="150"
                  stroke="#818cf8"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Marker point */}

                <circle
                  cx="296"
                  cy="57"
                  r="3"
                  fill="#6366f1"
                />

                {/* Gradients */}

                <defs>
                  <linearGradient
                    id="blueFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                    />
                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity="0"
                    />
                  </linearGradient>

                  <linearGradient
                    id="orangeFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ff7629"
                    />
                    <stop
                      offset="100%"
                      stopColor="#ff7629"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
              </svg>

              {/* Tooltip */}

              <div className="absolute right-[12px] top-[17px]">
                <div className="relative rounded-[5px] bg-slate-900 dark:bg-slate-800 px-3 py-1.5 text-center text-white shadow-lg border border-slate-700">
                  <p className="text-[8px] font-medium leading-none">
                    60
                  </p>

                  <p className="mt-0.5 text-[7px] leading-none text-white/80">
                    hours
                  </p>

                  <div className="absolute -bottom-[4px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900 dark:bg-slate-800" />
                </div>
              </div>

              {/* X axis */}

              <div className="absolute bottom-[-2px] left-[30px] right-0 flex justify-between">
                <span className="text-[7px] font-medium text-slate-400 dark:text-slate-500">
                  Jan
                </span>

                <span className="text-[7px] font-medium text-slate-400 dark:text-slate-500">
                  Feb
                </span>

                <span className="text-[7px] font-medium text-slate-400 dark:text-slate-500">
                  Mar
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}