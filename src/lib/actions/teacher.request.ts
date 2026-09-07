"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

async function getAuthHeaders(authToken?: string): Promise<Record<string, string>> {
  const headersMap: Record<string, string> = {};
  if (authToken) {
    headersMap["Authorization"] = `Bearer ${authToken}`;
  }
  try {
    const { headers } = await import("next/headers");
    const reqHeaders = await headers();
    const cookie = reqHeaders.get("cookie");
    if (cookie) {
      headersMap["cookie"] = cookie;
      if (!headersMap["Authorization"]) {
        const match = cookie.match(/better-auth\.session_token=([^;]+)/);
        if (match) {
          headersMap["Authorization"] = `Bearer ${decodeURIComponent(match[1])}`;
        }
      }
    }
  } catch {
    // running outside request context
  }
  return headersMap;
}

// Helper to safely handle non-JSON or HTML server errors (e.g., 401, 500 pages)
async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }
  const rawText = await res.text();
  throw new Error(`Server Non-JSON Response [Status ${res.status}]: ${rawText.substring(0, 150)}`);
}

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
  status?: string,
  authToken?: string
): Promise<GetRequestsResponse> {
  try {
    if (!SERVER_URL) {
      return { success: false, requests: [], error: "SERVER_URL is missing in Production ENV" };
    }

    const authHeaders = await getAuthHeaders(authToken);
    const params = new URLSearchParams();
    if (teacherEmail) params.append("teacherEmail", teacherEmail);
    if (status) params.append("status", status);

    const queryString = params.toString();
    const url = `${SERVER_URL}/api/teacher/requests${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        ...authHeaders,
      },
    });

    const data = await parseResponse(res);

    if (!res.ok) {
      return { success: false, requests: [], error: data.error || `Unauthorized or HTTP Error ${res.status}` };
    }

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
  payload: CreateRequestPayload,
  authToken?: string
): Promise<CreateRequestResponse> {
  try {
    if (!SERVER_URL) {
      return { success: false, error: "SERVER_URL is missing in Production ENV" };
    }

    const authHeaders = await getAuthHeaders(authToken);
    const res = await fetch(`${SERVER_URL}/api/teacher/requests`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(res);

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
export async function deleteTeacherRequestAction(
  requestId: string,
  authToken?: string
): Promise<ActionResponse> {
  try {
    if (!SERVER_URL) {
      return { success: false, error: "SERVER_URL is missing in Production ENV" };
    }

    const authHeaders = await getAuthHeaders(authToken);
    const res = await fetch(`${SERVER_URL}/api/teacher/requests/${requestId}`, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        ...authHeaders,
      },
    });

    const data = await parseResponse(res);

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
  adminFeedback?: string,
  authToken?: string
): Promise<ActionResponse> {
  try {
    if (!SERVER_URL) {
      return { success: false, error: "SERVER_URL is missing in Production ENV" };
    }

    const authHeaders = await getAuthHeaders(authToken);
    const res = await fetch(`${SERVER_URL}/api/admin/requests/${requestId}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ status, adminFeedback }),
    });

    const data = await parseResponse(res);

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