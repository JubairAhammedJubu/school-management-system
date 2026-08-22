"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  GraduationCap,
  Code2,
  Database,
  Layers,
  ChevronRight,
} from "lucide-react";

// Custom SVG Icons for Brands
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();

  const productLinks = [
    { name: "Home", href: "/" },
    { name: "Students", href: "/students" },
    { name: "Teachers", href: "/teachers" },
    { name: "Notices", href: "/notices" },
    { name: "Contact Us", href: "/contact" },
  ];

  const platformLinks = [
    { name: "Admin Portal", href: "/login" },
    { name: "Teacher Portal", href: "/teachers" },
    { name: "Student Portal", href: "/students" },
    { name: "Register School", href: "/login" },
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/JubairAhammedJubu/school-management-system", icon: GithubIcon },
    { name: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
    { name: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  ];

  const techStack = [
    { name: "Next.js 15", desc: "App Router & SSR", icon: Code2 },
    { name: "PostgreSQL", desc: "Relational DB", icon: Database },
    { name: "Prisma ORM", desc: "Type-safe Client", icon: Layers },
  ];

  return (
    <footer className="relative w-full pt-5 sm:pt-10 pb-4 sm:pb-5 bg-slate-50 dark:bg-[#030712] text-slate-600 dark:text-slate-400 transition-colors duration-500 font-sans overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative container mx-auto px-3 sm:px-0 md:px-0 xl:px-8 z-10">
        {/* Rounded Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl p-4 sm:p-10 lg:p-12 relative overflow-hidden"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[3px] bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full" />

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-10 lg:gap-12 pb-5 sm:pb-12">
            {/* Brand Info Column */}
            <div className="md:col-span-5 lg:col-span-4 space-y-3 sm:space-y-6 flex flex-col items-center sm:items-start text-center sm:text-left">
              <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
                <div className="relative w-8 h-8 sm:w-11 sm:h-11 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/second_logo_transparent.png"
                    alt="EduNexus Logo"
                    fill
                    sizes="(max-width: 640px) 32px, 44px"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                    Edu
                    <span className="text-blue-600 dark:text-blue-500">
                      Nexus
                    </span>
                  </span>
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mt-0.5 sm:mt-1">
                    SCHOOL MANAGEMENT SYSTEM
                  </span>
                </div>
              </Link>

              <p className="text-[11px] sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
                One school. One platform. Smarter management. Transforming
                educational operations with an intuitive digital ecosystem.
              </p>

              {/* System Status Pill */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  All Systems Operational
                </div>
              </div>

              {/* Social Icons */}
              <div className="pt-0 sm:pt-1">
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-900 dark:text-slate-300 tracking-wider uppercase block mb-1.5 sm:mb-2.5">
                  CONNECT WITH US
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
                  {socialLinks.map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 hover:border-blue-600 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 shadow-xs"
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: idx * 0.08 }}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Nav Links Layout */}
            <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
              {/* NAVIGATION / PRODUCT */}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 pb-1.5 sm:mb-4 sm:pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                    NAVIGATION
                  </h3>
                </div>
                <ul className="space-y-1.5 sm:space-y-3 text-[11px] sm:text-sm flex flex-col items-center sm:items-start">
                  {productLinks.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                      <li key={link.name} className="w-full">
                        <Link
                          href={link.href}
                          className={`group flex items-center justify-center sm:justify-between py-0.5 transition-all duration-200 ${isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white"
                            }`}
                        >
                          <span className="flex items-center gap-1.5 transition-transform duration-200 group-hover:translate-x-1">
                            {link.name}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600 dark:text-blue-400 hidden sm:block" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* PORTALS */}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 pb-1.5 sm:mb-4 sm:pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                    PORTALS
                  </h3>
                </div>
                <ul className="space-y-1.5 sm:space-y-3 text-[11px] sm:text-sm flex flex-col items-center sm:items-start">
                  {platformLinks.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                      <li key={link.name} className="w-full">
                        <Link
                          href={link.href}
                          className={`group flex items-center justify-center sm:justify-between py-0.5 transition-all duration-200 ${isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white"
                            }`}
                        >
                          <span className="flex items-center gap-1.5 transition-transform duration-200 group-hover:translate-x-1">
                            {link.name}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600 dark:text-blue-400 hidden sm:block" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* TECHNOLOGY */}
              <div className="hidden md:block col-span-2 sm:col-span-1 pt-2 sm:pt-0 text-center sm:text-left">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                    TECHNOLOGY
                  </h3>
                </div>
                <ul className="grid grid-cols-1 gap-3 text-xs sm:text-sm">
                  {techStack.map((tech) => {
                    const Icon = tech.icon;
                    return (
                      <li
                        key={tech.name}
                        className="group flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div>
                          <span className="text-slate-900 dark:text-slate-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block leading-tight text-xs sm:text-sm">
                            {tech.name}
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-500 block">
                            {tech.desc}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-4 sm:pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-[10px] sm:text-xs text-slate-500 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse shrink-0" />
              <p>ByteCode_Breakers — School Management System · EG13-08</p>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2.5 sm:gap-4 text-slate-600 dark:text-slate-400 font-medium">
              <Link
                href="/login"
                className="hover:text-blue-600 dark:hover:text-white transition-colors"
              >
                Admin
              </Link>
              <span className="text-slate-300 dark:text-slate-800">•</span>
              <Link
                href="/teachers"
                className="hover:text-blue-600 dark:hover:text-white transition-colors"
              >
                Teacher
              </Link>
              <span className="text-slate-300 dark:text-slate-800">•</span>
              <Link
                href="/students"
                className="hover:text-blue-600 dark:hover:text-white transition-colors"
              >
                Student
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}