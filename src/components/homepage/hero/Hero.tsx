"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";

export default function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-[600px] sm:min-h-[700px] overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-[340px] w-[120px] rotate-[40deg] rounded-[70px] bg-indigo-100/70 dark:bg-slate-900/60" />
        <div className="absolute left-[130px] -top-20 h-[350px] w-[105px] rotate-[40deg] rounded-[70px] bg-indigo-100/70 dark:bg-slate-900/60" />
        <div className="absolute right-[120px] -top-28 h-[360px] w-[110px] rotate-[40deg] rounded-[70px] bg-indigo-100/70 dark:bg-slate-900/60" />
        <div className="absolute right-[-40px] -top-32 h-[380px] w-[115px] rotate-[40deg] rounded-[70px] bg-indigo-100/70 dark:bg-slate-900/60" />
        <div className="absolute -bottom-32 -left-10 h-[370px] w-[115px] rotate-[40deg] rounded-[70px] bg-indigo-100/70 dark:bg-slate-900/60" />
        <div className="absolute -bottom-36 right-[90px] h-[390px] w-[120px] rotate-[40deg] rounded-[70px] bg-indigo-100/70 dark:bg-slate-900/60" />
        <div className="absolute -bottom-32 right-[-30px] h-[390px] w-[120px] rotate-[40deg] rounded-[70px] bg-indigo-100/70 dark:bg-slate-900/60" />
        <div className="absolute left-1/2 top-[25%] h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-[140px]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-[600px] sm:min-h-[700px] max-w-[1200px] flex-col items-center px-4 pt-24 sm:px-8 sm:pt-28 lg:pt-32 pb-8 sm:pb-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[820px] text-center"
        >
          <h1 className="font-heading text-[32px] font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-950 dark:text-white xs:text-[38px] sm:text-[52px] md:text-[60px] lg:text-[66px]">
            Powerful Tools for Effective{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300">
              School Management.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[680px] px-2 text-[14px] leading-[1.7] text-slate-600 dark:text-slate-300 sm:text-[16px]">
            Your ultimate SaaS solution for effortless school administration and academic
            <br className="hidden sm:block" />
            excellence. Simplify administrative tasks, enhance engagement.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-6 flex flex-row items-center justify-center gap-3 sm:mt-7"
        >
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
        </motion.div>

        {/* BOTTOM VISUALS */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="relative mt-6 sm:mt-9 flex h-[200px] sm:h-[300px] w-full max-w-[1040px] items-end justify-center gap-2.5 sm:gap-4 px-2"
        >
          {/* CARD 1 — TEXT CARD */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="relative hidden h-[275px] w-[185px] overflow-hidden rounded-[27px] bg-white dark:bg-slate-900/90 p-5 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 lg:block"
          >
            <div className="absolute left-0 top-0 h-[105px] w-full overflow-hidden">
              <svg viewBox="0 0 260 110" className="absolute left-[-20px] top-0 h-full w-[290px]" fill="none">
                {Array.from({ length: 11 }).map((_, index) => (
                  <path
                    key={index}
                    d={`M-20 ${20 + index * 7} C 50 ${-10 + index * 5}, 90 ${85 + index * 3}, 165 ${42 + index * 5} C 205 ${15 + index * 6}, 230 ${65 + index * 4}, 280 ${30 + index * 5}`}
                    stroke="#818cf8"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                ))}
              </svg>
            </div>

            <div className="absolute left-5 top-[112px]">
              <ArrowRight size={29} strokeWidth={1.5} className="text-indigo-600 dark:text-indigo-400" />
            </div>

            <p className="absolute bottom-7 left-5 right-5 text-[14px] leading-[1.45] font-semibold text-slate-900 dark:text-white">
              Empower Your
              <br />
              Educational
              <br />
              Institution with
              <br />
              School Manager Pro
            </p>
          </motion.div>

          {/* CARD 2 — 260% */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="hidden sm:flex h-[180px] w-[105px] sm:h-[200px] sm:w-[112px] flex-col items-center justify-center rounded-[22px] sm:rounded-[26px] bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-lg sm:shadow-xl shadow-slate-200/50 dark:shadow-black/40 text-center shrink-0"
          >
            <span className="text-[16px] sm:text-[18px] font-bold text-slate-900 dark:text-white">260%</span>
            <p className="mt-1 px-2 sm:px-3 text-[8px] leading-[1.35] text-slate-600 dark:text-slate-400 font-medium">
              Your ultimate SaaS
              <br />
              solution for effortless
            </p>
          </motion.div>

          {/* CARD 3 — CLASSROOM IMAGE */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="relative h-[140px] w-[170px] sm:h-[155px] sm:w-[210px] overflow-hidden rounded-[20px] sm:rounded-[25px] bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=85"
              alt="Team collaborating in a modern workspace"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/5" />
          </motion.div>

          {/* CARD 4 — 98% */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="flex h-[175px] w-[100px] sm:h-[200px] sm:w-[112px] flex-col items-center justify-center rounded-[22px] sm:rounded-[26px] bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-lg sm:shadow-xl shadow-slate-200/50 dark:shadow-black/40 text-center shrink-0"
          >
            <span className="text-[16px] sm:text-[18px] font-bold text-slate-900 dark:text-white">98%</span>
            <p className="mt-1 px-2 sm:px-3 text-[8px] leading-[1.35] text-slate-600 dark:text-slate-400 font-medium">
              our comprehensive suite
              <br />
              of tools and support.
            </p>
          </motion.div>

          {/* CARD 5 — STUDENT IMAGE */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="relative hidden sm:block h-[240px] w-[170px] lg:h-[275px] lg:w-[195px] overflow-hidden rounded-[35px] lg:rounded-[45px] border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=85"
              alt="Student studying with a laptop"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Second overlapping student shape */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="relative hidden md:block h-[240px] w-[95px] lg:h-[275px] lg:w-[105px] overflow-hidden rounded-[35px] lg:rounded-[45px] border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=500&q=85"
              alt="Student working on a laptop"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}