"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

type Role = "admin" | "teacher" | "student";

interface RoleOption {
  id: Role;
  label: string;
  icon: React.ReactNode;
}

const roleOptions: RoleOption[] = [
  { id: "admin", label: "Admin", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: "teacher", label: "Teacher", icon: <UserCheck className="w-4 h-4" /> },
  { id: "student", label: "Student", icon: <GraduationCap className="w-4 h-4" /> },
];

export default function LoginPage() {
  const [role, setRole] = useState<Role>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Wire this up to your auth endpoint.
    window.setTimeout(() => setIsSubmitting(false), 1200);
  };

  return (
    <main className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
      {/* Background Ambient Glowing Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 dark:bg-blue-600/25 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 dark:bg-indigo-600/25 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto w-full container px-5 pt-28 sm:pt-32 pb-16 lg:pb-20">
        <div className="grid w-full items-stretch gap-10 lg:gap-14 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Left: Brand Panel (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden lg:flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-br from-blue-600 to-indigo-600 p-10 shadow-2xl shadow-blue-500/20 overflow-hidden relative"
          >
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md text-white">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                  Edu<span className="text-blue-100">Nexus</span>
                </h1>
              </div>

              <h2 className="mt-10 text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white">
                Welcome back to your school, in one place.
              </h2>
              <p className="mt-4 text-sm xl:text-base leading-relaxed text-blue-100/90 max-w-sm">
                Sign in to manage students, staff, attendance and results — everything
                scoped to exactly what your role needs.
              </p>

              <div className="mt-8 flex flex-col gap-3 text-sm font-medium text-blue-50">
                <span className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Role-based dashboards for every user
                </span>
                <span className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Real-time attendance & results
                </span>
                <span className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> AI-powered at-risk predictions
                </span>
              </div>
            </div>

            {/* Floating stat card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative mt-10 w-fit rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-3 shadow-xl"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-blue-100/80">Trusted by campuses</p>
                  <p className="text-xs font-bold text-white">98.4% on-time reporting</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Login Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="w-full rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8 lg:p-10 flex flex-col justify-center"
          >
            {/* Mobile logo (shown when brand panel is hidden) */}
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Edu<span className="text-blue-600 dark:text-blue-400">Nexus</span>
              </h1>
            </div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/60 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md w-fit">
              <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              <span>SIGN IN</span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Log in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Choose your role and enter your credentials to continue.
            </p>

            {/* Role Segmented Control */}
            <div className="mt-6 grid grid-cols-3 gap-1.5 bg-slate-100/60 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              {roleOptions.map((opt) => {
                const active = role === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRole(opt.id)}
                    className={`relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      active
                        ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === "admin"
                        ? "admin@edunexus.school"
                        : role === "teacher"
                          ? "teacher@edunexus.school"
                          : "student@edunexus.school"
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 pl-10 pr-11 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-600 cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Keep me signed in
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>
                      Sign in as{" "}
                      {roleOptions.find((r) => r.id === role)?.label}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Role badge reminder */}
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mt-5 flex items-center gap-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5"
              >
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                  {roleOptions.find((r) => r.id === role)?.icon}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {role === "admin" &&
                    "Full operational, financial and administrative access."}
                  {role === "teacher" &&
                    "Access to assigned classes, attendance and results."}
                  {role === "student" &&
                    "Your personal attendance, results and notices."}
                </p>
              </motion.div>
            </AnimatePresence>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              New to EduNexus?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Register your school
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}