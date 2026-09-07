"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

async function getAuthHeaders(token?: string): Promise<Record<string, string>> {
  const headersMap: Record<string, string> = {};
  if (token) {
    headersMap["Authorization"] = `Bearer ${token}`;
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

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  location?: string | null;
  department?: string | null;
  bio?: string | null;
  role: string;
  fatherName?: string | null;
  motherName?: string | null;
  dateOfBirth?: string | Date | null;
  address?: string | null;
  bloodGroup?: string | null;
  schoolName?: string | null;
  studentClass?: string | null;
  roll?: string | null;
  createdAt?: string | Date | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetTeacherStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  studentClass?: string;
}

export interface GetTeacherStudentsResponse {
  success: boolean;
  students: StudentUser[];
  pagination: PaginationMeta;
  classes: string[];
  error?: string;
}

const emptyResponse = (
  error: string,
): GetTeacherStudentsResponse => ({
  success: false,
  students: [],
  pagination: { total: 0, page: 1, limit: 20, totalPages: 1 },
  classes: ["All Classes"],
  error,
});

/**
 * Server action to fetch students from Express backend API
 */
export async function getTeacherStudentsAction(
  params: GetTeacherStudentsParams = {},
  token?: string,
): Promise<GetTeacherStudentsResponse> {
  try {
    const { page = 1, limit = 20, search = "", studentClass = "" } = params;

    const query = new URLSearchParams();
    query.set("page", page.toString());
    query.set("limit", limit.toString());
    if (search) query.set("search", search);
    if (studentClass && studentClass !== "All Classes") {
      query.set("studentClass", studentClass);
    }

    const authHeaders = await getAuthHeaders(token);
    const res = await fetch(`${SERVER_URL}/api/teacher/students?${query.toString()}`, {
      cache: "no-store",
      headers: {
        ...authHeaders,
      },
    });

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return emptyResponse("Invalid response from server");
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      return emptyResponse(data.error || "Failed to fetch student list");
    }

    return {
      success: true,
      students: data.students || [],
      pagination:
        data.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 },
      classes: data.classes || ["All Classes"],
    };
  } catch (error: unknown) {
    console.error("getTeacherStudentsAction error:", error);
    const errMessage =
      error instanceof Error ? error.message : "Failed to fetch student list";
    return emptyResponse(errMessage);
  }
}
