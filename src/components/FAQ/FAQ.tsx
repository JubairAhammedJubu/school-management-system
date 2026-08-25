"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is EduNexus and how does it transform school management?",
    answer:
      "EduNexus is an all-in-one, intelligent school management system that replaces legacy paperwork, paper registers, and scattered spreadsheets. It connects administrators, teachers, students, and parents into a unified role-based digital ecosystem.",
    icon: <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
  },
  {
    id: "faq-2",
    question: "How long does it take to onboard and launch EduNexus for our school?",
    answer:
      "Setup takes less than 15 minutes! You can bulk import student profiles, staff accounts, and class structures via CSV or Excel. Our automated credential generator distributes secure login access instantly.",
    icon: <Zap className="w-4 h-4 text-amber-500" />,
  },
  {
    id: "faq-3",
    question: "How does the AI At-Risk Student Prediction engine work?",
    answer:
      "Our built-in AI model monitors real-time attendance trends, assignment submissions, and test score fluctuations. If a student shows signs of falling behind or attendance drop-offs, teachers and admins receive proactive early warnings before exams.",
    icon: <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
  },
  {
    id: "faq-4",
    question: "How secure is our school data and student privacy on EduNexus?",
    answer:
      "Security is our highest priority. EduNexus enforces end-to-end encryption, strict role-based access control (RBAC), automatic daily encrypted backups, and ISO/GDPR compliant data storage.",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: "faq-5",
    question: "Can teachers mark attendance and publish results from mobile phones?",
    answer:
      "Yes! EduNexus is 100% responsive and accessible on any device—mobile phones, tablets, or laptops. Teachers can mark digital attendance with a single tap and publish grade cards anywhere.",
    icon: <BookOpen className="w-4 h-4 text-blue-500" />,
  },
];

const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative w-full py-20 sm:py-28 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans">

      {/* Ambient Background Glows */}
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-8 md:px-0">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md"
          >
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight"
          >
            Everything you need to know about{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              EduNexus
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Have questions about onboarding, features, or security? We have answers.
          </motion.p>
        </div>

        {/* FAQ Accordion List (All In One Unified View) */}
        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`rounded-2xl border transition-all duration-300 backdrop-blur-xl overflow-hidden ${isOpen
                  ? "border-blue-500/70 dark:border-blue-500/70 bg-white dark:bg-slate-900 shadow-xl ring-2 ring-blue-500/20"
                  : "border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 pr-4">
                    {item.icon && (
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                        {item.icon}
                      </div>
                    )}
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {item.question}
                    </span>
                  </div>

                  {/* Animated Rotation Chevron */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                {/* Animated Answer Body (Framer Motion height reveal) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 pb-6 pt-1 sm:px-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Help CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-r from-blue-50/80 via-white/80 to-indigo-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/90 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
                Still have questions?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Can&apos;t find the answer you&apos;re looking for? Talk to our education specialists.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0 active:scale-95 text-sm"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default FAQSection;
