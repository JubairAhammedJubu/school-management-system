"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/unauthorized");
      } else if (rawRole === "student") {
        router.replace("/dashboard/student");
      } else if (rawRole === "teacher") {
        router.replace("/dashboard/teacher");
      } else if (rawRole === "admin") {
        router.replace("/dashboard/admin");
      } else {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  return null;
}
