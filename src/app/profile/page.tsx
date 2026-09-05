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
  ShieldCheck,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { updateUserProfileAction } from "@/lib/actions/user-actions";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  // Profile Form States
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [location, setLocation] = useState("New York, NY");
  const [department, setDepartment] = useState("Science & Technology");
  const [studentClass, setStudentClass] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [bio, setBio] = useState(
    "Dedicated educator passionate about interactive learning and STEM education.",
  );
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sync user details on session load
  useEffect(() => {
    if (session?.user) {
      const u = session.user as Record<string, any>;
      if (u.name) setName(u.name);
      if (u.image) setProfileImage(u.image);
      if (u.phone) setPhone(u.phone);
      if (u.location) setLocation(u.location);
      if (u.department) setDepartment(u.department);
      if (u.studentClass) setStudentClass(u.studentClass);
      if (u.studentSection || u.section) {
        setStudentSection(u.studentSection || u.section);
      }
      if (u.bio) setBio(u.bio);
    }
  }, [session]);

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      const authToken = localStorage.getItem("better-auth.session_token");
      const authHeaders = authToken
        ? { Authorization: `Bearer ${authToken}` }
        : undefined;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile/image`,
        {
          method: "POST",
          credentials: "include",
          headers: authHeaders,
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

      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(authHeaders ?? {}),
          },
          body: JSON.stringify({
            email: userEmail,
            userId: session?.user?.id,
            name: name.trim() || session?.user?.name || "EduNexus Member",
            image: imageUrl.trim(),
          }),
        },
      );
      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileData.error || "Failed to save profile image.");
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
    if (!isUploadingImage) {
      profileImageInputRef.current?.click();
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a valid full name.");
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
        department: department.trim(),
        studentClass: studentClass.trim(),
        studentSection: studentSection.trim(),
        section: studentSection.trim(),
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

  // Render Skeleton Loader while loading session
  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black px-4 py-20 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <div className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        </div>
      </div>
    );
  }

  // If not logged in, show access prompt
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black px-4 py-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-8 text-center shadow-xl backdrop-blur-xl"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
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
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-6 py-3 font-semibold text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <span>Go to Login</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  const userRole = (
    (session?.user as { role?: string } | undefined)?.role || "Student"
  ).toUpperCase();
  const isStudent = userRole === "STUDENT";
  const userEmail = session?.user?.email || "user@edunexus.com";
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans pb-20 pt-20 sm:pt-24">
      {/* Background Mesh Glows */}
      <div className="pointer-events-none fixed top-20 left-10 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none fixed bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
            Profile &amp; Settings
          </span>
        </div>

        {/* ========================================================= */}
        {/* PROFILE HEADER COVER CARD */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl backdrop-blur-xl"
        >
          {/* User Info Header Row */}
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Avatar & Basic Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-3xl border-4 border-white dark:border-slate-900 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-2xl flex items-center justify-center text-4xl font-extrabold shrink-0 overflow-hidden group">
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
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-600 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-400"
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
                  <div className="flex items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {name || "EduNexus Member"}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {userRole}
                    </span>
                  </div>

                  <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{userEmail}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all shadow-xs cursor-pointer"
                >
                  <Edit3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* PERSONAL INFORMATION CONTENT */}
        {/* ========================================================= */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main Details Form / Card */}
            <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Personal Details
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Manage your account information and public profile details.
                  </p>
                </div>
                {isEditing && (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    Editing Mode
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-80"
                      />
                      <User className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={userEmail}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      />
                      <Mail className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-80"
                      />
                      <Phone className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Location / Campus
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-80"
                      />
                      <MapPin className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Department / Faculty
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-80"
                    />
                    <Building className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {isStudent && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Student Class
                      </label>
                      <div className="relative">
                        <select
                          disabled={!isEditing}
                          value={studentClass}
                          onChange={(e) => setStudentClass(e.target.value)}
                          className="profile-select w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">Select class</option>
                          {Array.from(
                            { length: 12 },
                            (_, index) => `Class ${index + 1}`,
                          ).map((className) => (
                            <option key={className} value={className}>
                              {className}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500 dark:text-indigo-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Student Section
                      </label>
                      <div className="relative">
                        <select
                          disabled={!isEditing}
                          value={studentSection}
                          onChange={(e) => setStudentSection(e.target.value)}
                          className="profile-select w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">Select section</option>
                          {["A", "B", "C", "D"].map((section) => (
                            <option key={section} value={`Section ${section}`}>
                              Section {section}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500 dark:text-indigo-400" />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Bio / Summary
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-80 resize-none"
                  />
                </div>

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
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Side Status & Identity Card */}
            <div className="space-y-6">
              {/* Account Metadata Card */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-xl backdrop-blur-xl">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>System Identity &amp; Details</span>
                  </span>
                </h4>

                <div className="space-y-3 text-xs">
                  {/* Account Status */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-600 dark:text-slate-400">
                      Account Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active
                    </span>
                  </div>

                  {/* Email Status */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-600 dark:text-slate-400">
                      Email Status
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${isEmailVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {isEmailVerified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  {/* Role Privilege */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-600 dark:text-slate-400">
                      Role Privilege
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 capitalize">
                      {userRole}
                    </span>
                  </div>

                  {/* Registration Date */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-600 dark:text-slate-400">
                      Member Since
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {userCreatedAt}
                    </span>
                  </div>

                  {/* Last Profile Update */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-600 dark:text-slate-400">
                      Last Profile Update
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {userUpdatedAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* System Tip Box */}
              <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-950/40 dark:to-slate-900 p-6 shadow-lg">
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Sparkles className="h-5 w-5" />
                  <h4 className="text-sm font-bold">EduNexus Identity</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your EduNexus profile ID links your digital attendance, course
                  materials, grade submissions, and school notices automatically
                  across the system.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
