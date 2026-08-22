"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Teachers", href: "/dashboard/teachers", icon: Users },
  { label: "Students", href: "/dashboard/students", icon: GraduationCap },
  { label: "Classes", href: "/dashboard/classes", icon: BookOpen },
  { label: "Results", href: "/dashboard/results", icon: Award },
  { label: "Fees", href: "/dashboard/fees", icon: CreditCard },
  { label: "Notices", href: "/dashboard/notices", icon: Bell },
];

const teacherRoutes: RouteItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Classes", href: "/dashboard/my-classes", icon: BookOpen },
  { label: "Assignments", href: "/dashboard/assignments", icon: FileText },
  { label: "Results", href: "/dashboard/results", icon: Award },
  { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { label: "Students", href: "/dashboard/students", icon: GraduationCap },
];

const studentRoutes: RouteItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { label: "Results", href: "/dashboard/results", icon: Award },
  { label: "Assignments", href: "/dashboard/assignments", icon: FileText },
  { label: "Fees", href: "/dashboard/fees", icon: CreditCard },
  { label: "Notices", href: "/dashboard/notices", icon: Bell },
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

  const currentRoutes =
    userRole === "admin"
      ? adminRoutes
      : userRole === "teacher"
      ? teacherRoutes
      : studentRoutes;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully.");
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

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Sidebar Header / Brand */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              Edu<span className="text-blue-600 dark:text-blue-400">Nexus</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Workspace
            </span>
          </div>
        </Link>
        <span
          className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${roleBadge.color}`}
        >
          {roleBadge.label}
        </span>
      </div>

      {/* User Quick Overview */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
            {session?.user?.name ?? "EduNexus User"}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            {session?.user?.email ?? "workspace@edunexus.school"}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Menu Navigation
        </div>
        {currentRoutes.map((route) => {
          const Icon = route.icon;
          const isActive =
            route.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(route.href);

          return (
            <Link
              key={route.label}
              href={route.href}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 dark:bg-blue-600"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                />
                <span>{route.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 text-white/80" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions (Home & Logout) */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 bg-slate-50/50 dark:bg-slate-900/50">
        <Link
          href="/"
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-sm cursor-pointer"
        >
          <Home className="h-4 w-4 text-blue-500" />
          <span>Back to Home</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 text-rose-500" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col lg:flex-row font-sans">
      {/* Desktop Permanent Left Sidebar (Large Screens Only) */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0 z-30">
        {renderSidebarContent()}
      </aside>

      {/* Mobile & Tablet Top Bar (Small & Medium Screens) */}
      <div className="lg:hidden sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              Edu<span className="text-blue-600 dark:text-blue-400">Nexus</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Top Theme Toggle Button */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-blue-600" />
              )}
            </button>
          )}

          <span
            className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${roleBadge.color}`}
          >
            {roleBadge.label}
          </span>
        </div>
      </div>

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
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full shadow-2xl"
            >
              <div className="relative h-full">
                {/* Close Button Inside Mobile Drawer */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 z-50 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
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
        {/* Top Header Bar for Desktop (Theme Toggle & Top Status) */}
        <header className="hidden lg:flex h-16 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Dashboard Workspace
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {userRole} Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Very Top Theme Toggle Button */}
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                aria-label="Toggle light/dark theme"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-blue-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            )}

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {session?.user?.name ?? "EduNexus User"}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize leading-tight">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
