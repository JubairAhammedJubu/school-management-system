"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface NoticePayload {
  teacherName?: string;
  publishedBy?: string;
  authorEmail?: string;
  title: string;
  description?: string;
  detail: string;
  category: string;
  isPinned?: boolean;
  createdAt?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: "Academic" | "Events" | "General";
  date: string;
  detail: string;
  description?: string;
  teacherName?: string;
  publishedBy?: string;
  isPinned?: boolean;
  createdAt?: string;
}

export interface GetNoticesResponse {
  success: boolean;
  notices: NoticeItem[];
  error?: string;
}

export interface CreateNoticeResponse {
  success: boolean;
  message?: string;
  notice?: NoticeItem;
  error?: string;
}

/**
 * Fetch all notices from EduNexus API
 */
export async function getNoticesAction(): Promise<GetNoticesResponse> {
  try {
    const res = await fetch(`${SERVER_URL}/api/notices`, {
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType?.includes("application/json")) {
      return { success: false, notices: [], error: "Invalid response from server" };
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.notices)) {
      const mapped: NoticeItem[] = data.notices.map((item: any) => {
        const itemDate = item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
          : "Recently";

        return {
          id: item.id || item._id,
          title: item.title,
          category: (item.category as NoticeItem["category"]) || "General",
          date: itemDate,
          detail: item.detail || item.description || "",
          description: item.description || item.detail || "",
          teacherName: item.teacherName || item.publishedBy || item.author?.name || "Teacher",
          publishedBy: item.teacherName || item.publishedBy || item.author?.name || "Teacher",
          isPinned: Boolean(item.isPinned),
          createdAt: item.createdAt,
        };
      });

      return { success: true, notices: mapped };
    }

    return { success: false, notices: [], error: data.error || "Failed to fetch notices" };
  } catch (error: any) {
    console.error("getNoticesAction error:", error);
    return { success: false, notices: [], error: error?.message || "Failed to fetch notices" };
  }
}

/**
 * Post a new notice to EduNexus API
 */
export async function createNoticeAction(
  payload: NoticePayload,
  token?: string | null
): Promise<CreateNoticeResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${SERVER_URL}/api/notices`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return { success: false, error: "Server returned invalid response format" };
    }

    const data = await res.json();
    if (data.success && data.notice) {
      const createdItem = data.notice;
      const formattedNotice: NoticeItem = {
        id: createdItem.id || createdItem._id,
        title: createdItem.title,
        category: (createdItem.category as NoticeItem["category"]) || "General",
        date: new Date(createdItem.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        detail: createdItem.detail || createdItem.description || "",
        description: createdItem.description || createdItem.detail || "",
        teacherName: createdItem.teacherName || createdItem.publishedBy || payload.teacherName || "Teacher",
        publishedBy: createdItem.teacherName || createdItem.publishedBy || payload.teacherName || "Teacher",
        isPinned: Boolean(createdItem.isPinned),
        createdAt: createdItem.createdAt,
      };

      return {
        success: true,
        message: data.message || "Notice published successfully!",
        notice: formattedNotice,
      };
    }

    return {
      success: false,
      error: data.error || "Failed to publish notice",
    };
  } catch (error: any) {
    console.error("createNoticeAction error:", error);
    return {
      success: false,
      error: error?.message || "Failed to publish notice",
    };
  }
}
