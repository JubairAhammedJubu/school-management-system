"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

interface AuthPageProps {
  initialMode?: "login" | "register";
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setShowPassword(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Wire this up to your real auth endpoint.
    window.setTimeout(() => {
      setIsSubmitting(false);
      router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 font-sans transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-[900px] min-h-[460px] bg-white dark:bg-slate-900 rounded-[1.75rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors duration-500"
      >
        {/* --- FORM CONTAINER --- */}
        <div
          className={`w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-12 py-8 transition-all duration-700 ease-in-out z-10 ${
            isLogin ? "md:translate-x-0" : "md:translate-x-full"
          }`}
        >
          <div className="mb-4">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Edu<span className="text-blue-600 dark:text-blue-400">Nexus</span>
              </span>
            </div>
            <h2 className="text-xl text-center md:text-left font-bold text-slate-900 dark:text-white">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-center md:text-left text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isLogin
                ? "Sign in to your school workspace."
                : "Join your school's digital campus."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <AnimatePresence initial={false} mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Your Name"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-blue-600 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@edunexus.school"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-colors mt-3 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-3 text-center text-slate-500 dark:text-slate-400 text-xs">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="ml-2 text-blue-600 dark:text-blue-400 font-bold underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>

        {/* --- DECORATIVE PANEL WITH IMAGE BACKGROUND --- */}
        <div
          className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full transition-transform duration-700 ease-in-out z-20 flex-col items-center justify-center text-white px-10 text-center ${
            isLogin ? "translate-x-full" : "translate-x-0"
          }`}
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1758270704286-83476deb3bd1?fm=jpg&q=80&w=1200&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/85 to-indigo-700/85 mix-blend-multiply z-0" />
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] z-0" />
          <div className="absolute top-[-10%] right-[-10%] w-56 h-56 bg-white/10 rounded-full blur-3xl z-0" />

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 space-y-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  Smart School Management
                </span>
              </div>

              <h2 className="text-2xl font-extrabold leading-tight">
                {isLogin ? "Join your school community" : "Welcome back, Educator"}
              </h2>
              <div className="space-y-2.5 text-white/90 text-sm">
                <p className="flex items-center gap-2.5 justify-center">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  Role-based dashboards for every user
                </p>
                <p className="flex items-center gap-2.5 justify-center">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  Real-time attendance &amp; results
                </p>
                <p className="flex items-center gap-2.5 justify-center">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  Secure institutional access
                </p>
              </div>
              <motion.button
                type="button"
                onClick={toggleAuthMode}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-1 px-7 py-2 border-2 border-white/30 bg-white/10 backdrop-blur-md rounded-full font-bold hover:bg-white hover:text-blue-700 transition-colors flex items-center gap-2 mx-auto text-sm"
              >
                {isLogin ? "SIGN UP NOW" : "SIGN IN TO ACCOUNT"} <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
