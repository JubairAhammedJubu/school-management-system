"use client";

import React, { useEffect, useState, useTransition, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  Search,
  Users,
  ChevronDown,
  Eye,
  X,
  Calendar,
  Phone,
  MapPin,
  HeartPulse,
  School,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  BookOpen,
  UserRound,
  Filter,
  Check,
} from "lucide-react";
import {
  getTeacherStudentsAction,
  StudentUser,
  PaginationMeta,
} from "@/lib/actions/teacher-students";

const DEFAULT_CLASSES = ["All Classes", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [classesList, setClassesList] = useState<string[]>(DEFAULT_CLASSES);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = useCallback(
    (pageNum: number, searchVal: string, classVal: string) => {
      setIsLoading(true);
      startTransition(async () => {
        const res = await getTeacherStudentsAction({
          page: pageNum,
          limit: 20,
          search: searchVal,
          studentClass: classVal,
        });

        if (res.success) {
          setStudents(res.students);
          setPagination(res.pagination);
          if (res.classes && res.classes.length > 0) {
            setClassesList(res.classes);
          }
        } else {
          setStudents([]);
          setPagination({ total: 0, page: 1, limit: 20, totalPages: 1 });
        }
        setIsLoading(false);
      });
    },
    []
  );

  // Debounce search input changes by 300ms before triggering API request
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Trigger fetch only when page, debouncedSearch, or selectedClass changes
  useEffect(() => {
    fetchStudents(currentPage, debouncedSearch, selectedClass);
  }, [currentPage, debouncedSearch, selectedClass, fetchStudents]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClassSelect = (val: string) => {
    setSelectedClass(val);
    setCurrentPage(1);
  };

  const handleOpenDetails = (student: StudentUser) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="relative min-h-screen space-y-8 pb-12 transition-colors duration-300">
      {/* AMBIENT BACKGROUND INDIGO BLUR GLOWS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute left-1/4 -top-20 h-72 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-[130px]" />
        <div className="absolute right-10 top-1/3 h-80 w-80 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[130px]" />
      </div>

      {/* ===================================================== */}
      {/* HEADER BANNER WITH TOTAL STUDENTS BADGE */}
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
              <GraduationCap className="h-7 w-7" />
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Teacher Portal
                </span>

                <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <BookOpen className="h-3 w-3" />
                  Live Roster
                </span>

                {/* Total Students Badge */}
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-xs">
                  <Users className="h-3.5 w-3.5" />
                  Total Students: {pagination.total}
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Student <span className="text-indigo-600 dark:text-indigo-400">Directory</span>
              </h1>

              <p className="mt-1.5 max-w-xl text-xs text-slate-600 dark:text-slate-300 sm:text-sm leading-relaxed">
                Filter, search, and manage student profiles directly from the MongoDB database with instant details modal access.
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchStudents(currentPage, search, selectedClass)}
            className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-[11px] font-extrabold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg shrink-0 cursor-pointer w-fit self-start md:self-center"
          >
            <RefreshCw className={`h-3.5 w-3.5 transition-transform ${isLoading ? "animate-spin" : "group-hover:rotate-180"}`} />
            <span>Refresh Roster</span>
          </button>
        </div>
      </motion.div>

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
                Student Roster Table
                <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-extrabold text-white shadow-xs">
                  {pagination.total} Total Students
                </span>
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {isLoading ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching live student database records...
                  </span>
                ) : (
                  `Showing ${students.length} students on page ${pagination.page} of ${pagination.totalPages}`
                )}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-[280px]">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by student name or roll..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                />
              </div>

              {/* Class Select Dropdown */}
              <ClassSelectDropdown
                value={selectedClass}
                options={classesList}
                onChange={handleClassSelect}
              />
            </div>
          </div>
        </div>

        {/* Desktop Roster Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100/80 bg-slate-50/70 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 dark:border-slate-800/80 dark:bg-slate-950/60">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/80">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} index={i} />)
              ) : students.length > 0 ? (
                students.map((student, index) => (
                  <motion.tr
                    key={student.id || index}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="group transition-colors hover:bg-indigo-50/40 dark:hover:bg-slate-800/40"
                  >
                    {/* Student Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-black text-white shadow-md shadow-indigo-500/20">
                          {student?.name ? getInitials(student.name) : "ST"}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {student?.name ?? "N/A"}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {student?.email ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        {student?.studentClass ?? "N/A"}
                      </span>
                    </td>

                    {/* Roll No */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20">
                        {student?.roll ?? "N/A"}
                      </span>
                    </td>

                    {/* View Details Action Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDetails(student)}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-3.5 text-xs font-bold text-indigo-600 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <MobileSkeletonCard key={i} />)
          ) : students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-black text-white shadow-md">
                    {student?.name ? getInitials(student.name) : "ST"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {student?.name ?? "N/A"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Class: {student?.studentClass ?? "N/A"} | Roll: {student?.roll ?? "N/A"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenDetails(student)}
                  className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-indigo-50 px-3 text-[11px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Details
                </button>
              </div>
            ))
          ) : null}
        </div>

        {/* Empty State */}
        {!isLoading && students.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Search className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              No students found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              No student records matched your current query or filter criteria in the database.
            </p>
          </div>
        )}

        {/* ===================================================== */}
        {/* PAGINATION CONTROLS */}
        {/* ===================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100/90 px-6 py-4 dark:border-slate-800/90">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Page <span className="font-extrabold text-slate-900 dark:text-white">{pagination.page}</span> of{" "}
            <span className="font-extrabold text-slate-900 dark:text-white">{pagination.totalPages}</span> ({pagination.total} total students · 20 per page)
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              disabled={currentPage >= pagination.totalPages || isLoading}
              onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* ===================================================== */}
      {/* STUDENT DETAILS MODAL */}
      {/* ===================================================== */}
      <AnimatePresence>
        {isModalOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800/80 dark:bg-slate-900"
            >
              {/* Header Banner */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-xs shadow-md shadow-indigo-500/20">
                    {selectedStudent?.name ? getInitials(selectedStudent.name) : "ST"}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white">
                      {selectedStudent?.name ?? "N/A"}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      Class: {selectedStudent?.studentClass ?? "N/A"} | Roll No: {selectedStudent?.roll ?? "N/A"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <DetailCard
                    icon={User}
                    label="Father's Name"
                    value={selectedStudent?.fatherName ? selectedStudent.fatherName : "N/A"}
                  />

                  <DetailCard
                    icon={User}
                    label="Mother's Name"
                    value={selectedStudent?.motherName ? selectedStudent.motherName : "N/A"}
                  />

                  <DetailCard
                    icon={Calendar}
                    label="Date of Birth"
                    value={
                      selectedStudent?.dateOfBirth
                        ? new Date(selectedStudent.dateOfBirth).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"
                    }
                  />

                  <DetailCard
                    icon={HeartPulse}
                    label="Blood Group"
                    value={selectedStudent?.bloodGroup ? selectedStudent.bloodGroup : "N/A"}
                  />

                  <DetailCard
                    icon={MapPin}
                    label="Address"
                    value={selectedStudent?.address ? selectedStudent.address : "N/A"}
                  />

                  <DetailCard
                    icon={Phone}
                    label="Phone Number"
                    value={selectedStudent?.phone ? selectedStudent.phone : "N/A"}
                  />

                  <DetailCard
                    icon={MapPin}
                    label="Location"
                    value={selectedStudent?.location ? selectedStudent.location : "N/A"}
                  />

                  <DetailCard
                    icon={School}
                    label="School Name"
                    value={selectedStudent?.schoolName ? selectedStudent.schoolName : "N/A"}
                  />

                  <DetailCard
                    icon={GraduationCap}
                    label="Class"
                    value={selectedStudent?.studentClass ? selectedStudent.studentClass : "N/A"}
                  />

                  <DetailCard
                    icon={UserRound}
                    label="Roll Number"
                    value={selectedStudent?.roll ? selectedStudent.roll : "N/A"}
                  />
                </div>

                {/* Short Bio Block */}
                <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Short Bio
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedStudent?.bio ? selectedStudent.bio : "N/A"}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end border-t border-slate-100 px-6 py-3.5 dark:border-slate-800">
                <button
                  onClick={handleCloseModal}
                  className="h-9 rounded-lg bg-indigo-600 px-5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================================================= */
/* CLASS SELECT DROPDOWN COMPONENT */
/* ========================================================= */

function ClassSelectDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
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
    <div className="relative w-full sm:w-[200px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800 cursor-pointer"
      >
        <span className="truncate flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
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
            className="absolute right-0 top-full z-30 mt-1.5 w-full min-w-[200px] max-h-60 overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900"
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

/* ========================================================= */
/* SKELETON LOADER COMPONENTS */
/* ========================================================= */

function SkeletonRow({ index }: { index: number }) {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 shrink-0" />
          <div className="space-y-2">
            <div
              className="h-3.5 rounded-md bg-slate-200/80 dark:bg-slate-800/80"
              style={{ width: `${110 + (index % 3) * 35}px` }}
            />
            <div className="h-2.5 w-36 rounded-md bg-slate-100/90 dark:bg-slate-800/50" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-20 rounded-lg bg-slate-200/70 dark:bg-slate-800/60" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-16 rounded-lg bg-indigo-100/60 dark:bg-indigo-950/40" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="ml-auto h-8 w-28 rounded-lg bg-indigo-100/70 dark:bg-indigo-950/50" />
      </td>
    </tr>
  );
}

function MobileSkeletonCard() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-2.5 w-36 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>
        <div className="h-8 w-20 rounded-lg bg-indigo-100/70 dark:bg-indigo-950/50" />
      </div>
    </div>
  );
}

/* ========================================================= */
/* HELPER COMPONENTS */
/* ========================================================= */

function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  const isNA = value === "N/A" || !value;

  return (
    <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3.5 transition-all duration-200 hover:border-indigo-200 hover:bg-white dark:border-slate-800/80 dark:bg-slate-800/50 dark:hover:bg-slate-800">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <p
        className={`text-xs font-bold ${
          isNA ? "text-slate-400 italic" : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function getInitials(name: string): string {
  if (!name) return "ST";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}