"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AtRiskRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/teacher/performance");
  }, [router]);

  return null;
}
