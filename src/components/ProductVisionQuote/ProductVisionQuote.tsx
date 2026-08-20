"use client";

import React from "react";
import { Quote, Sparkles } from "lucide-react";

export default function ProductVisionQuote() {
  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-600/10 dark:from-blue-600/15 dark:via-indigo-600/15 dark:to-blue-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 text-center border bg-white/90 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800/80 shadow-2xl shadow-blue-900/5 dark:shadow-blue-950/30 backdrop-blur-xl transition-all duration-500">
          
          {/* Top Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[3px] bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full" />

          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20 mb-8 sm:mb-10">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Product Vision
          </div>

          {/* Quote Mark Decorative */}
          <div className="absolute top-8 left-8 sm:top-10 sm:left-10 text-slate-200 dark:text-slate-800/60 pointer-events-none">
            <Quote className="w-12 h-12 sm:w-16 sm:h-16 rotate-180" />
          </div>

          {/* Main Quote */}
          <blockquote className="relative z-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed sm:leading-snug max-w-3xl mx-auto text-slate-800 dark:text-slate-100 font-normal">
            "The goal isn't another dashboard to check — it's one place where attendance, grades, and fees already agree with each other."
          </blockquote>

          {/* Subtitle Line */}
          <div className="relative z-10 mt-8 sm:mt-10 flex items-center justify-center gap-3">
            <span className="h-[1px] w-8 bg-slate-300 dark:bg-slate-700/80" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-slate-500 dark:text-slate-400 uppercase">
              BYTECODE_BREAKERS
            </span>
            <span className="h-[1px] w-8 bg-slate-300 dark:bg-slate-700/80" />
          </div>

        </div>
      </div>
    </section>
  );
}