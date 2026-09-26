"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Sparkles,
  Users,
  TrendingUp,
  FileCheck2,
  Clock3,
  Plus,
  FileText,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

import ResultList, { type Result } from "@/components/shared/ResultList";
import SubmitResultModal from "@/components/shared/SubmitResultModal";
import ResultDetailsModal from "@/components/shared/ResultDetailsModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

export default function TeacherResultsPage() {
  const [isSubmitResultModalOpen, setIsSubmitResultModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [resultsRefreshKey, setResultsRefreshKey] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Delete modal state
  const [resultToDelete, setResultToDelete] = useState<Result | null>(null);
  const [isDeletingResult, setIsDeletingResult] = useState(false);

  const dynamicGradeDistribution = ["A+", "A", "B+", "B", "C", "D", "F"].map(
    (grade) => {
      const count = results.filter(
        (result) => result.grade.toUpperCase() === grade
      ).length;

      const percentage =
        results.length > 0 ? Math.round((count / results.length) * 100) : 0;

      return {
        grade,
        count,
        percentage,
      };
    }
  );

  const bPlusOrHigherCount = results.filter((result) =>
    ["A+", "A", "B+"].includes(result.grade.toUpperCase())
  ).length;

  const bPlusOrHigherPercentage =
    results.length > 0
      ? Math.round((bPlusOrHigherCount / results.length) * 100)
      : 0;

  // Open delete confirmation modal
  const openDeleteModal = (result: Result) => {
    setResultToDelete(result);
  };

  // Confirm delete result and trigger deletion
  const confirmDeleteResult = async () => {
    if (!resultToDelete) return;
    try {
      setIsDeletingResult(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || ""}/api/teacher/results/${resultToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete result.");
      }

      toast.success("Result deleted successfully!");
      setResultsRefreshKey((current) => current + 1);
    } catch (error: any) {
      console.error("Error deleting result:", error);
      toast.error(error?.message || "Something went wrong while deleting the result.");
    } finally {
      setIsDeletingResult(false);
      setResultToDelete(null);
    }
  };

  const handleExportPDFReport = async () => {
    if (results.length === 0) {
      toast.info("No exam results available to export.");
      return;
    }

    setIsExportingPDF(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;

      // Color Palette
      const primaryIndigo = [79, 70, 229]; // #4F46E5
      const textDark = [15, 23, 42]; // #0F172A
      const bgLight = [248, 250, 252]; // #F8FAFC
      const navyDark = [30, 41, 59]; // #1E293B
      const borderGray = [226, 232, 240]; // #E2E8F0

      // Header Banner Box
      doc.setFillColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      doc.rect(margin, 12, pageWidth - margin * 2, 28, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("EduNexus Academic Management System", margin + 8, 24);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Teacher Dashboard — Official Student Exam Results & Grades Report", margin + 8, 32);

      // Metadata
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      const generatedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      doc.text(`Generated: ${generatedDate}`, pageWidth - margin - 50, 24);

      let y = 48;

      // Summary Box
      const totalCount = results.length;
      const passedCount = results.filter((r) => (r.score / r.total) >= 0.4).length;
      const avgScore = totalCount > 0
        ? (results.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) / totalCount).toFixed(1)
        : "0.0";

      doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 3, 3, "FD");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(`Total Records: ${totalCount}`, margin + 6, y + 11);
      doc.setTextColor(16, 185, 129);
      doc.text(`Passed Examinees: ${passedCount} (${((passedCount / (totalCount || 1)) * 100).toFixed(0)}%)`, margin + 65, y + 11);
      doc.setTextColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
      doc.text(`Class Avg: ${avgScore}%`, margin + 145, y + 11);

      // Table Header
      y += 24;
      const colX = [margin, margin + 45, margin + 88, margin + 128, margin + 154, margin + 170];

      doc.setFillColor(navyDark[0], navyDark[1], navyDark[2]);
      doc.rect(margin, y, pageWidth - margin * 2, 8, "F");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Student Name", colX[0] + 3, y + 5.5);
      doc.text("Exam Title", colX[1] + 2, y + 5.5);
      doc.text("Class", colX[2] + 2, y + 5.5);
      doc.text("Score / Total", colX[3] + 2, y + 5.5);
      doc.text("Grade", colX[4] + 2, y + 5.5);
      doc.text("Status", colX[5] + 2, y + 5.5);

      y += 8;

      // Table Rows
      doc.setFontSize(8);

      results.forEach((r, idx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
          doc.setFillColor(navyDark[0], navyDark[1], navyDark[2]);
          doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text("Student Name", colX[0] + 3, y + 5.5);
          doc.text("Exam Title", colX[1] + 2, y + 5.5);
          doc.text("Class", colX[2] + 2, y + 5.5);
          doc.text("Score / Total", colX[3] + 2, y + 5.5);
          doc.text("Grade", colX[4] + 2, y + 5.5);
          doc.text("Status", colX[5] + 2, y + 5.5);
          y += 8;
        }

        if (idx % 2 === 0) {
          doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
          doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
        }

        doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
        doc.line(margin, y + 8, pageWidth - margin, y + 8);

        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.setFont("helvetica", "bold");
        const sName = (r.studentName || "Student").substring(0, 22);
        doc.text(sName, colX[0] + 3, y + 5.5);

        doc.setFont("helvetica", "normal");
        const eTitle = (r.exam || "N/A").substring(0, 20);
        doc.text(eTitle, colX[1] + 2, y + 5.5);

        const sClass = (r.studentClass || "Class 6").substring(0, 18);
        doc.text(sClass, colX[2] + 2, y + 5.5);

        const scoreStr = `${r.score} / ${r.total}`;
        doc.text(scoreStr, colX[3] + 2, y + 5.5);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
        doc.text(r.grade || "N/A", colX[4] + 2, y + 5.5);

        doc.setFont("helvetica", "normal");
        if (r.status?.toUpperCase() === "PUBLISHED") {
          doc.setTextColor(16, 185, 129);
        } else {
          doc.setTextColor(217, 119, 6);
        }
        doc.text(r.status?.toUpperCase() || "DRAFT", colX[5] + 2, y + 5.5);

        y += 8;
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.setFont("helvetica", "normal");
        doc.text(`EduNexus Academic Management Portal — Page ${i} of ${totalPages}`, margin, 290);
      }

      doc.save(`EduNexus_Teacher_Academic_Results_${Date.now()}.pdf`);
      toast.success("Academic results report exported to PDF!");
    } catch (err) {
      console.error("Failed to export PDF", err);
      toast.error("Failed to generate PDF document.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner matching other teacher routes */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              TEACHER ACADEMICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Student Results &amp; Grades
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Record, evaluate, and publish student examination marks and grade allocations for your classes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            type="button"
            onClick={handleExportPDFReport}
            disabled={isExportingPDF}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm border border-indigo-200 dark:border-indigo-900/50 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isExportingPDF ? (
              <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            )}
            Export PDF
          </button>

          <button
            type="button"
            onClick={() => setIsSubmitResultModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Enter Student Result
          </button>
        </div>
      </motion.div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Students Graded"
          value={String(results.length)}
          detail="Graded this academic term"
          delay={0.05}
          iconClass="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Average Score"
          value={
            results.length > 0
              ? `${(
                  results.reduce(
                    (sum, result) => sum + (result.score / result.total) * 100,
                    0
                  ) / results.length
                ).toFixed(1)}%`
              : "0.0%"
          }
          detail="+4.2% overall class growth"
          delay={0.1}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <SummaryCard
          icon={FileCheck2}
          label="Published"
          value={String(
            results.filter((result) => result.status.toUpperCase() === "PUBLISHED").length
          )}
          detail="Results visible to students"
          delay={0.15}
          iconClass="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-500/10"
        />
        <SummaryCard
          icon={Clock3}
          label="Draft Results"
          value={String(
            results.filter((result) => result.status.toUpperCase() === "DRAFT").length
          )}
          detail="Awaiting review or publish"
          delay={0.2}
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
        />
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent Results Section */}
        <ResultList
          refreshKey={resultsRefreshKey}
          onResultsChange={setResults}
          onDelete={openDeleteModal}
          onView={setSelectedResult}
          onEdit={setEditingResult}
        />

        {/* Grade Distribution Section */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-100/90 pb-4 dark:border-slate-800/90">
              <div>
                <h2 className="text-base font-extrabold text-slate-950 dark:text-white">
                  Grade Distribution
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Class academic performance breakdown
                </p>
              </div>
              <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-extrabold text-white shadow-xs">
                {results.length} Total
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {dynamicGradeDistribution.map((item, index) => (
                <motion.div
                  key={item.grade}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.3 + index * 0.05,
                  }}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black ${
                          item.grade === "A+"
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                            : item.grade === "A"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                              : item.grade === "B+"
                                ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
                                : item.grade === "B"
                                  ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {item.grade}
                      </span>

                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {item.count} {item.count === 1 ? "student" : "students"}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {item.percentage}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/80">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.35 + index * 0.05,
                      }}
                      className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Performance Callout Footer */}
          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                Performance Overview
              </span>
            </div>

            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              {bPlusOrHigherPercentage}% of your graded students achieved a B+ grade or higher this term.
            </p>
          </div>
        </motion.section>
      </div>

      {/* Modals */}
      <SubmitResultModal
        isOpen={isSubmitResultModalOpen}
        onClose={() => setIsSubmitResultModalOpen(false)}
        onSuccess={() => {
          setResultsRefreshKey((current) => current + 1);
        }}
      />
      <SubmitResultModal
        isOpen={Boolean(editingResult)}
        result={editingResult}
        onClose={() => setEditingResult(null)}
        onSuccess={() => {
          setEditingResult(null);
          setResultsRefreshKey((current) => current + 1);
        }}
      />
      <ResultDetailsModal
        result={selectedResult}
        isOpen={Boolean(selectedResult)}
        onClose={() => setSelectedResult(null)}
        onEdit={(res) => {
          setSelectedResult(null);
          setEditingResult(res);
        }}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(resultToDelete)}
        onClose={() => !isDeletingResult && setResultToDelete(null)}
        onConfirm={confirmDeleteResult}
        title="Delete Result"
        itemTitle={
          resultToDelete
            ? `${resultToDelete.studentName}'s ${resultToDelete.exam}`
            : "this result"
        }
        confirmButtonText="Delete Result"
        isDeleting={isDeletingResult}
      />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
  iconClass = "text-indigo-600 dark:text-indigo-400",
  iconBg = "bg-indigo-50 dark:bg-indigo-500/10",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
  iconClass?: string;
  iconBg?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/70"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconClass} shadow-xs`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {detail}
      </p>
    </motion.div>
  );
}