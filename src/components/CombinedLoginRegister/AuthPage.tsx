"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import QRCode from "qrcode";
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
  ChevronDown,
  Check,
  Clock,
  Sparkles,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { authClient, signIn, signOut, signUp, useSession } from "@/lib/auth-client";
import { checkApprovalStatusAction } from "@/lib/actions/approval-actions";
import {
  setNewPasswordAction,
  verifyPasswordResetCodeAction,
} from "@/lib/actions/password-reset-actions";
import {
  updateUserProfileAction,
  checkUserExistsAction,
} from "@/lib/actions/user-actions";

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

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();

  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ── Account lockout (3 bhul password → 5 hour lock) ──
  // Lock timestamp per-email localStorage e save thake (page reload/refresh
  // korleo lock thake), tai eta ekta state na rekhe proti render-e
  // localStorage theke derive kora hoy — `now` proti second tick kore
  // countdown fresh rakhe.
  const [now, setNow] = useState(() => Date.now());

  // ── Two-factor authentication (authenticator app) ──
  // "verify": returning user, 2FA already enabled — ask for the 6-digit
  //           code from their authenticator app. Correct code → login,
  //           wrong code → no login (no backup-code fallback).
  // "setup":  first successful login ever — show a QR code so they can
  //           add the account to an authenticator app, then confirm it
  //           with one code before we finish logging them in.
  const [twoFactorStage, setTwoFactorStage] = useState<
    "none" | "verify" | "setup"
  >("none");
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");
  const [totpQrDataUrl, setTotpQrDataUrl] = useState("");
  const [totpSecret, setTotpSecret] = useState("");

  // ── Forgot password (via authenticator app) ──
  // No email/OTP is sent anywhere: user gives their account email + the
  // 6-digit code from their authenticator app (the same TOTP secret used
  // for 2FA login). Correct code → a password field appears to set a new
  // password. "code": email + code form. "newPassword": set-password form.
  const [forgotPasswordStage, setForgotPasswordStage] = useState<
    "none" | "code" | "newPassword"
  >("none");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isVerifyingForgotCode, setIsVerifyingForgotCode] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── Admin-approval gate ──
  // "pending": this email exists but the admin hasn't approved it yet —
  // login button becomes a disabled "Pending approval" button. Re-checked
  // automatically every few seconds so it flips back to a normal enabled
  // login button the moment an admin approves, with no page refresh
  // needed. "unknown"/"approved" both render the normal login button —
  // we only ever block on a *confirmed* pending state, never while still
  // checking, so a slow network never wrongly locks the button.
  const [approvalStatus, setApprovalStatus] = useState<
    "unknown" | "pending" | "approved"
  >("unknown");

  useEffect(() => {
    if (!isLogin) return;
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApprovalStatus("unknown");
      return;
    }

    if (
      trimmedEmail === "demostudent@edunexus.std.com" ||
      trimmedEmail === "demoteacher@edunexus.tchr.com"
    ) {
      setApprovalStatus("approved");
      return;
    }

    let cancelled = false;
    const check = async () => {
      const result = await checkApprovalStatusAction(trimmedEmail);
      if (cancelled) return;
      setApprovalStatus((prev) => {
        if (!result.success) return prev;
        return result.isApproved ? "approved" : "pending";
      });
    };

    // Debounce the first check so it doesn't fire on every keystroke.
    const debounceId = setTimeout(check, 500);
    return () => {
      cancelled = true;
      clearTimeout(debounceId);
    };
  }, [email, isLogin]);

  // While a pending account is showing, keep re-checking every few
  // seconds so the button flips back to normal the moment an admin
  // approves — no page refresh needed.
  useEffect(() => {
    if (approvalStatus !== "pending") return;
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;

    const intervalId = setInterval(async () => {
      const result = await checkApprovalStatusAction(trimmedEmail);
      if (result.success && result.isApproved) {
        setApprovalStatus("approved");
      }
    }, 6000);

    return () => clearInterval(intervalId);
  }, [approvalStatus, email]);

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
  const [gender, setGender] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [qualification, setQualification] = useState("");
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredName, setRegisteredName] = useState("");
  const [registeredRole, setRegisteredRole] = useState<"student" | "teacher">("student");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // The institution email decides the role server-side (see auth.ts), so we
  // mirror that logic client-side to know which extra fields to show.
  const detectedRole: "teacher" | "student" = email
    .toLowerCase()
    .trim()
    .endsWith("@edunexus.tchr.com")
    ? "teacher"
    : "student";

  const getTargetDashboard = (_userRole?: string) => {
    return "/";
  };

  const lockoutStorageKey = (forEmail: string) =>
    `edunexus:lockoutUntil:${forEmail.toLowerCase().trim()}`;

  // Proti second tick kori jate lockout countdown live thake, ar shathe
  // shathe expired lock-er localStorage entry cleanup kore dei.
  useEffect(() => {
    if (!isLogin) return;
    const interval = setInterval(() => {
      setNow(Date.now());
      if (email.trim()) {
        const key = lockoutStorageKey(email);
        const stored = localStorage.getItem(key);
        if (stored && Number(stored) <= Date.now()) {
          localStorage.removeItem(key);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isLogin, email]);

  // Login form-e thakle current email-er jonno active lock ache kina, seta
  // shorashori render-e localStorage theke derive kori (extra state lagena).
  const lockoutUntil = (() => {
    if (!isLogin || !email.trim() || typeof window === "undefined") {
      return null;
    }
    const stored = localStorage.getItem(lockoutStorageKey(email));
    const storedUntil = stored ? Number(stored) : null;
    return storedUntil && storedUntil > now ? storedUntil : null;
  })();

  const isLockedOut = isLogin && !!lockoutUntil && lockoutUntil > now;
  const lockoutRemainingLabel = (() => {
    if (!isLockedOut || !lockoutUntil) return "";
    const msLeft = lockoutUntil - now;
    const totalSeconds = Math.max(0, Math.ceil(msLeft / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  })();

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
    setStudentSection("");
    setQualification("");
  };

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
    // Keep email intact so login form displays the email entered in register form
    setPassword("");
    setConfirmPassword("");
    setRegisterStep("form");
    resetTwoFactorState();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isLockedOut) return;
    if (isLogin && approvalStatus === "pending") {
      const msg =
        "Your account is pending admin approval. Please try again after an admin approves your account.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!isLogin) {
      // Step 1 of registration: validate basics & check if user already exists
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        toast.error("Passwords do not match. Please verify your password.");
        return;
      }
      if (!name.trim() || !email.trim() || !password) {
        setError("Please fill in all fields.");
        return;
      }

      setIsSubmitting(true);
      setError("");

      try {
        const checkRes = await checkUserExistsAction(email.trim());
        if (checkRes.exists) {
          const msg = `An account with ${email.trim()} already exists. Returning to Sign In...`;
          setError(msg);
          toast.warning(msg);
          setIsLogin(true);
          setPassword("");
          setConfirmPassword("");
          setRegisterStep("form");
          return;
        }
        setRegisterStep("info");
      } catch (err: any) {
        toast.error(err?.message || "Failed to check email.");
        setRegisterStep("info");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const { data, error: signInError } = await signIn.email({
        email,
        password,
      });
      if (signInError) {
        // Backend "ACCOUNT_LOCKED" code shoho lockedUntil (ISO timestamp)
        // pathay — eta diye button-take 5 ghontar jonno disable rakhi.
        const lockedUntilISO = (signInError as { lockedUntil?: string })
          .lockedUntil;
        if (signInError.code === "ACCOUNT_LOCKED" && lockedUntilISO) {
          const until = new Date(lockedUntilISO).getTime();
          localStorage.setItem(lockoutStorageKey(email), String(until));
          // "now" bumping korle re-render hoy, jate lockoutUntil (jeta
          // localStorage theke derive hoy) shathe shathe UI-te dekha jay.
          setNow(Date.now());
        }
        // Ekhono frontend approval-poll miss korle o (e.g. user submit
        // korlo thik shei shomoy-e), backend-i sheshmesh block kore dey —
        // shei state-take button-e reflect kori.
        if (
          signInError.code === "ACCOUNT_PENDING_APPROVAL" ||
          signInError.message?.toLowerCase().includes("pending admin approval") ||
          signInError.message?.toLowerCase().includes("pending approval")
        ) {
          setApprovalStatus("pending");
          const pendingMsg =
            "Your account is pending admin approval. Please try again after an admin approves your account.";
          setError(pendingMsg);
          toast.error(pendingMsg);
          throw new Error(pendingMsg);
        }
        throw new Error(signInError.message ?? "Invalid email or password.");
      }

      const signInData = data as null | {
        twoFactorRedirect?: boolean;
        user?: { twoFactorEnabled?: boolean };
      };

      const isDemoAccount =
        email.trim().toLowerCase() === "demostudent@edunexus.std.com" ||
        email.trim().toLowerCase() === "demoteacher@edunexus.tchr.com";

      if (!isDemoAccount && signInData?.twoFactorRedirect) {
        // Returning user, 2FA already set up — ask for the app's code.
        setTwoFactorError("");
        setOtpCode("");
        setTwoFactorStage("verify");
        return;
      }

      if (!isDemoAccount && signInData?.user && !signInData.user.twoFactorEnabled) {
        // Email + password shothik, ar ei account e 2FA age theke set up
        // kora nei — first-time setup hisebe QR code dekhai.
        const { data: enableData, error: enableError } =
          await authClient.twoFactor.enable({ password, method: "totp" });

        if (!enableError && enableData && enableData.method === "totp") {
          const qrDataUrl = await QRCode.toDataURL(enableData.totpURI);
          const secretMatch = /secret=([^&]+)/.exec(enableData.totpURI);
          setTotpQrDataUrl(qrDataUrl);
          setTotpSecret(secretMatch ? decodeURIComponent(secretMatch[1]) : "");

          // enable() call korte hole already-active session lage (better-auth
          // er nijer requirement), tai upore ei call-ta hobar shomoy backend
          // e ekta session bosey geche — kintu user ekhono OTP confirm kore
          // nai. Shathe shathe sign out kore dei jate QR screen dekhano
          // obosthay kono session-i na thake (Navbar tai automatically
          // "logged out" dekhabe). DB-te unverified TOTP secret thake jay,
          // handleVerifyOtp-e correct code dile abar login kore eta finalize
          // kora hobe.
          await signOut();

          setTwoFactorError("");
          setOtpCode("");
          setTwoFactorStage("setup");
          return;
        }
        // 2FA set up na hote parle-o login block kori na — shudhu shada
        // login diye continue kore jai.
      }

      const userRole = (signInData?.user as any)?.role || detectedRole;
      const targetUrl = getTargetDashboard(userRole);
      setIsRedirecting(true);
      toast.success("Welcome back! Redirecting to your workspace...");
      router.push(targetUrl);
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

  // Handles both stages: confirming a fresh authenticator-app setup, and
  // completing a normal 2FA-protected sign-in. Correct code → logs in;
  // wrong code → error, no login.
  const handleVerifyOtp = async () => {
    if (isVerifyingOtp || !otpCode) return;
    setTwoFactorError("");
    setIsVerifyingOtp(true);

    try {
      if (twoFactorStage === "setup") {
        // No session exists right now — we signed out right after enable()
        // (see handleSubmit), on purpose, so nobody counts as "logged in"
        // while the QR/OTP step is unconfirmed. better-auth's verifyTotp
        // needs an active session to attach the confirmation to, so we
        // briefly re-authenticate with the already-known email+password
        // first, then immediately verify. If the code turns out wrong we
        // sign this session back out right away, so a bad OTP never leaves
        // the user logged in.
        const { error: reSignInError } = await signIn.email({
          email,
          password,
        });
        if (reSignInError) {
          throw new Error(
            reSignInError.message ??
            "Session ferano gelo na. Doya kore abar login korun.",
          );
        }

        const { error: verifyError } = await authClient.twoFactor.verifyTotp({
          code: otpCode,
        });
        if (verifyError) {
          await signOut();
          throw new Error(verifyError.message ?? "Bhul code. Abar try korun.");
        }
      } else {
        // "verify" stage (2FA already enabled from before): better-auth
        // itself is holding a short-lived two-factor cookie from the
        // original sign-in.email() call — no session exists yet, and none
        // is needed until this succeeds.
        const { error: verifyError } = await authClient.twoFactor.verifyTotp({
          code: otpCode,
        });
        if (verifyError) {
          throw new Error(verifyError.message ?? "Bhul code. Abar try korun.");
        }
      }

      const userRole = (session?.user as any)?.role || detectedRole;
      const targetUrl = getTargetDashboard(userRole);
      setIsRedirecting(true);
      toast.success(
        twoFactorStage === "setup"
          ? "Authenticator app set up successfully!"
          : "Welcome back! Redirecting to your workspace...",
      );
      router.push(targetUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Bhul code. Abar try korun.";
      setTwoFactorError(message);
      toast.error(message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resetTwoFactorState = () => {
    setTwoFactorStage("none");
    setOtpCode("");
    setTwoFactorError("");
    setTotpQrDataUrl("");
    setTotpSecret("");
  };

  const handleCancelTwoFactor = async () => {
    // Neither stage has a live session at this point anymore: "setup"
    // already signed itself out right after enable() (see handleSubmit),
    // and "verify" never had one to begin with. Nothing to undo here.
    resetTwoFactorState();
    setPassword("");
  };

  const resetForgotPasswordState = () => {
    setForgotPasswordStage("none");
    setForgotEmail("");
    setForgotCode("");
    setForgotError("");
    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleOpenForgotPassword = () => {
    setForgotError("");
    setForgotEmail(email);
    setForgotCode("");
    setForgotPasswordStage("code");
  };

  // Step 1: email + authenticator code → resetToken (no email/OTP sent).
  const handleVerifyForgotCode = async () => {
    if (isVerifyingForgotCode || !forgotEmail.trim() || !forgotCode.trim()) {
      return;
    }
    setForgotError("");
    setIsVerifyingForgotCode(true);

    try {
      const result = await verifyPasswordResetCodeAction({
        email: forgotEmail.trim(),
        code: forgotCode.trim(),
      });
      if (!result.success || !result.data) {
        throw new Error(result.error ?? "Incorrect authenticator code.");
      }
      setResetToken(result.data.resetToken);
      setForgotPasswordStage("newPassword");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Incorrect authenticator code.";
      setForgotError(message);
      toast.error(message);
    } finally {
      setIsVerifyingForgotCode(false);
    }
  };

  // Step 2: spend the resetToken to actually set the new password.
  const handleSetNewPassword = async () => {
    if (isSettingNewPassword || !newPassword || !confirmNewPassword) return;

    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters.");
      return;
    }

    setForgotError("");
    setIsSettingNewPassword(true);

    try {
      const result = await setNewPasswordAction({ resetToken, newPassword });
      if (!result.success) {
        throw new Error(result.error ?? "Failed to update password.");
      }
      toast.success("Password updated! Please sign in with your new password.");
      setEmail(forgotEmail);
      setPassword("");
      resetForgotPasswordState();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update password.";
      setForgotError(message);
      toast.error(message);
    } finally {
      setIsSettingNewPassword(false);
    }
  };

  // Step 2 of registration: submitting the additional-info form is what
  // actually creates the account.
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");

    if (detectedRole === "teacher") {
      if (
        !fatherName.trim() ||
        !motherName.trim() ||
        !dateOfBirth ||
        !bloodGroup ||
        !address.trim() ||
        !phone.trim() ||
        !location.trim() ||
        !department.trim() ||
        !qualification.trim() ||
        !bio.trim()
      ) {
        const msg =
          "All profile fields (including Short Bio) are required for Teacher registration.";
        setError(msg);
        toast.error(msg);
        return;
      }
    }

    if (phone.trim() && (!phone.trim().startsWith("01") || phone.trim().length !== 11)) {
      const msg = "Student phone number must be exactly 11 digits and start with 01 (e.g. 01712345678).";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (
      guardianPhone.trim() &&
      (!guardianPhone.trim().startsWith("01") || guardianPhone.trim().length !== 11)
    ) {
      const msg = "Guardian phone number must be exactly 11 digits and start with 01 (e.g. 01712345678).";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (
      phone.trim() &&
      guardianPhone.trim() &&
      phone.trim() === guardianPhone.trim()
    ) {
      const msg = "Student phone number cannot be the same as Guardian phone number.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: signUpError } = await signUp.email({
        email,
        password,
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
        gender: gender || undefined,
        guardianPhone: guardianPhone.trim() || undefined,
        guardianRelation: guardianRelation || undefined,
        schoolName:
          detectedRole === "student"
            ? schoolName.trim() || undefined
            : undefined,
        studentClass:
          detectedRole === "student"
            ? studentClass.trim() || undefined
            : undefined,
        studentSection:
          detectedRole === "student"
            ? studentSection.trim() || undefined
            : undefined,
        sessionYear:
          detectedRole === "student"
            ? new Date().getFullYear().toString()
            : undefined,
        group:
          detectedRole === "student"
            ? department.trim() || undefined
            : undefined,
        qualification:
          detectedRole === "teacher"
            ? qualification.trim() || undefined
            : undefined,
      } as any);
      if (signUpError) {
        const errMsg = signUpError.message || "";
        if (
          errMsg.toLowerCase().includes("already exists") ||
          errMsg.toLowerCase().includes("already registered") ||
          (signUpError as any).code === "USER_ALREADY_EXISTS"
        ) {
          const msg = `An account with ${email.trim()} already exists. Returning to Sign In...`;
          setError(msg);
          toast.warning(msg);
          setIsLogin(true);
          setPassword("");
          setConfirmPassword("");
          setRegisterStep("form");
          return;
        }
        throw new Error(
          signUpError.message ?? "Could not create your account.",
        );
      }

      await signOut();
      setRegisteredName(name.trim());
      setRegisteredEmail(email.trim());
      setRegisteredRole(detectedRole);
      setIsRegistrationComplete(true);
      toast.success("Account created successfully! Awaiting admin approval.");
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

  // Navigating back from the info step returns to the basic details form
  // while keeping all entered information fields intact.
  const handleCancelInfo = () => {
    setRegisterStep("form");
    setError("");
  };

  if (isSessionPending) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 font-sans transition-colors duration-500">
        <div className="h-10 w-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Checking authentication status...
        </p>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-100 dark:bg-[#030712] p-4 font-sans transition-colors duration-500">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Signing in...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Redirecting to your workspace...
        </p>
      </div>
    );
  }

  if (isRegistrationComplete) {
    return (
      <RegistrationSuccessView
        name={registeredName || name}
        email={registeredEmail || email}
        role={registeredRole || detectedRole}
        onGoToLogin={() => {
          setIsRegistrationComplete(false);
          setIsLogin(true);
          setRegisterStep("form");
          setPassword("");
          setConfirmPassword("");
          setError("");
        }}
      />
    );
  }

  if (
    session?.user &&
    twoFactorStage === "none" &&
    forgotPasswordStage === "none" &&
    !isRedirecting &&
    !isRegistrationComplete
  ) {
    return <AlreadyLoggedInView session={session} />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#030712] pt-24 sm:pt-20 pb-6 p-4 font-sans transition-colors duration-500">
      {!isLogin && registerStep === "info" ? (
        <ProfileCompletionStep
          name={name}
          email={email}
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
          gender={gender}
          setGender={setGender}
          guardianPhone={guardianPhone}
          setGuardianPhone={setGuardianPhone}
          guardianRelation={guardianRelation}
          setGuardianRelation={setGuardianRelation}
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
          studentSection={studentSection}
          setStudentSection={setStudentSection}
          qualification={qualification}
          setQualification={setQualification}
          bio={bio}
          setBio={setBio}
        />
      ) : twoFactorStage !== "none" ? (
        <TwoFactorStep
          stage={twoFactorStage}
          otpCode={otpCode}
          setOtpCode={setOtpCode}
          isVerifying={isVerifyingOtp}
          error={twoFactorError}
          onVerify={handleVerifyOtp}
          onCancel={handleCancelTwoFactor}
          qrDataUrl={totpQrDataUrl}
          secret={totpSecret}
        />
      ) : forgotPasswordStage !== "none" ? (
        <ForgotPasswordStep
          stage={forgotPasswordStage}
          email={forgotEmail}
          setEmail={setForgotEmail}
          code={forgotCode}
          setCode={setForgotCode}
          isVerifyingCode={isVerifyingForgotCode}
          onVerifyCode={handleVerifyForgotCode}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmNewPassword={confirmNewPassword}
          setConfirmNewPassword={setConfirmNewPassword}
          isSettingNewPassword={isSettingNewPassword}
          onSetNewPassword={handleSetNewPassword}
          error={forgotError}
          onCancel={resetForgotPasswordState}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative w-full max-w-[880px] min-h-[420px] bg-white dark:bg-[#0b0f19] rounded-2xl shadow-2xl shadow-slate-300/50 dark:shadow-black/60 overflow-hidden flex flex-col md:flex-row transition-colors duration-500 border border-slate-200 dark:border-slate-800/80"
        >
          {/* --- FORM CONTAINER --- */}
          <div
            className={`w-full md:w-1/2 flex flex-col justify-center px-7 sm:px-10 py-6 transition-all duration-700 ease-in-out z-10 bg-white dark:bg-[#0b0f19] ${isLogin ? "md:translate-x-0" : "md:translate-x-full"
              }`}
          >
            <div className="mb-3">
              <div className="flex justify-center md:justify-start items-center gap-2 mb-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                  <GraduationCap className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  Edu
                  <span className="text-blue-600 dark:text-blue-400">
                    Nexus
                  </span>
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              {isLogin && approvalStatus === "pending" && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 my-1">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-100">Account Pending Approval</p>
                    <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                      Your account is pending admin approval. You will be able to log in once an administrator approves your account.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-[11px] font-medium text-red-500 dark:text-red-400 ml-1">
                  {error}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || (isLogin && approvalStatus === "pending")}
                whileHover={isLogin && approvalStatus === "pending" ? {} : { y: -1 }}
                whileTap={isLogin && approvalStatus === "pending" ? {} : { scale: 0.98 }}
                className={`w-full font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl transition-all mt-2 flex items-center justify-center gap-2 cursor-pointer ${isLogin && approvalStatus === "pending"
                    ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/25 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  }`}
              >
                {isSubmitting ? (
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : isLogin && approvalStatus === "pending" ? (
                  <>
                    <Clock size={14} />
                    <span>Pending Admin Approval</span>
                  </>
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

            {isLogin && (() => {
              const isDemoStudentFilled =
                email.trim().toLowerCase() === "demostudent@edunexus.std.com" &&
                password === "demostudent1234";
              const isDemoTeacherFilled =
                email.trim().toLowerCase() === "demoteacher@edunexus.tchr.com" &&
                password === "demoteacher1234";

              return (
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-500" />
                      Quick Demo Credentials
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">Click to fill</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isDemoStudentFilled}
                      onClick={() => {
                        setEmail("demostudent@edunexus.std.com");
                        setPassword("demostudent1234");
                        setError("");
                        toast.success("Welcome back! Demo Student credentials filled.");
                      }}
                      className={`flex flex-col items-start p-2 text-left rounded-xl border transition-all duration-200 group ${
                        isDemoStudentFilled
                          ? "bg-blue-100/80 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 opacity-60 cursor-not-allowed"
                          : "bg-slate-50 hover:bg-blue-50/80 dark:bg-slate-800/50 dark:hover:bg-blue-950/40 border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-800 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <GraduationCap size={13} />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            Demo Student
                          </span>
                        </div>
                        {isDemoStudentFilled && (
                          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded-md">
                            Filled
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 font-mono truncate w-full">
                        demostudent@edunexus.std.com
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isDemoTeacherFilled}
                      onClick={() => {
                        setEmail("demoteacher@edunexus.tchr.com");
                        setPassword("demoteacher1234");
                        setError("");
                        toast.success("Welcome back! Demo Teacher credentials filled.");
                      }}
                      className={`flex flex-col items-start p-2 text-left rounded-xl border transition-all duration-200 group ${
                        isDemoTeacherFilled
                          ? "bg-indigo-100/80 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-700 opacity-60 cursor-not-allowed"
                          : "bg-slate-50 hover:bg-indigo-50/80 dark:bg-slate-800/50 dark:hover:bg-indigo-950/40 border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-800 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                            <Briefcase size={13} />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Demo Teacher
                          </span>
                        </div>
                        {isDemoTeacherFilled && (
                          <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded-md">
                            Filled
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 font-mono truncate w-full">
                        demoteacher@edunexus.tchr.com
                      </span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* --- DECORATIVE PANEL WITH IMAGE BACKGROUND (unchanged) --- */}
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
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
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
                        { label: "Details", icon: UserPlus, active: true },
                        { label: "Verify", icon: ShieldCheck, active: false },
                        {
                          label: "Explore",
                          icon: GraduationCap,
                          active: false,
                        },
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
                                ? "bg-emerald-400/20 border-emerald-300/40"
                                : "bg-white/[0.06] border-white/15"
                              }`}
                          >
                            <step.icon
                              size={11}
                              className={
                                step.active
                                  ? "text-emerald-300"
                                  : "text-white/50"
                              }
                            />
                            <span
                              className={`text-[8px] font-bold uppercase tracking-wide ${step.active
                                  ? "text-emerald-200"
                                  : "text-white/50"
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
                  whileHover={{ gap: "10px" }}
                  whileTap={{ scale: 0.97 }}
                  className={`inline-flex items-center gap-2 rounded-full bg-white text-slate-900 text-[11px] font-bold py-1.5 ${isLogin ? "pl-1.5 pr-4" : "pl-4 pr-1.5"
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

interface TwoFactorStepProps {
  stage: "verify" | "setup";
  otpCode: string;
  setOtpCode: (v: string) => void;
  isVerifying: boolean;
  error: string;
  onVerify: () => void;
  onCancel: () => void;
  qrDataUrl: string;
  secret: string;
}

function TwoFactorStep({
  stage,
  otpCode,
  setOtpCode,
  isVerifying,
  error,
  onVerify,
  onCancel,
  qrDataUrl,
  secret,
}: TwoFactorStepProps) {
  const isSetup = stage === "setup";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative w-full max-w-md bg-white dark:bg-[#0b0f19] rounded-2xl shadow-2xl shadow-slate-300/50 dark:shadow-black/60 overflow-hidden border border-slate-200 dark:border-slate-800/80 px-7 sm:px-9 py-7"
    >
      <div className="flex flex-col items-center text-center mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 mb-2">
          <ShieldCheck size={18} />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {isSetup ? "Secure your account" : "Two-factor verification"}
        </h2>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          {isSetup
            ? "Scan this QR code with an authenticator app (Google Authenticator, Authy, etc.), then enter the 6-digit code to finish setup."
            : "Enter the 6-digit code from your authenticator app."}
        </p>
      </div>

      {isSetup && (
        <div className="flex flex-col items-center mb-4">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="Authenticator app QR code"
              className="h-40 w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white p-1.5"
            />
          ) : (
            <div className="h-40 w-40 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
            </div>
          )}
          {secret && (
            <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 text-center">
              Can&apos;t scan? Enter this key manually:{" "}
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 break-all">
                {secret}
              </span>
            </p>
          )}
        </div>
      )}

      <div className="space-y-1 mb-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
          Authentication code
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
            <KeyRound size={14} />
          </div>
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onVerify();
              }
            }}
            placeholder="123456"
            maxLength={6}
            className="w-full pl-9 pr-3 py-2 text-xs tracking-widest bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
          />
        </div>
      </div>

      {error && (
        <p className="text-[11px] font-medium text-red-500 dark:text-red-400 ml-1 mt-1.5">
          {error}
        </p>
      )}

      <motion.button
        type="button"
        onClick={onVerify}
        disabled={isVerifying || !otpCode}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md shadow-indigo-500/25 active:scale-95 transition-all mt-3 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {isVerifying ? (
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        ) : (
          <>
            {isSetup ? "Verify & enable" : "Verify"}
            <ArrowRight size={14} />
          </>
        )}
      </motion.button>

      <div className="flex items-center justify-center mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          <ArrowLeft size={12} /> Back to login
        </button>
      </div>
    </motion.div>
  );
}

interface ForgotPasswordStepProps {
  stage: "code" | "newPassword";
  email: string;
  setEmail: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  isVerifyingCode: boolean;
  onVerifyCode: () => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (v: string) => void;
  isSettingNewPassword: boolean;
  onSetNewPassword: () => void;
  error: string;
  onCancel: () => void;
}

function ForgotPasswordStep({
  stage,
  email,
  setEmail,
  code,
  setCode,
  isVerifyingCode,
  onVerifyCode,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  isSettingNewPassword,
  onSetNewPassword,
  error,
  onCancel,
}: ForgotPasswordStepProps) {
  const isCodeStage = stage === "code";
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative w-full max-w-md bg-white dark:bg-[#0b0f19] rounded-2xl shadow-2xl shadow-slate-300/50 dark:shadow-black/60 overflow-hidden border border-slate-200 dark:border-slate-800/80 px-7 sm:px-9 py-7"
    >
      <div className="flex flex-col items-center text-center mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 mb-2">
          <KeyRound size={18} />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {isCodeStage ? "Reset your password" : "Choose a new password"}
        </h2>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          {isCodeStage
            ? "Enter your account email and the 6-digit code from your authenticator app."
            : "Your code checked out — set a new password for your account."}
        </p>
      </div>

      {isCodeStage ? (
        <>
          <div className="space-y-1 mb-2">
            <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                <Mail size={14} />
              </div>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@edunexus.std.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1 mb-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
              Authentication code
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                <ShieldCheck size={14} />
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onVerifyCode();
                  }
                }}
                placeholder="123456"
                maxLength={6}
                className="w-full pl-9 pr-3 py-2 text-xs tracking-widest bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {error && (
            <p className="text-[11px] font-medium text-red-500 dark:text-red-400 ml-1 mt-1.5">
              {error}
            </p>
          )}

          <motion.button
            type="button"
            onClick={onVerifyCode}
            disabled={isVerifyingCode || !email.trim() || !code.trim()}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md shadow-indigo-500/25 active:scale-95 transition-all mt-3 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isVerifyingCode ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <>
                Verify code
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </>
      ) : (
        <>
          <div className="space-y-1 mb-2">
            <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
              New Password
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                <Lock size={14} />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="space-y-1 mb-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
              Confirm New Password
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                <ShieldCheck size={14} />
              </div>
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSetNewPassword();
                  }
                }}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={
                  showConfirmNewPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmNewPassword ? (
                  <EyeOff size={14} />
                ) : (
                  <Eye size={14} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[11px] font-medium text-red-500 dark:text-red-400 ml-1 mt-1.5">
              {error}
            </p>
          )}

          <motion.button
            type="button"
            onClick={onSetNewPassword}
            disabled={
              isSettingNewPassword || !newPassword || !confirmNewPassword
            }
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md shadow-indigo-500/25 active:scale-95 transition-all mt-3 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSettingNewPassword ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <>
                Update password
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </>
      )}

      <div className="flex items-center justify-center mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          <ArrowLeft size={12} /> Back to login
        </button>
      </div>
    </motion.div>
  );
}

interface ProfileCompletionStepProps {
  name: string;
  email: string;
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
  gender: string;
  setGender: (v: string) => void;
  guardianPhone: string;
  setGuardianPhone: (v: string) => void;
  guardianRelation: string;
  setGuardianRelation: (v: string) => void;
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
  studentSection: string;
  setStudentSection: (v: string) => void;
  qualification: string;
  setQualification: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const GUARDIAN_RELATION_OPTIONS = [
  "Father",
  "Mother",
  "Legal Guardian",
  "Uncle",
  "Aunt",
  "Other",
];
const CLASS_OPTIONS = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const GROUP_OPTIONS = ["Science", "Business Studies", "Humanities"];
const TEACHER_DEPARTMENT_OPTIONS = [
  "Science",
  "Commerce",
  "Arts",
  "Computer Science & ICT",
  "Mathematics",
  "English",
  "Bangla",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Science",
  "Accounting",
  "Islamic Studies",
  "Physical Education",
];
const QUALIFICATION_OPTIONS = [
  "B.Sc",
  "M.Sc",
  "B.A",
  "M.A",
  "B.Ed",
  "M.Ed",
  "B.Com",
  "M.Com",
  "Ph.D",
  "Diploma in Education",
];

interface CustomSelectProps {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}

function CustomSelect({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder = "Select option",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">
        {label}
      </label>
      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm flex items-center justify-between text-left cursor-pointer"
        >
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
            <Icon size={14} />
          </div>
          <span className={value ? "font-medium" : "text-slate-400 dark:text-slate-500"}>
            {value || placeholder}
          </span>
          <ChevronDown
            size={14}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-500" : ""
              }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 left-0 right-0 mt-1.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl shadow-slate-300/30 dark:shadow-black/50 max-h-48 overflow-y-auto"
            >
              {options.map((opt) => {
                const isSelected = opt === value;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-700 dark:text-slate-200"
                      }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <Check size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProfileCompletionStep({
  name,
  email,
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
  gender,
  setGender,
  guardianPhone,
  setGuardianPhone,
  guardianRelation,
  setGuardianRelation,
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
  studentSection,
  setStudentSection,
  qualification,
  setQualification,
  bio,
  setBio,
}: ProfileCompletionStepProps) {
  const isTeacher = detectedRole === "teacher";

  const inputClass =
    "w-full pl-9 pr-3 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm";
  const labelClass =
    "text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider";
  const iconWrapClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full max-w-5xl bg-white dark:bg-[#0b0f19] rounded-2xl shadow-2xl shadow-slate-300/50 dark:shadow-black/60 overflow-hidden border border-slate-200 dark:border-slate-800/80"
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
        <div className="flex-1 h-px bg-gradient-to-r from-emerald-400 to-indigo-500" />
        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[9px] font-bold">
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
        {/* --- FORM CONTAINER --- */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <form onSubmit={onSubmit} className="flex flex-col justify-between h-full">
            {/* Scrollable Fields Box */}
            <div className="px-5 sm:px-10 py-6 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto space-y-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25">
                  {isTeacher ? (
                    <Briefcase size={18} />
                  ) : (
                    <GraduationCap size={18} />
                  )}
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

              {/* Account Credentials Display Box (Name & Email) */}
              {(name || email) && (
                <div className="mb-4 p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 text-xs text-slate-800 dark:text-slate-100 font-bold truncate">
                    {name && (
                      <div className="flex items-center gap-1.5 truncate">
                        <User size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">{name}</span>
                      </div>
                    )}
                    {email && (
                      <div className="flex items-center gap-1.5 truncate text-slate-600 dark:text-slate-300 font-medium">
                        <Mail size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">{email}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-500/20 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-500/30 shrink-0 flex items-center gap-1 self-start sm:self-auto">
                    <CheckCircle2 size={11} /> Registered Account
                  </span>
                </div>
              )}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                  Personal &amp; Family
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className={labelClass}>
                      {isTeacher ? "Father's Name *" : "Father's Name"}
                    </label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <Users size={14} />
                      </div>
                      <input
                        type="text"
                        required={isTeacher}
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="e.g. Abdul Karim"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>
                      {isTeacher ? "Mother's Name *" : "Mother's Name"}
                    </label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <Users size={14} />
                      </div>
                      <input
                        type="text"
                        required={isTeacher}
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder="e.g. Rahima Begum"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>
                      {isTeacher ? "Date of Birth *" : "Date of Birth"}
                    </label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <Calendar size={14} />
                      </div>
                      <input
                        type="date"
                        required={isTeacher}
                        max={new Date().toISOString().split("T")[0]}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <CustomSelect
                    label={isTeacher ? "Blood Group *" : "Blood Group"}
                    icon={Droplet}
                    value={bloodGroup}
                    onChange={setBloodGroup}
                    options={BLOOD_GROUPS}
                    placeholder="Select Blood Group"
                  />

                  <CustomSelect
                    label="Gender"
                    icon={User}
                    value={gender}
                    onChange={setGender}
                    options={GENDER_OPTIONS}
                    placeholder="Select Gender"
                  />

                  <div className="space-y-1">
                    <label className={labelClass}>Guardian Phone</label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <Phone size={14} />
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                        value={guardianPhone}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "").slice(0, 11);
                          if (val.length > 0) {
                            if (val[0] !== "0") val = "0" + val.slice(1);
                            if (val.length > 1 && val[1] !== "1") val = "01" + val.slice(2);
                          }
                          setGuardianPhone(val);
                        }}
                        placeholder="01712345678"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <CustomSelect
                    label="Guardian Relationship"
                    icon={Users}
                    value={guardianRelation}
                    onChange={setGuardianRelation}
                    options={GUARDIAN_RELATION_OPTIONS}
                    placeholder="Select Relationship"
                  />
                </div>

                <div className="space-y-1 mt-2">
                  <label className={labelClass}>
                    {isTeacher ? "Permanent Address *" : "Permanent Address"}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                      <Home size={14} />
                    </div>
                    <textarea
                      required={isTeacher}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Permanent address: Village/House, Post Office, District"
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="space-y-1">
                    <label className={labelClass}>
                      {isTeacher ? "Phone Number *" : "Student Phone Number"}
                    </label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <Phone size={14} />
                      </div>
                      <input
                        type="tel"
                        required={isTeacher}
                        inputMode="numeric"
                        maxLength={11}
                        value={phone}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "").slice(0, 11);
                          if (val.length > 0) {
                            if (val[0] !== "0") val = "0" + val.slice(1);
                            if (val.length > 1 && val[1] !== "1") val = "01" + val.slice(2);
                          }
                          setPhone(val);
                        }}
                        placeholder="01712345678"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>
                      {isTeacher ? "Present Address *" : "Present Address"}
                    </label>
                    <div className="relative group">
                      <div className={iconWrapClass}>
                        <MapPin size={14} />
                      </div>
                      <input
                        type="text"
                        required={isTeacher}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Present address: e.g. Dhaka, Bangladesh"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                  {isTeacher ? "Professional Details" : "Academic Details"}
                </p>
                {isTeacher ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <CustomSelect
                      label="Department"
                      icon={Building2}
                      value={department}
                      onChange={setDepartment}
                      options={TEACHER_DEPARTMENT_OPTIONS}
                      placeholder="Select Department"
                    />

                    <CustomSelect
                      label="Education Qualification"
                      icon={Award}
                      value={qualification}
                      onChange={setQualification}
                      options={QUALIFICATION_OPTIONS}
                      placeholder="Select Qualification"
                    />
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 flex items-start gap-2.5 shadow-xs">
                      <div className="p-1 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 shrink-0 mt-0.5">
                        <AlertCircle size={15} />
                      </div>
                      <div className="text-[11px] leading-relaxed text-red-900 dark:text-red-200">
                        <span className="font-bold text-red-950 dark:text-red-300 block mb-0.5">
                          One-Time Entry Notice
                        </span>
                        School Name, Class, Section, and Group are registered once and cannot be changed anytime after submitting this form.
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Row 1: School Name & Class side-by-side */}
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

                        <CustomSelect
                          label="Class"
                          icon={BookOpen}
                          value={studentClass}
                          onChange={(val) => {
                            setStudentClass(val);
                            if (val !== "Class 9" && val !== "Class 10") {
                              setDepartment("");
                            }
                          }}
                          options={CLASS_OPTIONS}
                          placeholder="Select Class"
                        />
                      </div>

                      {/* Row 2: Section & Group below them */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomSelect
                          label="Section"
                          icon={Users}
                          value={studentSection}
                          onChange={setStudentSection}
                          options={["Section A", "Section B"]}
                          placeholder="Select Section"
                        />

                        {(studentClass === "Class 9" || studentClass === "Class 10") && (
                          <CustomSelect
                            label="Group"
                            icon={Building2}
                            value={department}
                            onChange={setDepartment}
                            options={GROUP_OPTIONS}
                            placeholder="Select Group"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className={labelClass}>
                  {isTeacher ? "Short Bio *" : "Short Bio (Optional)"}
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                    <FileText size={14} />
                  </div>
                  <textarea
                    required={isTeacher}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={
                      isTeacher
                        ? "A brief summary of your teaching background & experience *"
                        : "A line or two about yourself (optional)"
                    }
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 flex items-start gap-3 text-xs text-red-600 dark:text-red-400 mt-2"
                >
                  <div className="p-1 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                    <AlertCircle size={16} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="font-bold text-[12px] text-red-700 dark:text-red-300">
                      Registration Limit Notice
                    </p>
                    <p className="text-[11px] leading-relaxed text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Dedicated Action Buttons Footer */}
            <div className="px-5 sm:px-10 py-3.5 bg-white dark:bg-[#0b0f19] border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <motion.button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto shrink-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 px-5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Complete Registration</span>
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
              backgroundImage: `url('${isTeacher ? TEACHER_PROFILE_IMAGE : STUDENT_PROFILE_IMAGE
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
              These details help your teachers, classmates, and the admin team
              recognize you on EduNexus.
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

interface RegistrationSuccessViewProps {
  name: string;
  email: string;
  role: "student" | "teacher";
  onGoToLogin: () => void;
}

function RegistrationSuccessView({
  name,
  email,
  role,
  onGoToLogin,
}: RegistrationSuccessViewProps) {
  const isTeacher = role === "teacher";
  const roleDisplay = isTeacher ? "TEACHER" : "STUDENT";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#030712] p-4 font-sans transition-colors duration-500 relative overflow-hidden">
      {/* Background Mesh Glows */}
      <div className="pointer-events-none fixed top-20 left-10 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none fixed bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white dark:bg-[#0b0f19] rounded-2xl shadow-2xl shadow-slate-300/60 dark:shadow-black/60 border border-slate-200 dark:border-slate-800/80 p-7 sm:p-8 text-center"
      >
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 mb-6">
          <Clock size={13} className="animate-spin" style={{ animationDuration: "3s" }} />
          <span>Pending Admin Approval</span>
        </div>

        {/* Success Icon */}
        <div className="relative mx-auto h-20 w-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 flex items-center justify-center mb-4 overflow-hidden">
          <CheckCircle2 size={40} />
        </div>

        {/* User Details */}
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Registration Submitted!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
          Thank you, <strong className="text-slate-800 dark:text-slate-200">{name || "Member"}</strong>. Your account registration has been submitted successfully.
        </p>

        {/* Email & Role Badges */}
        <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 mb-6 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Account Email:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{email}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Registered Role:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              isTeacher
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
            }`}>
              {roleDisplay}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Approval Status:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Clock size={11} />
              <span>Pending Review</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Your account must be reviewed and approved by an administrator before you can log in to your workspace.
        </p>

        {/* Action Button */}
        <motion.button
          type="button"
          onClick={onGoToLogin}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Go to Sign In</span>
          <ArrowRight size={14} />
        </motion.button>
      </motion.div>
    </div>
  );
}

interface AlreadyLoggedInProps {
  session: any;
}

function AlreadyLoggedInView({ session }: AlreadyLoggedInProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const u = session?.user || {};
  const userName = u.name || u.email || "EduNexus User";
  const userEmail = u.email || "";
  const rawRole = (u.role || "student").toLowerCase();
  const roleDisplay = rawRole.toUpperCase();
  const isApproved = u.isApproved ?? true;

  const isTeacher = rawRole === "teacher";
  const isStudent = rawRole === "student";

  const dashboardUrl =
    rawRole === "student"
      ? "/dashboard/student"
      : rawRole === "teacher"
        ? "/dashboard/teacher"
        : rawRole === "admin"
          ? "/dashboard/admin"
          : "/dashboard";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      toast.info("Signed out successfully.");
      window.location.reload();
    } catch {
      toast.error("Failed to sign out.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#030712] p-4 font-sans transition-colors duration-500 relative overflow-hidden">
      {/* Background Mesh Glows */}
      <div className="pointer-events-none fixed top-20 left-10 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none fixed bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white dark:bg-[#0b0f19] rounded-2xl shadow-2xl shadow-slate-300/60 dark:shadow-black/60 border border-slate-200 dark:border-slate-800/80 p-7 sm:p-8 text-center"
      >
        {/* Status Badge */}
        {isApproved ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-6">
            <CheckCircle2 size={13} />
            <span>Already Signed In</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 mb-6">
            <Clock size={13} className="animate-spin" style={{ animationDuration: "3s" }} />
            <span>Pending Admin Approval</span>
          </div>
        )}

        {/* User Avatar */}
        <div className="relative mx-auto h-24 w-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center text-3xl font-extrabold mb-4 overflow-hidden border-4 border-white dark:border-slate-800">
          {u.image ? (
            <img src={u.image} alt={userName} className="h-full w-full object-cover" />
          ) : (
            <span>{userName[0]?.toUpperCase()}</span>
          )}
        </div>

        {/* User Details */}
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {isApproved ? `Welcome back, ${userName}!` : "Account Pending Approval"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 flex items-center justify-center gap-1.5">
          <Mail size={13} className="text-indigo-500" />
          <span>{userEmail}</span>
        </p>

        {/* Role & Details Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold border ${
              isTeacher
                ? "bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20"
                : isStudent
                  ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"
                  : "bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20"
            }`}
          >
            {isTeacher ? (
              <Briefcase size={12} />
            ) : isStudent ? (
              <GraduationCap size={12} />
            ) : (
              <ShieldCheck size={12} />
            )}
            {roleDisplay}
          </span>

          {isStudent && (u.studentClass || u.studentSection) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-500/15 px-3 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
              <School size={12} />
              {[u.studentClass, u.studentSection].filter(Boolean).join(" - ")}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {isApproved ? (
            <>
              <motion.button
                type="button"
                onClick={() => router.push(dashboardUrl)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight size={14} />
              </motion.button>

              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  type="button"
                  onClick={() => router.push("/profile")}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User size={13} />
                  <span>View Profile</span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-500/20 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>{isSigningOut ? "Signing out..." : "Switch Account"}</span>
                </motion.button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200/50 dark:border-amber-500/20">
                Your account is currently awaiting approval by an administrator. Once approved, you can log in to access your dashboard.
              </p>
              <motion.button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{isSigningOut ? "Signing out..." : "Return to Sign In"}</span>
                <ArrowRight size={14} />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
