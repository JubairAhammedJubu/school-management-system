import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  UserCheck,
  ShieldAlert,
  Ban,
  Copyright,
  Power,
  Scale,
  RefreshCcw,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | EduNexus - School Management Platform",
  description:
    "Review the Terms of Service governing the use of EduNexus by administrators, teachers, and students, including account responsibilities, acceptable use, and liability.",
  keywords: [
    "EduNexus Terms of Service",
    "School Management System Terms",
    "EdTech Terms and Conditions",
  ],
};

const sections = [
  {
    icon: UserCheck,
    title: "1. Accounts & Roles",
    body: [
      "EduNexus provides role-based access for administrators, teachers, and students. Your institution's administrator is responsible for issuing accounts and assigning the correct role and class/section information.",
      "You are responsible for keeping your login credentials confidential and for all activity that occurs under your account. Notify your school administrator immediately if you suspect unauthorized access.",
      "Accounts may be locked automatically after repeated failed login attempts as a security measure; contact your administrator to have access restored.",
    ],
  },
  {
    icon: FileText,
    title: "2. Use of the Service",
    body: [
      "EduNexus may be used only for legitimate educational administration purposes: managing attendance, assignments, results, fees, notices, and related academic records.",
      "Content you submit through the platform — such as assignment submissions, notices, or profile details — must be accurate and must not infringe on the rights of others.",
    ],
  },
  {
    icon: Ban,
    title: "3. Acceptable Use",
    body: [
      "You agree not to misuse the platform, including but not limited to: attempting to access accounts or data that do not belong to you, uploading malicious code, interfering with the platform's normal operation, or using the service to harass, defame, or discriminate against others.",
      "Teachers and administrators must handle student data responsibly and only for purposes related to the student's education.",
    ],
  },
  {
    icon: Copyright,
    title: "4. Intellectual Property",
    body: [
      "The EduNexus name, logo, interface design, and underlying software are the property of EduNexus and its licensors. Academic content and records you create (assignments, notices, results, etc.) remain the property of your institution.",
      "You may not copy, resell, or redistribute the platform's software or design without prior written permission.",
    ],
  },
  {
    icon: Power,
    title: "5. Suspension & Termination",
    body: [
      "We reserve the right to suspend or terminate access to an account that violates these Terms, poses a security risk, or is used unlawfully. Institutions may also request deactivation of individual accounts through their administrator.",
    ],
  },
  {
    icon: ShieldAlert,
    title: "6. Disclaimers & Limitation of Liability",
    body: [
      "EduNexus is provided on an \"as is\" and \"as available\" basis. While we work to keep the platform reliable and accurate, we do not guarantee uninterrupted or error-free operation and are not responsible for decisions made solely on the basis of data displayed in the platform (such as attendance percentages or grades) without verification against your institution's official records.",
      "To the fullest extent permitted by law, EduNexus and its team shall not be liable for indirect, incidental, or consequential damages arising from use of the platform.",
    ],
  },
  {
    icon: Scale,
    title: "7. Governing Law",
    body: [
      "These Terms are governed by the laws applicable in the jurisdiction in which your institution operates, without regard to conflict-of-law principles, unless otherwise agreed in a separate institutional agreement.",
    ],
  },
  {
    icon: RefreshCcw,
    title: "8. Changes to These Terms",
    body: [
      "We may revise these Terms from time to time. Continued use of EduNexus after changes are posted constitutes acceptance of the revised Terms. Material changes will be reflected by updating the \"Last updated\" date below.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-24 pt-20 sm:pt-24">
      {/* Background Mesh Glows */}
      <div className="pointer-events-none fixed top-20 left-10 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none fixed bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl backdrop-blur-xl p-6 sm:p-10">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Terms of Service
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Last updated: September 11, 2026
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            These Terms of Service (&quot;Terms&quot;) govern access to and use of EduNexus by
            administrators, teachers, and students of a registered institution. By logging in or
            otherwise using the platform, you agree to be bound by these Terms.
          </p>

          <div className="space-y-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <section key={section.title}>
                  <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                    <Icon className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    {section.title}
                  </h2>
                  <div className="space-y-2.5 pl-1">
                    {section.body.map((para, idx) => (
                      <p
                        key={idx}
                        className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}

            <section>
              <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                <Mail className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                9. Contact Us
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 pl-1">
                Questions about these Terms can be sent to{" "}
                <a
                  href="mailto:contact@edunexus.com"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  contact@edunexus.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}