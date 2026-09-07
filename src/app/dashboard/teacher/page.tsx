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
        {/* Banner Skeleton */}
        <div className="h-32 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 p-6 shadow-md dark:shadow-xl flex flex-col justify-between">
          <div className="h-6 w-64 rounded-md skeleton-shimmer" />
          <div className="h-4 w-96 rounded-md skeleton-shimmer-subtle" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 p-5 shadow-md dark:shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl skeleton-shimmer" />
                <div className="h-4 w-12 rounded-full skeleton-shimmer-subtle" />
              </div>
              <div className="space-y-2">
                <div className="h-7 w-24 rounded-md skeleton-shimmer" />
                <div className="h-3.5 w-36 rounded-md skeleton-shimmer-subtle" />
              </div>
            </div>
          ))}
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