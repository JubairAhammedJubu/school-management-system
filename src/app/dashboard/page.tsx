"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import StudentDashboardView from "@/components/DashboardViews/StudentDashboardView";
import TeacherDashboardView from "@/components/DashboardViews/TeacherDashboardView";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (rawRole === "student") {
        router.replace("/dashboard/student");
      } else if (rawRole === "admin") {
        router.replace("/dashboard/admin");
      } else if (rawRole === "teacher") {
        router.replace("/dashboard/teacher");
      } else {
        router.replace("/dashboard/student");
      }
    }
  }, [rawRole, isPending, router]);

  if (rawRole === "teacher") {
    return <TeacherDashboardView />;
  }

  return <StudentDashboardView />;
}
