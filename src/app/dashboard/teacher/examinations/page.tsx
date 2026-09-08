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
  Plus,
  X,
  AlertTriangle,
  Eye,
  Ban,
  UserCheck,
  BookMarked,
  Info,
  Loader2,
  RefreshCw,
  Printer,
} from "lucide-react";

import {
  getTeacherExamsAction,
  createTeacherExamAction,
  cancelTeacherExamAction,
  ExamItem,
} from "@/lib/actions/teacher.exam";
import { getTeacherRequestsAction, ClassSubjectRequestItem } from "@/lib/actions/teacher.request";
import { useSession } from "@/lib/auth-client";

const CLASS_OPTIONS = ["All Classes", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const STATUS_OPTIONS = ["All Status", "Upcoming", "Ongoing", "Completed", "Cancelled"];
const EXAM_TYPE_OPTIONS = ["Class Test", "Quiz", "Mid-Term", "Final Term"] as const;
const SECTION_OPTIONS = ["Section A", "Section B"];
const GROUP_OPTIONS = ["Science", "Business Studies", "Humanities"];

const START_TIME_OPTIONS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
];

const END_TIME_OPTIONS = [
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
];

const DEFAULT_ROOM_OPTIONS = [
  "Room 101",
  "Room 102",
  "Room 103",
  "Room 104",
  "Room 105",
  "Room 201",
  "Room 202",
  "Room 203",
  "Room 204",
  "Room 205",
  "Room 301",
  "Room 302",
  "Room 303",
  "Room 304",
  "Room 305",
  "Room 401",
  "Room 402",
  "Room 403",
  "Room 404",
  "Room 405",
];

const DYNAMIC_SUBJECTS_MAP: Record<string, Record<string, string[]> | string[]> = {
  "Class 6": [
    "Bangla",
    "English",
    "Mathematics",
    "General Science",
    "Bangladesh & Global Studies",
    "Information & Communication Technology (ICT)",
    "Agriculture Studies",
    "Home Science",
    "Physical Education & Health",
    "Islamic Studies",
    "Hindu Religion Studies",
  ],
  "Class 7": [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "General Science",
    "Bangladesh & Global Studies",
    "Information & Communication Technology (ICT)",
    "Agriculture Studies",
    "Home Science",
    "Islamic Studies",
    "Hindu Religion Studies",
  ],
  "Class 8": [
    "Bangla 1st Paper",
    "Bangla 2nd Paper",
    "English 1st Paper",
    "English 2nd Paper",
    "Mathematics",
    "General Science",
    "Bangladesh & Global Studies",
    "Information & Communication Technology (ICT)",
    "Agriculture Studies",
    "Home Science",
    "Islamic Studies",
    "Hindu Religion Studies",
  ],
  "Class 9": {
    "Science": [
      "Physics",
      "Chemistry",
      "Biology",
      "Higher Mathematics",
      "General Math",
      "Bangla 1st Paper",
      "Bangla 2nd Paper",
      "English 1st Paper",
      "English 2nd Paper",
      "Information & Communication Technology (ICT)",
      "Bangladesh & Global Studies",
      "Agriculture Studies",
    ],
    "Business Studies": [
      "Accounting",
      "Finance & Banking",
      "Business Entrepreneurship",
      "General Math",
      "General Science",
      "Economics",
      "Bangla 1st Paper",
      "Bangla 2nd Paper",
      "English 1st Paper",
      "English 2nd Paper",
      "Information & Communication Technology (ICT)",
      "Agriculture Studies",
    ],
    "Humanities": [
      "Geography & Environment",
      "Civics & Citizenship",
      "Economics",
      "History of Bangladesh & World Civilization",
      "General Math",
      "General Science",
      "Bangla 1st Paper",
      "Bangla 2nd Paper",
      "English 1st Paper",
      "English 2nd Paper",
      "Information & Communication Technology (ICT)",
      "Agriculture Studies",
    ],
  },
  "Class 10": {
    "Science": [
      "Physics",
      "Chemistry",
      "Biology",
      "Higher Mathematics",
      "General Math",
      "Bangla 1st Paper",
      "Bangla 2nd Paper",
      "English 1st Paper",
      "English 2nd Paper",
      "Information & Communication Technology (ICT)",
      "Bangladesh & Global Studies",
      "Agriculture Studies",
    ],
    "Business Studies": [
      "Accounting",
      "Finance & Banking",
      "Business Entrepreneurship",
      "General Math",
      "General Science",
      "Economics",
      "Bangla 1st Paper",
      "Bangla 2nd Paper",
      "English 1st Paper",
      "English 2nd Paper",
      "Information & Communication Technology (ICT)",
      "Agriculture Studies",
    ],
    "Humanities": [
      "Geography & Environment",
      "Civics & Citizenship",
      "Economics",
      "History of Bangladesh & World Civilization",
      "General Math",
      "General Science",
      "Bangla 1st Paper",
      "Bangla 2nd Paper",
      "English 1st Paper",
      "English 2nd Paper",
      "Information & Communication Technology (ICT)",
      "Agriculture Studies",
    ],
  },
};

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(" ");
  if (parts.length < 2) return 0;
  const [timePart, modifier] = parts;
  const timeSplit = timePart.split(":");
  if (timeSplit.length < 2) return 0;
  let hours = parseInt(timeSplit[0], 10);
  const minutes = parseInt(timeSplit[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return 0;

  if (modifier.toUpperCase() === "PM" && hours < 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
}

export default function TeacherExaminationsPage() {
  const { data: session } = useSession();
  const teacherEmail = session?.user?.email || "";
  const teacherName = session?.user?.name || "";

  const [exams, setExams] = useState<ExamItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Class Subject Requests for dynamic subject & room fetching
  const [classRequests, setClassRequests] = useState<ClassSubjectRequestItem[]>([]);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamItem | null>(null);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Exams & Requests from DB on Mount
  const fetchExams = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [examRes, requestRes] = await Promise.all([
        getTeacherExamsAction(),
        getTeacherRequestsAction(),
      ]);

      if (examRes.success) {
        setExams(examRes.exams);
      } else {
        showToast(examRes.error || "Failed to load examination schedules.");
      }

      if (requestRes.success && Array.isArray(requestRes.requests)) {
        setClassRequests(requestRes.requests);
      }
    } catch (err: any) {
      showToast("Error connecting to database.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchSearch =
        exam.title.toLowerCase().includes(search.toLowerCase()) ||
        exam.subject.toLowerCase().includes(search.toLowerCase()) ||
        exam.roomNo.toLowerCase().includes(search.toLowerCase()) ||
        exam.studentClass.toLowerCase().includes(search.toLowerCase());

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

  // Handlers
  const handleCreateExam = async (newExamData: Omit<ExamItem, "id" | "status">) => {
    try {
      const res = await createTeacherExamAction({
        ...newExamData,
        teacherEmail: newExamData.teacherEmail || teacherEmail,
      });
      if (res.success && res.exam) {
        setExams((prev) => [res.exam!, ...prev]);
        setIsCreateModalOpen(false);
        showToast(`Exam "${res.exam.title}" created & saved!`);
      } else {
        showToast(res.error || "Failed to create examination.");
      }
    } catch (error: any) {
      showToast("Error creating exam.");
    }
  };

  const handleConfirmCancelExam = async () => {
    if (!selectedExam) return;
    try {
      const res = await cancelTeacherExamAction(selectedExam.id);
      if (res.success) {
        setExams((prev) =>
          prev.map((e) => (e.id === selectedExam.id ? { ...e, status: "Cancelled" } : e))
        );
        setIsCancelModalOpen(false);
        showToast(`Exam "${selectedExam.title}" status updated to Cancelled.`);
        setSelectedExam(null);
      } else {
        showToast(res.error || "Failed to cancel exam.");
      }
    } catch (error: any) {
      showToast("Error cancelling exam.");
    }
  };

  const handleExportPDF = () => {
    if (filteredExams.length === 0) {
      showToast("No exam records to export.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Pop-up blocked! Please allow pop-ups to export PDF.");
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const rowsHtml = filteredExams
      .map((e) => {
        let badgeClass = "badge-upcoming";
        if (e.status === "Ongoing") badgeClass = "badge-ongoing";
        else if (e.status === "Completed") badgeClass = "badge-completed";
        else if (e.status === "Cancelled") badgeClass = "badge-cancelled";

        return `
          <tr>
            <td>
              <div class="title-text">${e.title}</div>
              <div class="sub-text">${e.subject} · ${e.examType}</div>
            </td>
            <td>
              <strong style="color: #0f172a;">${e.studentClass}</strong> (${e.section})
              ${e.group ? `<br/><span style="font-size: 10px; color: #64748b; font-weight: 600;">${e.group} Stream</span>` : ""}
            </td>
            <td style="font-weight: 600; color: #334155;">${e.date}</td>
            <td style="font-weight: 600; color: #334155;">${e.startTime} - ${e.endTime}</td>
            <td><span class="room-pill">${e.roomNo}</span></td>
            <td style="font-weight: 800; color: #0f172a;">${e.totalMarks} Marks</td>
            <td style="text-align: center;">
              <span class="badge ${badgeClass}">${e.status}</span>
            </td>
          </tr>
        `;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>EduNexus Examination Schedule - ${currentDate}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            
            * { box-sizing: border-box; }
            
            @media print {
              @page { size: A4 landscape; margin: 8mm 10mm; }
              html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; background: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
            
            body {
              font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
              background: #ffffff;
              color: #0f172a;
              padding: 20px 24px;
              margin: 0;
              width: 100%;
              box-sizing: border-box;
            }
            
            .top-accent {
              height: 6px;
              background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
              border-radius: 4px;
              margin-bottom: 20px;
              width: 100%;
            }
            
            .header-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 18px;
              border-bottom: 2px solid #e2e8f0;
              margin-bottom: 20px;
              width: 100%;
            }
            
            .brand-box {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            
            .logo-icon {
              width: 46px;
              height: 46px;
              background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-weight: 900;
              font-size: 22px;
              box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
            }
            
            .brand-name {
              font-size: 24px;
              font-weight: 900;
              color: #0f172a;
              letter-spacing: -0.5px;
              line-height: 1.1;
            }
            
            .brand-name span { color: #4f46e5; }
            
            .doc-type {
              font-size: 11px;
              font-weight: 800;
              color: #4f46e5;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 3px;
            }
            
            .meta-grid {
              display: flex;
              gap: 12px;
            }
            
            .meta-pill {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 8px 14px;
              border-radius: 10px;
              text-align: right;
            }
            
            .meta-label {
              font-size: 9px;
              font-weight: 800;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .meta-val {
              font-size: 12px;
              font-weight: 800;
              color: #0f172a;
              margin-top: 2px;
            }
            
            .table-wrapper {
              border: 1px solid #cbd5e1;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              text-align: left;
              font-size: 12px;
            }
            
            thead {
              background-color: #4f46e5;
              color: #ffffff;
            }
            
            th {
              padding: 12px 14px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              border-right: 1px solid rgba(255, 255, 255, 0.15);
            }
            th:last-child { border-right: none; }
            
            td {
              padding: 11px 14px;
              border-bottom: 1px solid #e2e8f0;
              border-right: 1px solid #f1f5f9;
              vertical-align: middle;
            }
            td:last-child { border-right: none; }
            
            tr:nth-child(even) { background-color: #f8fafc; }
            tr:last-child td { border-bottom: none; }
            
            .title-text {
              font-weight: 800;
              font-size: 13px;
              color: #0f172a;
            }
            
            .sub-text {
              font-size: 11px;
              color: #4f46e5;
              font-weight: 700;
              margin-top: 2px;
            }
            
            .badge {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 6px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .badge-upcoming { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
            .badge-ongoing { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
            .badge-completed { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
            .badge-cancelled { background: #ffe4e6; color: #9f1239; border: 1px solid #fecdd3; }
            
            .room-pill {
              display: inline-block;
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 3px 8px;
              border-radius: 6px;
              font-weight: 800;
              color: #334155;
              font-size: 11px;
            }
            
            .footer-container {
              margin-top: 24px;
              padding-top: 14px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 10px;
              color: #64748b;
              font-weight: 600;
            }
            
            .seal {
              display: flex;
              align-items: center;
              gap: 6px;
              color: #4f46e5;
              font-weight: 800;
            }
          </style>
        </head>
        <body>
          <div class="top-accent"></div>
          <div class="header-container">
            <div class="brand-box">
              <div class="logo-icon">E</div>
              <div>
                <div class="brand-name">Edu<span>Nexus</span></div>
                <div class="doc-type">Official Examination & Timetable Schedule</div>
              </div>
            </div>
            <div class="meta-grid">
              <div class="meta-pill">
                <div class="meta-label">Generated Date</div>
                <div class="meta-val">${currentDate}</div>
              </div>
              <div class="meta-pill">
                <div class="meta-label">Class Filter</div>
                <div class="meta-val">${selectedClass}</div>
              </div>
              <div class="meta-pill">
                <div class="meta-label">Total Exams</div>
                <div class="meta-val">${filteredExams.length} Scheduled</div>
              </div>
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">Examination & Subject</th>
                  <th style="width: 18%;">Class & Section</th>
                  <th style="width: 12%;">Date</th>
                  <th style="width: 15%;">Time</th>
                  <th style="width: 10%;">Room / Hall</th>
                  <th style="width: 10%;">Total Marks</th>
                  <th style="width: 10%; text-align: center;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>

          <div class="footer-container">
            <div class="seal">
              ✓ Official Authoritative Timetable Record · EduNexus Academic Management System
            </div>
            <div>Confidential Academic Document</div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showToast("Generating PDF print document...");
  };

  return (
    <div className="relative min-h-screen space-y-8 pb-12 transition-colors duration-300">
      {/* AMBIENT BACKGROUND INDIGO BLUR GLOWS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute left-1/4 -top-20 h-72 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-[130px]" />
        <div className="absolute right-10 top-1/3 h-80 w-80 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[130px]" />
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-indigo-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================== */}
      {/* HEADER BANNER */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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
                Create & schedule exams into the database, view invigilations, set mark thresholds, and track assessments.
              </p>
            </div>
          </div>

          {/* CREATE EXAM & REFRESH BUTTONS */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => fetchExams(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-black text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 focus:ring-4 focus:ring-indigo-500/20 cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Create Exam</span>
            </button>
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
          value={isLoading ? "..." : totalCount.toString()}
          detail="Active examination roster"
          delay={0.05}
        />

        <SummaryCard
          icon={Calendar}
          label="Upcoming Exams"
          value={isLoading ? "..." : upcomingCount.toString()}
          detail="Scheduled assessments"
          delay={0.1}
          badgeColor="text-indigo-600 dark:text-indigo-400"
        />

        <SummaryCard
          icon={Clock}
          label="Ongoing Today"
          value={isLoading ? "..." : ongoingCount.toString()}
          detail="Active exam sessions"
          delay={0.15}
          badgeColor="text-emerald-600 dark:text-emerald-400"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          value={isLoading ? "..." : completedCount.toString()}
          detail="Ready for evaluation"
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
        className="overflow-visible rounded-xl border border-slate-200/90 bg-white shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70"
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
                Live database entries for timetables, room invigilations, and passing thresholds.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
              {/* Search Bar */}
              <div className="relative w-full lg:w-[220px]">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search exam, subject, hall..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-slate-100/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                />
              </div>

              {/* Filter Controls & Export Button */}
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3 w-full lg:w-auto">
                <div className="col-span-1 sm:w-[155px] w-full">
                  <SelectDropdown
                    value={selectedClass}
                    options={CLASS_OPTIONS}
                    onChange={setSelectedClass}
                    icon={Filter}
                  />
                </div>

                <div className="col-span-1 sm:w-[155px] w-full">
                  <SelectDropdown
                    value={selectedStatus}
                    options={STATUS_OPTIONS}
                    onChange={setSelectedStatus}
                    icon={Layers}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="col-span-2 sm:col-span-1 sm:w-auto flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 text-xs font-bold text-indigo-700 transition-all hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 cursor-pointer shrink-0"
                  title="Export schedule as PDF document"
                >
                  <Printer className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING STATE SKELETON */}
        {isLoading ? (
          <ExaminationTableSkeleton />
        ) : (
          <>
            {/* Desktop Exam Schedule Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-100/80 bg-slate-50/70 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 dark:border-slate-800/80 dark:bg-slate-900/90">
                    <th className="px-6 py-4">Examination & Subject</th>
                    <th className="px-6 py-4">Class & Section</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
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
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                  {exam.subject}
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <ExamTypeBadge type={exam.examType} />
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Class & Section */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex w-max items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                              {exam.studentClass}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {exam.section} {exam.group ? `(${exam.group})` : ""}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            {exam.date}
                          </span>
                        </td>

                        {/* Time */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            {exam.startTime} - {exam.endTime}
                          </span>
                        </td>

                        {/* Room */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            {exam.roomNo}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <StatusBadge status={exam.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedExam(exam);
                                setIsDetailModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 cursor-pointer"
                              title="View Exam Details"
                            >
                              <Eye className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>Details</span>
                            </button>

                            {exam.status !== "Cancelled" && exam.status !== "Completed" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedExam(exam);
                                  setIsCancelModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 cursor-pointer"
                                title="Cancel Examination"
                              >
                                <Ban className="h-3.5 w-3.5" />
                                <span>Cancel</span>
                              </button>
                            )}
                          </div>
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
                        <div className="flex items-center gap-2">
                          <ExamTypeBadge type={exam.examType} />
                          {exam.isYourDuty && (
                            <span className="inline-flex items-center rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-black text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                              Your Duty
                            </span>
                          )}
                        </div>
                        <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                          {exam.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                          {exam.subject} · {exam.studentClass} ({exam.section}) {exam.group ? `- ${exam.group}` : ""}
                        </p>
                      </div>
                      <StatusBadge status={exam.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <p className="flex items-center gap-1 font-semibold">
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

                    {/* Mobile Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExam(exam);
                          setIsDetailModalOpen(true);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <Eye className="h-3.5 w-3.5 text-indigo-600" /> Details
                      </button>

                      {exam.status !== "Cancelled" && exam.status !== "Completed" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedExam(exam);
                            setIsCancelModalOpen(true);
                          }}
                          className="flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-extrabold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                        >
                          <Ban className="h-3.5 w-3.5" /> Cancel
                        </button>
                      )}
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
                  No examination entries in the database matched your search query or class filter. Click <strong>"Create Exam"</strong> to add one!
                </p>
              </div>
            )}
          </>
        )}
      </motion.section>

      {/* ===================================================== */}
      {/* CREATE EXAM MODAL */}
      {/* ===================================================== */}
      <CreateExamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateExam}
        existingExams={exams}
        classRequests={classRequests}
        currentTeacherName={teacherName}
        currentTeacherEmail={teacherEmail}
      />

      {/* ===================================================== */}
      {/* CANCEL EXAM CONFIRMATION MODAL */}
      {/* ===================================================== */}
      <CancelExamModal
        isOpen={isCancelModalOpen}
        exam={selectedExam}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancelExam}
      />

      {/* ===================================================== */}
      {/* EXAM DETAIL MODAL */}
      {/* ===================================================== */}
      <ExamDetailModal
        isOpen={isDetailModalOpen}
        exam={selectedExam}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}

/* ========================================================= */
/* CREATE EXAM MODAL COMPONENT - WITH MODERN CUSTOM SELECTS */
/* ========================================================= */
function CreateExamModal({
  isOpen,
  onClose,
  onSubmit,
  existingExams,
  classRequests,
  currentTeacherName = "",
  currentTeacherEmail = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ExamItem, "id" | "status">) => void;
  existingExams: ExamItem[];
  classRequests: ClassSubjectRequestItem[];
  currentTeacherName?: string;
  currentTeacherEmail?: string;
}) {
  const [title, setTitle] = useState("");
  const [studentClass, setStudentClass] = useState("Class 6");
  const [section, setSection] = useState("Section A");
  const [group, setGroup] = useState("Science");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState<ExamItem["examType"]>("Class Test");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("10:00 AM");
  const [roomNo, setRoomNo] = useState("Room 101");
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [invigilator, setInvigilator] = useState("");
  const [isYourDuty, setIsYourDuty] = useState<boolean>(true);
  const [syllabus, setSyllabus] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Auto Passing Marks Calculation (40% threshold)
  const passingMarks = useMemo(() => {
    return totalMarks === 100 ? 40 : 20; // 40% of 100 = 40; 40% of 50 = 20
  }, [totalMarks]);

  // Dynamic Subjects based on Selected Class & Group (from approved requests or grade/group mapping)
  const availableSubjects = useMemo(() => {
    const approvedForClass = classRequests
      .filter((r) => {
        if (r.status !== "APPROVED") return false;
        const matchGrade =
          r.grade.toLowerCase() === studentClass.toLowerCase() ||
          r.grade.replace(/[^0-9]/g, "") === studentClass.replace(/[^0-9]/g, "");

        if (!matchGrade) return false;

        if ((studentClass === "Class 9" || studentClass === "Class 10") && r.group) {
          const reqGroup = r.group.toLowerCase();
          const targetGroup = group.toLowerCase();
          return (
            reqGroup.includes(targetGroup) ||
            targetGroup.includes(reqGroup) ||
            (targetGroup.includes("business") && reqGroup.includes("commerce")) ||
            (targetGroup.includes("humanities") && reqGroup.includes("arts"))
          );
        }
        return true;
      })
      .map((r) => r.subject);

    if (approvedForClass.length > 0) {
      return Array.from(new Set(approvedForClass));
    }

    if (studentClass === "Class 9" || studentClass === "Class 10") {
      const classGroupMap = DYNAMIC_SUBJECTS_MAP[studentClass] as Record<string, string[]>;
      if (classGroupMap) {
        const mappedList = classGroupMap[group] || classGroupMap["Science"] || [];
        return mappedList;
      }
    }

    return (DYNAMIC_SUBJECTS_MAP[studentClass] as string[]) || ["Mathematics", "General Science", "English"];
  }, [studentClass, group, classRequests]);

  // Dynamic Rooms (from approved requests or defaults)
  const availableRooms = useMemo(() => {
    const approvedRooms = classRequests
      .filter((r) => r.status === "APPROVED" && r.room)
      .map((r) => r.room!);

    if (approvedRooms.length > 0) {
      return Array.from(new Set([...approvedRooms, ...DEFAULT_ROOM_OPTIONS]));
    }

    return DEFAULT_ROOM_OPTIONS;
  }, [classRequests]);

  // Filter end times to ensure minimum 30 minutes duration after selected startTime
  const availableEndTimes = useMemo(() => {
    const startMins = parseTimeToMinutes(startTime);
    return END_TIME_OPTIONS.filter((endOpt) => {
      const endMins = parseTimeToMinutes(endOpt);
      return endMins - startMins >= 30;
    });
  }, [startTime]);

  // Auto-adjust endTime if current endTime is less than 30 minutes after startTime
  useEffect(() => {
    const startMins = parseTimeToMinutes(startTime);
    const endMins = parseTimeToMinutes(endTime);
    if (endMins - startMins < 30) {
      if (availableEndTimes.length > 0) {
        setEndTime(availableEndTimes[0]);
      }
    }
  }, [startTime, endTime, availableEndTimes]);

  // Update selected subject when availableSubjects changes or class/group changes
  useEffect(() => {
    if (availableSubjects.length > 0) {
      if (!subject || !availableSubjects.includes(subject)) {
        setSubject(availableSubjects[0]);
      }
    }
  }, [availableSubjects, studentClass, group, subject]);

  // Auto conflict checking when room, class, section, date change
  useEffect(() => {
    if (!date || !roomNo) {
      setConflictWarning(null);
      return;
    }
    const conflict = existingExams.find(
      (e) =>
        e.date === date &&
        (e.roomNo.toLowerCase() === roomNo.toLowerCase() ||
          (e.studentClass === studentClass && e.section === section)) &&
        e.status !== "Cancelled"
    );
    if (conflict) {
      setConflictWarning(
        `Warning: ${conflict.roomNo} / ${conflict.studentClass} (${conflict.section}) already has an exam ("${conflict.title}") scheduled on ${date}.`
      );
    } else {
      setConflictWarning(null);
    }
  }, [date, roomNo, studentClass, section, existingExams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Please enter an Examination Title.");
      return;
    }
    if (!date) {
      setErrorMessage("Please select an Examination Date.");
      return;
    }
    if (!syllabus.trim()) {
      setErrorMessage("Syllabus & Guidelines is a REQUIRED field.");
      return;
    }

    // 30 Minutes Minimum Duration Rule
    const startMins = parseTimeToMinutes(startTime);
    const endMins = parseTimeToMinutes(endTime);
    const durationMins = endMins - startMins;

    if (durationMins < 30) {
      setErrorMessage(
        `The examination duration must be at least 30 minutes. (Selected duration: ${Math.max(0, durationMins)} minute(s)).`
      );
      return;
    }

    // Lead-Time Validation Rules
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      setErrorMessage("Examination date cannot be set in the past.");
      return;
    }

    // 100 Marks Rule: Must be scheduled at least 7 days in advance
    if (totalMarks >= 100 && diffDays < 7) {
      setErrorMessage(
        `For a 100-mark exam, you must schedule the examination at least 7 days in advance. (Selected date is ${diffDays} day(s) from today).`
      );
      return;
    }

    // 50 Marks Rule: Must be scheduled at least 3 days in advance
    if (totalMarks >= 50 && totalMarks < 100 && diffDays < 3) {
      setErrorMessage(
        `For a 50-mark exam, you must schedule the examination at least 3 days in advance. (Selected date is ${diffDays} day(s) from today).`
      );
      return;
    }

    const finalInvigilator = isYourDuty
      ? (currentTeacherName || "Assigned Teacher")
      : (invigilator.trim() || "Unassigned");

    setIsSubmitting(true);
    await onSubmit({
      title,
      subject,
      studentClass,
      section,
      group: studentClass === "Class 9" || studentClass === "Class 10" ? group : undefined,
      examType,
      date,
      startTime,
      endTime,
      roomNo,
      totalMarks: Number(totalMarks),
      passingMarks: Number(passingMarks),
      invigilator: finalInvigilator,
      isYourDuty,
      syllabus: syllabus.trim(),
      teacherEmail: currentTeacherEmail,
    });
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const inputStyle =
    "mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-indigo-600 focus:bg-slate-100/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-800";

  const showGroupField = studentClass === "Class 9" || studentClass === "Class 10";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 sm:py-6 overflow-y-auto backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Schedule New Examination
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Save examination details into database collection.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Room/Class Conflict Warning */}
            {conflictWarning && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{conflictWarning}</span>
              </div>
            )}

            {/* Title & Exam Type */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Mathematics Assessment"
                  className={inputStyle}
                />
              </div>

              <div>
                <CustomFormSelect
                  label="Exam Type"
                  required
                  value={examType}
                  options={Array.from(EXAM_TYPE_OPTIONS)}
                  onChange={(val) => setExamType(val as ExamItem["examType"])}
                  icon={Layers}
                />
              </div>
            </div>

            {/* Class, Section, Group (for Class 9/10), Subject */}
            <div className={`grid grid-cols-1 gap-3 ${showGroupField ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
              <div>
                <CustomFormSelect
                  label="Class"
                  required
                  value={studentClass}
                  options={CLASS_OPTIONS.filter((c) => c !== "All Classes")}
                  onChange={setStudentClass}
                  icon={BookOpen}
                />
              </div>

              <div>
                <CustomFormSelect
                  label="Section"
                  required
                  value={section}
                  options={SECTION_OPTIONS}
                  onChange={setSection}
                />
              </div>

              {showGroupField && (
                <div>
                  <CustomFormSelect
                    label="Group / Stream"
                    required
                    value={group}
                    options={GROUP_OPTIONS}
                    onChange={setGroup}
                  />
                </div>
              )}

              <div>
                <CustomFormSelect
                  label="Subject"
                  required
                  value={subject}
                  options={availableSubjects}
                  onChange={setSubject}
                  icon={BookMarked}
                />
              </div>
            </div>

            {/* Date, Start Time Dropdown, End Time Dropdown */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Exam Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputStyle}
                />
              </div>

              <div>
                <CustomFormSelect
                  label="Start Time"
                  required
                  value={startTime}
                  options={START_TIME_OPTIONS}
                  onChange={setStartTime}
                  icon={Clock}
                />
              </div>

              <div>
                <CustomFormSelect
                  label="End Time"
                  required
                  value={endTime}
                  options={availableEndTimes.length > 0 ? availableEndTimes : END_TIME_OPTIONS}
                  onChange={setEndTime}
                  icon={Clock}
                  helperText={
                    parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime) >= 30
                      ? `Duration: ${parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime)} mins`
                      : "Minimum 30 mins required"
                  }
                />
              </div>
            </div>

            {/* Room Select Dropdown, Invigilator Name */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <CustomFormSelect
                  label="Room / Hall No."
                  required
                  value={roomNo}
                  options={availableRooms}
                  onChange={setRoomNo}
                  icon={MapPin}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Invigilator Name</span>
                  {isYourDuty && (
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black">
                      Locked (Your Duty)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  disabled={isYourDuty}
                  value={isYourDuty ? (currentTeacherName || "Assigned Teacher (You)") : invigilator}
                  onChange={(e) => setInvigilator(e.target.value)}
                  placeholder="e.g. Dr. Rahim Khan (or empty for Unassigned)"
                  className={`${inputStyle} ${isYourDuty
                    ? "cursor-not-allowed opacity-80 bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-bold border-indigo-200/80 dark:border-indigo-500/30"
                    : ""
                    }`}
                />
              </div>
            </div>

            {/* Invigilation Duty Toggle Field (isYourDuty) */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-700/80 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Your Assigned Duty (<code className="text-[11px] text-indigo-600 dark:text-indigo-400">isYourDuty</code>)
                </span>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {isYourDuty
                    ? "Check if you are assigned to invigilate this examination schedule."
                    : "Standard faculty or unassigned invigilation duty."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsYourDuty(!isYourDuty)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isYourDuty ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isYourDuty ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            {/* Total Marks Dropdown & Auto Passing Marks */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <CustomFormSelect
                  label="Total Marks"
                  required
                  value={totalMarks}
                  options={[
                    { label: "50 Marks", value: 50 },
                    { label: "100 Marks", value: 100 },
                  ]}
                  onChange={(val) => setTotalMarks(Number(val))}
                  icon={Award}
                  helperText={totalMarks === 100 ? "Requires ≥7 days notice" : "Requires ≥3 days notice"}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Passing Marks (Auto 40%)
                </label>
                <div className="flex h-10 w-full items-center rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-xs font-black text-slate-900 dark:border-slate-700 dark:bg-slate-800/90 dark:text-emerald-400">
                  {passingMarks} pts (40%)
                </div>
                <p className="mt-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  Fixed pass threshold automatically set to 40%
                </p>
              </div>
            </div>

            {/* Syllabus & Guidelines (REQUIRED) */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Syllabus & Guidelines * (Required)
              </label>
              <textarea
                required
                rows={3}
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                placeholder="Enter covered chapters, topics, or exam hall guidelines (Required)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 outline-none transition-all focus:border-indigo-600 focus:bg-slate-100/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
              />
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save & Schedule Exam</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ========================================================= */
/* REUSABLE CUSTOM MODERN FORM SELECT COMPONENT */
/* ========================================================= */
function CustomFormSelect({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  required = false,
  helperText,
  placeholder = "Select option...",
}: {
  label?: string;
  value: string | number;
  options: (string | number)[] | { label: string; value: string | number }[];
  onChange: (val: any) => void;
  icon?: React.ElementType;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const normalizedOptions = options.map((opt) =>
    typeof opt === "object" ? opt : { label: String(opt), value: opt }
  );

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-indigo-600 dark:text-indigo-400">*</span>}
          </span>
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-slate-50/90 px-3.5 text-xs font-semibold outline-none transition-all duration-200 cursor-pointer dark:bg-slate-800/80 ${isOpen
          ? "border-indigo-500 bg-white ring-4 ring-indigo-500/15 shadow-sm dark:border-indigo-400 dark:bg-slate-800 text-slate-900 dark:text-white"
          : "border-slate-200/90 text-slate-800 hover:border-indigo-400 hover:bg-slate-100/80 dark:border-slate-700/80 dark:text-slate-100 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
          }`}
      >
        <span className="truncate flex items-center gap-2">
          {Icon && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-105 dark:bg-indigo-500/15 dark:text-indigo-400">
              <Icon className="h-3.5 w-3.5" />
            </span>
          )}
          <span className={selectedOption ? "font-bold text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500 font-normal"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : "group-hover:text-slate-600 dark:group-hover:text-slate-300"
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/70"
          >
            <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar pr-0.5">
              {normalizedOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-all cursor-pointer ${isSelected
                      ? "bg-indigo-50/90 text-indigo-700 font-extrabold dark:bg-indigo-500/20 dark:text-indigo-300 shadow-2xs"
                      : "text-slate-700 font-semibold hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {isSelected && <span className="h-3.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />}
                      <span className="truncate">{opt.label}</span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {helperText && <p className="mt-1 text-[10px] text-slate-500 font-medium">{helperText}</p>}
    </div>
  );
}

/* ========================================================= */
/* CANCEL CONFIRMATION MODAL - FULLY RESPONSIVE */
/* ========================================================= */
function CancelExamModal({
  isOpen,
  exam,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  exam: ExamItem | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [isCancelling, setIsCancelling] = useState(false);

  if (!isOpen || !exam) return null;

  const handleCancelClick = async () => {
    setIsCancelling(true);
    await onConfirm();
    setIsCancelling(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          onClick={isCancelling ? undefined : onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[calc(100%-1.5rem)] sm:max-w-sm md:max-w-[390px] max-h-[85vh] overflow-y-auto rounded-xl border border-rose-200/90 bg-white p-4 sm:p-5 shadow-2xl dark:border-rose-500/40 dark:bg-slate-950 custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer disabled:opacity-50"
            title="Close Modal"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200/80 dark:border-rose-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Cancellation Confirmation
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Cancel Examination Schedule?
              </h3>
            </div>
          </div>

          <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to cancel <strong className="text-slate-900 dark:text-white">&quot;{exam.title}&quot;</strong> for <span className="font-bold text-indigo-600 dark:text-indigo-400">{exam.studentClass} ({exam.section})</span> on {exam.date}?
          </p>

          <div className="mt-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 p-2.5 sm:p-3 text-[11px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-500/20">
            This will update the examination status to <span className="font-extrabold uppercase">Cancelled</span>.
          </div>

          <div className="mt-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-2.5 border-t border-slate-100 pt-3.5 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isCancelling}
              className="w-full sm:w-auto justify-center rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
            >
              Keep Exam
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isCancelling}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-rose-500/20 hover:bg-rose-700 cursor-pointer disabled:opacity-50"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Ban className="h-3.5 w-3.5" />
                  <span>Yes, Cancel Exam</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ========================================================= */
/* EXAM DETAIL MODAL - FULLY RESPONSIVE */
/* ========================================================= */
function ExamDetailModal({
  isOpen,
  exam,
  onClose,
}: {
  isOpen: boolean;
  exam: ExamItem | null;
  onClose: () => void;
}) {
  if (!isOpen || !exam) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <BookMarked className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {exam.examType} Assessment
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {exam.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Class & Section</p>
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  {exam.studentClass} ({exam.section}) {exam.group ? `- ${exam.group}` : ""}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Subject</p>
                <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">{exam.subject}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Date & Time</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {exam.date} · {exam.startTime} - {exam.endTime}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Room / Hall</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{exam.roomNo}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200/80 p-3.5 dark:border-slate-700/80">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Total Marks</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{exam.totalMarks} pts</p>
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Pass Mark: {exam.passingMarks} ({Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 p-3.5 dark:border-slate-700/80">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Invigilator</p>
                <p className="text-xs font-black text-slate-900 dark:text-white mt-1">
                  {exam.invigilator || "Unassigned"}
                </p>
                {exam.isYourDuty ? (
                  <span className="mt-1 inline-flex items-center rounded-md bg-indigo-100 px-2 py-0.5 text-[9px] font-black text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                    Your Assigned Duty
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Standard Faculty Duty</span>
                )}
              </div>
            </div>

            {exam.syllabus && (
              <div className="rounded-xl bg-indigo-50/60 p-4 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Syllabus & Guidelines
                </p>
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {exam.syllabus}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ========================================================= */
/* HELPER COMPONENTS */
/* ========================================================= */

function ExaminationTableSkeleton() {
  return (
    <>
      {/* Desktop Table Skeleton */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100/80 bg-slate-50/70 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 dark:border-slate-800/80 dark:bg-slate-900/90">
              <th className="px-6 py-4">Examination & Subject</th>
              <th className="px-6 py-4">Class & Section</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/80">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {/* Examination & Subject */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-9 w-9 shrink-0 rounded-lg skeleton-shimmer" />
                    <div className="space-y-2">
                      <div className="h-3.5 w-44 rounded-md skeleton-shimmer" />
                      <div className="h-2.5 w-28 rounded-md skeleton-shimmer-subtle" />
                    </div>
                  </div>
                </td>

                {/* Class & Section */}
                <td className="px-6 py-4">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 rounded-md skeleton-shimmer" />
                    <div className="h-2.5 w-16 rounded-md skeleton-shimmer-subtle" />
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <div className="h-3.5 w-20 rounded-md skeleton-shimmer" />
                </td>

                {/* Time */}
                <td className="px-6 py-4">
                  <div className="h-3.5 w-16 rounded-md skeleton-shimmer" />
                </td>

                {/* Room */}
                <td className="px-6 py-4">
                  <div className="h-3.5 w-16 rounded-md skeleton-shimmer" />
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="h-6 w-20 rounded-full skeleton-shimmer" />
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-16 rounded-xl skeleton-shimmer" />
                    <div className="h-8 w-16 rounded-xl skeleton-shimmer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="h-4 w-20 rounded skeleton-shimmer" />
                <div className="h-4 w-40 rounded skeleton-shimmer" />
                <div className="h-3 w-28 rounded skeleton-shimmer-subtle" />
              </div>
              <div className="h-6 w-16 rounded-full skeleton-shimmer" />
            </div>
            <div className="h-16 w-full rounded-lg skeleton-shimmer-subtle" />
            <div className="flex justify-end gap-2 pt-1">
              <div className="h-7 w-20 rounded-lg skeleton-shimmer" />
              <div className="h-7 w-20 rounded-lg skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

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
      className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl dark:shadow-black/70"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
        {value === "..." ? (
          <div className="h-7 w-12 rounded-md skeleton-shimmer my-0.5" />
        ) : (
          value
        )}
      </div>

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

  if (status === "Cancelled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
      Completed
    </span>
  );
}

function ExamTypeBadge({ type }: { type: ExamItem["examType"] }) {
  if (type === "Mid-Term" || type === "Final Term") {
    return (
      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-extrabold text-purple-600 dark:bg-purple-500/15 dark:text-purple-300 border border-purple-200/60 dark:border-purple-500/20">
        {type}
      </span>
    );
  }

  if (type === "Class Test") {
    return (
      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-500/20">
        {type}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/20">
      {type}
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
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-slate-50/90 px-3.5 text-xs font-bold transition-all duration-200 cursor-pointer dark:bg-slate-800/80 ${isOpen
          ? "border-indigo-500 bg-white ring-4 ring-indigo-500/15 shadow-sm dark:border-indigo-400 dark:bg-slate-800 text-slate-900 dark:text-white"
          : "border-slate-200/90 text-slate-700 hover:border-indigo-400 hover:bg-slate-100/80 dark:border-slate-700/80 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
          }`}
      >
        <span className="truncate flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-105 dark:bg-indigo-500/15 dark:text-indigo-400">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="truncate">{value}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : "group-hover:text-slate-600 dark:group-hover:text-slate-300"
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+0.35rem)] z-50 w-full min-w-[170px] rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-2xl backdrop-blur-2xl dark:border-slate-800/90 dark:bg-black/95 dark:shadow-black/70"
          >
            <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar pr-0.5">
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
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-all cursor-pointer ${isSelected
                      ? "bg-indigo-50/90 text-indigo-700 font-extrabold dark:bg-indigo-500/20 dark:text-indigo-300 shadow-2xs"
                      : "text-slate-700 font-semibold hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {isSelected && <span className="h-3.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />}
                      <span className="truncate">{option}</span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}