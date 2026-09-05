"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export interface ApprovalStatusResponse {
  success: boolean;
  isApproved?: boolean;
  error?: string;
}

/**
 * Used by the login form to decide whether to show a disabled "Pending
 * approval" button instead of the normal login button. Safe to call with
 * no session — it's a public, read-only check.
 */
export async function checkApprovalStatusAction(
  email: string,
): Promise<ApprovalStatusResponse> {
  try {
    const response = await fetch(
      `${SERVER_URL}/api/approval-status?email=${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );
    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Could not check approval status." };
    }

    return { success: true, isApproved: Boolean(result.isApproved) };
  } catch (error: any) {
    console.error("checkApprovalStatusAction error:", error);
    return { success: false, error: error?.message || "Server action request failed." };
  }
}
