"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export interface ClassSubjectRequestItem {
  id: string;
  teacherEmail: string;
  teacherName: string;
  grade: string;
  section: string;
  subject: string;
  subjectCode: string;
  group?: string;
  room?: string;
  schedule?: string;
  time?: string;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestPayload {
  teacherEmail: string;
  teacherName?: string;
  grade: string;
  section: string;
  subject: string;
  subjectCode?: string;
  group?: string;
  room?: string;
  schedule?: string;
  time?: string;
  reason?: string;
}

export interface GetRequestsResponse {
  success: boolean;
  requests: ClassSubjectRequestItem[];
  error?: string;
}

export interface CreateRequestResponse {
  success: boolean;
  message?: string;
  request?: ClassSubjectRequestItem;
  error?: string;
}

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Fetch class & subject requests from EduNexus API server
 */
export async function getTeacherRequestsAction(
  teacherEmail?: string,
  status?: string
): Promise<GetRequestsResponse> {
  try {
    const params = new URLSearchParams();
    if (teacherEmail) params.append("teacherEmail", teacherEmail);
    if (status) params.append("status", status);

    const queryString = params.toString();
    const url = `${SERVER_URL}/api/teacher/requests${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, requests: [], error: "Failed to fetch requests from server" };
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.requests)) {
      return {
        success: true,
        requests: data.requests,
      };
    }

    return { success: false, requests: [], error: data.error || "Failed to load requests" };
  } catch (err: any) {
    console.error("getTeacherRequestsAction Error:", err);
    return { success: false, requests: [], error: err?.message || "Server action failed" };
  }
}

/**
 * Create a new class & subject request
 */
export async function createTeacherRequestAction(
  payload: CreateRequestPayload
): Promise<CreateRequestResponse> {
  try {
    const res = await fetch(`${SERVER_URL}/api/teacher/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to submit request" };
    }

    return {
      success: true,
      message: data.message || "Request submitted successfully",
      request: data.request,
    };
  } catch (err: any) {
    console.error("createTeacherRequestAction Error:", err);
    return { success: false, error: err?.message || "Server action failed" };
  }
}

/**
 * Cancel/Delete a pending request
 */
export async function deleteTeacherRequestAction(requestId: string): Promise<ActionResponse> {
  try {
    const res = await fetch(`${SERVER_URL}/api/teacher/requests/${requestId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to delete request" };
    }

    return {
      success: true,
      message: data.message || "Request deleted successfully",
    };
  } catch (err: any) {
    console.error("deleteTeacherRequestAction Error:", err);
    return { success: false, error: err?.message || "Server action failed" };
  }
}

/**
 * Update request status (Admin function)
 */
export async function updateTeacherRequestStatusAction(
  requestId: string,
  status: "APPROVED" | "REJECTED" | "PENDING",
  adminFeedback?: string
): Promise<ActionResponse> {
  try {
    const res = await fetch(`${SERVER_URL}/api/admin/requests/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, adminFeedback }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to update request status" };
    }

    return {
      success: true,
      message: data.message || "Request status updated successfully",
    };
  } catch (err: any) {
    console.error("updateTeacherRequestStatusAction Error:", err);
    return { success: false, error: err?.message || "Server action failed" };
  }
}
