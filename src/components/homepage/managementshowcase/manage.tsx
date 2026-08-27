"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";

export default function ManagementShowcase() {
  return (
    <section
      id="management-showcase"
      className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
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
          <h2 className="text-[31px] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#47474b] sm:text-[38px] lg:text-[42px]">
            Revolutionize Your Innovative
            <br />
            Management Solutions
          </h2>

          <p className="mx-auto mt-4 max-w-[650px] text-[10px] leading-[1.7] text-[#77777d] sm:text-[11px]">
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

          <div className="relative h-[365px] overflow-hidden rounded-[18px] bg-[#ededee] px-5 pt-11 sm:h-[410px] sm:px-10 sm:pt-12 lg:h-[455px] lg:px-16">
            {/* =================================================
                DASHBOARD WINDOW
            ================================================== */}

            <div className="relative mx-auto h-[450px] w-full max-w-[865px] overflow-hidden rounded-[16px] bg-white shadow-[0_12px_35px_rgba(40,40,60,0.08)]">
              {/* -------------------------------------------------
                  TOP NAVIGATION
              -------------------------------------------------- */}

              <div className="flex h-[50px] items-center border-b border-[#f0f0f3] px-4 sm:px-6">
                {/* Logo */}

                <div className="flex w-[85px] items-center">
                  <div className="relative h-[20px] w-[25px]">
                    <div className="absolute left-0 top-[3px] h-[14px] w-[14px] rotate-45 bg-[#1680ed]" />

                    <div className="absolute left-[8px] top-[3px] h-[14px] w-[14px] rotate-45 bg-[#83c3ff]" />
                  </div>
                </div>

                {/* Navigation */}

                <div className="flex h-full items-center gap-6 text-[7px] font-medium text-[#555561] sm:gap-9">
                  <div className="relative flex h-full items-center font-semibold text-[#31313d]">
                    Overview

                    <span className="absolute bottom-0 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-t-full bg-[#2584ed]" />
                  </div>

                  <span>Report</span>
                  <span>File Storage</span>
                  <span>Courses</span>
                </div>

                {/* Right controls */}

                <div className="ml-auto flex items-center gap-3">
                  <span className="text-[10px] text-[#777781]">⚙</span>
                  <span className="text-[10px] text-[#777781]">♧</span>

                  <div className="h-7 w-7 overflow-hidden rounded-full bg-gradient-to-br from-[#d8a477] to-[#65452d]" />

                  <span className="text-[8px] text-[#555561]">⌄</span>
                </div>
              </div>

              {/* -------------------------------------------------
                  DASHBOARD BODY
              -------------------------------------------------- */}

              <div className="bg-[#fbfaff] p-4 sm:p-5">
                <div className="grid grid-cols-[1.55fr_0.75fr] gap-4">
                  {/* LEFT */}

                  <div>
                    {/* Overview statistics */}

                    <div className="rounded-[8px] border border-[#f0edf5] bg-white p-3">
                      <div className="grid grid-cols-[1.05fr_0.8fr_0.8fr]">
                        {/* Student */}

                        <div className="border-r border-[#eeeeef] pr-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-[#c99c78] to-[#604332]" />

                            <div>
                              <p className="text-[8px] font-bold text-[#30303b]">
                                Jhon Smith
                              </p>

                              <p className="text-[6px] text-[#777782]">
                                Student · Beginner
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="rounded-full bg-[#eaf3ff] px-3 py-1 text-[6px] font-semibold text-[#2381ed]">
                              Mahamodul
                            </span>

                            <span className="text-[7px] text-[#555560]">
                              185
                            </span>
                          </div>
                        </div>

                        {/* Pending */}

                        <div className="border-r border-[#eeeeef] px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff741e] text-white">
                              <span className="text-[9px]">▣</span>
                            </div>

                            <div>
                              <p className="text-[16px] font-bold leading-none text-[#3c3c4c]">
                                04
                              </p>

                              <p className="mt-1 text-[6px] text-[#777782]">
                                Pending courses
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Complete */}

                        <div className="px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8739ed] text-white">
                              <span className="text-[9px]">◆</span>
                            </div>

                            <div>
                              <p className="text-[16px] font-bold leading-none text-[#3c3c4c]">
                                08
                              </p>

                              <p className="mt-1 text-[6px] text-[#777782]">
                                Complete Courses
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second row */}

                      <div className="mt-4 grid grid-cols-3 border-t border-[#eeeeef] pt-3">
                        <div>
                          <p className="text-[16px] font-bold text-[#3c3c4c]">
                            72h
                          </p>

                          <p className="text-[6px] text-[#777782]">
                            Watch time
                          </p>
                        </div>

                        <div>
                          <p className="text-[16px] font-bold text-[#3c3c4c]">
                            06
                          </p>

                          <p className="text-[6px] text-[#777782]">
                            Certificates
                          </p>
                        </div>

                        <div>
                          <p className="text-[16px] font-bold text-[#3c3c4c]">
                            185
                          </p>

                          <p className="text-[6px] text-[#777782]">
                            Earning points
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Learning activity */}

                    <div className="mt-3 rounded-[8px] border border-[#f0edf5] bg-white p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-bold text-[#3c3c46]">
                          Learning Activity
                        </p>

                        <div className="flex items-center gap-3 text-[6px]">
                          <span className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-sm bg-[#8e37ec]" />
                            Materials
                          </span>

                          <span className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-sm bg-[#ff7625]" />
                            Exam
                          </span>

                          <span className="rounded border border-[#dddde3] px-2 py-1">
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
                              className="h-px w-full bg-[#eeeeef]"
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
                            stroke="#ff7625"
                            strokeWidth="2"
                          />

                          <path
                            d="M0 80 C45 63 70 62 105 74 C140 87 160 113 195 118 C230 122 260 102 290 81 C325 56 350 30 390 48 C430 65 440 82 470 77 C515 68 555 40 600 55"
                            fill="none"
                            stroke="#8c36ed"
                            strokeWidth="2"
                          />

                          <line
                            x1="385"
                            y1="20"
                            x2="385"
                            y2="150"
                            stroke="#c6c6ce"
                            strokeDasharray="3 3"
                          />

                          <circle
                            cx="385"
                            cy="50"
                            r="3"
                            fill="#8c36ed"
                          />
                        </svg>

                        {/* Tooltip */}

                        <div className="absolute left-[62%] top-[20px] rounded-[4px] bg-[#17113c] px-2 py-1 text-center text-white">
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
                    <div className="rounded-[8px] border border-[#f0edf5] bg-white p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-bold text-[#3b3b45]">
                          My Progress
                        </p>

                        <span className="rounded border border-[#dedee5] px-2 py-1 text-[5px]">
                          Daily⌄
                        </span>
                      </div>

                      <p className="mt-4 text-[6px] text-[#777782]">
                        New Course
                      </p>

                      <p className="text-[14px] font-bold text-[#1679e8]">
                        08
                      </p>

                      <p className="mt-2 text-[6px] text-[#777782]">
                        Visited Lessons
                      </p>

                      <p className="text-[14px] font-bold text-[#8c36ed]">
                        13<span className="text-[#777782]">/42</span>
                      </p>

                      <p className="mt-2 text-[6px] text-[#777782]">
                        Completed
                      </p>

                      <p className="text-[14px] font-bold text-[#ff7625]">
                        08<span className="text-[#777782]">/12</span>
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
                              stroke="#eef0f3"
                              strokeWidth="7"
                            />

                            <circle
                              cx="50"
                              cy="50"
                              r="35"
                              fill="none"
                              stroke="#ff7625"
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
                              stroke="#8c36ed"
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
                              stroke="#1679e8"
                              strokeWidth="7"
                              strokeLinecap="round"
                              strokeDasharray="82"
                              strokeDashoffset="27"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-[#eeeeef] pt-3">
                        <span className="text-[6px] text-[#777782]">
                          Total Hours
                        </span>

                        <span className="text-[7px] font-bold text-[#3c3c45]">
                          8h 30m
                        </span>
                      </div>
                    </div>

                    {/* Today's course */}

                    <div className="rounded-[8px] border border-[#f0edf5] bg-white p-3">
                      <p className="text-[8px] font-bold text-[#3b3b45]">
                        Today&apos;s course
                      </p>

                      <div className="mt-3 h-[65px] rounded-md bg-gradient-to-br from-[#eef1ff] to-[#f7eaff]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                PLAY BUTTON
            ================================================== */}

            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="absolute bottom-[24px] left-[30px] z-30 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#555557] text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] sm:bottom-[24px] sm:left-[30px]"
              aria-label="Play management platform video"
            >
              <Play
                size={22}
                fill="currentColor"
                className="ml-1"
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}