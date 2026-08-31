"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Award,
  CheckCircle2,
  UserX,
  Coffee,
  Activity,
  Star,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

export default function AdminTeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // টিচার্স ডেটা
  const teachers = [
    {
      id: 1,
      name: "Dr. Anisur Rahman",
      subject: "Mathematics",
      email: "anisur.math@edunexus.edu",
      phone: "+880 1711-223344",
      classes: "Class 11, Class 12",
      status: "Active",
      activityStatus: "In Class", // In Class, Free, Absent
      rating: "4.9",
      totalClassesPerWeek: 18,
      experience: "8 Years",
    },
    {
      id: 2,
      name: "Farhana Yasmin",
      subject: "English Literature",
      email: "farhana.eng@edunexus.edu",
      phone: "+880 1822-334455",
      classes: "Class 9, Class 10",
      status: "Active",
      activityStatus: "Free",
      rating: "4.8",
      totalClassesPerWeek: 15,
      experience: "6 Years",
    },
    {
      id: 3,
      name: "Nazmul Hossain",
      subject: "Physics",
      email: "nazmul.phy@edunexus.edu",
      phone: "+880 1933-445566",
      classes: "Class 10, Class 12",
      status: "Active",
      activityStatus: "In Class",
      rating: "4.7",
      totalClassesPerWeek: 20,
      experience: "10 Years",
    },
    {
      id: 4,
      name: "Taslima Sultana",
      subject: "Chemistry",
      email: "taslima.chem@edunexus.edu",
      phone: "+880 1544-556677",
      classes: "Class 11",
      status: "On Leave",
      activityStatus: "Absent",
      rating: "4.9",
      totalClassesPerWeek: 12,
      experience: "5 Years",
    },
  ];

  // স্ট্যাটিসটিক্স কাউন্ট
  const totalTeachers = 84;
  const presentTeachers = 76;
  const inClassTeachers = 45;
  const freeTeachers = 31;
  const absentTeachers = 8;

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 text-purple-600 dark:text-purple-400 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
              FACULTY MANAGEMENT & ANALYTICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Teachers Overview
            </h1>
          </div>
        </div>

        <button
          onClick={() => alert("Add Teacher Modal trigger")}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Teacher
        </button>
      </motion.div>

      {/* Teacher Status Proportional Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60">Total</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">All Faculty</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalTeachers}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">Present</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Present</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{presentTeachers}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60">Busy</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Class</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{inClassTeachers}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <Coffee className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60">Available</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Free / Break</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{freeTeachers}</h3>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <UserX className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60">Leave</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Absent / Leave</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{absentTeachers}</h3>
          </div>
        </div>
      </div>

      {/* Live Activity Proportion Bar Card */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            Live Faculty Status Proportion
          </h2>
          <span className="text-xs text-slate-500 font-medium">Real-time status breakdown</span>
        </div>

        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5 border border-slate-200/50 dark:border-slate-700">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${(inClassTeachers / totalTeachers) * 100}%` }} title="In Class" />
          <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(freeTeachers / totalTeachers) * 100}%` }} title="Free" />
          <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${(absentTeachers / totalTeachers) * 100}%` }} title="Absent" />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1 font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> In Class ({inClassTeachers})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Free / Available ({freeTeachers})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent / On Leave ({absentTeachers})</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-all shadow-sm backdrop-blur-xl"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            Showing: <strong className="text-purple-600 dark:text-purple-400">{filteredTeachers.length} Teachers</strong>
          </span>
        </div>
      </div>

      {/* Teachers Grid - Enhanced & Proportional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTeachers.map((teacher) => (
          <motion.div
            key={teacher.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-5 relative overflow-hidden"
          >
            {/* Top Row: Avatar, Name, Subject, and Status Badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-500/25">
                    {teacher.name.split(" ").pop()?.charAt(0) || "T"}
                  </div>
                  {/* Status Indicator Dot */}
                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                      teacher.activityStatus === "In Class"
                        ? "bg-blue-600"
                        : teacher.activityStatus === "Free"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {teacher.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                    <span>{teacher.subject} Specialist</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500 dark:text-slate-400">{teacher.experience} Exp</span>
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                  teacher.activityStatus === "In Class"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40"
                    : teacher.activityStatus === "Free"
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40"
                }`}
              >
                {teacher.activityStatus}
              </span>
            </div>

            {/* Middle Section: Contact & Proportional Academic Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
              </div>

              <div className="space-y-2 text-slate-600 dark:text-slate-300 sm:border-l sm:border-slate-100 dark:sm:border-slate-800/80 sm:pl-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Classes: <strong className="text-slate-900 dark:text-white">{teacher.classes}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Workload: <strong className="text-slate-900 dark:text-white">{teacher.totalClassesPerWeek} Classes/wk</strong></span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Rating Badge & Action Button */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/30 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Rating: {teacher.rating} / 5.0</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Viewing profile of ${teacher.name}`)}
                  className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-400 font-bold text-xs transition-all duration-200 cursor-pointer border border-purple-100 dark:border-purple-900/30 shadow-sm"
                >
                  View Profile
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}