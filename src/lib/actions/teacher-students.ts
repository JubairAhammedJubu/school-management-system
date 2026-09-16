"use server";

import { cookies } from "next/headers";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

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
  studentSection?: string | null;
  roll?: string | null;
  rollNumber?: string | null;
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

const emptyResponse = (error: string): GetTeacherStudentsResponse => ({
  success: false,
  students: [],
  pagination: { total: 0, page: 1, limit: 20, totalPages: 1 },
  classes: ["All Classes"],
  error,
});

async function getCookieHeader() {
  const cookieStore = await cookies();
  const value = cookieStore.toString();
  if (!value) {
    throw new Error("Unauthorized. Please log in again.");
  }
  return value;
}

/**
 * Fetch students from Express backend using HTTP-only session cookie
 */
export async function getTeacherStudentsAction(
  params: GetTeacherStudentsParams = {},
): Promise<GetTeacherStudentsResponse> {
  try {
    const { page = 1, limit = 20, search = "", studentClass = "" } = params;
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

    const query = new URLSearchParams();
    query.set("page", String(safePage));
    query.set("limit", String(safeLimit));
    if (search.trim()) query.set("search", search.trim());
    if (studentClass && studentClass !== "All Classes") {
      query.set("studentClass", studentClass);
    }

    const res = await fetch(
      `${SERVER_URL}/api/teacher/students?${query.toString()}`,
      {
        cache: "no-store",
        headers: {
          Cookie: await getCookieHeader(),
        },
      },
    );

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