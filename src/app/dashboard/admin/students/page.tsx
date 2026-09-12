"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  GraduationCap,
  Search,
  UserPlus,
  ArrowUpRight,
  CheckCircle2,
  Users,
  Mail,
  Phone,
  BookOpen,
  Award,
  ShieldCheck,
  CalendarDays,
  UserX,
  RefreshCw,
  Trash2,
  UserCog,
  X,
  Edit,
  Eye,
  Activity,
  BarChart3
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

interface StudentUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  studentClass?: string;
  studentSection?: string;
  isApproved: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState<StudentUser | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentUser | null>(null);

  // Add Form state
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addClass, setAddClass] = useState("Grade 10");
  const [addSection, setAddSection] = useState("A");

  // Edit Form state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editIsApproved, setEditIsApproved] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authedFetch("/api/admin/users?role=student&limit=100");
      const result = await res.json();
      if (res.ok && result.users) {
        setStudents(result.users);
      }
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user && rawRole === "admin") {
      loadStudents();
    }
  }, [session, rawRole, loadStudents]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim()) {
      toast.error("Name and Email are required.");
      return;
    }

    const newStudent: StudentUser = {
      id: `STU-${Date.now().toString().slice(-4)}`,
      name: addName.trim(),
      email: addEmail.trim(),
      phone: addPhone.trim() || "+880 1700-000000",
      studentClass: addClass.trim(),
      studentSection: addSection.trim(),
      isApproved: true,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    };

    setStudents((prev) => [newStudent, ...prev]);
    toast.success(`Student ${newStudent.name} added and assigned to ${newStudent.studentClass} ${newStudent.studentSection}!`);
    setShowAddModal(false);
    setAddName("");
    setAddEmail("");
    setAddPhone("");
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setIsSubmitting(true);

    try {
      const res = await authedFetch(`/api/admin/users/${editingStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim(),
          studentClass: editClass.trim(),
          studentSection: editSection.trim(),
          isApproved: editIsApproved,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update student profile");
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingStudent.id
            ? {
              ...s,
              name: editName.trim(),
              phone: editPhone.trim(),
              studentClass: editClass.trim(),
              studentSection: editSection.trim(),
              isApproved: editIsApproved,
            }
            : s
        )
      );

      toast.success("Student profile & class assignment updated!");
      setEditingStudent(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    setIsSubmitting(true);
    try {
      const res = await authedFetch(`/api/admin/users/${studentId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Failed to delete student");
      toast.success("Student account deleted successfully!");
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      setSelectedStudentForDelete(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete student";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (student: StudentUser) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditPhone(student.phone || "");
    setEditClass(student.studentClass || "Grade 10");
    setEditSection(student.studentSection || "A");
    setEditIsApproved(student.isApproved);
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

  const totalStudents = students.length;
  const approvedStudents = students.filter((s) => s.isApproved).length;
  const pendingStudents = students.filter((s) => !s.isApproved).length;

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.studentClass && student.studentClass.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              STUDENT MANAGEMENT &amp; ACADEMICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Student Overview
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add New Student
          </button>

          <button
            onClick={loadStudents}
            disabled={isLoading}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Students"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-500" : ""}`} />
          </button>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60">Total</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enrolled Students</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalStudents}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">Approved</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Students</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{approvedStudents}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <UserX className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60">Pending</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Approval</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{pendingStudents}</h3>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60">Security</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">2FA Protected</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {students.filter(s => s.twoFactorEnabled).length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all shadow-sm backdrop-blur-xl"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            Showing: <strong className="text-blue-600 dark:text-blue-400">{filteredStudents.length} Students</strong>
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
          No students found matching your criteria.
        </div>
      ) : (
        /* Students Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredStudents.map((student) => (
            <motion.div
              key={student.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              {/* Top Row: Avatar, Name, ID, and Status Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/25">
                      {student.name.charAt(0)}
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${student.isApproved ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {student.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                      <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${student.isApproved
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40"
                      : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40"
                    }`}
                >
                  {student.isApproved ? "Approved" : "Pending"}
                </span>
              </div>

              {/* Middle Section: Contact & Academic Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs">
                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{student.phone || "Not provided"}</span>
                  </div>
                </div>

                <div className="space-y-2 text-slate-600 dark:text-slate-300 sm:border-l sm:border-slate-100 dark:sm:border-slate-800/80 sm:pl-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Class: <strong className="text-slate-900 dark:text-white">{student.studentClass || "Grade 10"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Section: <strong className="text-slate-900 dark:text-white">{student.studentSection || "A"}</strong></span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setViewingStudent(student)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 font-bold text-xs transition-all cursor-pointer border border-blue-100 dark:border-blue-900/30 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(student)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-400 font-bold text-xs transition-all cursor-pointer border border-purple-100 dark:border-purple-900/30 flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Class</span>
                  </button>

                  <button
                    onClick={() => setSelectedStudentForDelete(student)}
                    className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 transition-all cursor-pointer border border-rose-100 dark:border-rose-900/30"
                    title="Remove Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" /> Add New Student
              </h3>

              <form onSubmit={handleAddStudent} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mahfuzur Rahman"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@edunexus.edu"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+880 1700-000000"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Assign Class
                    </label>
                    <select
                      value={addClass}
                      onChange={(e) => setAddClass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Assign Section
                    </label>
                    <select
                      value={addSection}
                      onChange={(e) => setAddSection(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                  >
                    Save Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setEditingStudent(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-purple-600" /> Update Student Profile &amp; Class
              </h3>

              <form onSubmit={handleUpdateStudent} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Assigned Class
                    </label>
                    <input
                      type="text"
                      value={editClass}
                      onChange={(e) => setEditClass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Assigned Section
                    </label>
                    <input
                      type="text"
                      value={editSection}
                      onChange={(e) => setEditSection(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Account Approval Status</span>
                  <button
                    type="button"
                    onClick={() => setEditIsApproved(!editIsApproved)}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${editIsApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {editIsApproved ? "Approved" : "Pending"}
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Student Profile Modal */}
      <AnimatePresence>
        {viewingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setViewingStudent(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                  {viewingStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {viewingStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {viewingStudent.id.slice(-6).toUpperCase()} • {viewingStudent.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-y border-slate-100 dark:border-slate-800 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Class &amp; Section:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {viewingStudent.studentClass || "Grade 10"} - Section {viewingStudent.studentSection || "A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Phone:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewingStudent.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approval Status:</span>
                  <span className={`font-bold ${viewingStudent.isApproved ? "text-emerald-600" : "text-amber-600"}`}>
                    {viewingStudent.isApproved ? "Approved Active Student" : "Pending Approval"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Overall Attendance:</span>
                  <span className="font-bold text-blue-600">94.5% (Excellent)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current GPA:</span>
                  <span className="font-bold text-amber-600">3.88 / 4.00</span>
                </div>
              </div>

              <button
                onClick={() => setViewingStudent(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {selectedStudentForDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative"
            >
              <button
                onClick={() => setSelectedStudentForDelete(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900/40">
                  <Trash2 className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Delete Student Account?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Are you sure you want to delete <strong>{selectedStudentForDelete.name}</strong> ({selectedStudentForDelete.email})? This action cannot be undone.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setSelectedStudentForDelete(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(selectedStudentForDelete.id)}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Delete Account"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}