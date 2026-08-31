import type { Metadata } from "next";
import NoticeBoard from "@/components/NoticeBoard/NoticeBoard";

export const metadata: Metadata = {
  title: "Notices & Announcements | EduNexus",
  description:
    "Stay up-to-date with official school notices, exam schedules, events, and important academic announcements.",
  keywords: [
    "School Notices",
    "EduNexus Announcements",
    "Academic Exam Schedule",
    "School Events",
  ],
};

export default function PublicNoticesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 pt-20 sm:pt-24 lg:pt-28 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <NoticeBoard isHomePageNotices={true} />
      </div>
    </main>
  );
}
