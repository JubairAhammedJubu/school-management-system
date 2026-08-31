"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {  
  Award, 
  Search, 
  Plus, 
  ArrowUpRight, 
  BarChart3, 
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users
} from "lucide-react";

export default function AdminResultsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

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

  // Sample results records data with pass/fail and grade point distribution
  const resultsRecords = [
    { 
      id: "EXM-001", 
      examName: "Mid-Term Examination 2026", 
      class: "Grade 10", 
      publishedDate: "Aug 20, 2026", 
      totalStudents: 120, 
      passed: 112, 
      failed: 8, 
      passRate: 93.3, 
      avgGpa: 3.85,
      gradePoints: { gpa5: 45, gpa4: 50, gpa3: 17, gpaBelow3: 8 },
      status: "Published" 
    },
    { 
      id: "EXM-002", 
      examName: "First Term Assessment", 
      class: "Grade 9", 
      publishedDate: "Jul 15, 2026", 
      totalStudents: 135, 
      passed: 130, 
      failed: 5, 
      passRate: 96.3, 
      avgGpa: 3.92,
      gradePoints: { gpa5: 60, gpa4: 55, gpa3: 15, gpaBelow3: 5 },
      status: "Published" 
    },
    { 
      id: "EXM-003", 
      examName: "Class Test - Physics", 
      class: "Grade 8", 
      publishedDate: "Pending", 
      totalStudents: 110, 
      passed: 98, 
      failed: 12, 
      passRate: 89.0, 
      avgGpa: 3.45,
      gradePoints: { gpa5: 30, gpa4: 45, gpa3: 23, gpaBelow3: 12 },
      status: "Drafting" 
    },
    { 
      id: "EXM-004", 
      examName: "Final Terminal Exam 2025", 
      class: "Grade 10", 
      publishedDate: "Dec 22, 2025", 
      totalStudents: 125, 
      passed: 115, 
      failed: 10, 
      passRate: 92.0, 
      avgGpa: 3.78,
      gradePoints: { gpa5: 40, gpa4: 50, gpa3: 25, gpaBelow3: 10 },
      status: "Archived" 
    },
  ];

  // Filtering logic based on search term and selected status tab
  const filteredResults = resultsRecords.filter((record) => {
    const matchesSearch = 
      record.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "All" || record.status === selectedStatus;

    return matchesSearch && matchesStatus;
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
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
            ADMIN ACADEMICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Academic Results &amp; Grading
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage exam publications, pass-fail analytics, and grade distributions.
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
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Pass Rate</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">94.2%</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Status Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search exam name, class or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all shadow-sm backdrop-blur-xl"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["All", "Published", "Drafting", "Archived"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border shadow-sm shrink-0 ${
                selectedStatus === status
                  ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table Section */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Exam Result Records &amp; Analytics</h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing: <strong className="text-blue-600 dark:text-blue-400">{filteredResults.length}</strong> entries
          </span>
        </div>

        {filteredResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:px-6">Exam Details</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Pass / Fail Summary</th>
                  <th className="p-4">Grade Points (GPA Distribution)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-sm">
                {filteredResults.map((record, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{record.examName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{record.id} • {record.publishedDate}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-slate-700 dark:text-slate-200">
                      {record.class}
                    </td>

                    {/* Pass / Fail Summary */}
                    <td className="p-4">
                      <div className="space-y-1.5 min-w-[160px]">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Pass: {record.passed}
                          </span>
                          <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Fail: {record.failed}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                          <div 
                            className="bg-emerald-500 h-full"
                            style={{ width: `${record.passRate}%` }}
                            title={`Pass Rate: ${record.passRate}%`}
                          />
                          <div 
                            className="bg-rose-500 h-full"
                            style={{ width: `${100 - record.passRate}%` }}
                            title={`Fail Rate: ${(100 - record.passRate).toFixed(1)}%`}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                          Pass Rate: <strong className="text-slate-700 dark:text-slate-300">{record.passRate}%</strong>
                        </p>
                      </div>
                    </td>

                    {/* Grade Points Distribution */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-900/40">
                          GPA 5.00: {record.gradePoints.gpa5}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/60 dark:border-blue-900/40">
                          GPA 4.00+: {record.gradePoints.gpa4}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/60 dark:border-amber-900/40">
                          GPA 3.00+: {record.gradePoints.gpa3}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold border border-rose-200/60 dark:border-rose-900/40">
                          Below 3.0: {record.gradePoints.gpaBelow3}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        record.status === "Published" 
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40" 
                          : record.status === "Drafting"
                          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                      }`}>
                        {record.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => router.push(`/admin/results/${record.id}`)}
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 transition-all cursor-pointer shadow-sm inline-flex items-center justify-center" 
                        title="Manage Results & Analytics"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Results Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              We couldn't find any examination records matching your search term or status filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}