"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  Award, 
  Search, 
  Plus, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  BarChart3, 
  FileText,
  GraduationCap
} from "lucide-react";

export default function AdminResultsPage() {
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

  // Sample results records data (API থেকে ডাটা এনে এখানে ম্যাপ করতে পারেন)
  const resultsRecords = [
    { id: "EXM-001", examName: "Mid-Term Examination 2026", class: "Grade 10", publishedDate: "Aug 20, 2026", totalStudents: 120, status: "Published" },
    { id: "EXM-002", examName: "First Term Assessment", class: "Grade 9", publishedDate: "Jul 15, 2026", totalStudents: 135, status: "Published" },
    { id: "EXM-003", examName: "Class Test - Physics", class: "Grade 8", publishedDate: "Pending", totalStudents: 110, status: "Drafting" },
    { id: "EXM-004", examName: "Final Terminal Exam 2025", class: "Grade 10", publishedDate: "Dec 22, 2025", totalStudents: 125, status: "Archived" },
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
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
            ADMIN ACADEMICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Academic Results &amp; Grading
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage exam publications, report cards, and grade distributions.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/results/publish")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Publish New Result
        </button>
      </motion.div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Published Exams</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">18</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average GPA</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">3.85</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pass Rate</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">94.2%</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search exam name or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
            <Filter className="w-4 h-4" /> Filter Status
          </button>
        </div>
      </div>

      {/* Results Table Section */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Exam Result Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4 sm:px-6">Exam Details</th>
                <th className="p-4">Class</th>
                <th className="p-4">Total Students</th>
                <th className="p-4">Published Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-sm">
              {resultsRecords.map((record, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{record.examName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{record.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{record.class}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{record.totalStudents} Students</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{record.publishedDate}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                      record.status === "Published" 
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40" 
                        : record.status === "Drafting"
                        ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer" title="Manage Results">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}