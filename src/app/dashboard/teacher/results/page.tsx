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
              Student Results & Grades
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Record, evaluate, and publish student examination marks and grade allocations for your classes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSubmitResultModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer hover:scale-[1.02] shrink-0 z-10"
        >
          <Plus className="w-4 h-4" />
          Enter Student Result
        </button>
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