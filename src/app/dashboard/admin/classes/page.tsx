"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Users, 
  Layers, 
  ArrowUpRight, 
  GraduationCap,
  BookmarkCheck
} from "lucide-react";

export default function AdminClassesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  if (isPending) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (!session?.user || rawRole !== "admin") {
    return null;
  }

  // Sample classes data (API থেকে ডাটা এনে এখানে ম্যাপ করতে পারেন)
  const classesList = [
    { id: "CLS-01", name: "Grade 8 A", teacher: "Dr. Shafiqul Islam", students: 38, subjects: 6, room: "Room 201" },
    { id: "CLS-02", name: "Grade 8 B", teacher: "Farhana Yasmin", students: 35, subjects: 6, room: "Room 202" },
    { id: "CLS-03", name: "Grade 9 A", teacher: "Mahmud Hasan", students: 42, subjects: 7, room: "Room 301" },
    { id: "CLS-04", name: "Grade 10 A", teacher: "Nazmul Hossain", students: 40, subjects: 8, room: "Room 401" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
            ADMIN ACADEMICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Class &amp; Section Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage school classes, section schedules, and subject allocations.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/classes/add")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Class
        </button>
      </motion.div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Classes</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">12</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Sections</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">36</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Subjects</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">24</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <BookmarkCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search class or section name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Classes Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {classesList.map((cls, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cls.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cls.room}</p>
                </div>
              </div>
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                {cls.subjects} Subjects
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-500 dark:text-slate-400">Class Teacher:</span>
                <span className="font-semibold">{cls.teacher}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-500 dark:text-slate-400">Enrolled Students:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{cls.students} Students</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 dark:hover:text-amber-400 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer">
                Manage Class <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}