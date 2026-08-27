"use client";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Globe,
  Mail,
  MessageCircle,
  Users,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/#about" },
  { name: "Students", href: "/students" },
  { name: "Teachers", href: "/teachers" },
  { name: "Notices", href: "/notices" },
  { name: "Contact Us", href: "/contact" },
];

const portals = [
  { name: "Admin Portal", href: "/login" },
  { name: "Teacher Portal", href: "/teachers" },
  { name: "Student Portal", href: "/students" },
];

export default function Footer() {
  const pathname = usePathname();

  // Don't show the public footer inside dashboard pages.
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

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
    <footer className="relative w-full overflow-hidden bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/[0.06] dark:bg-indigo-500/[0.1] blur-[100px]" />

      {/* Wide container */}
      <div className="relative mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Top border */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

        <div className="py-4 sm:py-10 md:py-12">
          {/* Main footer grid */}
          <div className="grid gap-5 md:grid-cols-12 md:gap-10 lg:gap-14 items-start">
            {/* ================================================= */}
            {/* BRAND */}
            {/* ================================================= */}
            <motion.div
              className="md:col-span-6 lg:col-span-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <Link
                href="/"
                className="group inline-flex items-center gap-3"
              >
                {/* Logo */}
                <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] sm:rounded-[12px] bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-[0_6px_20px_rgba(79,70,229,0.3)] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Image
                    src="/second_logo_transparent.png"
                    alt="EduNexus"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain p-[5px] sm:p-[6px]"
                  />
                </div>

                <div>
                  <div className="text-[17px] sm:text-[20px] font-extrabold leading-none tracking-[-0.04em] text-slate-900 dark:text-white">
                    Edu
                    <span className="text-indigo-600 dark:text-indigo-400">Nexus</span>
                  </div>

                  <div className="mt-0.5 sm:mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    School Management System
                  </div>
                </div>
              </Link>

              {/* Description */}
              <p className="mt-2 sm:mt-3.5 max-w-[440px] text-[12px] sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                One school. One platform. Smarter management. EduNexus
                connects students, teachers, and administrators in one
                intelligent digital ecosystem.
              </p>

              {/* System status & Social links row */}
              <div className="mt-2.5 sm:mt-4 flex flex-wrap items-center gap-2.5 sm:gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 dark:border-indigo-900/50 bg-indigo-50/70 dark:bg-indigo-950/60 px-2.5 py-1 sm:px-3 sm:py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  </span>

                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    All systems operational
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <a
                    href="#"
                    aria-label="Community"
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
                  >
                    <Users className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href="#"
                    aria-label="Website"
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href="#"
                    aria-label="Messages"
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href="mailto:contact@edunexus.com"
                    aria-label="Email"
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ================================================= */}
            {/* NAVIGATION & PORTALS SIDE BY SIDE & CENTERED */}
            {/* ================================================= */}
            <div className="md:col-span-6 lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-10 text-center">
              {/* NAVIGATION */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 text-center">
                  Navigation
                </h3>

                <ul className="mt-1.5 sm:mt-3.5 space-y-1 sm:space-y-2 flex flex-col items-center">
                  {navigation.map((item) => (
                    <li key={item.name} className="flex justify-center">
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-slate-600 dark:text-slate-400 transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {item.name}

                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* PORTALS */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.16 }}
              >
                <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 text-center">
                  Portals
                </h3>

                <ul className="mt-1.5 sm:mt-3.5 space-y-1 sm:space-y-2 flex flex-col items-center">
                  {portals.map((item) => (
                    <li key={item.name} className="flex justify-center">
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-slate-600 dark:text-slate-400 transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {item.name}

                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/login"
                  className="group mt-2.5 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
                >
                  Get Started

                  <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
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
        </div>
      </div>
    </footer>
  );
}
