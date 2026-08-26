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

  return (
    <footer className="relative w-full overflow-hidden bg-white text-slate-600">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.045] blur-[130px]" />

      {/* Wide container */}
      <div className="relative mx-auto w-full max-w-[1600px] px-8 sm:px-10 lg:px-16 xl:px-20">
        {/* Top border */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="py-16 sm:py-20">
          {/* Main footer grid */}
          <div className="grid gap-12 md:grid-cols-12 md:gap-16 lg:gap-24">
            {/* ================================================= */}
            {/* BRAND */}
            {/* ================================================= */}
            <motion.div
              className="md:col-span-5 lg:col-span-5"
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
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-[#2864ff] to-[#4c3df5] shadow-[0_8px_24px_rgba(49,92,255,0.22)] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Image
                    src="/second_logo_transparent.png"
                    alt="EduNexus"
                    fill
                    sizes="48px"
                    className="object-contain p-[7px]"
                  />
                </div>

                <div>
                  <div className="text-[23px] font-extrabold leading-none tracking-[-0.04em] text-[#111827]">
                    Edu
                    <span className="text-[#315cff]">Nexus</span>
                  </div>

                  <div className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    School Management System
                  </div>
                </div>
              </Link>

              {/* Description */}
              <p className="mt-6 max-w-[470px] text-[13px] leading-6 text-slate-500 sm:text-[14px]">
                One school. One platform. Smarter management. EduNexus
                connects students, teachers, and administrators in one
                intelligent digital ecosystem.
              </p>

              {/* System status */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3.5 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>

                <span className="text-[10px] font-semibold text-blue-600">
                  All systems operational
                </span>
              </div>

              {/* Social links */}
              <div className="mt-7">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Connect with us
                </p>

                <div className="flex items-center gap-2.5">
                  <a
                    href="#"
                    aria-label="Community"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                  >
                    <Users className="h-4 w-4" />
                  </a>

                  <a
                    href="#"
                    aria-label="Website"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                  >
                    <Globe className="h-4 w-4" />
                  </a>

                  <a
                    href="#"
                    aria-label="Messages"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>

                  <a
                    href="mailto:contact@edunexus.com"
                    aria-label="Email"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ================================================= */}
            {/* NAVIGATION */}
            {/* ================================================= */}
            <motion.div
              className="md:col-span-3 lg:col-span-3"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Navigation
              </h3>

              <ul className="mt-5 space-y-3.5">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-600"
                    >
                      {item.name}

                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ================================================= */}
            {/* PORTALS */}
            {/* ================================================= */}
            <motion.div
              className="md:col-span-4 lg:col-span-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.16 }}
            >
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Portals
              </h3>

              <ul className="mt-5 space-y-3.5">
                {portals.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-600"
                    >
                      {item.name}

                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/register"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2864ff] to-[#4c3df5] px-5 py-2.5 text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(49,92,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(49,92,255,0.25)]"
              >
                Get Started

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* ================================================= */}
          {/* BOTTOM BAR */}
          {/* ================================================= */}
          <div className="mt-14 border-t border-slate-100 pt-6">
            <div className="flex flex-col gap-4 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} EduNexus. All rights reserved.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-blue-600"
                >
                  Privacy
                </Link>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <Link
                  href="/terms"
                  className="transition-colors hover:text-blue-600"
                >
                  Terms
                </Link>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <span>Built for smarter schools</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}