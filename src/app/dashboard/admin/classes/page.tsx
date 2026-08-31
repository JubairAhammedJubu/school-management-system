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
  BookmarkCheck,
  Building2,
  GraduationCap,
  UserCheck,
  Filter,
  AlertCircle
} from "lucide-react";

export default function AdminClassesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShift, setSelectedShift] = useState("All");

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

  // ক্লাসের ডাইনামিক ডেটা তালিকা (capacity সহ)
  const classesList = [
    { id: "CLS-01", name: "Grade 8 A", teacher: "Dr. Shafiqul Islam", students: 38, capacity: 40, subjects: 6, room: "Room 201", shift: "Morning" },
    { id: "CLS-02", name: "Grade 8 B", teacher: "Farhana Yasmin", students: 35, capacity: 40, subjects: 6, room: "Room 202", shift: "Morning" },
    { id: "CLS-03", name: "Grade 9 A", teacher: "Mahmud Hasan", students: 42, capacity: 45, subjects: 7, room: "Room 301", shift: "Day" },
    { id: "CLS-04", name: "Grade 10 A", teacher: "Nazmul Hossain", students: 40, capacity: 40, subjects: 8, room: "Room 401", shift: "Morning" },
  ];

  // ফিল্টারিং লজিক (Search & Shift Filter একসাথে কাজ করবে)
  const filteredClasses = classesList.filter((cls) => {
    const matchesSearch = 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesShift = selectedShift === "All" || cls.shift === selectedShift;

    return matchesSearch && matchesShift;
  });

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
        
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
              ADMIN ACADEMICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Class & Section Overview
            </h1>
          </div>
        </div>

        <button
          onClick={() => router.push("/admin/classes/add")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Class
        </button>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60">Total</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Classes</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">12</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60">Sections</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Sections</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">36</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <BookmarkCheck className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">Modules</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Subjects</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">24</h3>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60">Capacity</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg. Class Size</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">38 Students</h3>
          </div>
        </div>
      </div>

      {/* Search and Shift Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search class, teacher or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all shadow-sm backdrop-blur-xl"
          />
        </div>

        {/* Shift Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["All", "Morning", "Day"].map((shift) => (
            <button
              key={shift}
              onClick={() => setSelectedShift(shift)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border shadow-sm shrink-0 ${
                selectedShift === shift
                  ? "bg-amber-600 text-white border-amber-600 shadow-amber-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {shift} Shift
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid Section */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredClasses.map((cls, idx) => {
            const occupancyRate = Math.round((cls.students / cls.capacity) * 100);
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                {/* Top Row: Icon, Name, Room & Shift */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-amber-500/25">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {cls.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{cls.room}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-slate-500 dark:text-slate-400">{cls.shift} Shift</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shadow-sm">
                    {cls.subjects} Subjects
                  </span>
                </div>

                {/* Middle Section: Teacher & Enrolled Info */}
                <div className="py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs space-y-3">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-slate-400" /> Class Teacher:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{cls.teacher}</span>
                  </div>

                  {/* Student Capacity & Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-amber-500" /> Capacity:
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {cls.students} / {cls.capacity} Students ({occupancyRate}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          occupancyRate >= 95 ? "bg-rose-500" : occupancyRate >= 80 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Quick Action Button */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => router.push(`/admin/classes/${cls.id}`)}
                    className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-600 hover:text-white text-amber-600 dark:text-amber-400 font-bold text-xs transition-all duration-200 cursor-pointer border border-amber-100 dark:border-amber-900/30 shadow-sm flex items-center gap-1.5"
                  >
                    <span>Manage Class</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-12 text-center shadow-xl backdrop-blur-xl flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Classes Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            We couldn't find any classes matching your search criteria or selected shift filter.
          </p>
        </div>
      )}
    </div>
  );
}