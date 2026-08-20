"use client";

import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  User,
  BriefcaseBusiness,
  RotateCcw,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [toast, setToast] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = () => {
    if (isRegistering) return;

    setToast(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      setToast("error");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your institutional email.");
      setToast("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setToast("error");
      return;
    }

    if (!role) {
      setErrorMessage("Please select an account role.");
      setToast("error");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      setToast("error");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      setToast("error");
      return;
    }

    if (!/\d/.test(password)) {
      setErrorMessage("Password must contain at least one number.");
      setToast("error");
      return;
    }

    if (!confirmPassword) {
      setErrorMessage("Please confirm your password.");
      setToast("error");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setToast("error");
      return;
    }

    setIsRegistering(true);
    setToast("success");

    window.setTimeout(() => {
      router.push("/login");
    }, 2500);
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <main
      className="
        min-h-screen
        bg-[#f5f8ff]
        px-4
        pb-8
        pt-[120px]
        text-slate-900
        transition-colors
        duration-500
        dark:bg-slate-950
        dark:text-slate-100
        sm:px-6
        lg:px-8
      "
    >
      {/* =====================================================
          TOAST
      ====================================================== */}
      {toast && (
        <div className="fixed right-5 top-[100px] z-[99999]">
          {/* SUCCESS */}
          {toast === "success" && (
            <div
              className="
                flex
                w-[260px]
                items-center
                gap-2.5
                rounded-xl
                border
                border-emerald-100
                bg-white
                px-3
                py-2.5
                shadow-[0_12px_30px_rgba(15,23,42,0.15)]
                dark:border-emerald-900/50
                dark:bg-slate-900
                dark:shadow-black/30
              "
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                <Check
                  size={16}
                  strokeWidth={2.5}
                  className="text-emerald-500 dark:text-emerald-400"
                />
              </div>

              <p className="text-xs font-semibold text-[#111a31] dark:text-white">
                Registration successful
              </p>
            </div>
          )}

          {/* ERROR */}
          {toast === "error" && (
            <div
              className="
                flex
                w-[300px]
                items-center
                gap-2.5
                rounded-xl
                border
                border-red-100
                bg-white
                px-3
                py-2.5
                shadow-[0_12px_30px_rgba(15,23,42,0.15)]
                dark:border-red-900/50
                dark:bg-slate-900
                dark:shadow-black/30
              "
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
                <AlertCircle
                  size={16}
                  strokeWidth={2.5}
                  className="text-red-500 dark:text-red-400"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#111a31] dark:text-white">
                  Registration failed
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                  {errorMessage}
                </p>
              </div>

              <button
                type="button"
                onClick={closeToast}
                className="shrink-0 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          MAIN CARD
      ====================================================== */}
      <div className="mx-auto flex w-full max-w-[1180px] items-start justify-center">
        <div
          className="
            grid
            w-full
            overflow-hidden
            rounded-[24px]
            bg-white
            shadow-[0_24px_70px_rgba(36,70,130,0.14)]
            transition-colors
            duration-500
            dark:bg-slate-900
            dark:shadow-black/30
            lg:grid-cols-[43%_57%]
          "
        >
          {/* =====================================================
              LEFT BRANDING PANEL
          ====================================================== */}
          <section className="relative hidden min-h-[680px] overflow-hidden bg-[#10182d] lg:block">
            {/* Decorative glow */}
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#315cff]/20 blur-3xl" />

            <div className="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-[#4d3df5]/20 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col p-10 xl:p-12">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-white shadow-[0_8px_24px_rgba(47,91,255,0.25)]">
                  <GraduationCap
                    size={25}
                    strokeWidth={2.1}
                    className="text-[#315cff]"
                  />
                </div>

                <div>
                  <h1 className="text-[17px] font-bold tracking-[-0.02em] text-white">
                    Edu<span className="text-[#4772ff]">Nexus</span>
                  </h1>

                  <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500">
                    School Management
                  </p>
                </div>
              </div>

              {/* Brand Copy */}
              <div className="mt-20 max-w-[390px]">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#315cff]/20 bg-[#315cff]/10 px-3.5 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4772ff]" />

                  <span className="text-[11px] font-semibold text-[#8da8ff]">
                    SMART SCHOOL MANAGEMENT
                  </span>
                </div>

                <h2 className="text-[38px] font-bold leading-[1.08] tracking-[-0.04em] text-white xl:text-[42px]">
                  One school.
                  <br />
                  One platform.
                  <br />

                  <span className="bg-gradient-to-r from-[#3b6cff] to-[#6150ff] bg-clip-text text-transparent">
                    Smarter management.
                  </span>
                </h2>

                <p className="mt-6 max-w-[370px] text-[14px] leading-6 text-slate-400">
                  Empowering institutional excellence through intelligent data
                  architecture and streamlined administration.
                </p>
              </div>

              {/* Bottom Graphic */}
              <div className="absolute bottom-0 left-0 right-0 h-[220px] overflow-hidden">
                <div className="absolute -bottom-32 left-[-8%] h-[250px] w-[72%] rotate-[-10deg] rounded-[50%] bg-[#28334f]" />

                <div className="absolute -bottom-40 left-[27%] h-[260px] w-[72%] rotate-[9deg] rounded-[50%] bg-[#6a748d]" />

                <div className="absolute -bottom-52 left-[-10%] h-[260px] w-[120%] rounded-[50%] bg-[#10182d]" />

                <div className="absolute bottom-6 left-10 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#315cff]/15">
                    <Check
                      size={14}
                      className="text-[#4772ff]"
                    />
                  </span>

                  <span className="text-[11px] font-medium text-slate-500">
                    Secure institutional access
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              SIGNUP FORM
          ====================================================== */}
          <section className="flex min-h-[680px] items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
            <div className="w-full max-w-[440px]">
              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2864ff] to-[#4c3df5] text-white shadow-lg shadow-[#315cff]/20">
                  <GraduationCap size={23} />
                </div>

                <p className="text-lg font-bold text-[#111a31] dark:text-white">
                  Edu<span className="text-[#315cff]">Nexus</span>
                </p>
              </div>

              {/* Heading */}
              <div className="mb-7">
                <div className="mb-1 text-[12px] font-medium text-[#315cff] dark:text-[#5d82ff]">
                  Create an Account
                </div>

                <h2 className="text-[26px] font-bold tracking-[-0.03em] text-[#111a31] dark:text-white">
                  Join EduNexus
                </h2>

                <p className="mt-1.5 text-[13px] leading-5 text-slate-500 dark:text-slate-400">
                  Create your account to access your administrative workspace.
                </p>
              </div>

              {/* Full Name */}
              <div className="mb-4">
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#34415d] dark:text-slate-300"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71809c] dark:text-slate-500"
                  />

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="
                      h-11
                      w-full
                      rounded-[7px]
                      border
                      border-transparent
                      bg-[#eef3ff]
                      pl-10
                      pr-4
                      text-[12px]
                      text-[#16213b]
                      outline-none
                      transition
                      placeholder:text-[#a9b4ca]
                      focus:border-[#7c9cff]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#315cff]/10
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      dark:placeholder:text-slate-500
                      dark:focus:border-[#5d82ff]
                      dark:focus:bg-slate-800
                    "
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#34415d] dark:text-slate-300"
                >
                  Institutional Email
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71809c] dark:text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@university.edu"
                    className="
                      h-11
                      w-full
                      rounded-[7px]
                      border
                      border-transparent
                      bg-[#eef3ff]
                      pl-10
                      pr-4
                      text-[12px]
                      text-[#16213b]
                      outline-none
                      transition
                      placeholder:text-[#a9b4ca]
                      focus:border-[#7c9cff]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#315cff]/10
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      dark:placeholder:text-slate-500
                      dark:focus:border-[#5d82ff]
                      dark:focus:bg-slate-800
                    "
                  />
                </div>
              </div>

              {/* Role */}
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#34415d] dark:text-slate-300"
                >
                  Account Role
                </label>

                <div className="relative">
                  <BriefcaseBusiness
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71809c] dark:text-slate-500"
                  />

                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`
                      h-11
                      w-full
                      appearance-none
                      rounded-[7px]
                      border
                      border-transparent
                      bg-[#eef3ff]
                      pl-10
                      pr-10
                      text-[12px]
                      outline-none
                      transition
                      focus:border-[#7c9cff]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#315cff]/10
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:focus:border-[#5d82ff]
                      dark:focus:bg-slate-800
                      ${
                        role
                          ? "text-[#16213b] dark:text-white"
                          : "text-[#a9b4ca] dark:text-slate-500"
                      }
                    `}
                  >
                    <option value="" disabled>
                      Select a role...
                    </option>

                    <option value="admin">
                      Administrator
                    </option>

                    <option value="teacher">
                      Teacher
                    </option>

                    <option value="student">
                      Student
                    </option>
                  </select>

                  <svg
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71809c] dark:text-slate-500"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#34415d] dark:text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71809c] dark:text-slate-500"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="
                      h-11
                      w-full
                      rounded-[7px]
                      border
                      border-transparent
                      bg-[#eef3ff]
                      pl-10
                      pr-10
                      text-[12px]
                      text-[#16213b]
                      outline-none
                      transition
                      placeholder:text-[#a9b4ca]
                      focus:border-[#7c9cff]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#315cff]/10
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      dark:placeholder:text-slate-500
                      dark:focus:border-[#5d82ff]
                      dark:focus:bg-slate-800
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71809c] transition hover:text-[#315cff] dark:text-slate-500 dark:hover:text-[#6d8cff]"
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#9ba6ba] dark:text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full border border-[#aeb8c9] dark:border-slate-600" />
                    At least 8 characters
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full border border-[#aeb8c9] dark:border-slate-600" />
                    Contains a number
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#34415d] dark:text-slate-300"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <RotateCcw
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71809c] dark:text-slate-500"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="
                      h-11
                      w-full
                      rounded-[7px]
                      border
                      border-transparent
                      bg-[#eef3ff]
                      pl-10
                      pr-10
                      text-[12px]
                      text-[#16213b]
                      outline-none
                      transition
                      placeholder:text-[#a9b4ca]
                      focus:border-[#7c9cff]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#315cff]/10
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      dark:placeholder:text-slate-500
                      dark:focus:border-[#5d82ff]
                      dark:focus:bg-slate-800
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71809c] transition hover:text-[#315cff] dark:text-slate-500 dark:hover:text-[#6d8cff]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="button"
                onClick={handleRegister}
                disabled={isRegistering}
                className="
                  group
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[7px]
                  bg-gradient-to-r
                  from-[#2463ff]
                  to-[#4b3df4]
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-[0_8px_20px_rgba(49,92,255,0.22)]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-[0_12px_25px_rgba(49,92,255,0.3)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {isRegistering
                  ? "Registration Successful"
                  : "Register Account"}

                {isRegistering ? (
                  <Check
                    size={15}
                    strokeWidth={2.5}
                  />
                ) : (
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>

              {/* Login Link */}
              <p className="mt-5 text-center text-[11px] text-slate-500 dark:text-slate-400">
                Already have an account?{" "}

                <a
                  href="/login"
                  className="font-medium text-[#315cff] transition hover:text-[#4b3df4] dark:text-[#6d8cff] dark:hover:text-[#8aa2ff]"
                >
                  Sign in
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}