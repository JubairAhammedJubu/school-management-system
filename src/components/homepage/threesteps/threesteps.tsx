"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Clock3,
  GraduationCap,
  LockKeyhole,
  SlidersHorizontal,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Features",
    description:
      "Uncover the Breadth and Depth of EduGenius' Powerful Tools and Capabilities",
    active: true,
  },
  {
    number: "02",
    title: "Navigate Dashboard",
    description:
      "Effortlessly Maneuver through the Intuitive Interface for Seamless Operations",
    active: false,
  },
  {
    number: "03",
    title: "Optimize Workflow",
    description:
      "Maximize Efficiency and Effectiveness with Streamlined Processes and Automation",
    active: false,
  },
];

export default function ThreeSteps() {
  return (
    <section className="w-full bg-white px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1080px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.045em] text-[#48484d] sm:text-[36px] lg:text-[39px]">
            Simplify School Management in 3 Steps
          </h2>

          <p className="mt-3 max-w-[680px] text-[10px] leading-[1.6] text-[#77777d] sm:text-[11px]">
            Streamline Operations, Enhance Engagement, and Empower Educators,
            Discover Seamless Efficiency and Innovation in Education Management.
          </p>
        </motion.div>

        {/* Content */}
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_1.08fr] lg:gap-12">
          {/* Left illustration */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="relative h-[325px] w-full overflow-hidden rounded-[15px] bg-gradient-to-br from-[#eee4ff] via-[#eee9ff] to-[#e7e4ff]"
          >
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
              }}
            />

            {/* Decorative glow */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#b784ff]/20 blur-3xl" />

            {/* Main white card */}
            <div className="absolute left-[16%] top-[11%] w-[76%] rounded-[12px] bg-white/95 p-5 shadow-[0_15px_35px_rgba(75,52,130,0.10)]">
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-[#444450]">
                  My assignment
                </h3>

                <SlidersHorizontal className="h-4 w-4 text-[#777780]" />
              </div>

              <div className="mt-4 flex items-center gap-8 border-b border-[#eeeeef] pb-3 text-[9px] font-semibold text-[#6d6d76]">
                <span className="text-[#444450]">☷</span>
                <span>TASK</span>
              </div>

              {/* Fake rows */}
              <div className="mt-5 space-y-3">
                <div className="h-2 w-[58%] rounded-full bg-[#f0f0f4]" />
                <div className="h-2 w-[75%] rounded-full bg-[#f0f0f4]" />
                <div className="h-2 w-[45%] rounded-full bg-[#f0f0f4]" />
              </div>
            </div>

            {/* Statistics floating card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="absolute bottom-[17px] left-[8%] w-[73%] rounded-[9px] bg-white p-4 shadow-[0_12px_30px_rgba(40,40,60,0.13)]"
            >
              <div className="grid grid-cols-2">
                {/* Pending */}
                <div className="flex items-center gap-3 border-b border-r border-[#eeeeef] pb-3 pr-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff7420] text-white">
                    <BookOpen className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-[16px] font-bold leading-none text-[#3f3f48]">
                      04
                    </p>
                    <p className="mt-1 text-[7px] text-[#85858e]">
                      Pending courses
                    </p>
                  </div>
                </div>

                {/* Complete */}
                <div className="flex items-center gap-3 border-b border-[#eeeeef] pb-3 pl-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2683e8] text-white">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-[16px] font-bold leading-none text-[#3f3f48]">
                      08
                    </p>
                    <p className="mt-1 text-[7px] text-[#85858e]">
                      Complete Courses
                    </p>
                  </div>
                </div>

                {/* Watch time */}
                <div className="flex items-center gap-3 border-r border-[#eeeeef] pt-3 pr-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2683e8] text-white">
                    <Clock3 className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-[16px] font-bold leading-none text-[#3f3f48]">
                      72h
                    </p>
                    <p className="mt-1 text-[7px] text-[#85858e]">
                      Watch time
                    </p>
                  </div>
                </div>

                {/* Certificates */}
                <div className="flex items-center gap-3 pt-3 pl-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ed21dd] text-white">
                    <LockKeyhole className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-[16px] font-bold leading-none text-[#3f3f48]">
                      06
                    </p>
                    <p className="mt-1 text-[7px] text-[#85858e]">
                      Certificates
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="flex min-h-[96px] overflow-hidden rounded-[7px] bg-[#f8f8f9]"
              >
                {/* Accent */}
                <div
                  className={`w-[8px] shrink-0 rounded-full ${
                    step.active
                      ? "bg-gradient-to-b from-[#9135ee] to-[#9135ee]"
                      : "bg-[#ddd5ef]"
                  }`}
                />

                <div className="flex flex-1 flex-col justify-center px-5 py-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-[#4b4b53]">
                      {step.title}
                    </h3>
                  </div>

                  <p className="mt-1 max-w-[470px] text-[10px] leading-[1.55] text-[#85858c]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}