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
      <div className="p-3 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Banner Skeleton */}
        <div className="h-32 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 p-5 sm:p-6 shadow-md backdrop-blur-xl flex flex-col justify-between">
          <div className="h-6 w-48 sm:w-64 rounded-md skeleton-shimmer" />
          <div className="h-4 w-64 sm:w-96 rounded-md skeleton-shimmer-subtle" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl skeleton-shimmer" />
                <div className="h-4 w-10 rounded-md skeleton-shimmer-subtle" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-16 rounded-md skeleton-shimmer" />
                <div className="h-3 w-24 rounded-md skeleton-shimmer-subtle" />
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