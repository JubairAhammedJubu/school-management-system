"use client";

import { useEffect, useState } from "react";
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
  ShieldCheck,
  Sparkles,
  Lock,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

type Role = "admin" | "teacher" | "student";

const DASHBOARD_HREF: Record<Role, string> = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
};

const PORTALS: { name: string; role: Role }[] = [
  { name: "Admin Portal", role: "admin" },
  { name: "Teacher Portal", role: "teacher" },
  { name: "Student Portal", role: "student" },
];

export default function Footer() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show the public footer inside dashboard pages.
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  // Treat "not yet resolved" the same as "logged out" until the session
  // settles, so the server-rendered footer and the first client render
  // match (no hydration mismatch) and no link briefly flashes disabled.
  const isReady = mounted && !isPending;
  const userRole = isReady
    ? ((session?.user as { role?: string } | undefined)?.role?.toLowerCase() as
        | Role
        | undefined)
    : undefined;
  const isLoggedIn = isReady && Boolean(userRole);

  // "Students" / "Teachers" go to that role's own dashboard once the
  // visitor is logged in as that role; otherwise they stay pointed at
  // the public info page.
  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    {
      name: "Students",
      href: userRole === "student" ? DASHBOARD_HREF.student : "/students",
    },
    {
      // Teacher's own dashboard if logged in as a teacher; a student is
      // explicitly not allowed to browse the Teachers area, so send them
      // to the unauthorized page instead of the public info page; anyone
      // else (logged out, or another role) goes to login.
      name: "Teachers",
      href:
        userRole === "teacher"
          ? DASHBOARD_HREF.teacher
          : userRole === "student"
            ? "/unauthorized"
            : "/login",
    },
    { name: "Notices", href: "/notices" },
    { name: "Contact Us", href: "/contact" },
  ];

  const ctaHref = isLoggedIn ? DASHBOARD_HREF[userRole as Role] : "/login";
  const ctaLabel = isLoggedIn ? "Go to Dashboard" : "Get Started";

  return (
    <footer className="relative w-full overflow-hidden bg-slate-50 dark:bg-black text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      {/* Background ambient glowing shapes for depth */}
      <div className="pointer-events-none absolute left-1/4 -top-24 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 -bottom-24 h-[300px] w-[500px] translate-x-1/2 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px]" />

      {/* Wide container */}
      <div className="relative mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="py-12 sm:py-16 lg:py-20">
          {/* Main footer grid */}
          <div className="grid gap-10 md:grid-cols-12 lg:gap-14 items-start">
            
            {/* ================================================= */}
            {/* BRAND SECTION */}
            {/* ================================================= */}
            <motion.div
              className="md:col-span-6 lg:col-span-6 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="group inline-flex items-center gap-3.5">
                {/* Logo with transparent support and aspect ratio fixes */}
                <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/second_logo_transparent.png"
                    alt="EduNexus"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain drop-shadow-md"
                  />
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Edu<span className="text-indigo-600 dark:text-indigo-400">Nexus</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    School Management System
                  </div>
                </div>
              </Link>

              {/* Description */}
              <p className="max-w-[460px] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                One school. One platform. Smarter management. EduNexus seamlessly connects students, teachers, and administrators within a unified, high-performance digital ecosystem.
              </p>

              {/* System status & Social links row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-50/80 dark:bg-emerald-950/40 px-3.5 py-1.5 backdrop-blur-md shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    All Systems Operational
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { icon: Users, href: "#", label: "Community" },
                    { icon: Globe, href: "#", label: "Website" },
                    { icon: MessageCircle, href: "#", label: "Messages" },
                    { icon: Mail, href: "mailto:contact@edunexus.com", label: "Email" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={idx}
                        href={item.href}
                        aria-label={item.label}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/20"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* ================================================= */}
            {/* NAVIGATION & PORTALS SIDE BY SIDE */}
            {/* ================================================= */}
            <div className="md:col-span-6 lg:col-span-6 grid grid-cols-2 gap-8 text-left bg-white/60 dark:bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none">
              
              {/* NAVIGATION */}
              <motion.div
                className="flex flex-col space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Navigation
                </h3>

                <ul className="space-y-2.5">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* PORTALS */}
              <motion.div
                className="flex flex-col space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Portals & Access
                </h3>

                <ul className="space-y-2.5">
                  {PORTALS.map((portal) => {
                    // Not logged in: every portal just goes to login.
                    if (!isLoggedIn) {
                      return (
                        <li key={portal.name}>
                          <Link
                            href="/login"
                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-colors" />
                            {portal.name}
                          </Link>
                        </li>
                      );
                    }

                    // Logged in as this portal's own role: go straight to
                    // that dashboard.
                    if (userRole === portal.role) {
                      return (
                        <li key={portal.name}>
                          <Link
                            href={DASHBOARD_HREF[portal.role]}
                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 transition-all duration-200 hover:translate-x-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                            {portal.name}
                          </Link>
                        </li>
                      );
                    }

                    // Logged in as a different role: this portal is locked.
                    return (
                      <li key={portal.name}>
                        <span
                          aria-disabled="true"
                          title="Not accessible with your current account role"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                          {portal.name}
                          <Lock className="h-3 w-3" />
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* CTA Button Inside Portals Box */}
                <div className="pt-2">
                  <Link
                    href={ctaHref}
                    className="group inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40 active:translate-y-0"
                  >
                    <span>{ctaLabel}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ================================================= */}
          {/* BOTTOM BAR */}
          {/* ================================================= */}
          <div className="mt-12 sm:mt-16 border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="flex flex-col gap-4 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-1.5">
                <span>© {new Date().getFullYear()} EduNexus. All rights reserved.</span>
              </p>

              <div className="flex flex-wrap items-center gap-6 font-medium">
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Privacy Policy
                </Link>

                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />

                <Link
                  href="/terms"
                  className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Terms of Service
                </Link>

                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />

                <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Built for smarter schools
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}