"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
    { name: "Register School", href: "/register" },
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
    <footer className="relative w-full bg-slate-50 dark:bg-[#030712] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300 font-sans overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
        
        {/* Main Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14"
        >
          {/* Brand Info Column */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  Edu<span className="text-blue-600 dark:text-blue-500">Nexus</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mt-1.5">
                  SCHOOL MANAGEMENT SYSTEM
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              One school. One platform. Smarter management. Transforming educational operations with an intuitive digital ecosystem.
            </p>

            {/* System Status Pill */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                All Systems Operational
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-900 dark:text-slate-300 tracking-wider uppercase block mb-3">
                CONNECT WITH US
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 hover:border-blue-600 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Nav Links Layout */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* NAVIGATION / PRODUCT */}
            <div>
              <div className="flex items-center gap-2 mb-5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                  NAVIGATION
                </h3>
              </div>
              <ul className="space-y-3 text-sm">
                {productLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`group flex items-center justify-between py-1 transition-all duration-200 ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 transition-transform duration-200 group-hover:translate-x-1">
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-blue-600 dark:text-blue-400" />
                          {link.name}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600 dark:text-blue-400" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* PORTALS */}
            <div>
              <div className="flex items-center gap-2 mb-5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                  PORTALS
                </h3>
              </div>
              <ul className="space-y-3 text-sm">
                {platformLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`group flex items-center justify-between py-1 transition-all duration-200 ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 transition-transform duration-200 group-hover:translate-x-1">
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-blue-600 dark:text-blue-400" />
                          {link.name}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600 dark:text-blue-400" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* TECHNOLOGY */}
            <div>
              <div className="flex items-center gap-2 mb-5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                  TECHNOLOGY
                </h3>
              </div>
              <ul className="space-y-4 text-sm">
                {techStack.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <li key={tech.name} className="group flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-slate-900 dark:text-slate-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block leading-tight">
                          {tech.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-500 block">
                          {tech.desc}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
            <p>ByteCode_Breakers — School Management System · EG13-08</p>
          </div>

          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-medium">
            <Link href="/login" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Admin
            </Link>
            <span className="text-slate-300 dark:text-slate-800">•</span>
            <Link href="/teachers" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Teacher
            </Link>
            <span className="text-slate-300 dark:text-slate-800">•</span>
            <Link href="/students" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Student
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}