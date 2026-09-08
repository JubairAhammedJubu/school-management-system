"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, FileCheck2, Filter, MapPin, RefreshCw, Search, X } from "lucide-react";
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

  useEffect(() => { if (!isPending && (!session?.user || rawRole !== "student")) 
    router.replace("/unauthorized"); 
  }, [isPending, rawRole, router, session?.user]);

  const fetchExams = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      const response = await getTeacherExamsAction();
      if (response.success) setExams(response.exams);
      else setError(response.error ?? "Unable to load the examination schedule.");
    } catch { 
      setError("Unable to connect to the examination service."); 
    }
    finally { setIsLoading(false); setIsRefreshing(false); }
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

  if (isPending || !session?.user || rawRole !== "student") return <ScheduleSkeleton />;


  return (
  <div className="space-y-6 pb-8">
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-200 bg-slate-100/90 p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200">
            <CalendarDays className="h-6 w-6" />
          </div>

          <div>
            <span className="inline-flex rounded-md border border-slate-200/80 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-300">
              Student Workspace
            </span>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Examinations
            </h1>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Your personal examination schedule and preparation
              details.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchExams(true)}
          disabled={isLoading || isRefreshing}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />

          Refresh schedule
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
          {studentClass ?? "Your class"}
        </span>

        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
          {studentSection ?? "Your section"}
        </span>

        {studentGroup && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
            {studentGroup}
          </span>
        )}
      </div>
    </motion.header>

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <InfoCard
        icon={CalendarDays}
        label="Scheduled exams"
        value={String(matchingExams.length)}
        detail="For your class"
      />

      <InfoCard
        icon={Clock3}
        label="Upcoming"
        value={String(upcoming)}
        detail="Prepare ahead"
      />

      <InfoCard
        icon={CheckCircle2}
        label="Ongoing"
        value={String(ongoing)}
        detail="Currently active"
        green
      />

      <InfoCard
        icon={FileCheck2}
        label="Completed"
        value={String(
          matchingExams.filter(
            (exam) => exam.status === "Completed"
          ).length
        )}
        detail="Past examinations"
      />
    </div>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
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

      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/20 sm:flex-row sm:p-5">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search subject, exam, or room..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="relative sm:w-48">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-8 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {[
              "All",
              "Upcoming",
              "Ongoing",
              "Completed",
              "Cancelled",
            ].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? (
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
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
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
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(exam.date)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {exam.startTime} – {exam.endTime}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exam.roomNo}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExam(exam)}
                className="shrink-0 rounded-xl border border-slate-200 px-3.5 py-2 text-[11px] font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
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
green = false,
}: {
icon: typeof CalendarDays;
label: string;
value: string;
detail: string;
green?: boolean;
}) {
return (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
        green
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      <Icon className="h-4.5 w-4.5" />
    </div>

    <p className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      {value}
    </p>

    <p className="mt-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
      {label}
    </p>

    <p className="mt-0.5 text-[10px] text-slate-400">
      {detail}
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
icon: typeof CalendarDays;
title: string;
detail: string;
action?: string;
onAction?: () => void;
}) {
return (
  <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      <Icon className="h-5 w-5" />
    </div>

    <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">
      {title}
    </h3>

    <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
      {detail}
    </p>

    {action && (
      <button
        type="button"
        onClick={onAction}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-900"
      >
        {action}
      </button>
    )}
  </div>
);
}

function ScheduleSkeleton() {
return (
  <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800"
      >
        <div className="h-10 w-10 rounded-xl bg-slate-200 animate-pulse dark:bg-slate-800" />

        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-44 rounded bg-slate-200 animate-pulse dark:bg-slate-800" />

          <div className="h-3 w-72 max-w-full rounded bg-slate-100 animate-pulse dark:bg-slate-800/60" />
        </div>
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