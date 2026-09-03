"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck,
  Sparkles,
  Search,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  Award,
  Layers,
  CheckCircle2,
  FileText,
} from "lucide-react";

export interface ExamItem {
  id: string;
  title: string;
  subject: string;
  studentClass: string;
  examType: "Mid-Term" | "Final Term" | "Unit Test" | "Quiz";
  date: string;
  startTime: string;
  endTime: string;
  roomNo: string;
  totalMarks: number;
  passingMarks: number;
  status: "Upcoming" | "Ongoing" | "Completed";
}

const INITIAL_EXAMS: ExamItem[] = [
  {
    id: "exam-1",
    title: "Mid-Term Mathematics Exam",
    subject: "Mathematics",
    studentClass: "Class 8",
    examType: "Mid-Term",
    date: "2026-09-15",
    startTime: "09:00 AM",
    endTime: "11:30 AM",
    roomNo: "Hall 302",
    totalMarks: 100,
    passingMarks: 40,
    status: "Upcoming",
  },
  {
    id: "exam-2",
    title: "General Science Assessment",
    subject: "Science",
    studentClass: "Class 9",
    examType: "Unit Test",
    date: "2026-09-03",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    roomNo: "Lab 101",
    totalMarks: 50,
    passingMarks: 20,
    status: "Ongoing",
  },
  {
    id: "exam-3",
    title: "English Literature & Grammar",
    subject: "English",
    studentClass: "Class 7",
    examType: "Mid-Term",
    date: "2026-09-18",
    startTime: "01:00 PM",
    endTime: "03:00 PM",
    roomNo: "Room 204",
    totalMarks: 100,
    passingMarks: 35,
    status: "Upcoming",
  },
  {
    id: "exam-4",
    title: "World History & Geography",
    subject: "Social Studies",
    studentClass: "Class 10",
    examType: "Final Term",
    date: "2026-08-28",
    startTime: "09:30 AM",
    endTime: "12:30 PM",
    roomNo: "Auditorium A",
    totalMarks: 100,
    passingMarks: 40,
    status: "Completed",
  },
  {
    id: "exam-5",
    title: "Computer Science Quiz 2",
    subject: "Computer Science",
    studentClass: "Class 6",
    examType: "Quiz",
    date: "2026-09-20",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    roomNo: "Comp Lab 2",
    totalMarks: 25,
    passingMarks: 10,
    status: "Upcoming",
  },
  {
    id: "exam-6",
    title: "Higher Mathematics Test",
    subject: "Mathematics",
    studentClass: "Class 10",
    examType: "Unit Test",
    date: "2026-08-25",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    roomNo: "Room 405",
    totalMarks: 50,
    passingMarks: 20,
    status: "Completed",
  },
];

const CLASS_OPTIONS = ["All Classes", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const STATUS_OPTIONS = ["All Status", "Upcoming", "Ongoing", "Completed"];

export default function TeacherExaminationsPage() {
  const [exams] = useState<ExamItem[]>(INITIAL_EXAMS);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchSearch =
        exam.title.toLowerCase().includes(search.toLowerCase()) ||
        exam.subject.toLowerCase().includes(search.toLowerCase()) ||
        exam.roomNo.toLowerCase().includes(search.toLowerCase());

      const matchClass =
        selectedClass === "All Classes" || exam.studentClass.toLowerCase() === selectedClass.toLowerCase();

      const matchStatus =
        selectedStatus === "All Status" || exam.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchClass && matchStatus;
    });
  }, [exams, search, selectedClass, selectedStatus]);

  // Metric counts
  const totalCount = exams.length;
  const upcomingCount = exams.filter((e) => e.status === "Upcoming").length;
  const ongoingCount = exams.filter((e) => e.status === "Ongoing").length;
  const completedCount = exams.filter((e) => e.status === "Completed").length;

  return (
    <div className="relative min-h-screen space-y-8 pb-12 transition-colors duration-300">
      {/* AMBIENT BACKGROUND INDIGO BLUR GLOWS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute left-1/4 -top-20 h-72 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-[130px]" />
        <div className="absolute right-10 top-1/3 h-80 w-80 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[130px]" />
      </div>

      {/* ===================================================== */}
      {/* HEADER BANNER */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/80"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <FileCheck className="h-7 w-7" />
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Teacher Portal
                </span>

                <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <BookOpen className="h-3 w-3" />
                  Academic Schedule
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Examinations <span className="text-indigo-600 dark:text-indigo-400">Schedule</span>
              </h1>

              <p className="mt-1.5 max-w-xl text-xs text-slate-600 dark:text-slate-300 sm:text-sm leading-relaxed">
                View exam timetables, room assignments, and track ongoing and upcoming academic assessments.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* METRIC SUMMARY CARDS */}
      {/* ===================================================== */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={Layers}
          label="Total Scheduled"
          value={totalCount.toString()}
          detail="Active examination roster"
          delay={0.05}
        />

        <SummaryCard
          icon={Calendar}
          label="Upcoming Exams"
          value={upcomingCount.toString()}
          detail="Scheduled in next 30 days"
          delay={0.1}
          badgeColor="text-indigo-600 dark:text-indigo-400"
        />

        <SummaryCard
          icon={Clock}
          label="Ongoing Today"
          value={ongoingCount.toString()}
          detail="Active exam sessions"
          delay={0.15}
          badgeColor="text-emerald-600 dark:text-emerald-400"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          value={completedCount.toString()}
          detail="Ready for result evaluation"
          delay={0.2}
          badgeColor="text-slate-600 dark:text-slate-400"
        />
      </div>

      {/* ===================================================== */}
      {/* MAIN CONTENT CARD & TOOLBAR */}
      {/* ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-visible rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/80"
      >
        {/* Toolbar */}
        <div className="border-b border-slate-100/90 p-5 sm:p-6 dark:border-slate-800/90">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                Exam Schedule Roster
                <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-extrabold text-white shadow-xs">
                  {filteredExams.length} Exams
                </span>
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                View timetables, room assignments, and passing marks for all classes.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-[240px]">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search exam, subject, hall..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                />
              </div>

              {/* Class Filter Dropdown */}
              <SelectDropdown
                value={selectedClass}
                options={CLASS_OPTIONS}
                onChange={setSelectedClass}
                icon={Filter}
              />

              {/* Status Filter Dropdown */}
              <SelectDropdown
                value={selectedStatus}
                options={STATUS_OPTIONS}
                onChange={setSelectedStatus}
                icon={Layers}
              />
            </div>
          </div>
        </div>

        {/* Desktop Exam Schedule Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-100/80 bg-slate-50/70 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 dark:border-slate-800/80 dark:bg-slate-950/60">
                <th className="px-6 py-4">Examination & Subject</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Room / Hall</th>
                <th className="px-6 py-4">Marks</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/80">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam, index) => (
                  <motion.tr
                    key={exam.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="group transition-colors hover:bg-indigo-50/40 dark:hover:bg-slate-800/40"
                  >
                    {/* Exam & Subject */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-black text-white shadow-md shadow-indigo-500/20">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {exam.title}
                          </p>
                          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                            {exam.subject} · <span className="text-slate-400 font-normal">{exam.examType}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        {exam.studentClass}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          {exam.date}
                        </p>
                        <p className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {exam.startTime} - {exam.endTime}
                        </p>
                      </div>
                    </td>

                    {/* Room */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        {exam.roomNo}
                      </span>
                    </td>

                    {/* Marks */}
                    <td className="px-6 py-4">
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {exam.totalMarks} <span className="text-[10px] text-slate-400 font-medium">pts</span>
                        <p className="text-[10px] text-slate-400 font-semibold">Pass: {exam.passingMarks}</p>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-right">
                      <StatusBadge status={exam.status} />
                    </td>
                  </motion.tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <div key={exam.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {exam.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      {exam.subject} · {exam.studentClass}
                    </p>
                  </div>
                  <StatusBadge status={exam.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-indigo-600" /> {exam.date}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-indigo-600" /> {exam.startTime}
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-indigo-600" /> {exam.roomNo}
                  </p>
                  <p className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                    <Award className="h-3 w-3 text-indigo-600" /> {exam.totalMarks} Marks
                  </p>
                </div>
              </div>
            ))
          ) : null}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Search className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              No examination schedules found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              No examination entries matched your current search query or class filter.
            </p>
          </div>
        )}
      </motion.section>
    </div>
  );
}

/* ========================================================= */
/* HELPER COMPONENTS */
/* ========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  delay,
  badgeColor = "text-indigo-600 dark:text-indigo-400",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  delay: number;
  badgeColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>

      <p className={`mt-1 text-[10px] font-medium ${badgeColor}`}>
        {detail}
      </p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: ExamItem["status"] }) {
  if (status === "Ongoing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Ongoing
      </span>
    );
  }

  if (status === "Upcoming") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-extrabold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
        Upcoming
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
      Completed
    </span>
  );
}

function SelectDropdown({
  value,
  options,
  onChange,
  icon: Icon,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  icon: React.ElementType;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-[170px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800 cursor-pointer"
      >
        <span className="truncate flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>{value}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-30 mt-1.5 w-full min-w-[170px] max-h-60 overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900"
          >
            {options.map((option) => {
              const isSelected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 font-extrabold"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
