"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
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
  X,
  Download,
  BookOpen,
  RefreshCw
} from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

function authedFetch(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("better-auth.session_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${SERVER_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
}

interface ResultRecord {
  id: string;
  studentName?: string;
  studentEmail?: string;
  studentClass?: string;
  exam: string;
  score: number;
  total: number;
  grade: string;
  status: string;
  createdAt: string;
}

export default function AdminResultsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [resultsRecords, setResultsRecords] = useState<ResultRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ResultRecord | null>(null);

  // Form states
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentClass, setStudentClass] = useState("Grade 10");
  const [examTitle, setExamTitle] = useState("");
  const [scoreVal, setScoreVal] = useState("85");
  const [totalVal, setTotalVal] = useState("100");
  const [gradeVal, setGradeVal] = useState("A+");
  const [isPublishing, setIsPublishing] = useState(false);

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  const loadResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authedFetch("/api/teacher/results");
      const data = await res.json();
      if (res.ok && data.results) {
        setResultsRecords(data.results);
      }
    } catch (err) {
      console.error("Failed to fetch database results", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user && rawRole === "admin") {
      loadResults();
    }
  }, [session, rawRole, loadResults]);

  const handlePublishExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || !studentName.trim() || !studentEmail.trim()) {
      toast.error("Please fill in student info and exam title.");
      return;
    }

    setIsPublishing(true);
    try {
      const res = await authedFetch("/api/teacher/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: `STU-${Date.now()}`,
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim().toLowerCase(),
          studentClass: studentClass.trim(),
          exam: examTitle.trim(),
          score: parseInt(scoreVal) || 0,
          total: parseInt(totalVal) || 100,
          grade: gradeVal,
          status: "PUBLISHED",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save result");

      toast.success(`Exam result published for ${studentName}!`);
      setShowPublishModal(false);
      setStudentName("");
      setStudentEmail("");
      setExamTitle("");
      loadResults();
    } catch (err: any) {
      toast.error(err.message || "Failed to publish result.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExportCSVReport = () => {
    if (resultsRecords.length === 0) {
      toast.info("No exam results available to export.");
      return;
    }
    const headers = "Result ID,Student Name,Student Email,Class,Exam Title,Score,Total Marks,Grade,Status,Date\n";
    const rows = resultsRecords
      .map(
        (r) =>
          `"${r.id}","${r.studentName || 'Student'}","${r.studentEmail || ''}","${r.studentClass || 'Grade 10'}","${r.exam}",${r.score},${r.total},"${r.grade}","${r.status}","${new Date(r.createdAt).toLocaleDateString()}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EduNexus_Database_Academic_Report_${Date.now()}.csv`;
    a.click();
    toast.success("Database academic results report exported to CSV!");
  };

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

  const filteredResults = resultsRecords.filter((record) => {
    const matchesSearch = 
      record.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.studentName && record.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.studentClass && record.studentClass.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "All" || record.status === selectedStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const totalExamsCount = resultsRecords.length;
  const passedCount = resultsRecords.filter(r => (r.score / r.total) >= 0.4).length;
  const overallAvgScore = resultsRecords.length > 0
    ? (resultsRecords.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / resultsRecords.length).toFixed(1)
    : "0.0";

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
            LIVE DATABASE ACADEMICS &amp; RESULTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Academic Results &amp; Grading Insights
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Publish exam results directly to Database, view performance analytics, and export reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSVReport}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-500" />
            Export CSV
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Publish New Result
          </button>

          <button
            onClick={loadResults}
            disabled={isLoading}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
            title="Refresh Results"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-500" : ""}`} />
          </button>
        </div>
      </motion.div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Recorded Results</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalExamsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Passed Examinees</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{passedCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Average Score</p>
            <h3 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{overallAvgScore}%</h3>
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
            placeholder="Search student, exam title or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all shadow-sm backdrop-blur-xl"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["All", "Published", "Draft"].map((status) => (
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Database Exam Results</h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing: <strong className="text-blue-600 dark:text-blue-400">{filteredResults.length}</strong> entries
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:px-6">Student &amp; Exam</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Score / Total</th>
                  <th className="p-4">Grade</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-sm">
                {filteredResults.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{record.studentName || "Student"}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{record.exam} • {new Date(record.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-slate-700 dark:text-slate-200">
                      {record.studentClass || "Grade 10"}
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {record.score} / {record.total} ({((record.score / record.total) * 100).toFixed(1)}%)
                    </td>

                    <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400">
                      {record.grade}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        record.status === "PUBLISHED" 
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40" 
                          : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40"
                      }`}>
                        {record.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedRecord(record)}
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 transition-all cursor-pointer shadow-sm inline-flex items-center justify-center" 
                        title="View Details"
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
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Database Results Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Click &quot;Publish New Result&quot; to save exam marks directly to the database.
            </p>
          </div>
        )}
      </div>

      {/* Publish Exam Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setShowPublishModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" /> Save &amp; Publish Exam Result to DB
              </h3>

              <form onSubmit={handlePublishExam} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sadia Sultana"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    placeholder="student@edunexus.edu"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Exam Title
                    </label>
                    <input
                      type="text"
                      placeholder="Mid-Term Physics"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Class / Grade
                    </label>
                    <input
                      type="text"
                      placeholder="Grade 10 A"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Score
                    </label>
                    <input
                      type="number"
                      placeholder="85"
                      value={scoreVal}
                      onChange={(e) => setScoreVal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Total
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      value={totalVal}
                      onChange={(e) => setTotalVal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Grade
                    </label>
                    <input
                      type="text"
                      placeholder="A+"
                      value={gradeVal}
                      onChange={(e) => setGradeVal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPublishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Save to Database"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Result Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedRecord.exam}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {selectedRecord.id}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-y border-slate-100 dark:border-slate-800 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.studentName || "Student"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Email:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.studentEmail || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.studentClass || "Grade 10"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Score Obtained:</span>
                  <span className="font-extrabold text-blue-600">{selectedRecord.score} / {selectedRecord.total} Marks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Letter Grade:</span>
                  <span className="font-bold text-emerald-600">{selectedRecord.grade}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Close Record
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}