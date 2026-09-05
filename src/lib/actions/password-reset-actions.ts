"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

/**
 * Step 1 of "forgot password": verify the user's email + the 6-digit code
 * from their authenticator app. No email/OTP is sent — this checks the
 * code against the same TOTP secret used for normal 2FA login. On success
 * returns a short-lived resetToken used by setNewPasswordAction below.
 */
export async function verifyPasswordResetCodeAction(input: {
  email: string;
  code: string;
}): Promise<ActionResponse<{ resetToken: string }>> {
  try {
    const response = await fetch(`${SERVER_URL}/api/password-reset/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Could not verify that email and code.",
      };
    }

    return { success: true, data: { resetToken: result.resetToken } };
  } catch (error: any) {
    console.error("verifyPasswordResetCodeAction error:", error);
    return { success: false, error: error?.message || "Server action request failed." };
  }
}

/**
 * Step 2: spend the resetToken from step 1 to set a new password.
 */
export async function setNewPasswordAction(input: {
  resetToken: string;
  newPassword: string;
}): Promise<ActionResponse> {
  try {
    const response = await fetch(`${SERVER_URL}/api/password-reset/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to update password.",
      };
    }

    return { success: true, message: result.message || "Password updated successfully." };
  } catch (error: any) {
    console.error("setNewPasswordAction error:", error);
    return { success: false, error: error?.message || "Server action request failed." };
  }
}
