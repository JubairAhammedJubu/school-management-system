"use client";

import { motion } from "framer-motion";

export default function ManagementShowcase() {
  return (
    <section
      id="management-showcase"
      className="relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1080px]">
        {/* =====================================================
            SECTION HEADING
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-[680px] text-center"
        >
          <h2 className="text-[31px] font-extrabold leading-[1.08] tracking-[-0.045em] text-slate-900 dark:text-white sm:text-[38px] lg:text-[42px]">
            Revolutionize Your Innovative
            <br />
            Management Solutions
          </h2>

          <p className="mx-auto mt-4 max-w-[650px] text-[10px] leading-[1.7] text-slate-600 dark:text-slate-300 sm:text-[11px]">
            Streamline Operations, Enhance Engagement, and Empower Educators,
            Discover Seamless Efficiency and Innovation in Education Management
          </p>
        </motion.div>

        {/* =====================================================
            DASHBOARD SHOWCASE
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.75,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="relative mt-9"
        >
          {/* Outer gray showcase */}

          <div className="relative h-[365px] overflow-hidden rounded-[18px] bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-5 pt-11 sm:h-[410px] sm:px-10 sm:pt-12 lg:h-[455px] lg:px-16">
            {/* =================================================
                DASHBOARD WINDOW
            ================================================== */}

            <div className="relative mx-auto h-[450px] w-full max-w-[865px] overflow-hidden rounded-[16px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-[0_12px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
              {/* -------------------------------------------------
                  TOP NAVIGATION
              -------------------------------------------------- */}

              <div className="flex h-[50px] items-center border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6">
                {/* Logo */}

                <div className="flex w-[85px] items-center">
                  <div className="relative h-[20px] w-[25px]">
                    <div className="absolute left-0 top-[3px] h-[14px] w-[14px] rotate-45 bg-indigo-600" />

                    <div className="absolute left-[8px] top-[3px] h-[14px] w-[14px] rotate-45 bg-indigo-400" />
                  </div>
                </div>

                {/* Navigation */}

                <div className="flex h-full items-center gap-6 text-[7px] font-medium text-slate-600 dark:text-slate-400 sm:gap-9">
                  <div className="relative flex h-full items-center font-bold text-slate-900 dark:text-white">
                    Overview

                    <span className="absolute bottom-0 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-t-full bg-indigo-600 dark:bg-indigo-400" />
                  </div>

                  <span>Report</span>
                  <span>File Storage</span>
                  <span>Courses</span>
                </div>

                {/* Right controls */}

                <div className="ml-auto flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">⚙</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">♧</span>

                  <div className="h-7 w-7 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />

                  <span className="text-[8px] text-slate-500 dark:text-slate-400">⌄</span>
                </div>
              </div>

              {/* -------------------------------------------------
                  DASHBOARD BODY
              -------------------------------------------------- */}

              <div className="bg-slate-50/80 dark:bg-slate-900/60 p-4 sm:p-5">
                <div className="grid grid-cols-[1.55fr_0.75fr] gap-4">
                  {/* LEFT */}

                  <div>
                    {/* Overview statistics */}

                    <div className="rounded-[8px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                      <div className="grid grid-cols-[1.05fr_0.8fr_0.8fr]">
                        {/* Student */}

                        <div className="border-r border-slate-200 dark:border-slate-800 pr-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />

                            <div>
                              <p className="text-[8px] font-bold text-slate-900 dark:text-white">
                                John Smith
                              </p>

                              <p className="text-[6px] text-slate-500 dark:text-slate-400">
                                Student · Beginner
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 px-3 py-1 text-[6px] font-semibold text-indigo-600 dark:text-indigo-400">
                              Mahamodul
                            </span>

                            <span className="text-[7px] text-slate-600 dark:text-slate-400 font-medium">
                              185
                            </span>
                          </div>
                        </div>

                        {/* Pending */}

                        <div className="border-r border-slate-200 dark:border-slate-800 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white">
                              <span className="text-[9px]">▣</span>
                            </div>

                            <div>
                              <p className="text-[16px] font-bold leading-none text-slate-900 dark:text-white">
                                04
                              </p>

                              <p className="mt-1 text-[6px] text-slate-500 dark:text-slate-400">
                                Pending courses
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Complete */}

                        <div className="px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
                              <span className="text-[9px]">◆</span>
                            </div>

                            <div>
                              <p className="text-[16px] font-bold leading-none text-slate-900 dark:text-white">
                                08
                              </p>

                              <p className="mt-1 text-[6px] text-slate-500 dark:text-slate-400">
                                Complete Courses
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second row */}

                      <div className="mt-4 grid grid-cols-3 border-t border-slate-200 dark:border-slate-800 pt-3">
                        <div>
                          <p className="text-[16px] font-bold text-slate-900 dark:text-white">
                            72h
                          </p>

                          <p className="text-[6px] text-slate-500 dark:text-slate-400">
                            Watch time
                          </p>
                        </div>

                        <div>
                          <p className="text-[16px] font-bold text-slate-900 dark:text-white">
                            06
                          </p>

                          <p className="text-[6px] text-slate-500 dark:text-slate-400">
                            Certificates
                          </p>
                        </div>

                        <div>
                          <p className="text-[16px] font-bold text-slate-900 dark:text-white">
                            185
                          </p>

                          <p className="text-[6px] text-slate-500 dark:text-slate-400">
                            Earning points
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Learning activity */}

                    <div className="mt-3 rounded-[8px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-bold text-slate-900 dark:text-white">
                          Learning Activity
                        </p>

                        <div className="flex items-center gap-3 text-[6px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-sm bg-indigo-600" />
                            Materials
                          </span>

                          <span className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" />
                            Exam
                          </span>

                          <span className="rounded border border-slate-200 dark:border-slate-700 px-2 py-1">
                            6 Month⌄
                          </span>
                        </div>
                      </div>

                      {/* Chart */}

                      <div className="relative mt-3 h-[150px] overflow-hidden">
                        {/* Grid */}

                        <div className="absolute inset-0 flex flex-col justify-between">
                          {[1, 2, 3, 4].map((line) => (
                            <div
                              key={line}
                              className="h-px w-full bg-slate-200 dark:bg-slate-800"
                            />
                          ))}
                        </div>

                        <svg
                          viewBox="0 0 600 150"
                          preserveAspectRatio="none"
                          className="absolute inset-0 h-full w-full"
                        >
                          <path
                            d="M0 62 C65 75 90 84 135 78 C190 70 220 55 270 63 C320 72 335 90 380 65 C425 39 450 42 490 70 C530 96 555 86 600 70"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2"
                          />

                          <path
                            d="M0 80 C45 63 70 62 105 74 C140 87 160 113 195 118 C230 122 260 102 290 81 C325 56 350 30 390 48 C430 65 440 82 470 77 C515 68 555 40 600 55"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="2"
                          />

                          <line
                            x1="385"
                            y1="20"
                            x2="385"
                            y2="150"
                            stroke="#94a3b8"
                            strokeDasharray="3 3"
                          />

                          <circle
                            cx="385"
                            cy="50"
                            r="3"
                            fill="#6366f1"
                          />
                        </svg>

                        {/* Tooltip */}

                        <div className="absolute left-[62%] top-[20px] rounded-[4px] bg-slate-900 dark:bg-slate-800 px-2 py-1 text-center text-white border border-slate-700">
                          <p className="text-[7px] font-semibold">60</p>
                          <p className="text-[5px]">hours</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      RIGHT PROGRESS CARD
                  ================================================== */}

                  <div className="space-y-3">
                    <div className="rounded-[8px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-bold text-slate-900 dark:text-white">
                          My Progress
                        </p>

                        <span className="rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 text-[5px]">
                          Daily⌄
                        </span>
                      </div>

                      <p className="mt-4 text-[6px] text-slate-500 dark:text-slate-400">
                        New Course
                      </p>

                      <p className="text-[14px] font-bold text-indigo-600 dark:text-indigo-400">
                        08
                      </p>

                      <p className="mt-2 text-[6px] text-slate-500 dark:text-slate-400">
                        Visited Lessons
                      </p>

                      <p className="text-[14px] font-bold text-indigo-600 dark:text-indigo-400">
                        13<span className="text-slate-400 dark:text-slate-500">/42</span>
                      </p>

                      <p className="mt-2 text-[6px] text-slate-500 dark:text-slate-400">
                        Completed
                      </p>

                      <p className="text-[14px] font-bold text-amber-500">
                        08<span className="text-slate-400 dark:text-slate-500">/12</span>
                      </p>

                      {/* Donut */}

                      <div className="mx-auto mt-3 flex h-[90px] w-[90px] items-center justify-center">
                        <div className="relative h-[82px] w-[82px]">
                          <svg
                            viewBox="0 0 100 100"
                            className="h-full w-full -rotate-90"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="35"
                              fill="none"
                              className="stroke-slate-200 dark:stroke-slate-800"
                              strokeWidth="7"
                            />

                            <circle
                              cx="50"
                              cy="50"
                              r="35"
                              fill="none"
                              stroke="#f97316"
                              strokeWidth="7"
                              strokeLinecap="round"
                              strokeDasharray="220"
                              strokeDashoffset="48"
                            />

                            <circle
                              cx="50"
                              cy="50"
                              r="24"
                              fill="none"
                              stroke="#6366f1"
                              strokeWidth="7"
                              strokeLinecap="round"
                              strokeDasharray="151"
                              strokeDashoffset="40"
                            />

                            <circle
                              cx="50"
                              cy="50"
                              r="13"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="7"
                              strokeLinecap="round"
                              strokeDasharray="82"
                              strokeDashoffset="27"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                        <span className="text-[6px] text-slate-500 dark:text-slate-400">
                          Total Hours
                        </span>

                        <span className="text-[7px] font-bold text-slate-900 dark:text-white">
                          8h 30m
                        </span>
                      </div>
                    </div>

                    {/* Today's course */}

                    <div className="rounded-[8px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                      <p className="text-[8px] font-bold text-slate-900 dark:text-white">
                        Today&apos;s course
                      </p>

                      <div className="mt-3 h-[65px] rounded-md bg-gradient-to-br from-indigo-100/70 to-purple-100/50 dark:from-indigo-950/60 dark:to-slate-800/80 border border-indigo-200/40 dark:border-indigo-900/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}