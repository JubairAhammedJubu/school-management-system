"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "react-toastify";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  KeyRound,
  UserPlus,
  ArrowLeft,
  Sparkles,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building2,
  FileText,
  X,
  Calendar,
  Droplet,
  School,
  BookOpen,
  Users,
  Home,
  Award,
  Briefcase,
} from "lucide-react";
import {signIn, signUp} from "@/lib/auth-client";
import {updateUserProfileAction} from "@/lib/actions/user-actions";

interface AuthPageProps {
  initialMode?: "login" | "register";
}

const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1779358296802-715fc9fbc152?fm=jpg&q=80&w=1200&auto=format&fit=crop";
const REGISTER_IMAGE =
  "https://images.unsplash.com/photo-1758270704286-83476deb3bd1?fm=jpg&q=80&w=1200&auto=format&fit=crop";
// Distinct imagery for the profile-completion step, split by role, so it
// never feels like a re-skin of the register screen.
const STUDENT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?fm=jpg&q=80&w=1200&auto=format&fit=crop";
const TEACHER_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?fm=jpg&q=80&w=1200&auto=format&fit=crop";

export default function AuthPage({initialMode = "login"}: AuthPageProps) {
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

  // Registration is two steps: "form" (name/email/password) then "info"
  // (extended profile details). The account is only created when the
  // second (info) form is submitted — Cancel on that step aborts the whole
  // registration and no user is created.
  const [registerStep, setRegisterStep] = useState<"form" | "info">("form");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [qualification, setQualification] = useState("");

  // The institution email decides the role server-side (see auth.ts), so we
  // mirror that logic client-side to know which extra fields to show.
  const detectedRole: "teacher" | "student" = email
    .toLowerCase()
    .trim()
    .endsWith("@edunexus.tchr.com")
    ? "teacher"
    : "student";

  const resetInfoFields = () => {
    setPhone("");
    setLocation("");
    setDepartment("");
    setBio("");
    setFatherName("");
    setMotherName("");
    setDateOfBirth("");
    setAddress("");
    setBloodGroup("");
    setSchoolName("");
    setStudentClass("");
    setQualification("");
  };

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRegisterStep("form");
    resetInfoFields();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isLogin) {
      // Step 1 of registration: just validate the basics and move on to the
      // additional-info form. No account is created here.
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        toast.error("Passwords do not match. Please verify your password.");
        return;
      }
      if (!name.trim() || !email.trim() || !password) {
        setError("Please fill in all fields.");
        return;
      }
      setError("");
      setRegisterStep("info");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const {error: signInError} = await signIn.email({email, password});
      if (signInError) {
        throw new Error(signInError.message ?? "Invalid email or password.");
      }
      toast.success("Welcome back! Redirecting to your workspace...");
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

  // Step 2 of registration: submitting the additional-info form is what
  // actually creates the account.
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const {error: signUpError} = await signUp.email({
        email,
        password,
        name,
      });
      if (signUpError) {
        throw new Error(
          signUpError.message ?? "Could not create your account.",
        );
      }

      // Account created — now attach the extra info collected in this step.
      const profileResult = await updateUserProfileAction({
        email,
        name,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        department: department.trim() || undefined,
        bio: bio.trim() || undefined,
        fatherName: fatherName.trim() || undefined,
        motherName: motherName.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        address: address.trim() || undefined,
        bloodGroup: bloodGroup || undefined,
        schoolName:
          detectedRole === "student"
            ? schoolName.trim() || undefined
            : undefined,
        studentClass:
          detectedRole === "student"
            ? studentClass.trim() || undefined
            : undefined,
        qualification:
          detectedRole === "teacher"
            ? qualification.trim() || undefined
            : undefined,
      });
      if (!profileResult.success) {
        toast.error(
          profileResult.error ??
            "Account created, but saving your extra info failed. You can update it later from your profile.",
        );
      }

      toast.success("Account created successfully! Welcome to EduNexus 🎉");
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

  // Cancel on the info step aborts registration entirely — no account is
  // created, and we drop back to the basic details form.
  const handleCancelInfo = () => {
    setRegisterStep("form");
    resetInfoFields();
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 pt-24 sm:pt-20 pb-6 p-4 font-sans transition-colors duration-500">
      {!isLogin && registerStep === "info" ? (
        <ProfileCompletionStep
          detectedRole={detectedRole}
          isSubmitting={isSubmitting}
          error={error}
          onCancel={handleCancelInfo}
          onSubmit={handleCompleteRegistration}
          fatherName={fatherName}
          setFatherName={setFatherName}
          motherName={motherName}
          setMotherName={setMotherName}
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
          bloodGroup={bloodGroup}
          setBloodGroup={setBloodGroup}
          address={address}
          setAddress={setAddress}
          phone={phone}
          setPhone={setPhone}
          location={location}
          setLocation={setLocation}
          department={department}
          setDepartment={setDepartment}
          schoolName={schoolName}
          setSchoolName={setSchoolName}
          studentClass={studentClass}
          setStudentClass={setStudentClass}
          qualification={qualification}
          setQualification={setQualification}
          bio={bio}
          setBio={setBio}
        />
      ) : (
      <motion.div
        initial={{opacity: 0, y: 14}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.45, ease: "easeOut"}}
        className="relative w-full max-w-[880px] min-h-[420px] bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl shadow-slate-300/50 dark:shadow-black/40 overflow-hidden flex flex-col md:flex-row transition-colors duration-500 border border-slate-200 dark:border-slate-800"
      >
        {/* --- FORM CONTAINER --- */}
        <div
          className={`w-full md:w-1/2 flex flex-col justify-center px-7 sm:px-10 py-6 transition-all duration-700 ease-in-out z-10 bg-white dark:bg-slate-900 ${
            isLogin ? "md:translate-x-0" : "md:translate-x-full"
          }`}
        >
          <div className="mb-3">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                <GraduationCap className="h-3.5 w-3.5" />
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
                  initial={{opacity: 0, height: 0, marginBottom: 0}}
                  animate={{opacity: 1, height: "auto", marginBottom: 0}}
                  exit={{opacity: 0, height: 0, marginBottom: 0}}
                  transition={{duration: 0.25, ease: "easeOut"}}
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
                  initial={{opacity: 0, height: 0, marginBottom: 0}}
                  animate={{opacity: 1, height: "auto", marginBottom: 0}}
                  exit={{opacity: 0, height: 0, marginBottom: 0}}
                  transition={{duration: 0.25, ease: "easeOut"}}
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
                whileHover={{scale: 1.01}}
                whileTap={{scale: 0.98}}
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
              whileHover={{y: -1}}
              whileTap={{scale: 0.98}}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Continue"}
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

        {/* --- DECORATIVE PANEL WITH IMAGE BACKGROUND (unchanged) --- */}
        <div
          className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full transition-transform duration-700 ease-in-out z-20 flex-col items-start justify-end text-white px-8 pb-10 text-left ${
            isLogin ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={isLogin ? "login-bg" : "register-bg"}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.5}}
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
          <div className="absolute bottom-[-15%] left-[-10%] w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl z-0" />

          {/* Top-left brand chip */}
          <div className="absolute top-6 left-6 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
            <GraduationCap size={16} className="text-white" />
          </div>

          {/* Top-right encrypted/secure indicator */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1">
            <ShieldCheck size={11} className="text-emerald-300" />
            <span className="text-[8px] font-bold uppercase tracking-wider text-white/80">
              JWT Encrypted
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -14}}
              transition={{duration: 0.35, ease: "easeOut"}}
              className="relative z-10 w-full px-1"
            >
              {isLogin ? (
                <>
                  {/* Sign-in flow: who's waiting for you */}
                  <div className="flex items-center mb-3">
                    <div className="flex -space-x-2.5">
                      {[
                        "bg-blue-400",
                        "bg-emerald-400",
                        "bg-amber-400",
                        "bg-pink-400",
                      ].map((c, i) => (
                        <motion.span
                          key={i}
                          initial={{opacity: 0, scale: 0.6}}
                          animate={{opacity: 1, scale: 1}}
                          transition={{delay: i * 0.06}}
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
                    <span className="italic font-serif font-normal text-emerald-300">
                      left off.
                    </span>
                  </h2>

                  <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium mb-5">
                    <KeyRound size={12} className="text-white/50" />
                    Your dashboard, grades &amp; messages are waiting
                  </div>
                </>
              ) : (
                <>
                  {/* Registration flow: 3-step setup preview */}
                  <div className="flex items-center gap-1.5 mb-4">
                    {[
                      {label: "Details", icon: UserPlus, active: true},
                      {label: "Verify", icon: ShieldCheck, active: false},
                      {label: "Explore", icon: GraduationCap, active: false},
                    ].map((step, i) => (
                      <div
                        key={step.label}
                        className="flex items-center gap-1.5"
                      >
                        <motion.div
                          initial={{opacity: 0, scale: 0.7}}
                          animate={{opacity: 1, scale: 1}}
                          transition={{delay: i * 0.08}}
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 border backdrop-blur-md ${
                            step.active
                              ? "bg-emerald-400/20 border-emerald-300/40"
                              : "bg-white/[0.06] border-white/15"
                          }`}
                        >
                          <step.icon
                            size={11}
                            className={
                              step.active ? "text-emerald-300" : "text-white/50"
                            }
                          />
                          <span
                            className={`text-[8px] font-bold uppercase tracking-wide ${
                              step.active ? "text-emerald-200" : "text-white/50"
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
                    <span className="italic font-serif font-normal text-emerald-300">
                      two minutes.
                    </span>
                  </h2>

                  <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium mb-5">
                    <CheckCircle2 size={12} className="text-white/50" />
                    No credit card, no paperwork — just your details
                  </div>
                </>
              )}

              <motion.button
                type="button"
                onClick={toggleAuthMode}
                whileHover={{gap: "10px"}}
                whileTap={{scale: 0.97}}
                className={`inline-flex items-center gap-2 rounded-full bg-white text-slate-900 text-[11px] font-bold py-1.5 ${
                  isLogin ? "pl-1.5 pr-4" : "pl-4 pr-1.5"
                }`}
              >
                {isLogin ? (
                  <>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                      <ArrowLeft size={12} />
                    </span>
                    <p>Create account</p>
                  </>
                ) : (
                  <>
                    <p>Sign in instead</p>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                      <ArrowRight size={12} />
                    </span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      )}
    </div>
  );
}

interface ProfileCompletionStepProps {
  detectedRole: "student" | "teacher";
  isSubmitting: boolean;
  error: string;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  fatherName: string;
  setFatherName: (v: string) => void;
  motherName: string;
  setMotherName: (v: string) => void;
  dateOfBirth: string;
  setDateOfBirth: (v: string) => void;
  bloodGroup: string;
  setBloodGroup: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  department: string;
  setDepartment: (v: string) => void;
  schoolName: string;
  setSchoolName: (v: string) => void;
  studentClass: string;
  setStudentClass: (v: string) => void;
  qualification: string;
  setQualification: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function ProfileCompletionStep({
  detectedRole,
  isSubmitting,
  error,
  onCancel,
  onSubmit,
  fatherName,
  setFatherName,
  motherName,
  setMotherName,
  dateOfBirth,
  setDateOfBirth,
  bloodGroup,
  setBloodGroup,
  address,
  setAddress,
  phone,
  setPhone,
  location,
  setLocation,
  department,
  setDepartment,
  schoolName,
  setSchoolName,
  studentClass,
  setStudentClass,
  qualification,
  setQualification,
  bio,
  setBio,
}: ProfileCompletionStepProps) {
  const isTeacher = detectedRole === "teacher";

  const inputClass =
    "w-full pl-9 pr-3 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 shadow-sm";
  const labelClass =
    "text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider";
  const iconWrapClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-violet-500 transition-colors pointer-events-none";

  return (
    <motion.div
      initial={{opacity: 0, y: 18, scale: 0.98}}
      animate={{opacity: 1, y: 0, scale: 1}}
      transition={{duration: 0.4, ease: "easeOut"}}
      className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[1.75rem] shadow-2xl shadow-slate-300/50 dark:shadow-black/40 overflow-hidden border border-slate-200 dark:border-slate-800"
    >
      {/* Progress rail */}
      <div className="flex items-center gap-2 sm:gap-3 px-5 sm:px-10 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 size={11} />
          </span>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wide">
            Account
          </span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-emerald-400 to-violet-400" />
        <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white text-[9px] font-bold">
            2
          </span>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wide">
            Profile
          </span>
        </div>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-600">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[9px] font-bold">
            3
          </span>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wide">
            Explore
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* --- FORM --- */}
        <div className="lg:col-span-7 px-5 sm:px-10 py-6 max-h-[75vh] overflow-y-auto">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25">
              {isTeacher ? <Briefcase size={18} /> : <GraduationCap size={18} />}
            </div>  
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Complete your profile
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isTeacher
                  ? "A few professional details to finish setting up your Teacher account."
                  : "A few academic details to finish setting up your Student account."}
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
                Personal &amp; Family
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className={labelClass}>Father&apos;s Name</label>
                  <div className="relative group">
                    <div className={iconWrapClass}>
                      <Users size={14} />
                    </div>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="e.g. Abdul Karim"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Mother&apos;s Name</label>
                  <div className="relative group">
                    <div className={iconWrapClass}>
                      <Users size={14} />
                    </div>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="e.g. Rahima Begum"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Date of Birth</label>
                  <div className="relative group">
                    <div className={iconWrapClass}>
                      <Calendar size={14} />
                    </div>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Blood Group</label>
                  <div className="relative group">
                    <div className={iconWrapClass}>
                      <Droplet size={14} />
                    </div>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mt-2">
                <label className={labelClass}>Address</label>
                <div className="relative group">
                  <div className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 group-focus-within:text-violet-500 transition-colors pointer-events-none">
                    <Home size={14} />
                  </div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Village/House, Post Office, District"
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div className="space-y-1">
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative group">
                    <div className={iconWrapClass}>
                      <Phone size={14} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712345678"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Location</label>
                  <div className="relative group">
                    <div className={iconWrapClass}>
                      <MapPin size={14} />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Dhaka, Bangladesh"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
                {isTeacher ? "Professional Details" : "Academic Details"}
              </p>
              {isTeacher ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className={labelClass}>Department</label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <Building2 size={14} />
                      </div>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Education Qualification</label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <Award size={14} />
                      </div>
                      <input
                        type="text"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        placeholder="e.g. M.Sc in Physics"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className={labelClass}>School Name</label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <School size={14} />
                      </div>
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. EduNexus High School"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Class</label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <BookOpen size={14} />
                      </div>
                      <input
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        placeholder="e.g. Class 9"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Short Bio</label>
              <div className="relative group">
                <div className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 group-focus-within:text-violet-500 transition-colors pointer-events-none">
                  <FileText size={14} />
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A line or two about yourself"
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {error && (
              <p className="text-[11px] font-medium text-red-500 dark:text-red-400 ml-1">
                {error}
              </p>
            )}

            <div className="flex gap-2 pt-1 bg-white dark:bg-slate-900 pb-1">
              <motion.button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                whileHover={{y: -1}}
                whileTap={{scale: 0.98}}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm py-2 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <X size={14} />
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{y: -1}}
                whileTap={{scale: 0.98}}
                className="flex-[2] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm py-2 rounded-lg shadow-lg shadow-violet-500/20 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight size={14} />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        {/* --- IMAGE / SUMMARY PANEL --- */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-end text-white p-8">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${
                isTeacher ? TEACHER_PROFILE_IMAGE : STUDENT_PROFILE_IMAGE
              }')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-950/40 to-violet-950/30" />
          <div className="absolute top-[-10%] right-[-10%] w-56 h-56 bg-violet-400/20 rounded-full blur-3xl" />

          <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1">
            {isTeacher ? (
              <Briefcase size={11} className="text-violet-200" />
            ) : (
              <GraduationCap size={11} className="text-violet-200" />
            )}
            <span className="text-[8px] font-bold uppercase tracking-wider text-white/80">
              {isTeacher ? "Teacher Account" : "Student Account"}
            </span>
          </div>

          <div className="relative z-10">
            <h2 className="text-[24px] font-black leading-[1.1] tracking-tight mb-3">
              You&apos;re almost
              <br />
              <span className="italic font-serif font-normal text-violet-300">
                all set up.
              </span>
            </h2>
            <p className="text-[11px] text-white/60 font-medium mb-4">
              These details help your teachers, classmates, and the admin
              team recognize you on EduNexus.
            </p>

            <div className="space-y-2.5">
              {[
                isTeacher
                  ? "Get assigned to your classes & subjects"
                  : "Get enrolled in your school & class",
                "See your dashboard, grades & notices",
                "Nothing is saved until you submit this step",
              ].map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2
                    size={13}
                    className="text-violet-300 mt-0.5 shrink-0"
                  />
                  <span className="text-[11px] text-white/70 font-medium">
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
