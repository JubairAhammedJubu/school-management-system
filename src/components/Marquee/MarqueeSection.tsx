"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import {
  Building2,
  Award,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  GraduationCap,
  Zap,
  Globe2,
} from "lucide-react";

interface PartnerInstitution {
  name: string;
  type: string;
  badge: string;
  icon: React.ReactNode;
}

const partners: PartnerInstitution[] = [
  {
    name: "St. Xavier's International Academy",
    type: "K-12 Education",
    badge: "5,000+ Students",
    icon: <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  },
  {
    name: "Oakridge Global School",
    type: "IB World School",
    badge: "Top Rated",
    icon: <Award className="w-5 h-5 text-amber-500" />,
  },
  {
    name: "Cambridge Higher Secondary",
    type: "Academic Excellence",
    badge: "AI Powered",
    icon: <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    name: "Greenwood Hall Institution",
    type: "Public School District",
    badge: "100% Automated",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
  },
  {
    name: "Beaconhouse National School",
    type: "Multicampus Network",
    badge: "99.9% Uptime",
    icon: <Globe2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
  },
  {
    name: "Apex STEM Academy",
    type: "Science & Tech",
    badge: "Smart Analytics",
    icon: <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
  },
  {
    name: "Heritage Model College",
    type: "Higher Education",
    badge: "Verified Partner",
    icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
  },
  {
    name: "Horizon International Campus",
    type: "Global Campus",
    badge: "Active Portal",
    icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
  },
];

const statsPills = [
  { label: "500+ Institutions Trust EduNexus", icon: <Users className="w-4 h-4 text-blue-500" /> },
  { label: "Real-time Attendance Sync", icon: <Zap className="w-4 h-4 text-amber-500" /> },
  { label: "AI Student At-Risk Prediction", icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
  { label: "99.99% Server Reliability", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
];

const MarqueeSection: React.FC = () => {
  return (
    <section className="relative w-full py-12 bg-slate-50/80 dark:bg-slate-950/80 border-y border-slate-200/80 dark:border-slate-800/80 overflow-hidden font-sans transition-colors duration-500">
      
      {/* Header Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 shadow-sm backdrop-blur-md"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>POWERING 500+ ACADEMIC INSTITUTIONS NATIONWIDE</span>
        </motion.div>
      </div>

      {/* Main Marquee Ticker */}
      <div className="relative w-full">
        {/* Gradient Blurs for Light and Dark Modes */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        <Marquee
          speed={45}
          gradient={false}
          className="py-2 flex items-center"
        >
          {partners.map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="mx-3 sm:mx-4 group cursor-pointer"
            >
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 px-5 py-3.5 shadow-md hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 backdrop-blur-xl transform group-hover:-translate-y-1">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 group-hover:scale-110 transition-transform duration-200">
                  {partner.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {partner.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {partner.type}
                    </span>
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/40">
                      {partner.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Reverse Sub-Marquee Stats Pills */}
      <div className="relative w-full mt-6">
        <Marquee
          speed={30}
          direction="right"
          gradient={false}
          className="py-1"
        >
          {statsPills.map((pill, i) => (
            <div key={i} className="mx-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-900/60 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-sm">
                {pill.icon}
                <span>{pill.label}</span>
              </span>
            </div>
          ))}
        </Marquee>
      </div>

    </section>
  );
};

export default MarqueeSection;
