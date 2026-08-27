"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import TeacherDashboardView from "@/components/DashboardViews/TeacherDashboardView";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user || rawRole !== "teacher") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  // Loading skeleton while checking authentication & role
  if (isPending) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        </div>
      </div>
    );
  }

  // If not logged in or role is not teacher, redirect handles it
  if (!session?.user || rawRole !== "teacher") {
    return null;
  }

  return <TeacherDashboardView />;
}