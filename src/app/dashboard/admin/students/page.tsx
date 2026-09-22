"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  GraduationCap,
  Search,
  UserPlus,
  CheckCircle2,
  Users,
  Mail,
  Phone,
  BookOpen,
  ShieldCheck,
  CalendarDays,
  UserX,
  RefreshCw,
  Trash2,
  X,
  Edit,
  Eye,
  Check,
  ChevronDown,
  Sparkles,
  Loader2,
  ShieldAlert,
  Layers,
  Lock,
  Filter,
  Key,
  Copy,
  EyeOff,
  UserCheck,
  MapPin,
  User,
  Download,
  FileText,
} from "lucide-react";
import { log } from "console";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

function authedFetch(path: string, init?: RequestInit) {
  return fetch(`${SERVER_URL}${path}`, {
    ...init,
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
  group?: string;
  rollNumber?: string;
  isApproved: boolean;
  twoFactorEnabled?: boolean;
  createdAt: string;
}

type FilterTab = "all" | "pending" | "approved" | "2fa";

type ModalAction =
  | { type: "add" }
  | { type: "edit"; student: StudentUser }
  | { type: "view"; student: StudentUser }
  | { type: "revoke"; student: StudentUser }
  | { type: "delete"; student: StudentUser }
  | { type: "demo_protected"; student: StudentUser }
  | { type: "credentials_created"; student: StudentUser; tempPass: string }
  | null;

// Helper to check if account is demo student
const isDemoStudent = (student: StudentUser) => {
  const email = (student.email || "").toLowerCase().trim();
  const name = (student.name || "").toLowerCase().trim();
  return (
    email === "demostudent@edunexus.std.com" ||
    email.includes("demostudent") ||
    name.includes("demo student") ||
    (student as any).isDemo === true
  );
};

interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select Option",
  icon: Icon,
}: {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ElementType;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOpt =
    options.find((o) => o.value === value) ||
    (value ? { value, label: value } : undefined);

  return (
    <div className={`relative ${isOpen ? "z-[60]" : "z-10"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-3 pr-2.5 py-2 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
          isOpen
            ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
            : "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-1 min-w-0">
          {Icon && (
            <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          )}
          {selectedOpt && selectedOpt.value !== "" ? (
            <span className="font-medium text-slate-900 dark:text-white truncate">
              {selectedOpt.label}
              {selectedOpt.subLabel && (
                <span className="text-slate-400 dark:text-slate-500 text-xs ml-1 font-normal">
                  ({selectedOpt.subLabel})
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-normal truncate">
              {selectedOpt?.label || placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-[70] left-0 right-0 max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-1 space-y-0.5"
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={`${opt.value}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                        ({opt.subLabel})
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
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

export default function AdminStudentsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Academic Placement Filter States (Defaults to Class 10, Section A, Science)
  const [selectedClassFilter, setSelectedClassFilter] =
    useState<string>("Class 10");
  const [selectedSectionFilter, setSelectedSectionFilter] =
    useState<string>("Section A");
  const [selectedGroupFilter, setSelectedGroupFilter] =
    useState<string>("Science");

  // Modal Action State
  const [modal, setModal] = useState<ModalAction>(null);

  // Helper to restrict phone input (starts with 01, max 11 digits)
  const handleBDPhoneChange = (
    input: string,
    setter: (val: string) => void,
  ) => {
    let digits = input.replace(/\D/g, "");
    if (digits.length > 0) {
      if (!digits.startsWith("0")) {
        digits = "01" + digits;
      } else if (digits.length >= 2 && !digits.startsWith("01")) {
        digits = "01" + digits.substring(2);
      }
    }
    setter(digits.slice(0, 11));
  };

  // Helper to export generated student credentials as a formatted PDF
  const handleDownloadPDF = async (student: StudentUser, tempPass: string) => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      // Branding Colors
      const darkNavy = [15, 23, 42];
      const primaryBlue = [37, 99, 235];
      const lightBg = [248, 250, 252];
      const borderSlate = [226, 232, 240];

      // Header Banner
      doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.rect(0, 0, 210, 38, "F");

      // Header Title & Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("EDUNEXUS SCHOOL MANAGEMENT SYSTEM", 15, 18);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text("Official Student Admission & Account Credentials Slip", 15, 26);

      // Accent Bar
      doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.rect(0, 38, 210, 3, "F");

      // Issued Metadata
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Issued Date: ${currentDate}`, 15, 49);
      const refId = student.id
        ? student.id.substring(0, 8).toUpperCase()
        : "NEW";
      doc.text(`Ref ID: STD-${refId}`, 145, 49);

      // Main Credentials Box
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.roundedRect(15, 55, 180, 85, 4, 4, "FD");

      // Box Header
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Student Account Credentials", 23, 67);

      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.line(23, 71, 187, 71);

      // Table Rows
      const placementInfo = `${student.studentClass || "Class 10"} (${student.studentSection || "Section A"})${student.group ? ` • Group: ${student.group}` : ""}`;

      const rows = [
        {
          label: "Student Full Name:",
          value: student.name,
          isPassword: false,
          isEmail: false,
        },
        {
          label: "Email Address:",
          value: student.email,
          isPassword: false,
          isEmail: true,
        },
        {
          label: "Temporary Password:",
          value: tempPass,
          isPassword: true,
          isEmail: false,
        },
        {
          label: "Academic Placement:",
          value: placementInfo,
          isPassword: false,
          isEmail: false,
        },
        {
          label: "Account Status:",
          value: student.isApproved ? "Approved & Active" : "Pending Access",
          isPassword: false,
          isEmail: false,
        },
      ];

      let currentY = 82;
      rows.forEach((row) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text(row.label, 23, currentY);

        doc.setFont("helvetica", "bold");
        if (row.isPassword) {
          doc.setTextColor(5, 150, 105);
        } else if (row.isEmail) {
          doc.setTextColor(37, 99, 235);
        } else {
          doc.setTextColor(15, 23, 42);
        }
        doc.text(row.value, 78, currentY);
        currentY += 10;
      });

      // Security Notice Box
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(15, 148, 180, 52, 4, 4, "FD");

      doc.setTextColor(30, 58, 138);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("IMPORTANT LOGIN & SECURITY INSTRUCTIONS", 23, 159);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 64, 175);
      doc.text(
        "1. Go to the EduNexus Student Portal at https://school-management-system-psi-ten.vercel.app/login",
        23,
        168,
      );
      doc.text(
        "2. Log in using the Email Address and Temporary Password generated above.",
        23,
        175,
      );
      doc.text(
        "3. You will be prompted to change your temporary password on your initial login.",
        23,
        182,
      );
      doc.text(
        "4. Keep this credential slip safe and confidential. Do not share your login details.",
        23,
        189,
      );

      // Footer
      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.line(15, 265, 195, 265);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "This document is automatically generated by EduNexus School Management System.",
        15,
        273,
      );
      doc.text("Authorized Admin Seal / Signature", 138, 273);

      // File Save
      const safeName = student.name.replace(/[^a-zA-Z0-9_-]/g, "_");
      doc.save(`EduNexus_Credentials_${safeName}.pdf`);
      toast.success("Credentials PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed", err);
      toast.error("Failed to generate PDF document.");
    }
  };

  // Form states - Add Student
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [addPhone, setAddPhone] = useState("");
  const [addClassNum, setAddClassNum] = useState("Class 10");
  const [addGroup, setAddGroup] = useState("Science");
  const [addSection, setAddSection] = useState("Section A");

  // Extended Profile fields - Add Student
  const [addFatherName, setAddFatherName] = useState("");
  const [addMotherName, setAddMotherName] = useState("");
  const [addGuardianPhone, setAddGuardianPhone] = useState("");
  const [addGuardianRelation, setAddGuardianRelation] = useState("Father");
  const [addDob, setAddDob] = useState("");
  const [addGender, setAddGender] = useState("Male");
  const [addAddress, setAddAddress] = useState("");
  const [addBloodGroup, setAddBloodGroup] = useState("A+");
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Form states - Edit Student
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editClassNum, setEditClassNum] = useState("");
  const [editGroup, setEditGroup] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editIsApproved, setEditIsApproved] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actingStudentId, setActingStudentId] = useState<string | null>(null);

  const rawRole = (
    session?.user as { role?: string } | undefined
  )?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/");
      } else if (rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authedFetch("/api/admin/users?role=student&limit=100");
      const result = await res.json();
      if (res.ok && Array.isArray(result.users)) {
        const list = result.users
          .filter(
            (u: any) => u && typeof u === "object" && typeof u.id === "string",
          )
          .map((u: any) => ({
            id: u.id,
            name: u.name ?? "",
            email: u.email ?? "",
            image: u.image,
            phone: u.phone,
            studentClass: u.studentClass ?? "",
            studentSection: u.studentSection ?? "",
            group: u.group ?? u.department ?? "",
            rollNumber: u.rollNumber ?? u.roll,
            isApproved: Boolean(u.isApproved),
            twoFactorEnabled: Boolean(u.twoFactorEnabled),
            createdAt: u.createdAt ?? new Date().toISOString(),
          }));
        setStudents(list);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Failed to load students", err);
      toast.error("Failed to load students list.");
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    if (session?.user && rawRole === "admin") {
      loadStudents();
    }
  }, [session, rawRole, loadStudents]);

  // Parse Class string into Class number, Group, Section
  const parseStudentClassInfo = (
    rawClass?: string,
    rawSec?: string,
    rawGroup?: string,
    rawDept?: string,
  ) => {
    let c = rawClass || "Class 10";
    let g = rawGroup || rawDept || "";
    let s = rawSec || "Section A";

    if (rawClass) {
      if (
        rawClass.includes("Class 10") ||
        rawClass.includes("Grade 10") ||
        rawClass.includes("10")
      )
        c = "Class 10";
      else if (
        rawClass.includes("Class 9") ||
        rawClass.includes("Grade 9") ||
        rawClass.includes("9")
      )
        c = "Class 9";
      else if (
        rawClass.includes("Class 8") ||
        rawClass.includes("Grade 8") ||
        rawClass.includes("8")
      )
        c = "Class 8";
      else if (
        rawClass.includes("Class 7") ||
        rawClass.includes("Grade 7") ||
        rawClass.includes("7")
      )
        c = "Class 7";
      else if (
        rawClass.includes("Class 6") ||
        rawClass.includes("Grade 6") ||
        rawClass.includes("6")
      )
        c = "Class 6";

      if (!g) {
        if (rawClass.includes("Science")) g = "Science";
        else if (
          rawClass.includes("Business Studies") ||
          rawClass.includes("Commerce")
        )
          g = "Business Studies";
        else if (rawClass.includes("Humanities") || rawClass.includes("Arts"))
          g = "Humanities";
      }

      if (
        rawClass.includes("Section B") ||
        rawClass.includes("Sec B") ||
        rawClass.includes("(B)")
      )
        s = "Section B";
      else if (
        rawClass.includes("Section A") ||
        rawClass.includes("Sec A") ||
        rawClass.includes("(A)")
      )
        s = "Section A";
    }

    if (!g && (c === "Class 9" || c === "Class 10")) {
      g = "Science";
    }

    return { c, g, s };
  };

  // Contextual student counts per Class, Section, and Group
  const getClassStudentCount = useCallback(
    (classNum: string) => {
      return students.filter((s) => {
        if (!s) return false;
        const parsed = parseStudentClassInfo(
          s.studentClass,
          s.studentSection,
          s.group,
          (s as any).department,
        );
        if (classNum !== "all" && parsed.c !== classNum) return false;
        return true;
      }).length;
    },
    [students],
  );

  const getSectionStudentCount = useCallback(
    (secName: string) => {
      const isClass9or10 =
        selectedClassFilter.includes("9") || selectedClassFilter.includes("10");
      return students.filter((s) => {
        if (!s) return false;
        const parsed = parseStudentClassInfo(
          s.studentClass,
          s.studentSection,
          s.group,
          (s as any).department,
        );
        if (selectedClassFilter !== "all" && parsed.c !== selectedClassFilter)
          return false;
        if (secName !== "all" && parsed.s !== secName) return false;
        if (
          isClass9or10 &&
          selectedGroupFilter !== "all" &&
          parsed.g !== selectedGroupFilter
        )
          return false;
        return true;
      }).length;
    },
    [students, selectedClassFilter, selectedGroupFilter],
  );

  const getGroupStudentCount = useCallback(
    (groupName: string) => {
      return students.filter((s) => {
        if (!s) return false;
        const parsed = parseStudentClassInfo(
          s.studentClass,
          s.studentSection,
          s.group,
          (s as any).department,
        );
        if (selectedClassFilter !== "all" && parsed.c !== selectedClassFilter)
          return false;
        if (
          selectedSectionFilter !== "all" &&
          parsed.s !== selectedSectionFilter
        )
          return false;
        if (groupName !== "all" && parsed.g !== groupName) return false;
        return true;
      }).length;
    },
    [students, selectedClassFilter, selectedSectionFilter],
  );

  // 1-Click Toggle Approval
  const handleToggleApprove = async (student: StudentUser) => {
    setActingStudentId(student.id);
    const nextApproved = !student.isApproved;
    console.log(nextApproved);
    try {
      const res = await authedFetch(`/api/admin/users/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: nextApproved }),
      });

      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === student.id ? { ...s, isApproved: nextApproved } : s,
          ),
        );
        toast.success(
          nextApproved
            ? `Approved ${student.name}'s account!`
            : `Revoked access for ${student.name}`,
        );
        setModal(null);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to update student approval status.");
      }
    } catch {
      toast.error("Network error while updating status.");
    } finally {
      setActingStudentId(null);
    }
  };

  // Revoke Approval Action with Demo Guard
  const handleRevoke = async () => {
    if (!modal || modal.type !== "revoke") return;
    if (isDemoStudent(modal.student)) {
      setModal({ type: "demo_protected", student: modal.student });
      return;
    }
    await handleToggleApprove(modal.student);
  };

    const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim()) {
      toast.error("Name and Email are required.");
      return;
    }
    const finalPassword = addPassword.trim();
    if (!finalPassword) {
      toast.error("Please enter a custom password for the student.");
      return;
    }
    if (finalPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (
      addPhone.trim() &&
      (addPhone.length !== 11 || !addPhone.startsWith("01"))
    ) {
      toast.error(
        "Student Phone Number must start with 01 and be exactly 11 digits.",
      );
      return;
    }
    if (
      addGuardianPhone.trim() &&
      (addGuardianPhone.length !== 11 || !addGuardianPhone.startsWith("01"))
    ) {
      toast.error(
        "Guardian Phone Number must start with 01 and be exactly 11 digits.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const isClass9or10 =
        addClassNum.includes("9") || addClassNum.includes("10");
      const fullClass = addClassNum;

      let formattedEmail = addEmail.trim().toLowerCase();
      if (!formattedEmail.includes("@")) {
        formattedEmail = `${formattedEmail}@edunexus.std.com`;
      }

      const res = await authedFetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName.trim(),
          email: formattedEmail,
          password: finalPassword,
          phone: addPhone.trim() || null,
          role: "student",
          studentClass: fullClass,
          studentSection: addSection,
          group: isClass9or10 ? addGroup : null,
          isApproved: true,
          fatherName: addFatherName.trim() || null,
          motherName: addMotherName.trim() || null,
          guardianPhone: addGuardianPhone.trim() || null,
          guardianRelation: addGuardianRelation,
          dateOfBirth: addDob || null,
          gender: addGender,
          address: addAddress.trim() || null,
          bloodGroup: addBloodGroup || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to create student account.");
      }

      const raw = data.user ?? data.student ?? data.data ?? null;

      if (!raw?.id) {
        toast.success("Student created. Refreshing list…");
        await loadStudents();
        setAddName("");
        setAddEmail("");
        setAddPassword("");
        setAddPhone("");
        setAddFatherName("");
        setAddMotherName("");
        setAddGuardianPhone("");
        setAddDob("");
        setAddAddress("");
        setModal(null);
        return;
      }

      const createdStudent: StudentUser = {
        id: raw.id,
        name: raw.name ?? addName.trim(),
        email: raw.email ?? formattedEmail,
        image: raw.image,
        phone: raw.phone ?? (addPhone.trim() || undefined),
        studentClass: raw.studentClass ?? fullClass,
        studentSection: raw.studentSection ?? addSection,
        group: raw.group ?? (isClass9or10 ? addGroup : undefined),
        rollNumber: raw.rollNumber ?? raw.roll,
        isApproved: raw.isApproved !== false,
        twoFactorEnabled: Boolean(raw.twoFactorEnabled),
        createdAt: raw.createdAt ?? new Date().toISOString(),
      };

      const returnedPassword = String(
        data.temporaryPassword ?? data.password ?? finalPassword,
      );

      setStudents((prev) => [
        createdStudent,
        ...prev.filter((s) => s && s.id !== createdStudent.id),
      ]);

      toast.success(
        `Student ${createdStudent.name} created and enrolled successfully!`,
      );

      setAddName("");
      setAddEmail("");
      setAddPassword("");
      setAddPhone("");
      setAddFatherName("");
      setAddMotherName("");
      setAddGuardianPhone("");
      setAddDob("");
      setAddAddress("");

      setModal({
        type: "credentials_created",
        student: createdStudent,
        tempPass: returnedPassword,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to add new student.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Update Student Profile & Class Assignment
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || modal.type !== "edit") return;
    setIsSubmitting(true);

    try {
      const isClass9or10 =
        editClassNum.includes("9") || editClassNum.includes("10");
      const groupPart = isClass9or10 && editGroup ? ` - ${editGroup}` : "";
      const sectionPart = editSection ? ` (${editSection})` : "";
      const fullClass = `${editClassNum}${groupPart}${sectionPart}`;

      const res = await authedFetch(`/api/admin/users/${modal.student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim(),
          studentClass: fullClass,
          studentSection: editSection,
          group: isClass9or10 ? editGroup : null,
          isApproved: editIsApproved,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update student profile.");
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.id === modal.student.id
            ? {
                ...s,
                name: editName.trim(),
                phone: editPhone.trim(),
                studentClass: fullClass,
                studentSection: editSection,
                group: isClass9or10 ? editGroup : undefined,
                isApproved: editIsApproved,
              }
            : s,
        ),
      );

      toast.success(`Updated ${editName.trim()}'s details!`);
      setModal(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Student Account with Demo Protection Guard
  const handleDeleteStudent = async () => {
    if (!modal || modal.type !== "delete") return;

    if (isDemoStudent(modal.student)) {
      setModal({ type: "demo_protected", student: modal.student });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authedFetch(`/api/admin/users/${modal.student.id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error ?? "Failed to delete student account.");
      toast.success("Student account deleted successfully.");
      setStudents((prev) => prev.filter((s) => s.id !== modal.student.id));
      setModal(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (student: StudentUser) => {
    setModal({ type: "edit", student });
    setEditName(student.name);
    setEditPhone(student.phone || "");

    const parsed = parseStudentClassInfo(
      student.studentClass,
      student.studentSection,
      student.group,
    );
    setEditClassNum(parsed.c);
    setEditGroup(parsed.g);
    setEditSection(parsed.s);
    setEditIsApproved(student.isApproved);
  };

  if (isPending) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (!session?.user || rawRole !== "admin") {
    return null;
  }

  const isClass9or10 =
    selectedClassFilter.includes("9") || selectedClassFilter.includes("10");

  // 1. Academic Placement Filtered Roster (Class, Section, Group)
  const placementStudents = students.filter((student) => {
    if (!student) return false;
    const parsed = parseStudentClassInfo(
      student.studentClass,
      student.studentSection,
      student.group,
      (student as any).department,
    );

    if (selectedClassFilter !== "all" && parsed.c !== selectedClassFilter) {
      return false;
    }
    if (selectedSectionFilter !== "all" && parsed.s !== selectedSectionFilter) {
      return false;
    }
    if (
      isClass9or10 &&
      selectedGroupFilter !== "all" &&
      parsed.g !== selectedGroupFilter
    ) {
      return false;
    }
    return true;
  });
  // Metrics calculated from placementStudents for consistent counts across tabs
  const totalStudents = placementStudents.length;
  const approvedStudents = placementStudents.filter(
    (s) => s?.isApproved,
  ).length;
  const pendingStudents = placementStudents.filter(
    (s) => s && !s.isApproved,
  ).length;
  const twoFactorCount = placementStudents.filter(
    (s) => s?.twoFactorEnabled,
  ).length;

  // 2. Roster List filtered by Tab & Search Term
  const filteredStudents = placementStudents.filter((student) => {
    if (!student) return false;

    const name = (student.name ?? "").toLowerCase();
    const email = (student.email ?? "").toLowerCase();
    const cls = (student.studentClass ?? "").toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchesSearch =
      name.includes(q) || email.includes(q) || cls.includes(q);

    if (!matchesSearch) return false;
    if (activeTab === "pending" && student.isApproved) return false;
    if (activeTab === "approved" && !student.isApproved) return false;
    if (activeTab === "2fa" && !student.twoFactorEnabled) return false;

    return true;
  });
  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden"
      >
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-lg shadow-indigo-600/25">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                <Sparkles className="w-3 h-3" /> STUDENT ACADEMICS
              </span>
              {pendingStudents > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Students Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage student enrollments, approve accounts &amp; assign class
              sections.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => {
              setModal({ type: "add" });
              setAddName("");
              setAddEmail("");
              setAddPassword("");
              setAddPhone("");
              setAddFatherName("");
              setAddMotherName("");
              setAddGuardianPhone("");
              setAddDob("");
              setAddAddress("");
            }}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>

          <button
            onClick={loadStudents}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all disabled:opacity-60 cursor-pointer shadow-xs"
            title="Refresh Roster"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards Grid - Unique Tab Selections */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            tabKey: "all" as FilterTab,
            label: "Total Enrolled",
            value: totalStudents,
            icon: Users,
            color:
              "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/40",
          },
          {
            tabKey: "pending" as FilterTab,
            label: "Pending Access",
            value: pendingStudents,
            icon: UserX,
            badge: pendingStudents > 0,
            color:
              "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40",
          },
          {
            tabKey: "approved" as FilterTab,
            label: "Active Students",
            value: approvedStudents,
            icon: CheckCircle2,
            color:
              "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40",
          },
          {
            tabKey: "2fa" as FilterTab,
            label: "2FA Protection",
            value: twoFactorCount,
            icon: ShieldCheck,
            color:
              "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-900/40",
          },
        ].map((card) => {
          const Icon = card.icon;
          const isSelected = activeTab === card.tabKey;

          return (
            <button
              key={card.tabKey}
              onClick={() => setActiveTab(card.tabKey)}
              className={`text-left rounded-2xl border ${
                isSelected
                  ? "border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-lg"
                  : "border-slate-200/80 dark:border-slate-800"
              } bg-white/90 dark:bg-slate-900/90 p-4 shadow-sm backdrop-blur-xl transition-all hover:scale-[1.01] cursor-pointer flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center ${card.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {card.badge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse shadow-sm">
                    <ShieldAlert className="w-3 h-3" /> Requires Action
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {isLoading ? (
                    <span className="inline-block h-6 w-10 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  ) : (
                    card.value
                  )}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "All Students", count: totalStudents },
            {
              id: "pending",
              label: "Pending Access",
              count: pendingStudents,
              alert: pendingStudents > 0,
            },
            {
              id: "approved",
              label: "Active Students",
              count: approvedStudents,
            },
            { id: "2fa", label: "2FA Secured", count: twoFactorCount },
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isTabActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    isTabActive
                      ? "bg-white/20 text-white"
                      : tab.alert
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Academic Placement Filter Bar (Class, Section, Group) */}
      <div className="relative z-30 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-5 shadow-xl backdrop-blur-xl space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Select Class, Section &amp; Group
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose a specific class, section, and group to view student
                roster records.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            {selectedClassFilter} • {selectedSectionFilter}
            {(selectedClassFilter.includes("9") ||
              selectedClassFilter.includes("10")) &&
              ` • ${selectedGroupFilter}`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Class Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Select Class
            </label>
            <CustomSelect
              value={selectedClassFilter}
              onChange={(val) => {
                setSelectedClassFilter(val);
                setSelectedSectionFilter("Section A");
                setSelectedGroupFilter("Science");
              }}
              options={[
                {
                  value: "Class 6",
                  label: "Class 6",
                  subLabel: `${getClassStudentCount("Class 6")} students`,
                },
                {
                  value: "Class 7",
                  label: "Class 7",
                  subLabel: `${getClassStudentCount("Class 7")} students`,
                },
                {
                  value: "Class 8",
                  label: "Class 8",
                  subLabel: `${getClassStudentCount("Class 8")} students`,
                },
                {
                  value: "Class 9",
                  label: "Class 9",
                  subLabel: `${getClassStudentCount("Class 9")} students`,
                },
                {
                  value: "Class 10",
                  label: "Class 10",
                  subLabel: `${getClassStudentCount("Class 10")} students`,
                },
              ]}
              icon={BookOpen}
              placeholder="Select Class"
            />
          </div>

          {/* 2. Section Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Select Section
            </label>
            <CustomSelect
              value={selectedSectionFilter}
              onChange={setSelectedSectionFilter}
              options={[
                {
                  value: "Section A",
                  label: "Section A",
                  subLabel: `${getSectionStudentCount("Section A")} students`,
                },
                {
                  value: "Section B",
                  label: "Section B",
                  subLabel: `${getSectionStudentCount("Section B")} students`,
                },
              ]}
              icon={Layers}
              placeholder="Select Section"
            />
          </div>

          {/* 3. Group Filter (Class 9 & 10 only) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Select Group
              </label>
              {selectedClassFilter.includes("9") ||
              selectedClassFilter.includes("10") ? (
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-900/40">
                  Class 9 &amp; 10 Only
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">
                  Not Applicable
                </span>
              )}
            </div>

            {selectedClassFilter.includes("9") ||
            selectedClassFilter.includes("10") ? (
              <CustomSelect
                value={selectedGroupFilter}
                onChange={setSelectedGroupFilter}
                options={[
                  {
                    value: "Science",
                    label: "Science",
                    subLabel: `${getGroupStudentCount("Science")} students`,
                  },
                  {
                    value: "Business Studies",
                    label: "Business Studies",
                    subLabel: `${getGroupStudentCount("Business Studies")} students`,
                  },
                  {
                    value: "Humanities",
                    label: "Humanities",
                    subLabel: `${getGroupStudentCount("Humanities")} students`,
                  },
                ]}
                icon={GraduationCap}
                placeholder="Select Group"
              />
            ) : (
              <div className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between cursor-not-allowed">
                <span>N/A for {selectedClassFilter}</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Students Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse"
            />
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <UserX className="w-12 h-12 text-slate-400" />
          <p className="text-base font-bold text-slate-900 dark:text-white">
            No students found
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            {searchTerm
              ? `No results matching "${searchTerm}"`
              : activeTab === "pending"
                ? "Great! All registered students have been approved."
                : "No students match this filter criteria."}
          </p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStudents.map((student) => {
              const isUpdatingThis = actingStudentId === student.id;
              const isDemo = isDemoStudent(student);

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  {/* Top Row: Avatar, Info, Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-800 flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-md shadow-indigo-600/20">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                            student.isApproved
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white break-words">
                            {student.name}
                          </h3>
                          {isDemo && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                              <Lock className="w-2.5 h-2.5" /> Protected Demo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 break-all mt-0.5">
                          <Mail className="w-3 h-3 flex-shrink-0 text-slate-400" />
                          <span>{student.email}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold border flex-shrink-0 ${
                        student.isApproved
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-900/40"
                      }`}
                    >
                      {student.isApproved ? "Approved" : "Pending Access"}
                    </span>
                  </div>

                  {/* Contact & Academic Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-2">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span>Class: {student.studentClass || "Class 10"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <CalendarDays className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>
                        Section: {student.studentSection || "Section A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>Phone: {student.phone || "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                      <span>
                        2FA:{" "}
                        <strong
                          className={
                            student.twoFactorEnabled
                              ? "text-purple-600 dark:text-purple-400 font-bold"
                              : "text-slate-500"
                          }
                        >
                          {student.twoFactorEnabled
                            ? "TOTP Authenticator Protection"
                            : "Disabled (Standard)"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* Approve / Revoke Action */}
                    {!student.isApproved ? (
                      <button
                        onClick={() => handleToggleApprove(student)}
                        disabled={isUpdatingThis}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                      >
                        {isUpdatingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Access</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (isDemo) {
                            setModal({ type: "demo_protected", student });
                          } else {
                            setModal({ type: "revoke", student });
                          }
                        }}
                        disabled={isUpdatingThis}
                        className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all cursor-pointer shadow-xs"
                        title="Revoke Approval Access"
                      >
                        {isUpdatingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    {/* View Profile Modal Button */}
                    <button
                      onClick={() => setModal({ type: "view", student })}
                      className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all cursor-pointer shadow-xs"
                      title="View Student Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Class & Section Modal Button */}
                    <button
                      onClick={() => openEditModal(student)}
                      className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 hover:text-purple-700 dark:hover:text-purple-300 transition-all cursor-pointer shadow-xs"
                      title="Edit Profile & Class Assignment"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Account Button */}
                    <button
                      onClick={() => {
                        if (isDemo) {
                          setModal({ type: "demo_protected", student });
                        } else {
                          setModal({ type: "delete", student });
                        }
                      }}
                      className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-rose-300 transition-all cursor-pointer shadow-xs"
                      title={
                        isDemo
                          ? "Protected Demo Account"
                          : "Delete Student Account"
                      }
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {/* Add New Student Modal */}
      <AnimatePresence>
        {modal && modal.type === "add" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto no-scrollbar">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl max-w-2xl sm:max-w-3xl w-full relative overflow-x-hidden overflow-y-auto max-h-[90vh] my-auto no-scrollbar"
            >
              <div className="absolute right-0 top-0 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none overflow-hidden" />

              <button
                onClick={() => setModal(null)}
                className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center gap-3 pr-6 mb-4 flex-shrink-0">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 flex-shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    Enroll New Student
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    Fill in the student details line by line.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-3 relative">
                {/* 1. Student Full Name */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    1. Student Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tanvir Hossain"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* 2. Email Address */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    2. Email Address *{" "}
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">
                      (@edunexus.std.com)
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="student@edunexus.std.com"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* 3. Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                      3. Custom Password *{" "}
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        (Admin must enter password, min 8 chars)
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const rand =
                          "std" + Math.random().toString(36).substring(2, 7);
                        setAddPassword(rand);
                        setShowPassword(true);
                      }}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Auto-Generate
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter custom password for student..."
                      value={addPassword}
                      onChange={(e) => setAddPassword(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 4. Phone Number */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    4. Phone Number{" "}
                    <span className="text-[10px] text-indigo-500 font-normal">
                      (Starts with 01, max 11 digits)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="01700000000"
                    value={addPhone}
                    onChange={(e) =>
                      handleBDPhoneChange(e.target.value, setAddPhone)
                    }
                    maxLength={11}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  />
                </div>

                {/* 5. Class */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    5. Select Class
                  </label>
                  <CustomSelect
                    value={addClassNum}
                    onChange={(val) => {
                      setAddClassNum(val);
                      if (!val.includes("9") && !val.includes("10"))
                        setAddGroup("");
                    }}
                    options={[
                      { value: "Class 6", label: "Class 6" },
                      { value: "Class 7", label: "Class 7" },
                      { value: "Class 8", label: "Class 8" },
                      { value: "Class 9", label: "Class 9" },
                      { value: "Class 10", label: "Class 10" },
                    ]}
                  />
                </div>

                {/* 6. Group (if Class 9 or 10) */}
                {(addClassNum.includes("9") || addClassNum.includes("10")) && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      6. Select Group{" "}
                      <span className="text-[10px] text-indigo-500 font-normal">
                        (Class 9-10 Only)
                      </span>
                    </label>
                    <CustomSelect
                      value={addGroup}
                      onChange={setAddGroup}
                      options={[
                        { value: "Science", label: "Science" },
                        {
                          value: "Business Studies",
                          label: "Business Studies",
                        },
                        { value: "Humanities", label: "Humanities" },
                      ]}
                    />
                  </div>
                )}

                {/* 7. Section */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    7. Select Section
                  </label>
                  <CustomSelect
                    value={addSection}
                    onChange={setAddSection}
                    options={[
                      { value: "Section A", label: "Section A" },
                      { value: "Section B", label: "Section B" },
                    ]}
                  />
                </div>

                {/* 8. Father's Name */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    8. Father's Name
                  </label>
                  <input
                    type="text"
                    placeholder="Father's full name"
                    value={addFatherName}
                    onChange={(e) => setAddFatherName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* 9. Mother's Name */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    9. Mother's Name
                  </label>
                  <input
                    type="text"
                    placeholder="Mother's full name"
                    value={addMotherName}
                    onChange={(e) => setAddMotherName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* 10. Guardian Phone */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    10. Guardian Phone{" "}
                    <span className="text-[10px] text-indigo-500 font-normal">
                      (Starts with 01, max 11 digits)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="01700000000"
                    value={addGuardianPhone}
                    onChange={(e) =>
                      handleBDPhoneChange(e.target.value, setAddGuardianPhone)
                    }
                    maxLength={11}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  />
                </div>

                {/* 11. Guardian Relation */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    11. Guardian Relation
                  </label>
                  <CustomSelect
                    value={addGuardianRelation}
                    onChange={setAddGuardianRelation}
                    options={[
                      { value: "Father", label: "Father" },
                      { value: "Mother", label: "Mother" },
                      { value: "Legal Guardian", label: "Legal Guardian" },
                      { value: "Uncle", label: "Uncle" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>

                {/* 12. Date of Birth */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    12. Date of Birth
                  </label>
                  <input
                    type="date"
                    value={addDob}
                    onChange={(e) => setAddDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* 13. Gender */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    13. Gender
                  </label>
                  <CustomSelect
                    value={addGender}
                    onChange={setAddGender}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>

                {/* 14. Blood Group */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    14. Blood Group
                  </label>
                  <CustomSelect
                    value={addBloodGroup}
                    onChange={setAddBloodGroup}
                    options={[
                      { value: "A+", label: "A+" },
                      { value: "A-", label: "A-" },
                      { value: "B+", label: "B+" },
                      { value: "B-", label: "B-" },
                      { value: "AB+", label: "AB+" },
                      { value: "AB-", label: "AB-" },
                      { value: "O+", label: "O+" },
                      { value: "O-", label: "O-" },
                    ]}
                  />
                </div>

                {/* 15. Present Address */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    15. Present Address
                  </label>
                  <input
                    type="text"
                    placeholder="Full home address"
                    value={addAddress}
                    onChange={(e) => setAddAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    disabled={isSubmitting}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Save Student"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Credentials Created Handover Modal */}
      <AnimatePresence>
        {modal && modal.type === "credentials_created" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/20">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    Student Account Created!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hand over these login credentials to the student.
                  </p>
                </div>
              </div>

              {/* Box displaying generated student credentials */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Student Name:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {modal.student.name}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Email Address:
                  </span>
                  <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {modal.student.email}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Temporary Password:
                  </span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {modal.tempPass}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Academic Class:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {modal.student.studentClass || "Class 10"} •{" "}
                    {modal.student.studentSection || "Section A"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    const textToCopy = `EduNexus Student Credentials:\nName: ${modal.student.name}\nEmail: ${modal.student.email}\nPassword: ${modal.tempPass}\nClass: ${modal.student.studentClass || "Class 10"}\nSection: ${modal.student.studentSection || "Section A"}\nLogin URL: http://localhost:3000/login`;
                    navigator.clipboard.writeText(textToCopy);
                    setCopiedCredentials(true);
                    toast.success("Credentials copied to clipboard!");
                    setTimeout(() => setCopiedCredentials(false), 2500);
                  }}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  {copiedCredentials ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedCredentials ? "Copied!" : "Copy Info"}</span>
                </button>

                <button
                  onClick={() =>
                    handleDownloadPDF(modal.student, modal.tempPass)
                  }
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => setModal(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal - Styled & Responsive */}
      <AnimatePresence>
        {modal && modal.type === "edit" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto no-scrollbar">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl max-w-2xl sm:max-w-3xl w-full relative overflow-x-hidden overflow-y-auto max-h-[90vh] my-auto no-scrollbar"
            >
              <div className="absolute right-0 top-0 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none overflow-hidden" />

              <button
                onClick={() => setModal(null)}
                className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center gap-3 pr-6 mb-3 sm:mb-4 flex-shrink-0">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-md shadow-indigo-600/25 flex-shrink-0">
                  <Edit className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    Edit Student Profile
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    {modal.student.name} •{" "}
                    <span className="font-mono text-slate-400">
                      {modal.student.email}
                    </span>
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleUpdateStudent}
                className="space-y-3 relative overflow-visible"
              >
                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Personal Info</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 relative overflow-visible">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Academic Placement</span>
                  </div>

                  <div
                    className={`grid gap-2.5 transition-all ${
                      editClassNum.includes("9") || editClassNum.includes("10")
                        ? "grid-cols-1 sm:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        Class
                      </label>
                      <CustomSelect
                        value={editClassNum}
                        onChange={(val) => {
                          setEditClassNum(val);
                          if (!val.includes("9") && !val.includes("10"))
                            setEditGroup("");
                        }}
                        options={[
                          { value: "Class 6", label: "Class 6" },
                          { value: "Class 7", label: "Class 7" },
                          { value: "Class 8", label: "Class 8" },
                          { value: "Class 9", label: "Class 9" },
                          { value: "Class 10", label: "Class 10" },
                        ]}
                      />
                    </div>

                    {(editClassNum.includes("9") ||
                      editClassNum.includes("10")) && (
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          Group{" "}
                          <span className="text-[10px] text-indigo-500 font-normal">
                            (Class 9-10)
                          </span>
                        </label>
                        <CustomSelect
                          value={editGroup}
                          onChange={setEditGroup}
                          options={[
                            { value: "Science", label: "Science" },
                            {
                              value: "Business Studies",
                              label: "Business Studies",
                            },
                            { value: "Humanities", label: "Humanities" },
                          ]}
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        Section
                      </label>
                      <CustomSelect
                        value={editSection}
                        onChange={setEditSection}
                        options={[
                          { value: "Section A", label: "Section A" },
                          { value: "Section B", label: "Section B" },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Account Approval Status
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Toggle whether this student can access dashboard tools
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditIsApproved(!editIsApproved)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer border transition-all ${
                      editIsApproved
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    {editIsApproved ? "Approved" : "Pending"}
                  </button>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    disabled={isSubmitting}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Student Profile Modal */}
      <AnimatePresence>
        {modal && modal.type === "view" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full relative space-y-4"
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-800 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-600/25">
                  {modal.student.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {modal.student.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {modal.student.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Class &amp; Section:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {modal.student.studentClass || "Class 10"} •{" "}
                    {modal.student.studentSection || "Section A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Phone Contact:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {modal.student.phone || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Approval Status:</span>
                  <span
                    className={`font-bold ${modal.student.isApproved ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
                  >
                    {modal.student.isApproved
                      ? "Approved Active Student"
                      : "Pending Approval"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Account Protection:</span>
                  <span
                    className={`font-bold ${modal.student.twoFactorEnabled ? "text-purple-600 dark:text-purple-400" : "text-slate-500"}`}
                  >
                    {modal.student.twoFactorEnabled
                      ? "2FA TOTP Active"
                      : "Standard Password"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Enrolled On:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(modal.student.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* 2FA Protection Reason Card */}
              <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span>2FA Protection Details</span>
                </div>
                <p className="text-[11px] text-purple-900/80 dark:text-purple-300/80 leading-relaxed">
                  {modal.student.twoFactorEnabled
                    ? "Reason: This student activated 2-Factor Authentication via an Authenticator App (TOTP + Backup Keys) to secure their account against unauthorized logins."
                    : "Reason: Standard password authentication. 2-Factor Authentication is currently not configured for this account."}
                </p>
              </div>

              <button
                onClick={() => setModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Revoke Approval Access Modal */}
      <AnimatePresence>
        {modal && modal.type === "revoke" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full relative"
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3">
                <UserX className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Revoke Access for {modal.student.name}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-5 leading-relaxed">
                This student will no longer be able to log in or access student
                portal tools until re-approved by an admin.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal(null)}
                  disabled={actingStudentId === modal.student.id}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={actingStudentId === modal.student.id}
                  className="flex-1 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/25"
                >
                  {actingStudentId === modal.student.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Revoke Access"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {modal && modal.type === "delete" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full relative"
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-3">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete {modal.student.name}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
                This action will permanently remove this student account from
                the database.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setModal(null)}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStudent}
                  disabled={isSubmitting}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-500/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete Account"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Demo Account Protection Alert Modal */}
      <AnimatePresence>
        {modal && modal.type === "demo_protected" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full relative"
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 mb-3">
                <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Protected Demo Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-5 leading-relaxed">
                The Demo Student account (
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {modal.student.email}
                </span>
                ) is protected and cannot be deleted or have its access revoked.
                This account is reserved for platform demonstrations and system
                testing.
              </p>
              <button
                onClick={() => setModal(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
