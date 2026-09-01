"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Search, 
  UserPlus, 
  ArrowUpRight, 
  CheckCircle2, 
  Users,
  Mail,
  Phone,
  BookOpen,
  Award,
  ShieldCheck,
  CalendarDays,
  UserX,
  Coffee,
  Activity
} from "lucide-react";

export default function AdminStudentsPage() {
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

  // স্টুডেন্ট ডেটা
  const students = [
    { 
      id: "STU-001", 
      name: "Tanvir Ahmed", 
      email: "tanvir@edunexus.std.com", 
      phone: "+880 1611-112233",
      grade: "Grade 10 A", 
      attendance: "95%", 
      status: "Active",
      gpa: "3.95",
      guardian: "Abdul Karim"
    },
    { 
      id: "STU-002", 
      name: "Nusrat Jahan", 
      email: "nusrat@edunexus.std.com", 
      phone: "+880 1722-223344",
      grade: "Grade 9 B", 
      attendance: "91%", 
      status: "Active",
      gpa: "3.80",
      guardian: "Rafiqul Islam"
    },
    { 
      id: "STU-003", 
      name: "Rakibul Islam", 
      email: "rakib@edunexus.std.com", 
      phone: "+880 1833-334455",
      grade: "Grade 8 A", 
      attendance: "88%", 
      status: "Inactive",
      gpa: "3.40",
      guardian: "Nurul Huda"
    },
    { 
      id: "STU-004", 
      name: "Sadia Sultana", 
      email: "sadia@edunexus.std.com", 
      phone: "+880 1944-445566",
      grade: "Grade 10 B", 
      attendance: "96%", 
      status: "Active",
      gpa: "4.00",
      guardian: "Monir Hossain"
    },
  ];

  // স্ট্যাটিসটিক্স কাউন্ট
  const totalStudents = 1240;
  const activeStudents = 1195;
  const inactiveStudents = 45;
  const avgAttendance = "94.2%";

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              STUDENT MANAGEMENT & ANALYTICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Student Overview
            </h1>
          </div>
        </div>

        <button
          onClick={() => router.push("/admin/students/add")}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add New Student
        </button>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60">Total</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enrolled Students</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalStudents}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">Active</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Students</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeStudents}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60">Rate</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg. Attendance</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{avgAttendance}</h3>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <UserX className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60">Inactive</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inactive Students</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{inactiveStudents}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID or grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all shadow-sm backdrop-blur-xl"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            Showing: <strong className="text-blue-600 dark:text-blue-400">{filteredStudents.length} Students</strong>
          </span>
        </div>
      </div>

      {/* Students Grid - Enhanced & Proportional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredStudents.map((student, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-5 relative overflow-hidden"
          >
            {/* Top Row: Avatar, Name, ID, and Status Badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/25">
                    {student.name.charAt(0)}
                  </div>
                  {/* Status Indicator Dot */}
                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                      student.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {student.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                    <span>{student.id}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500 dark:text-slate-400">Guardian: {student.guardian}</span>
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                  student.status === "Active"
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40"
                }`}
              >
                {student.status}
              </span>
            </div>

            {/* Middle Section: Contact & Academic Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{student.phone}</span>
                </div>
              </div>

              <div className="space-y-2 text-slate-600 dark:text-slate-300 sm:border-l sm:border-slate-100 dark:sm:border-slate-800/80 sm:pl-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Class: <strong className="text-slate-900 dark:text-white">{student.grade}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Attendance: <strong className="text-slate-900 dark:text-white">{student.attendance}</strong></span>
                </div>
              </div>
            </div>

            {/* Bottom Row: GPA Badge & Action Button */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/30 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                <span>Current GPA: {student.gpa}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/students/${student.id}`)}
                  className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 font-bold text-xs transition-all duration-200 cursor-pointer border border-blue-100 dark:border-blue-900/30 shadow-sm flex items-center gap-1.5"
                >
                  <span>View Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}