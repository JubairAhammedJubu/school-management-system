"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Shield,
  Lock,
  Camera,
  CheckCircle2,
  Calendar,
  Building,
  Phone,
  MapPin,
  Edit3,
  Save,
  Sparkles,
  ArrowLeft,
  Clock,
  ChevronDown,
  Award,
  Users,
  Droplet,
  Home,
  School,
  Briefcase,
  GraduationCap,
  Check,
  X,
  Info,
  Hash,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { updateUserProfileAction } from "@/lib/actions/user-actions";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const GUARDIAN_RELATION_OPTIONS = [
  "Father",
  "Mother",
  "Legal Guardian",
  "Uncle",
  "Aunt",
  "Other",
];
const CLASS_OPTIONS = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTION_OPTIONS = ["Section A", "Section B"];
const GROUP_OPTIONS = ["Science", "Business Studies", "Humanities"];
const TEACHER_DEPARTMENT_OPTIONS = [
  "Science",
  "Commerce",
  "Arts",
  "Computer Science & ICT",
  "Mathematics",
  "English",
  "Bangla",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Science",
  "Accounting",
  "Islamic Studies",
  "Physical Education",
];
const QUALIFICATION_OPTIONS = [
  "B.Sc",
  "M.Sc",
  "B.A",
  "M.A",
  "B.Ed",
  "M.Ed",
  "B.Com",
  "M.Com",
  "Ph.D",
  "Diploma in Education",
];

interface ProfileCustomSelectProps {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}

function ProfileCustomSelect({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder = "Select option",
}: ProfileCustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20 shadow-xs flex items-center justify-between text-left cursor-pointer"
        >
          <span className={value ? "font-medium" : "text-slate-400 dark:text-slate-500"}>
            {value || placeholder}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400">
            <Icon size={16} className="text-slate-400 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-500 dark:text-indigo-400" : ""
                }`}
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 left-0 right-0 mt-1.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-2xl dark:shadow-black/70 max-h-52 overflow-y-auto"
            >
              {options.map((opt) => {
                const isSelected = opt === value;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-xs text-left flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-500/15 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer ${isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold"
                        : "text-slate-700 dark:text-slate-200"
                      }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <Check size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Profile Form States
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(""); // Present Address
  const [address, setAddress] = useState(""); // Permanent Address
  const [department, setDepartment] = useState("");
  const currentYearStr = new Date().getFullYear().toString();
  const [sessionYear, setSessionYear] = useState(currentYearStr);
  const [studentClass, setStudentClass] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("");
  const [qualification, setQualification] = useState("");
  const [bio, setBio] = useState("");

  // Profile Image States (UNTOUCHED as requested)
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const userEmail = session?.user?.email || "user@edunexus.com";
  const userEmailLower = userEmail.toLowerCase();
  const isDemoUser =
    userEmailLower === "demostudent@edunexus.std.com" ||
    userEmailLower === "demoteacher@edunexus.tchr.com" ||
    (session?.user as Record<string, any>)?.isDemo === true;

  // Sync all user details on session load
  useEffect(() => {
    if (session?.user) {
      const u = session.user as Record<string, any>;
      console.log("Syncing user details from session:", u);
      if (u.name) setName(u.name);
      if (u.image) setProfileImage(u.image);
      if (u.phone) setPhone(u.phone);
      if (u.location) setLocation(u.location);
      if (u.department) setDepartment(u.department);
      const createdYear = u.createdAt ? new Date(u.createdAt).getFullYear() : null;
      const validCreatedYear = createdYear && !isNaN(createdYear) ? String(createdYear) : "";
      const derivedSession = u.sessionYear || u.session || validCreatedYear || currentYearStr;
      setSessionYear(String(derivedSession));
      if (u.studentClass) setStudentClass(u.studentClass);
      if (u.studentSection || u.section) {
        setStudentSection(u.studentSection || u.section);
      }
      if (u.rollNumber || u.roll) {
        setRollNumber(String( u.rollNumber || u.roll || "" ));
      }
      if (u.schoolName) setSchoolName(u.schoolName);
      if (u.fatherName) setFatherName(u.fatherName);
      if (u.motherName) setMotherName(u.motherName);
      if (u.dateOfBirth) {
        const dobDate = new Date(u.dateOfBirth);
        if (!isNaN(dobDate.getTime())) {
          setDateOfBirth(dobDate.toISOString().split("T")[0]);
        }
      }
      if (u.address) setAddress(u.address);
      if (u.bloodGroup) setBloodGroup(u.bloodGroup);
      if (u.gender) setGender(u.gender);
      if (u.guardianPhone) setGuardianPhone(u.guardianPhone);
      if (u.guardianRelation) setGuardianRelation(u.guardianRelation);
      if (u.qualification) setQualification(u.qualification);
      if (u.bio) setBio(u.bio);
    }
  }, [session]);

  // Profile Image Upload Handlers
  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (isDemoUser) {
      setShowDemoModal(true);
      event.target.value = "";
      return;
    }
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile images must be 5 MB or smaller.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile/image`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload profile image.");
      }

      const imageUrl = data.imageUrl || data.fileUrl || data.url;
      if (typeof imageUrl !== "string" || !imageUrl.trim()) {
        throw new Error(
          "The profile image URL was not returned by the server.",
        );
      }

      const profileResponse = await updateUserProfileAction({
        email: userEmail,
        userId: session?.user?.id,
        name: name.trim() || session?.user?.name || "EduNexus Member",
        image: imageUrl.trim(),
      });

      if (!profileResponse.success) {
        throw new Error(profileResponse.error || "Failed to save profile image.");
      }

      setProfileImage(imageUrl.trim());
      URL.revokeObjectURL(previewUrl);
      setProfileImagePreview("");
      toast.success("Profile picture updated successfully.");
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      setProfileImagePreview("");
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile picture.",
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const openProfileImagePicker = () => {
    if (isDemoUser) {
      setShowDemoModal(true);
      return;
    }
    if (!isUploadingImage) {
      profileImageInputRef.current?.click();
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoUser) {
      setShowDemoModal(true);
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter a valid full name.");
      return;
    }

    if (
      phone.trim() &&
      (!phone.trim().startsWith("01") || phone.trim().length !== 11)
    ) {
      toast.error("Phone number must be exactly 11 digits and start with 01.");
      return;
    }

    if (
      guardianPhone.trim() &&
      (!guardianPhone.trim().startsWith("01") || guardianPhone.trim().length !== 11)
    ) {
      toast.error("Guardian phone number must be exactly 11 digits and start with 01.");
      return;
    }

    if (
      phone.trim() &&
      guardianPhone.trim() &&
      phone.trim() === guardianPhone.trim()
    ) {
      toast.error("Student phone number cannot be the same as Guardian phone number.");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateUserProfileAction({
        email: userEmail,
        userId: session?.user?.id,
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        address: address.trim(),
        department: department.trim(),
        studentClass: studentClass.trim(),
        studentSection: studentSection.trim(),
        section: studentSection.trim(),
        sessionYear: sessionYear.trim() || currentYearStr,
        schoolName: schoolName.trim(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        dateOfBirth: dateOfBirth,
        bloodGroup: bloodGroup,
        gender: gender,
        guardianPhone: guardianPhone.trim(),
        guardianRelation: guardianRelation,
        qualification: qualification.trim(),
        bio: bio.trim(),
      });
      if (res.success) {
        toast.success(res.message || "Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Skeleton Loader while checking session
  if (isPending) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans py-12 sm:py-16 lg:py-24 flex flex-col justify-center items-center">
        {/* Background Mesh Glows */}
        <div className="pointer-events-none fixed top-20 left-10 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl" />
        <div className="pointer-events-none fixed bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-28 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>

          {/* Header Cover Card Skeleton */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-xl dark:shadow-2xl dark:shadow-black/70 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
                {/* Avatar & Upload button Skeleton */}
                <div className="flex flex-col items-center gap-2">
                  <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <div className="h-8 w-48 sm:w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-6 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-4 w-44 sm:w-60 rounded-md bg-slate-200 dark:bg-slate-800 mx-auto sm:mx-0" />
                </div>
              </div>
              <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            </div>
          </div>

          {/* Main Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Form Container Skeleton */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-md dark:shadow-2xl dark:shadow-black/70 space-y-6 animate-pulse">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-2">
                <div className="h-6 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-full max-w-sm rounded-md bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Form Section 1: Academic / Professional */}
              <div className="space-y-4 pt-2">
                <div className="h-4 w-44 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
                  </div>
                </div>
              </div>

              {/* Form Section 2: Personal Info */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="h-4 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-20 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
                </div>
              </div>

              {/* Form Section 3: Bio */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800" />
              </div>
            </div>

            {/* Right Sidebar Skeleton */}
            <div className="space-y-6">
              {/* System Identity Card Skeleton */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-md dark:shadow-2xl dark:shadow-black/70 space-y-4 animate-pulse">
                <div className="h-5 w-44 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-3 pt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/80 last:border-0"
                    >
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tip Card Skeleton */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-md dark:shadow-2xl dark:shadow-black/70 space-y-3 animate-pulse">
                <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-full rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                <div className="h-3 w-4/5 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login prompt if unauthenticated
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-950 p-8 text-center shadow-xl backdrop-blur-xl dark:shadow-2xl dark:shadow-black/70"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Authentication Required
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Please log in to your EduNexus account to access your user profile
            and settings.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <span>Go to Login</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Role calculations
  const rawRole = (
    (session?.user as { role?: string } | undefined)?.role || "student"
  ).toLowerCase();
  const userRole = rawRole.toUpperCase();
  const isTeacher = rawRole === "teacher";
  const isStudent = rawRole === "student";
  const isAdmin = rawRole === "admin";

  const userCreatedAt = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Jan 2026";
  const userUpdatedAt = (
    session?.user as { updatedAt?: string | Date } | undefined
  )?.updatedAt
    ? new Date(
      (session?.user as { updatedAt?: string | Date }).updatedAt!,
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Recently";
  const isEmailVerified =
    (session?.user as { emailVerified?: boolean } | undefined)?.emailVerified ??
    true;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans py-12 sm:py-16 lg:py-24 flex flex-col justify-center items-center">
      {/* Background Mesh Glows */}
      <div className="pointer-events-none fixed top-20 left-10 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none fixed bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isTeacher
              ? "Teacher Profile"
              : isStudent
                ? "Student Profile"
                : "Admin Profile"}
          </span>
        </div>

        {/* Demo Account Read-Only Banner */}
        {isDemoUser && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/90 dark:bg-amber-500/10 p-4 shadow-sm backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-900 dark:text-amber-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Demo Account — Read-Only Mode
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Profile modifications are disabled for demo accounts to maintain standard credentials for all visitors.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDemoModal(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-100/80 dark:bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors cursor-pointer shrink-0"
            >
              <Info className="h-4 w-4" />
              <span>Learn More</span>
            </button>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* PROFILE HEADER COVER CARD */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl dark:shadow-2xl dark:shadow-black/70 backdrop-blur-xl"
        >
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Avatar & Basic Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-4 border-white dark:border-slate-900 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-2xl flex items-center justify-center text-4xl font-extrabold shrink-0 overflow-hidden group">
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview}
                        alt="Selected profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : profileImage ? (
                      <Image
                        src={profileImage}
                        alt={name || "User Avatar"}
                        width={128}
                        height={128}
                        loading="eager"
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{(name || userEmail)[0]?.toUpperCase()}</span>
                    )}

                    <button
                      type="button"
                      onClick={openProfileImagePicker}
                      disabled={isUploadingImage}
                      aria-label="Change profile photo"
                      className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-semibold text-white cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Camera className="h-6 w-6 mb-1" />
                      {isUploadingImage ? "Uploading..." : "Change"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={openProfileImagePicker}
                    disabled={isUploadingImage}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-600 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-400"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    {isUploadingImage ? "Uploading..." : "Choose photo"}
                  </button>
                  <input
                    ref={profileImageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleProfileImageChange}
                    disabled={isUploadingImage}
                    className="sr-only"
                  />
                </div>

                <div className="mb-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {name || "EduNexus Member"}
                    </h1>

                    {/* Role Badge */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border ${isTeacher
                          ? "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20"
                          : isStudent
                            ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"
                            : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20"
                        }`}
                    >
                      {isTeacher ? (
                        <Briefcase className="h-3.5 w-3.5" />
                      ) : isStudent ? (
                        <GraduationCap className="h-3.5 w-3.5" />
                      ) : (
                        <Shield className="h-3.5 w-3.5" />
                      )}
                      {userRole}
                    </span>

                    {/* Dynamic Extra Badges */}
                    {isTeacher && qualification && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20">
                        <Award className="h-3.5 w-3.5" />
                        {qualification}
                      </span>
                    )}

                    {isTeacher && department && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                        <Building className="h-3.5 w-3.5" />
                        {department}
                      </span>
                    )}

                    {isStudent && (studentClass || studentSection || rollNumber || sessionYear) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                        <School className="h-3.5 w-3.5" />
                        {[
                          studentClass,
                          studentSection,
                          rollNumber ? `Roll: ${rollNumber}` : null,
                          sessionYear ? `Session ${sessionYear}` : null,
                        ].filter(Boolean).join(" • ")}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{userEmail}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isDemoUser) {
                      setShowDemoModal(true);
                    } else {
                      setIsEditing(!isEditing);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all shadow-xs cursor-pointer"
                >
                  <Edit3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* DYNAMIC ROLE-BASED PROFILE FORM CONTENT */}
        {/* ========================================================= */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main Form Box */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-md dark:shadow-2xl dark:shadow-black/70 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {isTeacher
                      ? "Teacher Profile Information"
                      : isStudent
                        ? "Student Academic Profile"
                        : "Administrator Account Profile"}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isTeacher
                      ? "Your official teacher credentials, department, and contact information."
                      : isStudent
                        ? "Your student enrollment, class allocation, and parent details."
                        : "System control permissions and administrator profile details."}
                  </p>
                </div>
                {isEditing && (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/20">
                    Editing Mode
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">

                {/* ── 1. ROLE-SPECIFIC SPECIAL SECTION ───────────────── */}

                {/* TEACHER SPECIFIC: Professional Info */}
                {isTeacher && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      <span>Professional &amp; Teaching Details</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {isEditing ? (
                        <ProfileCustomSelect
                          label="Department *"
                          icon={Building}
                          value={department}
                          onChange={setDepartment}
                          options={TEACHER_DEPARTMENT_OPTIONS}
                          placeholder="Select Department"
                        />
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Department *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={department || "Not specified"}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-medium"
                            />
                            <Building className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {isEditing ? (
                        <ProfileCustomSelect
                          label="Education Qualification *"
                          icon={Award}
                          value={qualification}
                          onChange={setQualification}
                          options={QUALIFICATION_OPTIONS}
                          placeholder="Select Qualification"
                        />
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Education Qualification *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={qualification || "Not specified"}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-medium"
                            />
                            <Award className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STUDENT SPECIFIC: Academic Details */}
                {isStudent && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4" />
                        <span>Academic Enrollment Details</span>
                      </h4>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Read-only enrollment fields</span>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-start gap-2.5 shadow-xs">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed text-blue-900 dark:text-blue-200">
                        <strong className="font-bold text-blue-950 dark:text-blue-100">Need to update your academic information?</strong> Academic enrollment details (School Name, Class, Section, Roll Number &amp; Group) cannot be self-edited. Please contact your school administrator to make any changes.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Row 1: School Name & Class side-by-side */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* School Name (Disabled / Read Only for Student) */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              School Name
                            </label>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Read Only
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={schoolName || "Not assigned"}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-900/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed"
                            />
                            <School className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                          </div>
                        </div>

                        {/* Class (Disabled for Student) */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              Class
                            </label>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Read Only
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={studentClass || "Not assigned"}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-900/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed"
                            />
                            <School className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Section, Roll Number & Group lower to them */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Section (Disabled for Student) */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              Section
                            </label>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Read Only
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={studentSection || "Not assigned"}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-900/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed"
                            />
                            <Users className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                          </div>
                        </div>

                        {/* Roll Number (Disabled for Student) */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              Roll Number
                            </label>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Read Only
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={rollNumber ? `Roll ${rollNumber}` : "Not assigned"}
                              className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 px-4 py-2.5 text-sm text-emerald-700 dark:text-emerald-300 font-extrabold cursor-not-allowed"
                            />
                            <Hash className="absolute right-3.5 top-3 h-4 w-4 text-emerald-500 dark:text-emerald-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Group (Class 9 & 10) (Disabled for Student) */}
                        {(studentClass === "Class 9" || studentClass === "Class 10") && (
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Group
                              </label>
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> Read Only
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                disabled
                                value={department || "Not specified"}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-900/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed"
                              />
                              <Building className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                            </div>
                          </div>
                        )}

                        {/* Session Year */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              Session Year
                            </label>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Read Only
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={sessionYear || "2026"}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-900/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-bold cursor-not-allowed"
                            />
                            <Calendar className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ADMIN SPECIFIC: System Administration */}
                {isAdmin && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      <span>System Governance &amp; Administration</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Privilege Level
                        </label>
                        <input
                          type="text"
                          disabled
                          value="Super Administrator"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          System Access
                        </label>
                        <input
                          type="text"
                          disabled
                          value="Full Authorization &amp; Moderation"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 2. PERSONAL & FAMILY DETAILS (Teacher & Student) ─── */}
                {!isAdmin && (
                  <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>Personal &amp; Family Details</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Father&apos;s Name {isTeacher && "*"}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                            placeholder="e.g. Abdul Karim"
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 disabled:opacity-80"
                          />
                          <User className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Mother&apos;s Name {isTeacher && "*"}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={motherName}
                            onChange={(e) => setMotherName(e.target.value)}
                            placeholder="e.g. Rahima Begum"
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 disabled:opacity-80"
                          />
                          <User className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Date of Birth {isTeacher && "*"}
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            disabled={!isEditing}
                            max={new Date().toISOString().split("T")[0]}
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 disabled:opacity-80"
                          />
                          <Calendar className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {isEditing ? (
                        <ProfileCustomSelect
                          label={isTeacher ? "Blood Group *" : "Blood Group"}
                          icon={Droplet}
                          value={bloodGroup}
                          onChange={setBloodGroup}
                          options={BLOOD_GROUPS}
                          placeholder="Select Blood Group"
                        />
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Blood Group {isTeacher && "*"}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={bloodGroup || "Not specified"}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-medium"
                            />
                            <Droplet className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {/* Gender */}
                      {isEditing ? (
                        <ProfileCustomSelect
                          label="Gender"
                          icon={User}
                          value={gender}
                          onChange={setGender}
                          options={GENDER_OPTIONS}
                          placeholder="Select Gender"
                        />
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Gender
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={gender || "Not specified"}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-medium"
                            />
                            <User className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {/* Guardian Phone */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Guardian Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            inputMode="numeric"
                            disabled={!isEditing}
                            maxLength={11}
                            value={guardianPhone}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, "").slice(0, 11);
                              if (val.length > 0) {
                                if (val[0] !== "0") val = "0" + val.slice(1);
                                if (val.length > 1 && val[1] !== "1") val = "01" + val.slice(2);
                              }
                              setGuardianPhone(val);
                            }}
                            placeholder="01712345678"
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 disabled:opacity-80"
                          />
                          <Phone className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Guardian Relationship */}
                      {isEditing ? (
                        <ProfileCustomSelect
                          label="Guardian Relationship"
                          icon={Users}
                          value={guardianRelation}
                          onChange={setGuardianRelation}
                          options={GUARDIAN_RELATION_OPTIONS}
                          placeholder="Select Relationship"
                        />
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Guardian Relationship
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={guardianRelation || "Not specified"}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-medium"
                            />
                            <Users className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── 3. CONTACT & ADDRESS DETAILS ───────────────────── */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>Contact &amp; Address Information</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 disabled:opacity-80"
                        />
                        <User className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address (Account ID)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled
                          value={userEmail}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                        <Mail className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isStudent ? "Student Phone Number" : isTeacher ? "Phone Number *" : "Phone Number"}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled={!isEditing}
                          maxLength={11}
                          value={phone}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "").slice(0, 11);
                            if (val.length > 0) {
                              if (val[0] !== "0") val = "0" + val.slice(1);
                              if (val.length > 1 && val[1] !== "1") val = "01" + val.slice(2);
                            }
                            setPhone(val);
                          }}
                          placeholder="01712345678"
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 disabled:opacity-80"
                        />
                        <Phone className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Present Address {isTeacher && "*"}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Present address e.g. Dhaka, Bangladesh"
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 disabled:opacity-80"
                        />
                        <MapPin className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {!isAdmin && (
                    <div className="mt-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Permanent Address {isTeacher && "*"}
                      </label>
                      <div className="relative">
                        <textarea
                          rows={2}
                          disabled={!isEditing}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Permanent address: Village/House, Post Office, District"
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 disabled:opacity-80 resize-none"
                        />
                        <Home className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>

                {/* ── 4. BIO / SUMMARY ───────────────────────────────── */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isTeacher
                      ? "Short Bio (Teaching Experience & Background) *"
                      : isStudent
                        ? "Short Bio (About Yourself)"
                        : "Administrative Bio"}
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={
                      isTeacher
                        ? "A brief summary of your teaching background & experience"
                        : "A line or two about yourself"
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 disabled:opacity-80 resize-none"
                  />
                </div>

                {/* Save Button in Editing Mode */}
                {isEditing && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingProfile ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Profile Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Side Status & Identity Card */}
            <div className="space-y-6">
              {/* System Details Card */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-md dark:shadow-2xl dark:shadow-black/70 backdrop-blur-xl">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>System Identity &amp; Status</span>
                  </span>
                </h4>

                <div className="space-y-3 text-xs">
                  {/* Account Status */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">
                      Account Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active
                    </span>
                  </div>

                  {/* Email Verification */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">
                      Email Verification
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${isEmailVerified
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                        }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {isEmailVerified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  {/* Role Privilege */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">
                      Role Access
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 capitalize">
                      {userRole}
                    </span>
                  </div>

                  {/* Registration Date */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">
                      Member Since
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
                      {userCreatedAt}
                    </span>
                  </div>

                  {/* Last Profile Update */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">
                      Last Updated
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
                      {userUpdatedAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* EduNexus Tip Box */}
              <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-950/40 dark:to-slate-950 p-6 shadow-lg">
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Sparkles className="h-5 w-5" />
                  <h4 className="text-sm font-bold">EduNexus Identity</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isTeacher
                    ? "Your teacher profile details link your assigned classes, subject evaluations, student marksheets, and school notices across EduNexus."
                    : isStudent
                      ? "Your student profile links your enrollment, class schedule, transcript results, and school announcements automatically."
                      : "Your administrative profile grants full management and authorization access across EduNexus."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Demo Account Restriction Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-7 shadow-2xl dark:shadow-black/80"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowDemoModal(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Content Header */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-sm">
                  <Lock className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Demo Account Restriction
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    <Mail className="h-3 w-3 text-amber-500" />
                    {userEmail}
                  </span>
                </div>
              </div>

              {/* Body Text */}
              <div className="mt-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-2">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Demo student and teacher profiles cannot be edited or updated.
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  To ensure a consistent and reliable demonstration experience for all visitors and reviewers, credentials, photos, and personal information for demo accounts are read-only.
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowDemoModal(false)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <span>Got It</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
