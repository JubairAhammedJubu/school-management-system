"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronDown,
  Check,
} from "lucide-react";

export default function TalkToUs() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    schoolName: "",
    role: "School Admin / Principal",
    message: "",
  });
  const [roleOpen, setRoleOpen] = useState(false);
  const roleOptions = [
    { value: "School Admin / Principal", label: "School Principal / Admin", accent: "bg-blue-500" },
    { value: "Teacher", label: "Teacher / Educator", accent: "bg-indigo-500" },
    { value: "IT Manager", label: "IT Manager / Coordinator", accent: "bg-cyan-500" },
    { value: "Student / Parent", label: "Student / Parent", accent: "bg-emerald-500" },
    { value: "Other", label: "Other", accent: "bg-slate-400" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="talk-to-us" className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans">

      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-600/15 dark:via-indigo-600/15 dark:to-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header Section */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Let&apos;s Connect
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Ready to transform with{" "}
            <span className="text-blue-600 dark:text-blue-500">EduNexus</span>?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Have questions or want a personalized demo? Reach out to us and our team will get back to you shortly.
          </p>
        </motion.div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Contact Cards */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Prefer direct communication? Reach us through any of the options below.
              </p>
            </div>

            <div className="space-y-4">
              <motion.a
                href="mailto:contact@edunexus.com"
                className="flex items-center gap-4 p-4 rounded-2xl border bg-white/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-blue-950/20 hover:border-blue-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45, delay: 0.2 }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Send an Email
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    contact@edunexus.com
                  </p>
                </div>
              </motion.a>

              <motion.a
                href="tel:+8801700000000"
                className="flex items-center gap-4 p-4 rounded-2xl border bg-white/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-blue-950/20 hover:border-blue-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Call Us Directly
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    +880 1700-000000
                  </p>
                </div>
              </motion.a>

              <motion.div
                className="flex items-center gap-4 p-4 rounded-2xl border bg-white/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-blue-950/20"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45, delay: 0.4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Head Office
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="p-4 rounded-2xl border bg-blue-50/50 dark:bg-slate-900/40 border-blue-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-start gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: 0.5 }}
            >
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed">
                <strong className="font-semibold text-blue-600 dark:text-blue-400">Fast Response:</strong> Our support & sales teams typically respond within 2-4 business hours.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Glassmorphism Contact Form */}
          <motion.div
            className="lg:col-span-7 rounded-3xl p-6 sm:p-10 border bg-white/90 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800/80 shadow-2xl shadow-blue-900/5 dark:shadow-blue-950/30 backdrop-blur-xl relative"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.18, ease: "easeOut" }}
          >

            {/* Top Accent Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[3px] bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full" />

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Thank you for reaching out. A representative from EduNexus will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-600/20"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@school.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                      School / Institution Name
                    </label>
                    <input
                      type="text"
                      placeholder="Greenwood High School"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label id="role-label" className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                      Your Role
                    </label>
                    <div className="relative group/role">
                      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-blue-600 dark:text-blue-400">
                        <Sparkles className="w-4 h-4 transition-transform duration-300 group-focus-within/role:rotate-12" />
                      </div>
                      <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={roleOpen}
                        aria-labelledby="role-label"
                        onClick={() => setRoleOpen(!roleOpen)}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") setRoleOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-left text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:hover:border-blue-700"
                      >
                        {roleOptions.find((option) => option.value === formData.role)?.label}
                      </button>
                      <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-slate-400 transition-colors group-focus-within/role:text-blue-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                      {roleOpen && (
                        <div
                          role="listbox"
                          aria-labelledby="role-label"
                          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-blue-100 bg-white/95 p-1.5 shadow-xl shadow-blue-900/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-blue-950/30"
                        >
                          {roleOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              role="option"
                              aria-selected={formData.role === option.value}
                              onClick={() => {
                                setFormData({ ...formData, role: option.value });
                                setRoleOpen(false);
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:outline-none dark:text-slate-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-300 dark:focus:bg-blue-500/10"
                            >
                              <span className={`h-2.5 w-2.5 rounded-full ${option.accent}`} />
                              <span className="flex-1">{option.label}</span>
                              {formData.role === option.value && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    How can we help? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you're looking for or request a demo..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}