"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Users,
  Search,
  Mail,
  BookOpen,
  CheckCircle2,
  UserX,
  Coffee,
  Activity,
  ShieldCheck,
  CalendarDays,
  RefreshCw,
  Trash2,
  UserCog,
  LockKeyhole,
  X,
  ChevronDown,
  UserPlus,
  Edit,
  GraduationCap,
  Briefcase
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

interface Teacher {
  id: string;
  name: string;
  email: string;
  image?: string;
  department?: string;
  qualification?: string;
  isApproved: boolean;
  twoFactorEnabled: boolean;
  lockedUntil?: string | null;
  createdAt: string;
  assignedSubject?: string;
  assignedClass?: string;
  availability?: "Active" | "On Leave";
}

type ModalAction = 
  | { type: "role"; teacher: Teacher } 
  | { type: "delete"; teacher: Teacher } 
  | { type: "disapprove"; teacher: Teacher } 
  | { type: "edit"; teacher: Teacher }
  | null;

export default function AdminTeachersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<ModalAction>(null);
  const [isActing, setIsActing] = useState(false);
  const [newRole, setNewRole] = useState("student");
  const [showAddModal, setShowAddModal] = useState(false);

  // Add teacher states
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addDept, setAddDept] = useState("Computer Science");
  const [addQual, setAddQual] = useState("M.Sc. in Engineering");

  // Edit teacher states
  const [editDept, setEditDept] = useState("");
  const [editQual, setEditQual] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editAvailability, setEditAvailability] = useState<"Active" | "On Leave">("Active");

  useEffect(() => {
    if (!isPending && (!session?.user || rawRole !== "admin")) {
      router.replace("/unauthorized");
    }
  }, [session, rawRole, isPending, router]);

  const loadTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authedFetch("/api/admin/users?role=teacher&limit=100");
      const data = await res.json();
      if (res.ok) setTeachers(data.users ?? []);
    } catch {
      toast.error("Failed to load teachers.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user && rawRole === "admin") loadTeachers();
  }, [session, rawRole, loadTeachers]);

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim()) {
      toast.error("Name and Email are required.");
      return;
    }

    const created: Teacher = {
      id: `TCH-${Date.now().toString().slice(-4)}`,
      name: addName.trim(),
      email: addEmail.trim(),
      department: addDept,
      qualification: addQual,
      isApproved: true,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      assignedSubject: "Mathematics",
      assignedClass: "Grade 10 A",
      availability: "Active",
    };

    setTeachers((prev) => [created, ...prev]);
    toast.success(`Teacher "${created.name}" added successfully!`);
    setShowAddModal(false);
    setAddName("");
    setAddEmail("");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || modal.type !== "edit" || isActing) return;
    setIsActing(true);

    try {
      const res = await authedFetch(`/api/admin/users/${modal.teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: editDept,
          qualification: editQual,
        }),
      });

      if (!res.ok) throw new Error("Failed to update teacher profile");

      setTeachers((prev) =>
        prev.map((t) =>
          t.id === modal.teacher.id
            ? {
                ...t,
                department: editDept,
                qualification: editQual,
                assignedSubject: editSubject,
                assignedClass: editClass,
                availability: editAvailability,
              }
            : t
        )
      );

      toast.success(`Updated ${modal.teacher.name}'s profile & assignments!`);
      setModal(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update teacher.");
    } finally {
      setIsActing(false);
    }
  };

  const handleDelete = async () => {
    if (!modal || modal.type !== "delete" || isActing) return;
    setIsActing(true);
    try {
      const res = await authedFetch(`/api/admin/users/${modal.teacher.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message);
      setTeachers((prev) => prev.filter((t) => t.id !== modal.teacher.id));
      setModal(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to delete.");
    } finally {
      setIsActing(false);
    }
  };

  const handleDisapprove = async () => {
    if (!modal || modal.type !== "disapprove" || isActing) return;
    setIsActing(true);
    try {
      const res = await authedFetch(`/api/admin/users/${modal.teacher.id}/disapprove`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message);
      setTeachers((prev) => prev.map((t) => t.id === modal.teacher.id ? { ...t, isApproved: false } : t));
      setModal(null);
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    } finally {
      setIsActing(false);
    }
  };

  const handleRoleChange = async () => {
    if (!modal || modal.type !== "role" || isActing) return;
    setIsActing(true);
    try {
      const res = await authedFetch(`/api/admin/users/${modal.teacher.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message);
      setTeachers((prev) => prev.filter((t) => t.id !== modal.teacher.id));
      setModal(null);
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    } finally {
      setIsActing(false);
    }
  };

  const openEditModal = (t: Teacher) => {
    setModal({ type: "edit", teacher: t });
    setEditDept(t.department || "General Sciences");
    setEditQual(t.qualification || "M.Sc");
    setEditSubject(t.assignedSubject || "Mathematics");
    setEditClass(t.assignedClass || "Grade 10 A");
    setEditAvailability(t.availability || "Active");
  };

  if (isPending) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (!session?.user || rawRole !== "admin") return null;

  const approved = teachers.filter((t) => t.isApproved).length;
  const unapproved = teachers.filter((t) => !t.isApproved).length;

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.department || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 text-purple-600 dark:text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-1 text-xs font-semibold rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
              FACULTY MANAGEMENT &amp; ASSIGNMENTS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Teachers Overview
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Teacher
          </button>

          <button
            onClick={loadTeachers}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-60"
            title="Refresh Teachers"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Faculty", value: teachers.length, icon: Users, color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60" },
          { label: "Approved Staff", value: approved, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" },
          { label: "Pending Access", value: unapproved, icon: Coffee, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" },
          { label: "Showing Now", value: filteredTeachers.length, icon: Activity, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60" },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-lg flex flex-col justify-between">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{card.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {isLoading ? <span className="inline-block h-6 w-10 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /> : card.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-all shadow-sm"
        />
      </div>

      {/* Teachers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <UserX className="w-10 h-10 text-slate-400" />
          <p className="text-sm font-bold text-slate-900 dark:text-white">No teachers found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try a different search term</p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                        {teacher.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${teacher.isApproved ? "bg-emerald-500" : "bg-rose-500"}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{teacher.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {teacher.email}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${teacher.isApproved ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40" : "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/40"}`}>
                    {teacher.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 dark:border-slate-800 py-3">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                    <span>Dept: {teacher.department || "General Science"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    <span>Subject: {teacher.assignedSubject || "Mathematics"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Class: {teacher.assignedClass || "Grade 10 A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Status: <strong className="text-emerald-600">{teacher.availability || "Active"}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(teacher)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-purple-100 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition-all"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Assign &amp; Edit
                  </button>
                  <button
                    onClick={() => { setNewRole("student"); setModal({ type: "role", teacher }); }}
                    className="p-2 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                    title="Change Role"
                  >
                    <UserCog className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setModal({ type: "delete", teacher })}
                    className="p-2 rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                    title="Delete Teacher"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Add Teacher Modal */}
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
                <UserPlus className="w-5 h-5 text-purple-600" /> Add New Teacher
              </h3>

              <form onSubmit={handleAddTeacher} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Teacher Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Shafiqul Islam"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="teacher@edunexus.edu"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="Physics"
                      value={addDept}
                      onChange={(e) => setAddDept(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      placeholder="Ph.D in Science"
                      value={addQual}
                      onChange={(e) => setAddQual(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
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
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20"
                  >
                    Save Teacher
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Teacher & Assign Subject/Class Modal */}
      <AnimatePresence>
        {modal && modal.type === "edit" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-purple-600" /> Assign Subject, Class &amp; Edit Profile
              </h3>

              <form onSubmit={handleEditSave} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={editQual}
                      onChange={(e) => setEditQual(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Assign Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mathematics"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Assign Class
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grade 10 A"
                      value={editClass}
                      onChange={(e) => setEditClass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Teacher Availability Status
                  </label>
                  <select
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value as "Active" | "On Leave")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Active">Active Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isActing}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 disabled:opacity-50"
                  >
                    {isActing ? "Saving..." : "Save Assignments"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation & Role Modals */}
      <AnimatePresence>
        {modal && modal.type !== "edit" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={() => !isActing && setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <button onClick={() => !isActing && setModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>

              {modal.type === "delete" && (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 mb-3"><Trash2 className="w-5 h-5" /></div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete {modal.teacher.name}?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">This will permanently delete the account and all data.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setModal(null)} disabled={isActing} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm py-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-60">Cancel</button>
                    <button onClick={handleDelete} disabled={isActing} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                      {isActing ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : "Delete"}
                    </button>
                  </div>
                </>
              )}

              {modal.type === "disapprove" && (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 mb-3"><UserX className="w-5 h-5" /></div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Revoke access for {modal.teacher.name}?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">They will not be able to log in until re-approved.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setModal(null)} disabled={isActing} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm py-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-60">Cancel</button>
                    <button onClick={handleDisapprove} disabled={isActing} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                      {isActing ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : "Revoke"}
                    </button>
                  </div>
                </>
              )}

              {modal.type === "role" && (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 mb-3"><UserCog className="w-5 h-5" /></div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Change role for {modal.teacher.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Select new role:</p>
                  <div className="relative mb-4">
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setModal(null)} disabled={isActing} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm py-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-60">Cancel</button>
                    <button onClick={handleRoleChange} disabled={isActing} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                      {isActing ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : "Change"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}