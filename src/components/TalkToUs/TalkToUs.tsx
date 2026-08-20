"use client";

import React, { useState, useRef, useEffect } from "react";
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
  ShieldCheck,
  GraduationCap,
  Cpu,
  User,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const roleOptions = [
  { value: "School Principal / Admin", label: "School Principal / Admin", icon: ShieldCheck },
  { value: "Teacher / Educator", label: "Teacher / Educator", icon: GraduationCap },
  { value: "IT Manager / Coordinator", label: "IT Manager / Coordinator", icon: Cpu },
  { value: "Student / Parent", label: "Student / Parent", icon: User },
  { value: "Other", label: "Other", icon: Sparkles },
];

export default function TalkToUs() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    schoolName: "",
    role: "School Principal / Admin",
    message: "",
  });

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const selectedRoleObj = roleOptions.find((r) => r.value === formData.role) || roleOptions[0];
  const SelectedIcon = selectedRoleObj.icon;

  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-600/15 dark:via-indigo-600/15 dark:to-purple-600/15 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Let's Connect
          </motion.div>

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
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-5 space-y-6"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Prefer direct communication? Reach us through any of the options below.
              </p>
            </motion.div>

            <div className="space-y-4">
              <motion.a
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                href="mailto:contact@edunexus.com"
                className="flex items-center gap-4 p-4 rounded-2xl border bg-white/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-blue-950/20 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
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
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                href="tel:+8801700000000"
                className="flex items-center gap-4 p-4 rounded-2xl border bg-white/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-blue-950/20 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
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
                variants={itemVariants}
                whileHover={{ y: -2, scale: 1.01 }}
                className="flex items-center gap-4 p-4 rounded-2xl border bg-white/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-blue-950/20 transition-all duration-300"
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
              variants={itemVariants}
              className="p-4 rounded-2xl border bg-blue-50/50 dark:bg-slate-900/40 border-blue-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-start gap-3"
            >
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 animate-pulse" />
              <p className="text-xs leading-relaxed">
                <strong className="font-semibold text-blue-600 dark:text-blue-400">Fast Response:</strong> Our support & sales teams typically respond within 2-4 business hours.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Glassmorphism Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-7 rounded-3xl p-6 sm:p-10 border bg-white/90 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800/80 shadow-2xl shadow-blue-900/5 dark:shadow-blue-950/30 backdrop-blur-xl relative"
          >
            
            {/* Top Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[3px] bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full origin-center"
            />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="text-center py-12 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Thank you for reaching out. A representative from EduNexus will contact you shortly.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
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

                    {/* Custom Animated Select Dropdown */}
                    <div className="relative" ref={selectRef}>
                      <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                        Your Role
                      </label>

                      {/* Dropdown Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsSelectOpen((prev) => !prev)}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isSelectOpen
                            ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <SelectedIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{selectedRoleObj.label}</span>
                        </div>

                        <motion.div
                          animate={{ rotate: isSelectOpen ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="shrink-0 text-slate-400 dark:text-slate-500 ml-2"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </button>

                      {/* Dropdown Animated Menu */}
                      <AnimatePresence>
                        {isSelectOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-blue-950/20 backdrop-blur-xl p-1.5 space-y-1 overflow-hidden"
                          >
                            {roleOptions.map((option, idx) => {
                              const OptionIcon = option.icon;
                              const isSelected = option.value === formData.role;

                              return (
                                <motion.button
                                  key={option.value}
                                  type="button"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.15, delay: idx * 0.03 }}
                                  whileHover={{ x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setFormData({ ...formData, role: option.value });
                                    setIsSelectOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                    isSelected
                                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                        isSelected
                                          ? "bg-white/20 text-white"
                                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                      }`}
                                    >
                                      <OptionIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <span>{option.label}</span>
                                  </div>

                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                      <Check className="w-4 h-4 text-white" />
                                    </motion.div>
                                  )}
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
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

                  <motion.button
                    whileHover={{ scale: 1.015, boxShadow: "0px 10px 25px rgba(37, 99, 235, 0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all duration-200 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}