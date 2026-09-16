



const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
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

/**
 * Server Action to update user profile details via EduNexus Express Backend API.
 * Forwards request cookies to ensure Express session authentication succeeds.
 */
export async function updateUserProfileAction(
  data: UpdateProfileInput,
): Promise<ActionResponse> {
  try {
    const response = await fetch(`${SERVER_URL}/api/user/profile`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    // console.log("updateUserProfileAction request body:",data);

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
 * Checks whether an account with the given email already exists in the system.
 */
export async function checkUserExistsAction(
  email: string
): Promise<{ success: boolean; exists: boolean; user?: any; error?: string }> {
  try {
    const response = await fetch(
      `${SERVER_URL}/api/user/check-exists?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const result = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      exists: false,
      error: error?.message || "Failed to check email existence.",
    };
  }
}
