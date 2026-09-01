"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Sparkles,
  Plus,
  X,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Trash2,
  Info,
  ChevronDown,
  Check,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  getTeacherRequestsAction,
  createTeacherRequestAction,
  deleteTeacherRequestAction,
  ClassSubjectRequestItem,
} from "@/lib/actions/teacher.request";

interface SubjectItem {
  name: string;
  code: string;
}

const compulsoryClass9And10: SubjectItem[] = [
  { name: "Bangla 1st Paper", code: "BAN-1" },
  { name: "Bangla 2nd Paper", code: "BAN-2" },
  { name: "English 1st Paper", code: "ENG-1" },
  { name: "English 2nd Paper", code: "ENG-2" },
  { name: "Mathematics", code: "MATH" },
  { name: "Information & Communication Technology (ICT)", code: "ICT" },
  { name: "Physical Education, Health Science & Games", code: "PEH" },
  { name: "Islamic Studies", code: "IME" },
  { name: "Hindu Religion Studies", code: "HRE" },
  { name: "Christian Religion Studies", code: "CRE" },
  { name: "Buddhist Religion Studies", code: "BRE" },
];

const scienceGroupSubjects: SubjectItem[] = [
  ...compulsoryClass9And10,
  { name: "Physics", code: "PHY" },
  { name: "Chemistry", code: "CHE" },
  { name: "Biology", code: "BIO" },
  { name: "Higher Mathematics", code: "HMATH" },
  { name: "Bangladesh & Global Studies", code: "BGS" },
  { name: "Agricultural Studies", code: "AGRI" },
  { name: "Home Science", code: "HSCI" },
];

const commerceGroupSubjects: SubjectItem[] = [
  ...compulsoryClass9And10,
  { name: "Accounting", code: "ACC" },
  { name: "Finance & Banking", code: "FIN" },
  { name: "Business Entrepreneurship", code: "ENT" },
  { name: "General Science", code: "SCI" },
  { name: "Economics", code: "ECON" },
  { name: "Agricultural Studies", code: "AGRI" },
  { name: "Home Science", code: "HSCI" },
];

const artsGroupSubjects: SubjectItem[] = [
  ...compulsoryClass9And10,
  { name: "Geography & Environment", code: "GEO" },
  { name: "Civics & Citizenship", code: "CIV" },
  { name: "Economics", code: "ECON" },
  { name: "General Science", code: "SCI" },
  { name: "History of Bangladesh & World Civilization", code: "HIST" },
  { name: "Agricultural Studies", code: "AGRI" },
  { name: "Home Science", code: "HSCI" },
  { name: "Fine Arts", code: "ARTS" },
];

const subjectsByClass: Record<string, SubjectItem[]> = {
  "Class 6": [
    { name: "Bangla", code: "BAN" },
    { name: "English", code: "ENG" },
    { name: "Mathematics", code: "MATH" },
    { name: "Science", code: "SCI" },
    { name: "Bangladesh & Global Studies", code: "BGS" },
    { name: "Information & Communication Technology (ICT)", code: "ICT" },
    { name: "Physical Education & Health", code: "PEH" },
    { name: "Work & Life Oriented Education", code: "WLE" },
    { name: "Agricultural Studies", code: "AGRI" },
    { name: "Arts & Crafts", code: "ARTS" },
    { name: "Islamic Studies", code: "IME" },
    { name: "Hindu Religion Studies", code: "HRE" },
    { name: "Christian Religion Studies", code: "CRE" },
    { name: "Buddhist Religion Studies", code: "BRE" },
  ],
  "Class 7": [
    { name: "Bangla 1st Paper", code: "BAN-1" },
    { name: "Bangla 2nd Paper (Grammar & Composition)", code: "BAN-2" },
    { name: "English 1st Paper (English For Today)", code: "ENG-1" },
    { name: "English 2nd Paper (Grammar & Composition)", code: "ENG-2" },
    { name: "Mathematics", code: "MATH" },
    { name: "General Science", code: "SCI" },
    { name: "Bangladesh & Global Studies", code: "BGS" },
    { name: "Information & Communication Technology (ICT)", code: "ICT" },
    { name: "Islamic Studies", code: "IME" },
    { name: "Hindu Religion Studies", code: "HRE" },
    { name: "Christian Religion Studies", code: "CRE" },
    { name: "Buddhist Religion Studies", code: "BRE" },
  ],
  "Class 8": [
    { name: "Bangla 1st Paper (Literature)", code: "BAN-1" },
    { name: "Bangla 2nd Paper (Grammar & Composition)", code: "BAN-2" },
    { name: "English 1st Paper (English For Today)", code: "ENG-1" },
    { name: "English 2nd Paper (Grammar & Composition)", code: "ENG-2" },
    { name: "Mathematics", code: "MATH" },
    { name: "General Science", code: "SCI" },
    { name: "Bangladesh & Global Studies", code: "BGS" },
    { name: "Information & Communication Technology (ICT)", code: "ICT" },
    { name: "Islamic Studies", code: "IME" },
    { name: "Hindu Religion Studies", code: "HRE" },
    { name: "Christian Religion Studies", code: "CRE" },
    { name: "Buddhist Religion Studies", code: "BRE" },
  ],
};

const availableGroups = ["Science Group", "Commerce Group", "Arts (Humanities) Group"];

const getSubjectsForClassAndGroup = (grade: string, group: string): SubjectItem[] => {
  if (grade === "Class 9" || grade === "Class 10") {
    if (group === "Commerce Group") return commerceGroupSubjects;
    if (group === "Arts (Humanities) Group") return artsGroupSubjects;
    return scienceGroupSubjects;
  }
  return subjectsByClass[grade] || subjectsByClass["Class 6"];
};

const availableGrades = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const availableSections = ["Section A", "Section B"];
const availableSchedules = ["Sun · Tue · Thu", "Mon · Wed"];
const availableTimes = [
  "09:00 AM – 10:00 AM",
  "10:15 AM – 11:15 AM",
  "11:15 AM – 12:15 PM",
  "01:30 PM – 02:30 PM",
];

const availableRooms = [
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

export default function TeacherMyClassesPage() {
  const { data: session } = useSession();
  const teacherEmail = session?.user?.email || "";
  const teacherName = session?.user?.name || "Teacher";

  const [activeTab, setActiveTab] = useState<"classes" | "requests">("requests");
  const [requests, setRequests] = useState<ClassSubjectRequestItem[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  // Modal Form State
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const currentClassSubjects = getSubjectsForClassAndGroup(selectedGrade, selectedGroup);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [room, setRoom] = useState("");
  const [schedule, setSchedule] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  // When class changes
  const handleGradeChange = (newGrade: string) => {
    setSelectedGrade(newGrade);
    setSelectedSubject("");
  };

  // When group changes
  const handleGroupChange = (newGroup: string) => {
    setSelectedGroup(newGroup);
    setSelectedSubject("");
  };

  // Fetch Requests
  const fetchRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    const res = await getTeacherRequestsAction(teacherEmail);
    if (res.success) {
      setRequests(res.requests);
    } else {
      toast.error(res.error || "Failed to load requests");
    }
    setIsLoadingRequests(false);
  }, [teacherEmail]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Derived Statistics from live database records
  const approvedRequests = requests.filter((r) => r.status === "APPROVED");
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = approvedRequests.length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  // Handle Submit Request
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherEmail) {
      toast.error("You must be logged in to submit a request.");
      return;
    }

    if (!selectedGrade) {
      toast.error("Please select a Class.");
      return;
    }
    if (!selectedSection) {
      toast.error("Please select a Section.");
      return;
    }
    if ((selectedGrade === "Class 9" || selectedGrade === "Class 10") && !selectedGroup) {
      toast.error("Please select an Academic Group.");
      return;
    }
    if (!selectedSubject) {
      toast.error("Please select a Subject.");
      return;
    }
    if (!schedule) {
      toast.error("Please select Preferred Days.");
      return;
    }
    if (!time) {
      toast.error("Please select a Time Slot.");
      return;
    }
    if (!room) {
      toast.error("Please select a Classroom.");
      return;
    }

    if (selectedSubject.includes("Coming Soon")) {
      toast.info("Class 9 & 10 subject curriculum is coming soon.");
      return;
    }

    setIsSubmitting(true);

    const subjectObj = currentClassSubjects.find((s) => s.name === selectedSubject) || { code: "SUB" };
    const gradeNum = selectedGrade.replace(/[^0-9]/g, "") || "01";
    const secLetter = selectedSection.split(" ")[1] || "A";
    const generatedCode = `${subjectObj.code}-${gradeNum.padStart(2, "0")}${secLetter}`;

    const isClass9Or10 = selectedGrade === "Class 9" || selectedGrade === "Class 10";

    const res = await createTeacherRequestAction({
      teacherEmail,
      teacherName,
      grade: selectedGrade,
      section: selectedSection,
      subject: selectedSubject,
      subjectCode: generatedCode,
      group: isClass9Or10 ? selectedGroup : undefined,
      room,
      schedule,
      time,
      reason,
    });

    if (res.success) {
      toast.success("Class & Subject request submitted successfully!");
      setIsModalOpen(false);
      setSelectedGrade("");
      setSelectedGroup("");
      setSelectedSection("");
      setSelectedSubject("");
      setSchedule("");
      setTime("");
      setRoom("");
      setReason("");
      fetchRequests();
    } else {
      toast.error(res.error || "Failed to submit request.");
    }

    setIsSubmitting(false);
  };

  // Handle Cancel/Delete Pending Request
  const handleDeleteRequest = async (id: string) => {
    setDeletingId(id);
    const res = await deleteTeacherRequestAction(id);
    if (res.success) {
      toast.success("Request canceled successfully.");
      setRequests((prev) => prev.filter((item) => item.id !== id));
      setCancelConfirmId(null);
    } else {
      toast.error(res.error || "Failed to cancel request.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 pb-8 font-sans">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/90 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-cyan-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-indigo-100 bg-indigo-50/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  Teacher Portal
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Class & Subject Management
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                View your active teaching assignments and apply for new class/subject authorizations.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40 cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Apply for Class / Subject</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* SUMMARY CARDS */}
      {/* ===================================================== */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={BookOpen}
          label="Assigned Classes"
          value={`${approvedCount}`}
          detail="Active teaching sections"
          delay={0}
        />

        <SummaryCard
          icon={Clock}
          label="Pending Requests"
          value={`${pendingCount}`}
          detail="Awaiting admin approval"
          delay={0.05}
          iconClass="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-500/10"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Approved Requests"
          value={`${approvedCount}`}
          detail="Authorized by admin"
          delay={0.1}
          iconClass="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />

        <SummaryCard
          icon={XCircle}
          label="Rejected Requests"
          value={`${rejectedCount}`}
          detail="Needs modification"
          delay={0.15}
          iconClass="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-500/10"
        />
      </div>

      {/* ===================================================== */}
      {/* NAVIGATION TABS */}
      {/* ===================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === "requests"
            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
        >
          <Clock3 className="h-4 w-4" />
          <span>Class & Subject Requests</span>
          <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
            {requests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("classes")}
          className={`flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === "classes"
            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>My Assigned Classes</span>
          <span className="ml-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 text-[10px]">
            {approvedCount}
          </span>
        </button>
      </div>

      {/* ===================================================== */}
      {/* TAB CONTENT 1: ASSIGNED CLASSES */}
      {/* ===================================================== */}
      {activeTab === "classes" && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Assigned Classes
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                View your authorized active classes, student rosters, and schedules.
              </p>
            </div>
          </div>

          {isLoadingRequests ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/60 animate-pulse" />
              ))}
            </div>
          ) : approvedRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-10 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Active Classes Assigned Yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Once your class or subject request is approved by the school admin, your active classes will automatically appear here.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-600 hover:shadow-lg hover:shadow-indigo-500/35 cursor-pointer active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Apply for a Class / Subject</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {approvedRequests.map((item, index) => (
                <ClassCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* ===================================================== */}
      {/* TAB CONTENT 2: REQUESTS HISTORY & STATUS */}
      {/* ===================================================== */}
      {activeTab === "requests" && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Request Application History
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Track your submitted class/subject applications and view admin feedback.
              </p>
            </div>

            <button
              onClick={fetchRequests}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer"
            >
              Refresh Status
            </button>
          </div>

          {isLoadingRequests ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800/60 animate-pulse"
                />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-10 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Applications Submitted Yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You haven&apos;t requested authorization for any new classes or subjects yet.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-600 hover:shadow-lg hover:shadow-indigo-500/35 cursor-pointer active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Submit First Request</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((item, index) => (
                <RequestCard
                  key={item.id}
                  item={item}
                  index={index}
                  deletingId={deletingId}
                  onDelete={(id) => setCancelConfirmId(id)}
                />
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* ===================================================== */}
      {/* MODAL FORM: APPLY FOR CLASS & SUBJECT */}
      {/* ===================================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 14 }}
              className="relative w-full max-w-lg sm:max-w-xl max-h-[85vh] sm:max-h-[88vh] my-auto flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800/80 dark:bg-slate-950 z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Apply for Class / Subject Authorization
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Submit request to administration for class allocation.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitRequest} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Class */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Class
                    </label>
                    <NiceSelect
                      value={selectedGrade}
                      onChange={handleGradeChange}
                      options={availableGrades.map((g) => ({ value: g, label: g }))}
                      placeholder="Select Class"
                    />
                  </div>

                  {/* Select Section */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Section
                    </label>
                    <NiceSelect
                      value={selectedSection}
                      onChange={setSelectedSection}
                      options={availableSections.map((sec) => ({ value: sec, label: sec }))}
                      placeholder="Select Section"
                    />
                  </div>
                </div>

                {/* Select Group (Only for Class 9 & Class 10) */}
                {(selectedGrade === "Class 9" || selectedGrade === "Class 10") && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Academic Group / Stream
                    </label>
                    <NiceSelect
                      value={selectedGroup}
                      onChange={handleGroupChange}
                      options={availableGroups.map((grp) => ({ value: grp, label: grp }))}
                      placeholder="Select Academic Group"
                    />
                  </div>
                )}

                {/* Select Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject Name
                  </label>
                  <NiceSelect
                    value={selectedSubject}
                    onChange={setSelectedSubject}
                    options={currentClassSubjects.map((sub) => ({
                      value: sub.name,
                      label: `${sub.name} (${sub.code})`,
                    }))}
                    placeholder="Select Subject"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Schedule */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Days
                    </label>
                    <NiceSelect
                      value={schedule}
                      onChange={setSchedule}
                      options={availableSchedules.map((s) => ({ value: s, label: s }))}
                      placeholder="Select Preferred Days"
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Time Slot
                    </label>
                    <NiceSelect
                      value={time}
                      onChange={setTime}
                      options={availableTimes.map((t) => ({ value: t, label: t }))}
                      placeholder="Select Time Slot"
                    />
                  </div>
                </div>

                {/* Preferred Room */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Classroom
                  </label>
                  <NiceSelect
                    value={room}
                    onChange={setRoom}
                    options={availableRooms.map((r) => ({ value: r, label: r }))}
                    placeholder="Select Classroom"
                  />
                </div>

                {/* Reason Textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Application Note / Reason (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide details about your qualifications or request rationale..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white resize-none"
                  />
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================== */}
      {/* CANCELLATION CONFIRMATION MODAL */}
      {/* ===================================================== */}
      <AnimatePresence>
        {cancelConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelConfirmId(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 14 }}
              className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800/80 dark:bg-slate-950 z-10 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 mb-4">
                <Trash2 className="h-6 w-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cancel Class Request?
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to cancel this pending class & subject authorization request? This action cannot be undone.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={() => setCancelConfirmId(null)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Keep Request
                </button>
                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={() => handleDeleteRequest(cancelConfirmId)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {deletingId ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Canceling...</span>
                    </>
                  ) : (
                    <span>Yes, Cancel</span>
                  )}
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
/* REQUEST CARD COMPONENT */
/* ========================================================= */

function RequestCard({
  item,
  index,
  deletingId,
  onDelete,
}: {
  item: ClassSubjectRequestItem;
  index: number;
  deletingId: string | null;
  onDelete: (id: string) => void;
}) {
  const isPending = item.status === "PENDING";
  const isApproved = item.status === "APPROVED";
  const isRejected = item.status === "REJECTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${isPending
        ? "border-amber-200/80 bg-amber-50/20 dark:border-amber-500/30 dark:bg-amber-950/30"
        : isApproved
          ? "border-emerald-200/80 bg-emerald-50/20 dark:border-emerald-500/30 dark:bg-emerald-950/30"
          : "border-rose-200/80 bg-rose-50/20 dark:border-rose-500/30 dark:bg-rose-950/30"
        }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Info */}
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${isPending
              ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
              : isApproved
                ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"
              }`}
          >
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {item.subject}
              </h3>
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300">
                {item.subjectCode}
              </span>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isPending
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  : isApproved
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  }`}
              >
                {isPending && <Clock className="h-3 w-3 animate-spin" />}
                {isApproved && <CheckCircle2 className="h-3 w-3" />}
                {isRejected && <XCircle className="h-3 w-3" />}
                {item.status}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {item.grade} • {item.section} {item.group ? `• ${item.group} ` : ""}• {item.room || "Room TBD"}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
              Schedule: {item.schedule || "Mon-Wed-Fri"} ({item.time || "09:00 AM"})
            </p>
          </div>
        </div>

        {/* Right Actions / Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Submitted
            </p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {isPending && (
            <button
              onClick={() => onDelete(item.id)}
              disabled={deletingId === item.id}
              className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
              title="Cancel Request"
            >
              {deletingId === item.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Application Reason Note */}
      {item.reason && (
        <div className="mt-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 p-3 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Note: </span>
            {item.reason}
          </div>
        </div>
      )}

      {/* Admin Feedback Box */}
      {item.adminFeedback && (
        <div
          className={`mt-3.5 rounded-xl p-3 text-xs flex items-start gap-2 ${isRejected
            ? "bg-rose-100/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/40"
            : "bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900/40"
            }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Admin Feedback: </span>
            {item.adminFeedback}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ========================================================= */
/* CLASS CARD COMPONENT */
/* ========================================================= */

function ClassCard({
  item,
  index,
}: {
  item: ClassSubjectRequestItem;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.2 + index * 0.07,
      }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-900/5 dark:border-slate-800/80 dark:bg-slate-950/90 dark:hover:border-indigo-800"
    >
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 opacity-80" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {item.subject}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {item.grade}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {item.section}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            Active
          </div>
        </div>

        <div className="mt-5 inline-flex rounded-md bg-slate-50 px-2.5 py-1 text-[9px] font-bold tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {item.subjectCode}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoItem icon={CalendarDays} label="Schedule" value={item.schedule || "Mon · Wed · Fri"} />
          <InfoItem icon={Clock3} label="Time" value={item.time || "09:00 AM"} />
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {item.room || "Room TBD"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  valueClass = "text-slate-700 dark:text-slate-200",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50/80 p-3 dark:bg-slate-900/70">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-slate-400" />
        <span className="text-[9px] font-medium text-slate-400">{label}</span>
      </div>
      <p className={`mt-1.5 truncate text-[10px] font-bold ${valueClass}`}>
        {value}
      </p>
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800/80 dark:bg-slate-950/90 sm:p-5"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${iconClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-4 text-[10px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500">
        {detail}
      </p>
    </motion.div>
  );
}

/* ========================================================= */
/* NICE CUSTOM SELECT DROPDOWN COMPONENT */
/* ========================================================= */

interface SelectOption {
  value: string;
  label: string;
}

function NiceSelect({
  value,
  onChange,
  options,
  placeholder = "Select option",
}: {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/90 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-900 shadow-2xs transition-all duration-200 hover:border-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white dark:hover:border-indigo-500 cursor-pointer"
      >
        <span className={selectedOption ? "truncate" : "truncate text-slate-400 dark:text-slate-500 font-normal"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? "rotate-180 text-indigo-500" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 overflow-y-auto max-h-48 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/70 shadow-slate-900/10 custom-scrollbar"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${isSelected
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}