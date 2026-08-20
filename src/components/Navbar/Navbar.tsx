"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  { label: "Students", href: "/students" },
  { label: "Teachers", href: "/teachers" },
  { label: "Notices", href: "/notices" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  // Entrance animation on mount / sync theme state
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

  // Scroll effect for dynamic shadow adjustment
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  return (
    <header
      className={`fixed top-3 sm:top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
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
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <GraduationCapIcon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Edu<span className="text-blue-600 dark:text-blue-400">Nexus</span>
              </h1>
              {/* <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 mt-1">
                School Management
              </p> */}
            </div>
          </Link>

          {/* Desktop Navigation (Visible on Large devices >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-slate-100/60 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            {navItems.map((item) => {
              const active = checkIsActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${active
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

          {/* Action Buttons & Theme Toggle (Visible on Desktop >= 1024px) */}
          <div className="hidden lg:flex items-center gap-2.5">
            <ThemeToggleButton theme={theme} onToggle={toggleTheme} />

            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
            >
              <LogInIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>Login</span>
            </Link>

            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile & Medium Header Controls (Theme Toggle + Menu Bar Toggle) */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggleButton theme={theme} onToggle={toggleTheme} />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <CloseIcon className="h-5.5 w-5.5 text-blue-600" /> : <MenuIcon className="h-5.5 w-5.5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Medium Navigation Menu Dropdown with Smooth Expand/Collapse Animation */}
        <div
          className={`grid lg:hidden transition-all duration-300 ease-in-out ${isOpen
            ? "grid-rows-[1fr] opacity-100 border-t border-slate-200/80 dark:border-slate-800/80"
            : "grid-rows-[0fr] opacity-0 border-t-0 border-transparent"
            }`}
        >
          <div className={`overflow-hidden px-4 transition-all duration-300 ease-in-out ${isOpen ? "py-3.5 space-y-3" : "py-0 space-y-0"}`}>
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
                      {active && <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />}
                      {item.label}
                    </span>
                    <ChevronRightIcon
                      className={`h-4 w-4 transition-transform ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 opacity-60"
                        }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons in Menu Dropdown */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogInIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all cursor-pointer"
                >
                  <SparklesIcon className="h-4 w-4" />
                  <span className="truncate">Get Started</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


