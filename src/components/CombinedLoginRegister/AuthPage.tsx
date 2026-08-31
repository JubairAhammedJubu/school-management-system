"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  KeyRound,
  UserPlus,
  Sparkles,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";

type Role = "student" | "teacher" | "admin";

interface AuthPageProps {
  initialMode?: "login" | "register";
}

const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1779358296802-715fc9fbc152?fm=jpg&q=80&w=1200&auto=format&fit=crop";
const REGISTER_IMAGE =
  "https://images.unsplash.com/photo-1758270704286-83476deb3bd1?fm=jpg&q=80&w=1200&auto=format&fit=crop";

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match. Please verify your password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error: signInError } = await signIn.email({ email, password });
        if (signInError) {
          throw new Error(signInError.message ?? "Invalid email or password.");
        }
        toast.success("Welcome back! Redirecting to your workspace...");
      } else {
        const { error: signUpError } = await signUp.email({
          email,
          password,
          name,
          role: "student",
        } as Parameters<typeof signUp.email>[0]);

        if (signUpError) {
          throw new Error(
            signUpError.message ?? "Could not create your account."
          );
        }
        toast.success("Account created successfully! Welcome to EduNexus 🎉");
      }
      window.location.href = "/";
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-black pt-24 sm:pt-28 pb-6 p-4 font-sans transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-[880px] min-h-[420px] bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl shadow-slate-300/50 dark:shadow-black/40 overflow-hidden flex flex-col md:flex-row transition-colors duration-500 border border-slate-200 dark:border-slate-800"
      >
        {/* --- FORM CONTAINER --- */}
        <div
          className={`w-full md:w-1/2 flex flex-col justify-center px-7 sm:px-10 py-6 transition-all duration-700 ease-in-out z-10 bg-white dark:bg-slate-900 ${isLogin ? "md:translate-x-0" : "md:translate-x-full"
            }`}
        >
          <div className="mb-3">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-1.5">
              <div className="relative h-7 w-7 shrink-0">
                <Image
                  src="/second_logo_transparent.png"
                  alt="EduNexus Logo"
                  width={28}
                  height={28}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                Edu
                <span className="text-blue-600 dark:text-blue-400">Nexus</span>
              </span>
            </div>
            <h2 className="text-lg text-center md:text-left font-bold text-slate-900 dark:text-white">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-center md:text-left text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isLogin
                ? "Sign in to your school workspace."
                : "Join your school's digital campus."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
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
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                      <User size={14} />
                    </div>
                    <input
                      type="text"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@edunexus.std.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <AnimatePresence initial={false} mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="confirmPassword"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                      <ShieldCheck size={14} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required={!isLogin}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p className="text-[11px] font-medium text-red-500 dark:text-red-400 ml-1">
                {error}
              </p>
            )}

            {isLogin && (
              <motion.button
                type="button"
                disabled={
                  email === "demostudent@gmail.com" &&
                  password === "demostudent1234"
                }
                onClick={() => {
                  setEmail("demostudent@gmail.com");
                  setPassword("demostudent1234");
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Sparkles size={13} className="text-amber-500 shrink-0" />
                <span>
                  {email === "demostudent@gmail.com" &&
                    password === "demostudent1234"
                    ? "Demo Credentials Fulfilled"
                    : "Fill Demo Student Credentials"}
                </span>
              </motion.button>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-2.5 text-center text-slate-500 dark:text-slate-400 text-[11px]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="ml-1.5 text-blue-600 dark:text-blue-400 font-bold underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>

        {/* --- DECORATIVE PANEL WITH IMAGE BACKGROUND --- */}
        <div
          className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full transition-transform duration-700 ease-in-out z-20 flex-col items-start justify-end text-white px-8 pb-10 text-left ${isLogin ? "translate-x-full" : "translate-x-0"
            }`}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={isLogin ? "login-bg" : "register-bg"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${isLogin ? LOGIN_IMAGE : REGISTER_IMAGE}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-slate-950/40 z-0" />
          <div className="absolute top-[-10%] right-[-10%] w-56 h-56 bg-blue-400/20 rounded-full blur-3xl z-0" />
          <div className="absolute bottom-[-15%] left-[-10%] w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl z-0" />

          {/* Top-left brand chip */}
          <div className="absolute top-6 left-6 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
            <GraduationCap size={16} className="text-white" />
          </div>

          {/* Top-right Form Toggle Button on Image */}
          <motion.button
            type="button"
            onClick={toggleAuthMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-6 right-6 z-30 flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/35 px-3.5 py-1.5 text-xs font-bold text-white shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <span>{isLogin ? "Create Account" : "Sign In"}</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative z-10 w-full px-1"
            >
              {isLogin ? (
                <>
                  <div className="flex items-center mb-3">
                    <div className="flex -space-x-2.5">
                      {[
                        "bg-blue-400",
                        "bg-indigo-400",
                        "bg-amber-400",
                        "bg-pink-400",
                      ].map((c, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.06 }}
                          className={`h-7 w-7 rounded-full ${c} border-2 border-slate-950 flex items-center justify-center text-[9px] font-bold text-slate-900`}
                        >
                          {["A", "R", "S", "M"][i]}
                        </motion.span>
                      ))}
                      <span className="h-7 w-7 rounded-full bg-white/15 backdrop-blur-md border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">
                        +9k
                      </span>
                    </div>
                    <span className="ml-2.5 text-[10px] text-white/60 font-medium">
                      already signed in today
                    </span>
                  </div>

                  <h2 className="text-[26px] font-black leading-[1.1] tracking-tight text-left mb-3">
                    Pick up right
                    <br />
                    where you{" "}
                    <span className="italic font-serif font-normal text-indigo-300">
                      left off.
                    </span>
                  </h2>

                  <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium mb-2">
                    <KeyRound size={12} className="text-white/50" />
                    Your dashboard, grades &amp; messages are waiting
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 mb-4">
                    {[
                      { label: "Details", icon: UserPlus, active: true },
                      { label: "Verify", icon: ShieldCheck, active: false },
                      { label: "Explore", icon: GraduationCap, active: false },
                    ].map((step, i) => (
                      <div
                        key={step.label}
                        className="flex items-center gap-1.5"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.08 }}
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 border backdrop-blur-md ${step.active
                              ? "bg-indigo-400/20 border-indigo-300/40"
                              : "bg-white/[0.06] border-white/15"
                            }`}
                        >
                          <step.icon
                            size={11}
                            className={
                              step.active ? "text-indigo-300" : "text-white/50"
                            }
                          />
                          <span
                            className={`text-[8px] font-bold uppercase tracking-wide ${step.active ? "text-indigo-200" : "text-white/50"
                              }`}
                          >
                            {step.label}
                          </span>
                        </motion.div>
                        {i < 2 && <span className="h-px w-3 bg-white/20" />}
                      </div>
                    ))}
                  </div>

                  <h2 className="text-[26px] font-black leading-[1.1] tracking-tight text-left mb-3">
                    Takes under
                    <br />
                    <span className="italic font-serif font-normal text-indigo-300">
                      two minutes.
                    </span>
                  </h2>

                  <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium mb-2">
                    <KeyRound size={12} className="text-white/50" />
                    Quick signup for instant access
                  </div>
                </>
              )}

              {/* Bottom Action Button on Image */}
              <motion.button
                type="button"
                onClick={toggleAuthMode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 w-full py-2 px-4 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-xs font-bold text-white shadow-lg transition-all flex items-center justify-between cursor-pointer group"
              >
                <span>{isLogin ? "Need a new account?" : "Already registered?"}</span>
                <span className="flex items-center gap-1 text-indigo-300 underline font-extrabold group-hover:translate-x-0.5 transition-transform">
                  {isLogin ? "Register Now" : "Sign In"} <ArrowRight size={13} />
                </span>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}