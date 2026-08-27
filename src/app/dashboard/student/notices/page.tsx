"use client";

import { Bell, CalendarDays, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const notices = [
  { title: "Mid-term exam schedule released", date: "August 24, 2026", detail: "Review your subject dates and exam room assignments." },
  { title: "Library will be closed on Saturday", date: "August 22, 2026", detail: "Please borrow or return books before Friday afternoon." },
  { title: "Annual sports day registration open", date: "August 18, 2026", detail: "Register with the student activities office by September 2." },
];

export default function StudentNoticesPage() {
  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 bg-slate-100/90 p-6 text-slate-900 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:p-8"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Sparkles className="h-3 w-3" /> Student Workspace
            </span>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Notices</h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">School updates and important reminders.</p>
          </div>
        </div>
      </motion.section>

      <div className="space-y-3">
        {notices.map((notice, index) => (
          <motion.article
            key={notice.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="flex gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{notice.title}</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{notice.date}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{notice.detail}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
