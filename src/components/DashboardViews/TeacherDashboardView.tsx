"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Award,
  Megaphone,
  Plus,
  Search,
  ListTodo,
  Calendar,
  Square,
  CheckSquare,
  Trash2,
  MapPin,
  RefreshCw,
  ChevronRight,
  SlidersHorizontal,
  ShieldCheck,
  Database,
  GraduationCap,
  Hash,
  Mail,
  PieChart,
  BarChart3,
  FileCheck,
  RotateCcw,
  FileCode,
  Bell,
  Activity,
  Hourglass,
  Command,
  User,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useSession } from "@/lib/auth-client";
import {
  getTeacherRequestsAction,
  ClassSubjectRequestItem,
} from "@/lib/actions/teacher.request";
import {
  getTeacherStudentsAction,
  StudentUser,
} from "@/lib/actions/teacher-students";
import { getTeacherExamsAction, ExamItem } from "@/lib/actions/teacher.exam";
import { getNoticesAction, NoticeItem } from "@/lib/actions/teacher.notice";

/* ========================================================= */
/* DUMMY / DEMO ANALYTICS DATA FOR OVERVIEW PREVIEWS */
/* ========================================================= */

const weeklyAttendanceDemo = [
  { day: "Mon", attendance: 92, present: 130, absent: 12 },
  { day: "Tue", attendance: 95, present: 135, absent: 7 },
  { day: "Wed", attendance: 89, present: 126, absent: 16 },
  { day: "Thu", attendance: 94, present: 133, absent: 9 },
  { day: "Fri", attendance: 97, present: 138, absent: 4 },
];

const attendanceDistributionDemo = [
  { name: "Present", value: 131, percentage: "92.3%", color: "#4f46e5" },
  { name: "Late", value: 6, percentage: "4.2%", color: "#f59e0b" },
  { name: "Absent", value: 5, percentage: "3.5%", color: "#ef4444" },
];

const classAttendanceRatesDemo = [
  { name: "Grade 10 A", rate: 97, present: 31, total: 32 },
  { name: "Grade 8 A", rate: 96, present: 29, total: 30 },
  { name: "Grade 9 A", rate: 94, present: 26, total: 28 },
  { name: "Grade 8 B", rate: 91, present: 27, total: 30 },
  { name: "Grade 9 B", rate: 88, present: 22, total: 25 },
];

const subjectResultsDemo = [
  { subject: "Mathematics", avgScore: 88, highest: 99, passRate: 96, grade: "A" },
  { subject: "Physics", avgScore: 92, highest: 100, passRate: 98, grade: "A+" },
  { subject: "Chemistry", avgScore: 84, highest: 96, passRate: 92, grade: "B+" },
  { subject: "Biology", avgScore: 89, highest: 97, passRate: 95, grade: "A" },
  { subject: "English", avgScore: 86, highest: 95, passRate: 94, grade: "A-" },
];

const recentTestResultsDemo = [
  { title: "Mid-Term Algebra Quiz", className: "Grade 8 A", date: "May 14, 2026", avg: "88%", passCount: "28/30", status: "Published" },
  { title: "Physics Motion Assessment", className: "Grade 10 A", date: "May 10, 2026", avg: "94%", passCount: "31/32", status: "Published" },
  { title: "Human Biology Lab Evaluation", className: "Grade 9 A", date: "May 06, 2026", avg: "85%", passCount: "25/28", status: "Published" },
];

interface ScheduleSlot {
  id: string;
  time: string;
  subject: string;
  grade: string;
  room: string;
  status: "In Progress" | "Up Next" | "Completed";
}

const todayScheduleDemo: ScheduleSlot[] = [
  { id: "s1", time: "08:30 AM - 09:30 AM", subject: "Physics", grade: "Grade 10 A", room: "Lab 302", status: "Completed" },
  { id: "s2", time: "10:15 AM - 11:15 AM", subject: "Mathematics", grade: "Grade 8 A", room: "Room 104", status: "In Progress" },
  { id: "s3", time: "01:30 PM - 02:30 PM", subject: "Chemistry", grade: "Grade 9 B", room: "Room 201", status: "Up Next" },
];

interface TeacherTask {
  id: string;
  text: string;
  completed: boolean;
  category: "Grading" | "Notice" | "Attendance" | "Preparation";
}

const defaultTasks: TeacherTask[] = [
  { id: "t1", text: "Grade Grade 10 A Physics Lab Papers", completed: false, category: "Grading" },
  { id: "t2", text: "Post Revision Schedule Notice for Mid-Terms", completed: true, category: "Notice" },
  { id: "t3", text: "Submit Daily Attendance for Grade 8 A", completed: false, category: "Attendance" },
  { id: "t4", text: "Prepare Quiz 3 Questions for Chemistry", completed: false, category: "Preparation" },
];

/* ========================================================= */
/* MAIN COMPONENT */
/* ========================================================= */

export default function TeacherDashboardView() {
  const { data: session } = useSession();
  const teacherEmail = session?.user?.email || "";
  const teacherName = session?.user?.name || "Teacher";

  // Real Data States
  const [assignedClassesCount, setAssignedClassesCount] = useState<number>(0);
  const [, setApprovedRequests] = useState<ClassSubjectRequestItem[]>([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState<number>(0);
  const [studentsList, setStudentsList] = useState<StudentUser[]>([]);
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [assignmentsCount, setAssignmentsCount] = useState<{ total: number; active: number }>({ total: 0, active: 0 });
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<ExamItem[]>([]);
  const [recentNotices, setRecentNotices] = useState<NoticeItem[]>([]);
  const [isLoadingRealData, setIsLoadingRealData] = useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>("");

  // Daily Tasks State (Persisted in localStorage)
  const [tasks, setTasks] = useState<TeacherTask[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edunexus_teacher_tasks");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return defaultTasks;
  });
  const [newTaskText, setNewTaskText] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("edunexus_teacher_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Fetch Real Database Metrics
  const fetchRealData = async () => {
    setIsLoadingRealData(true);
    try {
      if (teacherEmail) {
        const requestsRes = await getTeacherRequestsAction(teacherEmail);
        if (requestsRes.success) {
          const approved = requestsRes.requests.filter((r) => r.status === "APPROVED");
          setApprovedRequests(approved);
          setAssignedClassesCount(approved.length);
        }
      }

      const studentsRes = await getTeacherStudentsAction({ limit: 6 });
      if (studentsRes.success) {
        setStudentsList(studentsRes.students || []);
        setTotalStudentsCount(studentsRes.pagination?.total || studentsRes.students?.length || 0);
      }

      if (teacherEmail) {
        const token = typeof window !== "undefined" ? localStorage.getItem("better-auth.session_token") : null;
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        const assignRes = await fetch(`${serverUrl}/api/teacher/assignments?teacherEmail=${encodeURIComponent(teacherEmail)}`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const assignData = await assignRes.json();
        if (assignData.success) {
          const list = assignData.assignments || [];
          const active = list.filter((a: any) => a.status === "ACTIVE").length;
          setAssignmentsCount({ total: list.length, active });
          setRecentAssignments(list.slice(0, 3));
        }
      }

      const examsRes = await getTeacherExamsAction();
      if (examsRes.success) {
        setUpcomingExams((examsRes.exams || []).slice(0, 3));
      }

      const noticesRes = await getNoticesAction();
      if (noticesRes.success) {
        setRecentNotices((noticesRes.notices || []).slice(0, 3));
      }

      const now = new Date();
      setLastRefreshedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error("Error fetching real teacher dashboard metrics:", err);
    } finally {
      setIsLoadingRealData(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, [teacherEmail]);

  // Task Helpers
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: TeacherTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      category: "Preparation",
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskText("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredStudents = studentsList.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.studentClass?.toLowerCase().includes(q) ||
      s.roll?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900 dark:text-white max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
      {/* ===================================================== */}
      {/* EXECUTIVE HEADER BANNER */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Command className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  Academic Command Center
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Database className="h-3 w-3" />
                  Synced {lastRefreshedAt ? `(${lastRefreshedAt})` : ""}
                </span>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{teacherName}</span>
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Manage your daily teaching workflow: live sections, room schedules, enrolled student directory, assignments, and test evaluation metrics.
              </p>
            </div>
          </div>

          {/* Action Buttons & Sync */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 md:pt-0">
            <button
              onClick={fetchRealData}
              disabled={isLoadingRealData}
              title="Refresh Metrics"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingRealData ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/dashboard/teacher/students"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Directory</span>
            </Link>

            <Link
              href="/dashboard/teacher/my-classes"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-600 transition-all active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>My Classes</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* HIGH-CONTRAST TOP STAT CARDS GRID */}
      {/* ===================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          icon={BookOpen}
          label="Assigned Classes"
          value={String(assignedClassesCount)}
          isLoading={isLoadingRealData}
          detail="Active database sections"
          delay={0}
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={String(totalStudentsCount)}
          isLoading={isLoadingRealData}
          detail="Enrolled directory count"
          delay={0.04}
        />
        <StatCard
          icon={FileText}
          label="Active Courseworks"
          value={String(assignmentsCount.active)}
          isLoading={isLoadingRealData}
          detail={`${assignmentsCount.total} total courseworks`}
          delay={0.08}
        />
        <StatCard
          icon={Clock}
          label="Scheduled Exams"
          value={String(upcomingExams.length)}
          isLoading={isLoadingRealData}
          detail="Active exam schedules"
          delay={0.12}
        />
        <StatCard
          icon={CalendarCheck}
          label="Attendance Rate"
          value="94.1%"
          detail="Analytics preview"
          isIncomplete
          delay={0.16}
        />
        <StatCard
          icon={Award}
          label="Avg Result Score"
          value="87.4%"
          detail="Analytics preview"
          isIncomplete
          delay={0.2}
        />
      </div>

      {/* ===================================================== */}
      {/* SECTION 1: TODAY'S ROOM SCHEDULE & ACTION CHECKLIST */}
      {/* ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {/* Today's Room Schedule (2 Cols on LG) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 lg:col-span-2 flex flex-col justify-between"
        >
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    Today&apos;s Room Schedule
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Scheduled room sessions and class times</p>
                </div>
              </div>

              <Link
                href="/dashboard/teacher/my-classes"
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {todayScheduleDemo.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 sm:p-3.5 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40 shrink-0 font-bold text-xs">
                      <GraduationCap className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.subject}
                        </span>
                        <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold">
                          {item.grade}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {item.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {item.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase flex items-center gap-1 border ${item.status === "In Progress"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                          : item.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                        }`}
                    >
                      {item.status === "In Progress" && <Activity className="h-3 w-3 animate-pulse" />}
                      {item.status === "Completed" && <CheckSquare className="h-3 w-3" />}
                      {item.status === "Up Next" && <Hourglass className="h-3 w-3" />}
                      {item.status}
                    </span>

                    <Link
                      href="/dashboard/teacher/attendance"
                      className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-2xs hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 flex items-center gap-1 transition-all"
                    >
                      <CheckSquare className="h-3 w-3" />
                      <span>Log Attendance</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Daily Teacher Task Checklist (1 Col) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between"
        >
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                  <ListTodo className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Teacher Action Checklist
                </h3>
              </div>
              <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-md">
                {tasks.filter((t) => t.completed).length}/{tasks.length}
              </span>
            </div>

            {/* Task input form */}
            <form onSubmit={addTask} className="mb-3 flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="space-y-2 max-h-[210px] overflow-y-auto pr-0.5">
              {tasks.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">No active tasks.</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${task.completed
                        ? "border-slate-200 bg-slate-100/60 opacity-60 dark:border-slate-900 dark:bg-slate-900/40"
                        : "border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                      }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="h-4 w-4 shrink-0 text-slate-400" />
                      )}
                      <span
                        className={`text-xs truncate ${task.completed ? "line-through text-slate-400" : "font-bold text-slate-900 dark:text-white"
                          }`}
                      >
                        {task.text}
                      </span>
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="ml-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono">
              <Database className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> Local state
            </span>
            <button
              onClick={() => setTasks(defaultTasks)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-extrabold flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ===================================================== */}
      {/* SECTION 2: ENROLLED STUDENTS DIRECTORY PREVIEW */}
      {/* ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
              <Users className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1">
                  Enrolled Students Directory
                </h2>
                <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1">
                  ({totalStudentsCount})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Quick lookup for student section assignments and contacts
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
              />
            </div>

            <Link
              href="/dashboard/teacher/students"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all shrink-0"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Roster Cards Grid */}
        {isLoadingRealData ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            No matching student records.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map((st) => (
              <div
                key={st.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40 font-black text-xs">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {st.name}
                    </h4>
                    <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold shrink-0">
                      {st.studentClass || "Grade 10"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                    <Hash className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <strong>{st.roll || "N/A"}</strong>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <Mail className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">{st.email}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ===================================================== */}
      {/* SECTION 3: ATTENDANCE ANALYTICS (DEMO DATA) */}
      {/* ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
              <CalendarCheck className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Attendance Analytics
                </h2>
                <span className="rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1">
                  <PieChart className="h-3 w-3" /> DEMO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Daily presence trends, status breakdown, and section performance rates
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/teacher/attendance"
            className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all shrink-0"
          >
            <span>Explore Attendance</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Attendance Content Grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Chart 1: Weekly Area Chart */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Weekly Attendance Trend (%)
                </h3>
                <p className="text-[10px] text-slate-500">Monday to Friday presence percentage</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-2 py-0.5 rounded-md">
                <TrendingUp className="h-3 w-3" />
                +3.2%
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyAttendanceDemo} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendanceColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => `${val}%`} />
                  <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "11px", backgroundColor: "#0f172a", borderColor: "#334155", color: "#ffffff" }} formatter={(val) => [`${val}%`, "Rate"]} />
                  <Area type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={2.5} fill="url(#attendanceColor)" dot={{ r: 3.5, fill: "#4f46e5", stroke: "#ffffff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Today's Status Breakdown */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <PieChart className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Status Breakdown
            </h3>
            <p className="text-[10px] text-slate-500 mb-3">Today&apos;s session status distribution</p>

            <div className="space-y-2.5">
              {attendanceDistributionDemo.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg bg-white p-2.5 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{item.value}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 dark:text-white block flex items-center gap-1">
                <BarChart3 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> Class Rates
              </span>
              {classAttendanceRatesDemo.slice(0, 3).map((cls) => (
                <div key={cls.name} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-900 dark:text-white">{cls.name}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{cls.rate}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400" style={{ width: `${cls.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===================================================== */}
      {/* SECTION 4: EXAMINATIONS & RESULTS ANALYTICS (DEMO DATA) */}
      {/* ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
              <Award className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Examinations & Results Analytics
                </h2>
                <span className="rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1">
                  <PieChart className="h-3 w-3" /> DEMO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Academic progress metrics, grade distributions, and test logs
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/teacher/results"
            className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all shrink-0"
          >
            <span>Explore Results</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Results Content Grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Subject Performance Breakdown */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-xs font-black text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> Subject Grade & Pass Rate Averages
            </h3>
            <p className="text-[10px] text-slate-500 mb-3.5">Calculated across term quizzes and examinations</p>

            <div className="space-y-3">
              {subjectResultsDemo.map((item) => (
                <div key={item.subject} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{item.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold">
                        Grade {item.grade}
                      </span>
                      <span className="font-black text-slate-900 dark:text-white">{item.avgScore}%</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400"
                      style={{ width: `${item.avgScore}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Highest: {item.highest}%</span>
                    <span>Pass Rate: {item.passRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Published Test Evaluation Logs */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-xs font-black text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> Published Test Evaluations
            </h3>
            <p className="text-[10px] text-slate-500 mb-3.5">Recent exam results published to student portals</p>

            <div className="space-y-3">
              {recentTestResultsDemo.map((test) => (
                <div key={test.title} className="rounded-xl border border-slate-200/90 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        {test.title}
                      </h4>
                      <p className="mt-0.5 text-[10px] text-slate-500">{test.className} • {test.date}</p>
                    </div>
                    <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-2 py-0.5 text-[9px] font-bold uppercase shrink-0">
                      {test.status}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                    <span className="text-slate-500 dark:text-slate-400">Class Avg: <strong className="text-slate-900 dark:text-white">{test.avg}</strong></span>
                    <span className="text-slate-500 dark:text-slate-400">Passed: <strong className="text-slate-900 dark:text-white">{test.passCount}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===================================================== */}
      {/* SECTION 5: LIVE OPERATIONAL FEEDS (EXAMS, COURSEWORKS, NOTICES) */}
      {/* ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Real Data Block 1: Upcoming Exams Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between"
        >
          <div>
            <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Live Upcoming Exams
                </h3>
              </div>
              <Link
                href="/dashboard/teacher/examinations"
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>All ({upcomingExams.length})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {isLoadingRealData ? (
              <div className="space-y-2.5">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
                ))}
              </div>
            ) : upcomingExams.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No upcoming exam schedules in system.</p>
            ) : (
              <div className="space-y-2.5">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {exam.subject}
                      </span>
                      <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold">{exam.studentClass}</span>
                    </div>
                    <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white truncate">{exam.title}</h4>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {exam.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {exam.roomNo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Real Data Block 2: Recent Courseworks / Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between"
        >
          <div>
            <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Live Courseworks
                </h3>
              </div>
              <Link
                href="/dashboard/teacher/assignments"
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>All ({assignmentsCount.total})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {isLoadingRealData ? (
              <div className="space-y-2.5">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
                ))}
              </div>
            ) : recentAssignments.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No active courseworks found.</p>
            ) : (
              <div className="space-y-2.5">
                {recentAssignments.map((asgn) => (
                  <div key={asgn.id} className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <FileCode className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {asgn.subject}
                      </span>
                      <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold">
                        {asgn.status}
                      </span>
                    </div>
                    <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white truncate">{asgn.title}</h4>
                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> Due: {asgn.dueDate || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Real Data Block 3: School Notices & Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between md:col-span-2 lg:col-span-1"
        >
          <div>
            <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                  <Megaphone className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Live School Notices
                </h3>
              </div>
              <Link
                href="/dashboard/teacher/notices"
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>All ({recentNotices.length})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {isLoadingRealData ? (
              <div className="space-y-2.5">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
                ))}
              </div>
            ) : recentNotices.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No notices published yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-1">
                        <Bell className="h-3 w-3" /> {notice.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{notice.date}</span>
                    </div>
                    <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white truncate">{notice.title}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ===================================================== */}
      {/* ROUTE NAVIGATION HUB WITH DEDICATED ICONS */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.45 }}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> Portal Route Shortcuts
          </h3>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Direct Navigation Hub
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          <RouteShortcut href="/dashboard/teacher/my-classes" label="My Classes" badge="Live DB" icon={BookOpen} />
          <RouteShortcut href="/dashboard/teacher/students" label="Students" badge="Live DB" icon={Users} />
          <RouteShortcut href="/dashboard/teacher/assignments" label="Assignments" badge="Live DB" icon={FileText} />
          <RouteShortcut href="/dashboard/teacher/examinations" label="Exams" badge="Live DB" icon={Clock} />
          <RouteShortcut href="/dashboard/teacher/notices" label="Notices" badge="Live DB" icon={Megaphone} />
          <RouteShortcut href="/dashboard/teacher/attendance" label="Attendance" badge="Demo Data" icon={CalendarCheck} isDemo />
          <RouteShortcut href="/dashboard/teacher/results" label="Results" badge="Demo Data" icon={Award} isDemo />
        </div>
      </motion.div>
    </div>
  );
}

/* ========================================================= */
/* MONOCHROMATIC / ACCENTED STAT CARD COMPONENT */
/* ========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  isLoading,
  isIncomplete,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  isLoading?: boolean;
  isIncomplete?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="relative rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-indigo-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
          <Icon className="h-4 w-4" />
        </div>
        {isIncomplete && (
          <span className="rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-1.5 py-0.5 text-[8px] font-mono font-bold flex items-center gap-1">
            <PieChart className="h-3 w-3" /> DEMO
          </span>
        )}
      </div>

      <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
        {label}
      </p>

      {isLoading || value === "..." ? (
        <div className="my-1.5 h-6 w-16 rounded-md bg-slate-200/90 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
      ) : (
        <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">{value}</p>
      )}

      <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">{detail}</p>
    </motion.div>
  );
}

/* ========================================================= */
/* ACCENTED ROUTE SHORTCUT COMPONENT */
/* ========================================================= */

function RouteShortcut({
  href,
  label,
  badge,
  icon: Icon,
  isDemo,
}: {
  href: string;
  label: string;
  badge: string;
  icon: React.ElementType;
  isDemo?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between rounded-xl border p-3 transition-all hover:border-indigo-500 hover:shadow-sm dark:hover:border-indigo-500/40 ${isDemo
          ? "border-slate-200/90 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40"
          : "border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-950"
        }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
        </div>
        <p className="mt-2.5 text-xs font-bold text-slate-900 dark:text-white truncate">{label}</p>
      </div>

      <span className="mt-2 text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400">{badge}</span>
    </Link>
  );
}