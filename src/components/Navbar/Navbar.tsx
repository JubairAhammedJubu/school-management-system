"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useSession, signOut } from "@/lib/auth-client";

// Lightweight, self-contained SVG Icon Components
const GraduationCapIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M22 10v6m-10-6v10m0-10L2 6l10-4 10 4-10 4zM4 9.5V16c0 1.657 3.582 3 8 3s8-1.343 8-3V9.5"
    />
  </svg>
);

const MenuIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChevronRightIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const ChevronDownIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const DashboardIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const UserProfileIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LogInIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);

const LogOutIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const SparklesIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const SunIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
}

const ThemeToggleButton: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      type="button"
      className={`relative inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-100/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-95 group cursor-pointer ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <SunIcon
          className={`absolute transition-all duration-500 transform ${theme === "dark"
            ? "opacity-0 rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100 text-amber-500"
            }`}
        />
        <MoonIcon
          className={`absolute transition-all duration-500 transform ${theme === "dark"
            ? "opacity-100 rotate-0 scale-100 text-blue-400"
            : "opacity-0 -rotate-90 scale-50"
            }`}
        />
      </div>
    </button>
  );
};

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About US", href: "/about" },
  { label: "Students", href: "/dashboard/student" },
  { label: "Teachers", href: "/dashboard/teacher" },
  { label: "Notices", href: "/notices" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const userRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();
  const dashboardHref = "/dashboard/teacher";
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully.");
      setShowLogoutModal(false);
      setShowUserDropdown(false);
      setIsOpen(false);
      window.location.href = "/";
    } catch (err) {
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Entrance animation on mount / sync theme state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Scroll effect for dynamic shadow adjustment
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu, user dropdown, and modal on ESC key press or outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowLogoutModal(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Helper to determine if a route is currently active
  const checkIsActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("#")) {
      return false;
    }
    return pathname?.startsWith(href) ?? false;
  };

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-3 sm:top-4 left-0 right-0 z-50 px-4 sm:px-5 md:px-4 lg:px-6 transition-all duration-700 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
      >
        <div
          className={`relative container mx-auto container w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ${scrolled
            ? "shadow-lg shadow-blue-900/5 dark:shadow-black/20 border-slate-300/80 dark:border-slate-700/80"
            : "shadow-md shadow-slate-900/5"
            }`}
        >
          <div className="flex items-center justify-between px-4 py-2 sm:px-5 sm:py-2.5 lg:py-3">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-0.5 cursor-pointer"
            >
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/second_logo_transparent.png"
                  alt="EduNexus Logo"
                  fill
                  sizes="(max-width: 640px) 36px, 40px"
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  Edu
                  <span className="text-blue-600 dark:text-blue-400">Nexus</span>
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation (Visible on Large devices >= 1024px) */}
            <nav className="hidden lg:flex items-center gap-1 lg:gap-1.5 bg-slate-100/60 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              {navItems.map((item) => {
                const active = checkIsActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative px-3.5 py-1.5 lg:px-4 lg:py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${active
                      ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-slate-900/40"
                      }`}
                  >
                    {item.label}
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons (Visible on Large devices >= 1024px) */}
            <div className="hidden lg:flex items-center gap-2.5">
              <ThemeToggleButton theme={theme} onToggle={toggleTheme} />

              {!mounted || isPending ? (
                /* Skeleton Loader when logging in / checking session */
                <div className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 animate-pulse">
                  <div className="h-7 w-7 rounded-lg bg-slate-300/80 dark:bg-slate-700/80 shrink-0" />
                  <div className="h-3.5 w-16 rounded bg-slate-300/80 dark:bg-slate-700/80" />
                  <div className="h-3 w-3 rounded bg-slate-300/80 dark:bg-slate-700/80" />
                </div>
              ) : session ? (
                /* User Dropdown Button */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="User menu"
                    aria-expanded={showUserDropdown}
                  >
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                      {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                      {session.user.name?.split(" ")[0] ?? "User"}
                    </span>
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${showUserDropdown ? "rotate-180 text-blue-600" : ""
                        }`}
                    />
                  </button>

                  {/* Desktop User Dropdown Popover */}
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
                      >
                        {/* User Header */}
                        <div className="px-3 py-2.5 mb-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                              {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-snug">
                                {session.user.name ?? "User"}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-snug">
                                {session.user.email}
                              </p>
                            </div>
                          </div>
                          {(session.user as { role?: string }).role && (
                            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-md border border-blue-200/50 dark:border-blue-900/50">
                              {(session.user as { role?: string }).role}
                            </span>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <Link
                            href={dashboardHref}
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            <DashboardIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span>Dashboard</span>
                          </Link>

                          <Link
                            href="/profile"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            <UserProfileIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span>Profile</span>
                          </Link>

                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                          <button
                            onClick={() => {
                              setShowUserDropdown(false);
                              setShowLogoutModal(true);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <LogOutIcon className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer group"
                >
                  <SparklesIcon className="h-4 w-4 text-blue-200 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Get Started</span>
                </Link>
              )}
            </div>

            {/* Mobile Header Controls (Theme Toggle + Menu Toggle) */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggleButton theme={theme} onToggle={toggleTheme} />

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <CloseIcon className="h-5.5 w-5.5 text-blue-600" />
                ) : (
                  <MenuIcon className="h-5.5 w-5.5" />
                )}
              </button>
            </div>
          </div>

          {/* Compact Navigation Menu Dropdown with Smooth Expand/Collapse Animation */}
          <div
            className={`grid lg:hidden transition-all duration-300 ease-in-out ${isOpen
              ? "grid-rows-[1fr] opacity-100 border-t border-slate-200/80 dark:border-slate-800/80"
              : "grid-rows-[0fr] opacity-0 border-t-0 border-transparent"
              }`}
          >
            <div
              className={`overflow-hidden px-4 transition-all duration-300 ease-in-out ${isOpen ? "py-3.5 space-y-3" : "py-0 space-y-0"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {navItems.map((item) => {
                  const active = checkIsActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${active
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold"
                        : "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                        )}
                        {item.label}
                      </span>
                      <ChevronRightIcon
                        className={`h-4 w-4 transition-transform ${active
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400 opacity-60"
                          }`}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Action Buttons in Menu Dropdown (For small and medium devices when logged in) */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
                {!mounted || isPending ? (
                  /* Skeleton Loader for Mobile Menu Dropdown */
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 animate-pulse">
                    <div className="h-8 w-8 rounded-lg bg-slate-300/80 dark:bg-slate-700/80 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-24 rounded bg-slate-300/80 dark:bg-slate-700/80" />
                      <div className="h-2.5 w-32 rounded bg-slate-200/80 dark:bg-slate-800/80" />
                    </div>
                  </div>
                ) : session ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                        {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">
                          {session.user.name ?? "User"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-tight">
                          {session.user.email}
                        </p>
                      </div>
                      {(session.user as { role?: string }).role && (
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-md shrink-0">
                          {(session.user as { role?: string }).role}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <DashboardIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <UserProfileIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>Profile</span>
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 px-3.5 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                    >
                      <LogOutIcon className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer group"
                  >
                    <SparklesIcon className="h-4 w-4 text-blue-200 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Get Started</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 min-h-screen w-screen">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isLoggingOut && setShowLogoutModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[9999]"
            />

            {/* Modal Card Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center z-[10000] my-auto"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shadow-inner">
                <LogOutIcon className="h-7 w-7" />
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
                      <LogOutIcon className="h-4 w-4" />
                      <span>Log Out</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
