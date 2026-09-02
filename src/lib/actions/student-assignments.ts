"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export type AssignmentStatus = "pending" | "submitted" | "graded";

export interface StudentAssignment {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  grade: string;
  section: string;
  dueDate: string;
  totalMarks: number;
  teacherName: string | null;
  status: AssignmentStatus;
  submittedAt: string | null;
  studentGrade: number | null;
  feedback: string | null;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

/**
 * Fetches all assignments for a student's class/section, merged with
 * that student's own submission status.
 */
export async function getStudentAssignmentsAction(
  studentEmail: string,
  studentClass: string,
  section: string
): Promise<ActionResponse<StudentAssignment[]>> {
  try {
    const params = new URLSearchParams({ studentEmail, studentClass, section });
    const response = await fetch(`${SERVER_URL}/api/student/assignments?${params.toString()}`, {
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to load assignments." };
    }

    return { success: true, data: result.assignments as StudentAssignment[] };
  } catch (error: any) {
    console.error("getStudentAssignmentsAction error:", error);
    return { success: false, error: error?.message || "Server action request failed." };
  }
}

/**
 * Fetches a single assignment merged with the student's own submission.
 */
export async function getStudentAssignmentByIdAction(
  assignmentId: string,
  studentEmail: string
): Promise<ActionResponse<StudentAssignment>> {
  try {
    const params = new URLSearchParams({ studentEmail });
    const response = await fetch(
      `${SERVER_URL}/api/student/assignments/${assignmentId}?${params.toString()}`,
      { cache: "no-store" }
    );

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to load assignment." };
    }

    return { success: true, data: result.assignment as StudentAssignment };
  } catch (error: any) {
    console.error("getStudentAssignmentByIdAction error:", error);
    return { success: false, error: error?.message || "Server action request failed." };
  }
}

/**
 * Marks an assignment as submitted for a student.
 */
export async function submitStudentAssignmentAction(
  assignmentId: string,
  studentEmail: string,
  studentName?: string
): Promise<ActionResponse> {
  try {
    const response = await fetch(`${SERVER_URL}/api/student/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentEmail, studentName }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to submit assignment." };
    }

    return { success: true, message: result.message || "Assignment submitted successfully!" };
  } catch (error: any) {
    console.error("submitStudentAssignmentAction error:", error);
    return { success: false, error: error?.message || "Server action request failed." };
  }
}