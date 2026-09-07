"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headersMap: Record<string, string> = {
    "Content-Type": "application/json",
  };
  try {
    const { headers } = await import("next/headers");
    const reqHeaders = await headers();
    const cookie = reqHeaders.get("cookie");
    if (cookie) {
      headersMap["cookie"] = cookie;
      const match = cookie.match(/better-auth\.session_token=([^;]+)/);
      if (match) {
        headersMap["Authorization"] = `Bearer ${decodeURIComponent(match[1])}`;
      }
    }
  } catch {
    // running outside request context
  }
  return headersMap;
}

export interface ExamItem {
  id: string;
  title: string;
  subject: string;
  studentClass: string;
  section: string;
  group?: string;
  examType: "Class Test" | "Quiz" | "Mid-Term" | "Final Term";
  date: string;
  startTime: string;
  endTime: string;
  roomNo: string;
  totalMarks: number;
  passingMarks: number;
  invigilator: string;
  isYourDuty: boolean;
  syllabus?: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  teacherEmail?: string;
  createdAt?: string;
}

export interface CreateExamPayload {
  title: string;
  subject: string;
  studentClass: string;
  section?: string;
  group?: string;
  examType?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  roomNo?: string;
  totalMarks?: number;
  passingMarks?: number;
  invigilator?: string;
  isYourDuty?: boolean;
  syllabus?: string;
  teacherEmail?: string;
}


export interface GetExamsResponse {
  success: boolean;
  exams: ExamItem[];
  error?: string;
}

export interface ActionExamResponse {
  success: boolean;
  message?: string;
  exam?: ExamItem;
  error?: string;
}

/**
 * Fetch all examination schedules from the database via EduNexus server
 */
export async function getTeacherExamsAction(): Promise<GetExamsResponse> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${SERVER_URL}/api/exams`, {
      cache: "no-store",
      headers: authHeaders,
    });

    if (!res.ok) {
      return { success: false, exams: [], error: `Server error: ${res.status}` };
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.exams)) {
      const mapped: ExamItem[] = data.exams.map((item: any) => ({
        id: item.id || item._id,
        title: item.title,
        subject: item.subject,
        studentClass: item.studentClass,
        section: item.section || "Section A",
        group: item.group || undefined,
        examType: (item.examType as ExamItem["examType"]) || "Mid-Term",
        date: item.date,
        startTime: item.startTime || "09:00 AM",
        endTime: item.endTime || "11:30 AM",
        roomNo: item.roomNo || "Hall 101",
        totalMarks: item.totalMarks || 100,
        passingMarks: item.passingMarks || 40,
        invigilator: item.invigilator || "Unassigned",
        isYourDuty: item.isYourDuty ?? true,
        syllabus: item.syllabus || undefined,
        status: (item.status as ExamItem["status"]) || "Upcoming",
        teacherEmail: item.teacherEmail,
        createdAt: item.createdAt,
      }));

      return { success: true, exams: mapped };
    }

    return { success: true, exams: [] };
  } catch (error: any) {
    console.error("Error fetching exams in action:", error);
    return { success: false, exams: [], error: error?.message || "Failed to fetch exams" };
  }
}

/**
 * Create a new examination record in the database
 */
export async function createTeacherExamAction(
  payload: CreateExamPayload
): Promise<ActionExamResponse> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${SERVER_URL}/api/exams`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Failed to create exam (Status ${res.status})`,
      };
    }

    const item = data.exam;
    const createdExam: ExamItem = {
      id: item.id || item._id,
      title: item.title,
      subject: item.subject,
      studentClass: item.studentClass,
      section: item.section || "Section A",
      group: item.group || undefined,
      examType: item.examType || "Mid-Term",
      date: item.date,
      startTime: item.startTime || "09:00 AM",
      endTime: item.endTime || "11:30 AM",
      roomNo: item.roomNo || "Hall 101",
      totalMarks: item.totalMarks || 100,
      passingMarks: item.passingMarks || 40,
      invigilator: item.invigilator || "Unassigned",
      isYourDuty: item.isYourDuty ?? true,
      syllabus: item.syllabus || undefined,
      status: item.status || "Upcoming",
    };


    return {
      success: true,
      message: data.message || "Exam created successfully",
      exam: createdExam,
    };
  } catch (error: any) {
    console.error("Error creating exam in action:", error);
    return { success: false, error: error?.message || "Failed to create exam" };
  }
}

/**
 * Cancel an examination schedule in the database
 */
export async function cancelTeacherExamAction(examId: string): Promise<ActionExamResponse> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${SERVER_URL}/api/exams/${examId}/cancel`, {
      method: "PATCH",
      headers: authHeaders,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Failed to cancel exam (Status ${res.status})`,
      };
    }

    return {
      success: true,
      message: data.message || "Exam cancelled successfully",
    };
  } catch (error: any) {
    console.error("Error cancelling exam in action:", error);
    return { success: false, error: error?.message || "Failed to cancel exam" };
  }
}
