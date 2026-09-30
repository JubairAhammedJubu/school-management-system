"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, FileCheck2, Filter, MapPin, RefreshCw, Search, X, ChevronDown, Check } from "lucide-react";
import { getTeacherExamsAction, type ExamItem } from "@/lib/actions/teacher.exam";
import { useSession } from "@/lib/auth-client";

const statusStyles: Record<ExamItem["status"], string> = {
  Upcoming: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400",
  Ongoing: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
  Completed: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Cancelled: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400",
};

function classNumber(value?: string) { return value?.match(/\d+/)?.[0] ?? value?.trim().toLowerCase(); }
function sectionName(value?: string) { return value?.replace(/^section\s*/i, "").trim().toLowerCase(); }

export default function StudentExaminationsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const student = session?.user as { role?: string; studentClass?: string; studentSection?: string; group?: string } | undefined;
  const rawRole = student?.role?.toLowerCase();
  const studentClass = student?.studentClass;
  const studentSection = student?.studentSection;
  const studentGroup = student?.group;
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedExam, setSelectedExam] = useState<ExamItem | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/");
      } else if (rawRole !== "student") {
        router.replace("/unauthorized");
      }
    }
  }, [isPending, rawRole, router, session?.user]);

  const fetchExams = async (refresh = false) => {
    setIsLoading(true);
    if (refresh) setIsRefreshing(true);
    setError(null);
    try {
      const response = await getTeacherExamsAction();
      if (response.success) setExams(response.exams);
      else setError(response.error ?? "Unable to load the examination schedule.");
    } catch { 
      setError("Unable to connect to the examination service."); 
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isPending || rawRole !== "student") return;
    const loadTimer = window.setTimeout(() => { void fetchExams(); }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [isPending, rawRole]);

  const matchingExams = useMemo(() => exams.filter((exam) => {
    const matchesClass = !studentClass || classNumber(exam.studentClass) === classNumber(studentClass);
    const matchesSection = !studentSection || sectionName(exam.section) === sectionName(studentSection);
    const matchesGroup = !studentGroup || !exam.group || exam.group.toLowerCase() === studentGroup.toLowerCase();
    return matchesClass && matchesSection && matchesGroup;
  }), [exams, studentClass, studentGroup, studentSection]);

  const filteredExams = useMemo(() => matchingExams.filter((exam) => {
    const term = search.toLowerCase();
    const matchesSearch = !term || [exam.title, exam.subject, exam.examType, exam.roomNo].some((value) => value.toLowerCase().includes(term));
    return matchesSearch && (status === "All" || exam.status === status);
  }), [matchingExams, search, status]);

  const upcoming = matchingExams.filter((exam) => exam.status === "Upcoming").length;
  const ongoing = matchingExams.filter((exam) => exam.status === "Ongoing").length;

  if (isPending || !session?.user || rawRole !== "student") {
    return (
      <div className="space-y-6 pb-8">
        <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Executive Header Banner */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Student Workspace
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {studentClass ?? "Class"} • {studentSection ?? "Section"} {studentGroup ? `• ${studentGroup}` : ""}
                </span>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Examinations Schedule
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Your personal examination schedule, room assignments, timing, and preparation details.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 md:pt-0">
            <button
              type="button"
              onClick={() => fetchExams(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 ${
                  isRefreshing || isLoading ? "animate-spin" : ""
                }`}
              />
              <span>Refresh Schedule</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* High-Contrast Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <InfoCard
          icon={CalendarDays}
          label="Scheduled Exams"
          value={String(matchingExams.length)}
          detail="For your class"
          isLoading={isLoading || isRefreshing}
        />

        <InfoCard
          icon={Clock3}
          label="Upcoming Exams"
          value={String(upcoming)}
          detail="Prepare ahead"
          isLoading={isLoading || isRefreshing}
        />

        <InfoCard
          icon={CheckCircle2}
          label="Ongoing Exams"
          value={String(ongoing)}
          detail="Currently active"
          green
          isLoading={isLoading || isRefreshing}
        />

        <InfoCard
          icon={FileCheck2}
          label="Completed Exams"
          value={String(
            matchingExams.filter(
              (exam) => exam.status === "Completed"
            ).length
          )}
          detail="Past examinations"
          isLoading={isLoading || isRefreshing}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              My examination schedule
            </h2>

            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Only exams assigned to your class and section are shown.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {filteredExams.length} exam
            {filteredExams.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:flex-row sm:p-5">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search subject, exam, or room..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <StatusSelect value={status} onChange={setStatus} />
        </div>

        {isLoading || isRefreshing ? (
          <ScheduleSkeleton />
        ) : error ? (
          <MessageState
            icon={AlertCircle}
            title="Schedule unavailable"
            detail={error}
            action="Try again"
            onAction={() => fetchExams()}
          />
        ) : filteredExams.length === 0 ? (
          <MessageState
            icon={CalendarDays}
            title="No examinations found"
            detail={
              matchingExams.length === 0
                ? "There are no examination records for your class and section yet."
                : "Try changing the search or status filter."
            }
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredExams.map((exam, index) => (
              <motion.article
                key={exam.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex min-w-0 items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                    <FileCheck2 className="h-4.5 w-4.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                        {exam.title}
                      </h3>

                      <StatusBadge status={exam.status} />
                    </div>

                    <p className="mt-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {exam.subject}{" "}
                      <span className="text-slate-400">·</span>{" "}
                      {exam.examType}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-indigo-500" />
                        {formatDate(exam.date)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 className="h-3 w-3 text-amber-500" />
                        {exam.startTime} – {exam.endTime}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-500" />
                        {exam.roomNo}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedExam(exam)}
                  className="shrink-0 rounded-xl border border-slate-200 px-3.5 py-2 text-[11px] font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 cursor-pointer"
                >
                  View details
                </button>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedExam && (
          <ExamDetails
            exam={selectedExam}
            onClose={() => setSelectedExam(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = ["All", "Upcoming", "Ongoing", "Completed", "Cancelled"];

  return (
    <div ref={dropdownRef} className="relative sm:w-52">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-600 cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <Filter className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="truncate">
            {value === "All" ? "Status: All Exams" : `Status: ${value}`}
          </span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-full min-w-[190px] rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
          >
            {options.map((option) => {
              const isActive = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400 font-bold"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  <span>{option === "All" ? "All Statuses" : option}</span>
                  {isActive && (
                    <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function StatusBadge({
  status,
}: {
  status: ExamItem["status"];
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  detail,
  isLoading = false,
  green = false,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  detail: string;
  isLoading?: boolean;
  green?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl hover:border-indigo-500/40"
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-2xs ${
            green
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40"
              : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
        {label}
      </p>

      {isLoading ? (
        <div className="my-1 h-7 w-16 rounded-md bg-slate-200 dark:bg-slate-800/80 animate-pulse" />
      ) : (
        <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {value}
        </p>
      )}

      <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">
        {detail}
      </p>
    </motion.div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 animate-pulse"
        >
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800/80" />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-40 rounded-md bg-slate-200 dark:bg-slate-800/80" />
                <div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-800/80" />
              </div>

              <div className="h-3 w-28 rounded-md bg-slate-100 dark:bg-slate-800/50" />

              <div className="flex items-center gap-3 pt-1">
                <div className="h-3 w-24 rounded-md bg-slate-100 dark:bg-slate-800/50" />
                <div className="h-3 w-24 rounded-md bg-slate-100 dark:bg-slate-800/50" />
                <div className="h-3 w-16 rounded-md bg-slate-100 dark:bg-slate-800/50" />
              </div>
            </div>
          </div>

          <div className="h-8 w-24 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800/80" />
        </div>
      ))}
    </div>
  );
}

function ExamDetails({
exam,
onClose,
}: {
exam: ExamItem;
onClose: () => void;
}) {
return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
  >
    <button
      type="button"
      aria-label="Close examination details"
      onClick={onClose}
      className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
    />

    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 12 }}
      className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <X className="h-4 w-4" />
      </button>

      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
        {exam.examType}
      </span>

      <h2 className="mt-1 pr-8 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {exam.title}
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {exam.subject}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <Detail
          label="Date"
          value={formatDate(exam.date)}
        />

        <Detail
          label="Time"
          value={`${exam.startTime} – ${exam.endTime}`}
        />

        <Detail
          label="Room"
          value={exam.roomNo}
        />

        <Detail
          label="Marks"
          value={`${exam.totalMarks} total · ${exam.passingMarks} pass`}
        />
      </div>

      {exam.syllabus && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Syllabus / instructions
          </p>

          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {exam.syllabus}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <StatusBadge status={exam.status} />

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);
}

function Detail({
label,
value,
}: {
label: string;
value: string;
}) {
return (
  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {label}
    </p>

    <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-200">
      {value}
    </p>
  </div>
);
}

function MessageState({
  icon: Icon,
  title,
  detail,
  action,
  onAction,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-4 border border-slate-200 dark:border-slate-700">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <p className="max-w-md text-xs text-slate-500 dark:text-slate-400 mb-4">{detail}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
        >
          {action}
        </button>
      )}
    </div>
  );
}