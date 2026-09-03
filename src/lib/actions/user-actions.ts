"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface UpdateProfileInput {
  email?: string;
  userId?: string;
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
  schoolName?: string;
  studentClass?: string;
  section?: string;
  roll?: string;
  qualification?: string;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  user?: T;
}

/**
 * Server Action to update user profile details via EduNexus Express Backend API
 * without relying on cookies.
 */
export async function updateUserProfileAction(
  data: UpdateProfileInput
): Promise<ActionResponse> {
  try {
    const response = await fetch(`${SERVER_URL}/api/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();

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
  } catch (error: any) {
    console.error("updateUserProfileAction error:", error);
    return {
      success: false,
      error: error?.message || "Server action request failed.",
    };
  }
}