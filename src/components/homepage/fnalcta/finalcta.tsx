"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function FinalCTA() {
  const { data: session } = useSession();
  return (
    <section className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-t border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-[1055px] flex-col items-center text-center"
      >
        {/* Heading */}
        <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.045em] text-slate-900 dark:text-white sm:text-[38px]">
          It&apos;s easy to get started
        </h2>

        {/* Reviews */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-400 sm:text-[14px]">
            432,000+
          </span>

          <div className="flex items-center gap-[2px]">
            {[1, 2, 3, 4].map((star) => (
              <Star
                key={star}
                className="h-[14px] w-[14px] fill-amber-400 text-amber-400"
                strokeWidth={1.5}
              />
            ))}

            <Star
              className="h-[14px] w-[14px] fill-slate-300 dark:fill-slate-700 text-slate-300 dark:text-slate-700"
              strokeWidth={1.5}
            />
          </div>

          <span className="text-[13px] text-slate-600 dark:text-slate-400 sm:text-[14px]">
            reviews on Google Play and App Store
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex flex-col items-center gap-2.5 sm:flex-row">
          {!session?.user && (
            <Link
              href="/login"
              className="group flex h-[42px] min-w-[150px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-7 text-[11px] font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
            >
              Get started

              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
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
            className="flex h-[42px] min-w-[140px] items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-7 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-all duration-300 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
          >
            See How it works
          </a>
        </div>
      </motion.div>
    </section>
  );
}