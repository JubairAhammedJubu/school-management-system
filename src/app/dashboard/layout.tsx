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
  { label: "Teachers", href: "/dashboard/admin/teachers", icon: Users },
  { label: "Students", href: "/dashboard/admin/students", icon: GraduationCap },
  { label: "Classes", href: "/dashboard/admin/classes", icon: BookOpen },
  { label: "Results", href: "/dashboard/admin/results", icon: Award },
  { label: "Fees", href: "/dashboard/admin/fees", icon: CreditCard },
  { label: "Notices", href: "/dashboard/admin/notices", icon: Bell },
];

const teacherRoutes: RouteItem[] = [
  { label: "Overview", href: "/dashboard/teacher", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/teacher/attendance", icon: CalendarCheck },
  { label: "Examination & Results", href: "/dashboard/teacher/results", icon: Award },
  { label: "Assignments Management", href: "/dashboard/teacher/assignments", icon: FileText },
  { label: "Class & Subject Requests", href: "/dashboard/teacher/my-classes", icon: BookOpen },
  { label: "Students", href: "/dashboard/teacher/students", icon: GraduationCap },
  { label: "Notices", href: "/dashboard/teacher/notices", icon: Bell },
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
  const { data: session, isPending } = useSession();

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
    setMobileMenuOpen(false);
  }, [pathname]);

  // Determine role safely
  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();
  const userRole: UserRole =
    rawRole === "admin" ? "admin" : rawRole === "teacher" ? "teacher" : "student";

  // Redirect unauthorized attempts
  useEffect(() => {
    if (!isPending) {
      const isAdminRoute = pathname.startsWith("/dashboard/admin");
      const isStudentRoute = pathname.startsWith("/dashboard/student");
      const isTeacherRoute = pathname.startsWith("/dashboard/teacher");

      if (isAdminRoute || isStudentRoute || isTeacherRoute) {
        if (!session?.user) {
          router.replace("/unauthorized");
        } else if (isAdminRoute && rawRole !== "admin") {
          router.replace("/unauthorized");
        } else if (isStudentRoute && rawRole !== "student") {
          router.replace("/unauthorized");
        } else if (isTeacherRoute && rawRole !== "teacher") {
          router.replace("/unauthorized");
        }
      }
    }
  }, [pathname, rawRole, session, isPending, router]);

  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully.");
      setShowLogoutModal(false);
      window.location.href = "/";
    } catch {
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Role Badge Config
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case "admin":
        return {
          label: "Administrator",
          badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
          accentGradient: "from-rose-600 via-pink-600 to-purple-600",
        };
      case "teacher":
        return {
          label: "Faculty Teacher",
          badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
          accentGradient: "from-indigo-600 via-purple-600 to-blue-600",
        };
      case "student":
      default:
        return {
          label: "Student Portal",
          badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
          accentGradient: "from-blue-600 via-cyan-600 to-teal-600",
        };
    }
  };

  const roleConfig = getRoleConfig(userRole);

  // Group routes logically for professional sidebar
  const getGroupedRoutes = (role: UserRole) => {
    if (role === "admin") {
      return [
        {
          title: "Main Dashboard",
          items: [adminRoutes[0]],
        },
        {
          title: "People & Classes",
          items: [adminRoutes[1], adminRoutes[2], adminRoutes[3]],
        },
        {
          title: "Academics & Management",
          items: [adminRoutes[4], adminRoutes[5], adminRoutes[6]],
        },
      ];
    } else if (role === "teacher") {
      return [
        {
          title: "Main Dashboard",
          items: [teacherRoutes[0]],
        },
        {
          title: "Classroom Tools",
          items: [teacherRoutes[1], teacherRoutes[2], teacherRoutes[3]],
        },
        {
          title: "Requests & Communication",
          items: [teacherRoutes[4], teacherRoutes[5], teacherRoutes[6]],
        },
      ];
    } else {
      return [
        {
          title: "Main Dashboard",
          items: [studentRoutes[0]],
        },
        {
          title: "Academic Workspace",
          items: [studentRoutes[1], studentRoutes[2], studentRoutes[3]],
        },
        {
          title: "Finance & Alerts",
          items: [studentRoutes[4], studentRoutes[5]],
        },
      ];
    }
  };

  const groupedRoutes = getGroupedRoutes(userRole);

  const sidebarContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.01,
      },
    },
  };

  const sidebarItemVariants: Variants = {
    hidden: { opacity: 0, x: -12 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 380,
        damping: 28,
      },
    },
  };

  const renderSidebarContent = () => (
    <motion.div
      variants={sidebarContainerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl transition-colors duration-300 overflow-hidden selection:bg-indigo-500 selection:text-white"
    >
      {/* Brand Header */}
      <motion.div
        variants={sidebarItemVariants}
        className="p-2.5 px-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/40"
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr ${roleConfig.accentGradient} text-white shadow-sm shrink-0`}
          >
            <GraduationCap className="h-4 w-4" />
          </motion.div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Edu<span className="text-blue-600 dark:text-blue-400">Nexus</span>
              </span>
              <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
            </div>
            <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase leading-tight">
              School System
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Role Pill Banner */}
      <motion.div
        variants={sidebarItemVariants}
        className="px-3 py-1.5 bg-slate-100/60 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between"
      >
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
            {roleConfig.label}
          </span>
        </div>
        <span className="text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
          Online
        </span>
      </motion.div>

      {/* Navigation Groups */}
      <div className="flex-1 px-2.5 py-2 space-y-2.5 overflow-y-auto custom-scrollbar">
        {groupedRoutes.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <motion.p
              variants={sidebarItemVariants}
              className="px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500"
            >
              {group.title}
            </motion.p>

            {group.items.map((route) => {
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
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={route.href}
                    className={`relative group flex items-center justify-between pl-3 pr-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer overflow-hidden ${
                      isActive
                        ? "bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-500/30"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
                    }`}
                  >
                    {/* Active Left Accent Indicator Bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeLeftIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-white dark:bg-white shadow-xs"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-slate-700"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{route.label}</span>
                    </div>

                    {isActive ? (
                      <motion.div
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-white font-bold" />
                      </motion.div>
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile Footer Card */}
      <motion.div
        variants={sidebarItemVariants}
        className="p-2 px-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 space-y-1.5"
      >
        <Link
          href="/profile"
          title="View & Edit Profile"
          className="relative flex items-center gap-2.5 p-1.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 shadow-xs transition-all cursor-pointer group"
        >
          <div className="relative shrink-0">
            <div className="h-7.5 w-7.5 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-sm group-hover:scale-105 transition-transform">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 absolute -bottom-0.5 -right-0.5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate leading-tight">
              {session?.user?.name ?? "EduNexus User"}
            </p>
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 group-hover:text-indigo-500/90 dark:group-hover:text-indigo-300 transition-colors truncate leading-tight mt-0.5">
              {session?.user?.email ?? "workspace@edunexus.school"}
            </p>
          </div>

          {/* Hover Tooltip */}
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap dark:bg-slate-800 border border-slate-700/50 z-30">
            View Profile
          </span>
        </Link>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          {/* Back to Home */}
          <Link
            href="/"
            title="Back to Homepage"
            className="flex items-center justify-center gap-1.5 h-7 rounded-md bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-xs transition-colors cursor-pointer text-[11px] font-semibold"
          >
            <Home className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Home</span>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
            title="Logout"
            className="flex items-center justify-center gap-1.5 h-7 rounded-md bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-xs transition-colors cursor-pointer disabled:opacity-50 text-[11px] font-semibold"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const isStudentRoute = pathname.startsWith("/dashboard/student");
  const isTeacherRoute = pathname.startsWith("/dashboard/teacher");
  const isUnauthorized =
    (isStudentRoute || isTeacherRoute) &&
    (!session?.user ||
      (isStudentRoute && rawRole !== "student") ||
      (isTeacherRoute && rawRole !== "teacher"));

  // While checking session or if unauthorized
  if (isPending || isUnauthorized) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isUnauthorized ? "Redirecting..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col lg:flex-row font-sans">
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Top Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr ${roleConfig.accentGradient} text-white shadow-sm`}>
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
              Edu<span className="text-blue-600 dark:text-blue-400">Nexus</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-blue-600" />
              )}
            </button>
          )}

          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
            {userRole}
          </span>
        </div>
      </motion.div>

      {/* Mobile Off-Canvas Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] h-full shadow-2xl"
            >
              <div className="relative h-full">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 z-50 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
                {renderSidebarContent()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar for Desktop */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="hidden lg:flex h-16 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 items-center justify-between sticky top-0 z-20"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Dashboard Workspace
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-semibold">
              {userRole} Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Top Theme Toggle Button */}
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span>Light Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-600" />
                    <span>Dark Mode</span>
                  </div>
                )}
              </button>
            )}

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

            <Link
              href="/profile"
              title="View & Edit Profile"
              className="relative flex items-center gap-2.5 p-1 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                  {session?.user?.name ?? "EduNexus User"}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize leading-tight">
                  {userRole}
                </span>
              </div>

              {/* Hover Tooltip */}
              <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap dark:bg-slate-800 border border-slate-700/50 z-30">
                View Profile
              </span>
            </Link>
          </div>
        </motion.header>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
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
