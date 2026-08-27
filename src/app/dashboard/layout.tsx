"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  CreditCard,
  Bell,
  FileText,
  CalendarCheck,
  Home,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  User,
  Sparkles,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

type UserRole = "admin" | "teacher" | "student";

interface RouteItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminRoutes: RouteItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Teachers", href: "/dashboard/teachers", icon: Users },
  { label: "Students", href: "/dashboard/students", icon: GraduationCap },
  { label: "Classes", href: "/dashboard/classes", icon: BookOpen },
  { label: "Results", href: "/dashboard/results", icon: Award },
  { label: "Fees", href: "/dashboard/fees", icon: CreditCard },
  { label: "Notices", href: "/dashboard/notices", icon: Bell },
];

const teacherRoutes: RouteItem[] = [
  { label: "Overview", href: "/dashboard/teacher", icon: LayoutDashboard },
  { label: "My Classes", href: "/dashboard/teacher/my-classes", icon: BookOpen },
  { label: "Assignments", href: "/dashboard/teacher/assignments", icon: FileText },
  { label: "Results", href: "/dashboard/teacher/results", icon: Award },
  { label: "Attendance", href: "/dashboard/teacher/attendance", icon: CalendarCheck },
  { label: "Students", href: "/dashboard/teacher/students", icon: GraduationCap },
];

const studentRoutes: RouteItem[] = [
  { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/student/attendance", icon: CalendarCheck },
  { label: "Results", href: "/dashboard/student/result", icon: Award },
  { label: "Assignments", href: "/dashboard/student/assignment", icon: FileText },
  { label: "Fees", href: "/dashboard/student/fee", icon: CreditCard },
  { label: "Notices", href: "/dashboard/student/notices", icon: Bell },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync theme state on mount
  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Close mobile drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [pathname]);

  // Determine role safely
  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();
  const userRole: UserRole =
    rawRole === "admin" ? "admin" : rawRole === "teacher" ? "teacher" : "student";

  const currentRoutes =
    userRole === "admin"
      ? adminRoutes
      : userRole === "teacher"
        ? teacherRoutes
        : studentRoutes;

  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully.");
      setShowLogoutModal(false);
      window.location.href = "/";
    } catch (err) {
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Role Badge Styling
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return {
          label: "Admin",
          color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
        };
      case "teacher":
        return {
          label: "Teacher",
          color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
        };
      case "student":
      default:
        return {
          label: "Student",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
        };
    }
  };

  const roleBadge = getRoleBadge(userRole);

  const sidebarContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02,
      },
    },
  };

  const sidebarItemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 26,
      },
    },
  };

  const renderSidebarContent = () => (
    <motion.div
      variants={sidebarContainerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300 overflow-hidden"
    >
      {/* Compact Sidebar Header / Brand */}
      <motion.div
        variants={sidebarItemVariants}
        className="p-3 px-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 6 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm transition-shadow duration-300 shrink-0"
          >
            <GraduationCap className="h-4 w-4" />
          </motion.div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              Edu<span className="text-blue-600 dark:text-blue-400">Nexus</span>
            </span>
            <span
              className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider rounded border ${roleBadge.color}`}
            >
              {roleBadge.label}
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Compact User Quick Overview */}
      <motion.div
        variants={sidebarItemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
        className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-800/40 flex items-center gap-2.5 transition-colors"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: -6 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0"
        >
          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
        </motion.div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
            {session?.user?.name ?? "EduNexus User"}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight">
            {session?.user?.email ?? "workspace@edunexus.school"}
          </span>
        </div>
      </motion.div>

      {/* Expanded Main Navigation Links */}
      <div className="flex-1 px-2.5 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        <motion.div
          variants={sidebarItemVariants}
          className="px-2.5 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
        >
          Menu Navigation
        </motion.div>
        {currentRoutes.map((route) => {
          const Icon = route.icon;
          const isOverview =
            route.href === "/dashboard" ||
            route.href === "/dashboard/teacher" ||
            route.href === "/dashboard/admin" ||
            route.href === "/dashboard/student";

          const isActive = isOverview
            ? pathname === route.href
            : pathname === route.href || pathname.startsWith(`${route.href}/`);

          return (
            <motion.div
              key={route.label}
              variants={sidebarItemVariants}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={route.href}
                className="relative group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 overflow-hidden"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarTab"
                    className="absolute inset-0 bg-indigo-600 dark:bg-indigo-600 rounded-lg shadow-sm shadow-indigo-500/20 z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2.5">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 transition-colors duration-200 ${isActive
                        ? "text-white"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                    />
                  </motion.div>
                  <span
                    className={
                      isActive
                        ? "text-white font-semibold"
                        : "text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                    }
                  >
                    {route.label}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <ChevronRight className="h-3 w-3 text-white/80" />
                  </motion.div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Ultra-Compact Bottom Actions (Home & Logout) */}
      <motion.div
        variants={sidebarItemVariants}
        className="p-2 px-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1 bg-slate-50/50 dark:bg-slate-900/50"
      >
        <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/"
            className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-2xs cursor-pointer"
          >
            <Home className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
            className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col lg:flex-row font-sans">
      {/* Desktop Permanent Left Sidebar (Large Screens Only) */}
      <aside className="hidden lg:block w-56 h-screen sticky top-0 shrink-0 z-30">
        {renderSidebarContent()}
      </aside>

      {/* Mobile & Tablet Top Bar (Small & Medium Screens) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </motion.button>

          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 6 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm"
            >
              <GraduationCap className="h-4 w-4" />
            </motion.div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              Edu<span className="text-blue-600 dark:text-blue-400">Nexus</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Top Theme Toggle Button */}
          {mounted && (
            <motion.button
              type="button"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div
                    key="sun-mobile"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Sun className="h-4 w-4 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon-mobile"
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Moon className="h-4 w-4 text-blue-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}

          <motion.span
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${roleBadge.color}`}
          >
            {roleBadge.label}
          </motion.span>
        </div>
      </motion.div>

      {/* Mobile Off-Canvas Drawer (Small & Medium Screens) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Off-Canvas Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-56 max-w-[75vw] h-full shadow-2xl"
            >
              <div className="relative h-full">
                {/* Close Button Inside Mobile Drawer */}
                <motion.button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 z-50 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </motion.button>
                {renderSidebarContent()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar for Desktop (Theme Toggle & Top Status) */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="hidden lg:flex h-16 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 items-center justify-between sticky top-0 z-20"
        >
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-center gap-2.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Dashboard Workspace
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-xs text-slate-500 dark:text-slate-400 capitalize px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-semibold"
            >
              {userRole} Portal
            </motion.span>
          </motion.div>

          <div className="flex items-center gap-4">
            {/* Very Top Theme Toggle Button */}
            {mounted && (
              <motion.button
                type="button"
                onClick={toggleTheme}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
                aria-label="Toggle light/dark theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4 text-amber-400" />
                      <span>Light Mode</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4 text-blue-600" />
                      <span>Dark Mode</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex items-center gap-2.5 cursor-pointer p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <motion.div
                whileHover={{ rotate: 12 }}
                className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm"
              >
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </motion.div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {session?.user?.name ?? "EduNexus User"}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize leading-tight">
                  {userRole}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center z-[10001] my-auto"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shadow-inner">
                <LogOut className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Confirm Logout
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to log out of your account?
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogoutConfirm}
                  className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingOut ? (
                    <span>Logging out...</span>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
