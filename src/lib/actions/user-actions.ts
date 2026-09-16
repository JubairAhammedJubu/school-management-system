"use server";

import { cookies } from "next/headers";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

/** Only fields a user is allowed to edit from the client */
export interface UpdateProfileInput {
  name: string;
  image?: string;
  phone?: string;
  location?: string;
  department?: string;
  bio?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  address?: string;
  bloodGroup?: string;
  gender?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  schoolName?: string;
  studentClass?: string;
  studentSection?: string;
  sessionYear?: string;
  section?: string;
  roll?: string;
  qualification?: string;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  user?: T;
}

function getSessionCookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  // Forward only auth-related cookies if possible
  const session =
    cookieStore.get("better-auth.session_token") ??
    cookieStore.get("__Secure-better-auth.session_token");

  if (session) {
    return `${session.name}=${session.value}`;
  }

  // Fallback: all cookies (less ideal)
  return cookieStore.toString();
}

function sanitizeProfilePayload(data: UpdateProfileInput) {
  const trim = (v?: string) =>
    typeof v === "string" ? v.trim() : undefined;

  // Never send identity/role fields from client
  return {
    name: trim(data.name) || "",
    image: trim(data.image),
    phone: trim(data.phone),
    location: trim(data.location),
    department: trim(data.department),
    bio: trim(data.bio)?.slice(0, 1000),
    fatherName: trim(data.fatherName),
    motherName: trim(data.motherName),
    dateOfBirth: trim(data.dateOfBirth),
    address: trim(data.address)?.slice(0, 500),
    bloodGroup: trim(data.bloodGroup),
    gender: trim(data.gender),
    guardianPhone: trim(data.guardianPhone),
    guardianRelation: trim(data.guardianRelation),
    schoolName: trim(data.schoolName),
    studentClass: trim(data.studentClass),
    studentSection: trim(data.studentSection),
    sessionYear: trim(data.sessionYear),
    section: trim(data.section),
    roll: trim(data.roll),
    qualification: trim(data.qualification),
  };
}

/**
 * Update profile — identity comes from session on backend, not body.
 */
export async function updateUserProfileAction(
  data: UpdateProfileInput,
): Promise<ActionResponse> {
  try {
    if (!data?.name || !data.name.trim()) {
      return { success: false, error: "Name is required." };
    }

    const payload = sanitizeProfilePayload(data);

    if (!payload.name) {
      return { success: false, error: "Name is required." };
    }

    const cookieStore = await cookies();
    const cookieHeader = getSessionCookieHeader(cookieStore);

    if (!cookieHeader) {
      return { success: false, error: "Unauthorized. Please log in again." };
    }

    const response = await fetch(`${SERVER_URL}/api/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to update profile information.",
      };
    }

    return {
      success: true,
      message: result.message || "Profile updated successfully!",
      user: result.user,
    };
  } catch (error: unknown) {
    console.error("updateUserProfileAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Server action request failed.",
    };
  }
}

/**
 * Email existence check — minimal response, basic validation.
 * Still public by nature; backend must rate-limit.
 */
export async function checkUserExistsAction(
  email: string,
): Promise<{ success: boolean; exists: boolean; error?: string }> {
  try {
    const normalized = String(email || "").trim().toLowerCase();

    // Basic email shape check (not perfect, but blocks junk)
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return {
        success: false,
        exists: false,
        error: "Please enter a valid email address.",
      };
    }

    // Prevent oversized input
    if (normalized.length > 254) {
      return {
        success: false,
        exists: false,
        error: "Email is too long.",
      };
    }

    const response = await fetch(
      `${SERVER_URL}/api/user/check-exists?email=${encodeURIComponent(normalized)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        exists: false,
        error: result.error || "Failed to check email existence.",
      };
    }

    // Only expose boolean — never full user object
    return {
      success: true,
      exists: Boolean(result.exists),
    };
  } catch (error: unknown) {
    console.error("checkUserExistsAction error:", error);
    return {
      success: false,
      exists: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check email existence.",
    };
  }
}