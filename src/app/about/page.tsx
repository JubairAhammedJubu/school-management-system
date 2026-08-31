import type { Metadata } from "next";
import About from "@/components/About/About";

export const metadata: Metadata = {
  title: "About Us | EduNexus - Next-Gen School Management Platform",
  description:
    "Learn about EduNexus, our vision to transform educational management, and how our role-based digital system empowers admins, teachers, and students worldwide.",
  keywords: [
    "About EduNexus",
    "School Management System",
    "EdTech Vision",
    "Academic ERP Platform",
  ],
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100">
      <About />
    </main>
  );
}
