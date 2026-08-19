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

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Students", href: "/students" },
  { label: "Teachers", href: "/teachers" },
  { label: "Notices", href: "/notices" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Entrance animation on mount / page refresh
  useEffect(() => {
    setMounted(true);
  }, []);

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
      className={`fixed top-2 sm:top-3 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 transition-all duration-700 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
        }`}
    >
      <div
        className={`relative mx-auto container rounded-2xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ${scrolled
          ? "shadow-lg shadow-blue-900/5 dark:shadow-black/20 border-slate-300/80 dark:border-slate-700/80"
          : "shadow-md shadow-slate-900/5"
          }`}
      >
        <div className="flex items-center justify-between px-3.5 py-1.5 sm:px-5 sm:py-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-0.5"
          >
            <div className="flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <GraduationCapIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </div>

            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Edu<span className="text-blue-600 dark:text-blue-400">Manage</span>
              </h1>
              <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 mt-0.5">
                School Management
              </p>
            </div>
          </Link>

          {/* Desktop Navigation (Visible on Large devices >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1 bg-slate-100/60 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            {navItems.map((item) => {
              const active = checkIsActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-3 py-1 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${active
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

          {/* Action Buttons (Visible on Desktop >= 1024px) */}
          <div className="hidden lg:flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
              <LogInIcon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>Login</span>
            </button>

            <button className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
              <SparklesIcon className="h-3.5 w-3.5" />
              <span>Get Started</span>
            </button>
          </div>

          {/* Mobile & Medium Menu Toggle Button (Visible on screens < 1024px, including md) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex lg:hidden items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <CloseIcon className="h-5 w-5 text-blue-600" /> : <MenuIcon className="h-5 w-5" />}
          </button>
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
                    className={`flex items-center justify-between px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${active
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

            {/* Mobile Action Buttons */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogInIcon className="h-4 w-4" />
                <span>Login</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all"
              >
                <SparklesIcon className="h-4 w-4" />
                <span>Get Started</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


