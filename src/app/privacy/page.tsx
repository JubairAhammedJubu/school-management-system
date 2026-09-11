import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  Database,
  Users,
  Lock,
  Cookie,
  Baby,
  RefreshCcw,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | EduNexus - School Management Platform",
  description:
    "Read the EduNexus Privacy Policy to understand what information we collect from students, teachers, and administrators, and how it is used, stored, and protected.",
  keywords: [
    "EduNexus Privacy Policy",
    "School Management System Privacy",
    "Student Data Protection",
    "EdTech Privacy",
  ],
};

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    body: [
      "When your institution registers on EduNexus, we collect account information such as name, email address, phone number, role (admin, teacher, or student), and — for students — class, section, roll number, and guardian details submitted during onboarding.",
      "We also collect academic records created within the platform, including attendance, assignments, grades, notices, and fee records, so your school's day-to-day operations can be managed digitally.",
      "Basic technical data (browser type, device information, and log data such as IP address and timestamps) is collected automatically to keep the platform secure and reliable.",
    ],
  },
  {
    icon: Users,
    title: "2. How We Use Your Information",
    body: [
      "Information is used strictly to operate the platform: authenticating accounts, displaying dashboards relevant to your role, generating attendance and result reports, sending notices, and processing fee records.",
      "We do not sell personal information to third parties, and we do not use student data for advertising.",
      "Aggregated, de-identified data may be used internally to improve platform performance and reliability.",
    ],
  },
  {
    icon: Lock,
    title: "3. Data Storage & Security",
    body: [
      "Data is stored in access-controlled databases, and passwords are never stored in plain text. Access to student and staff records is restricted based on account role — students can only see their own records, teachers can access their assigned classes, and admins have institution-wide oversight.",
      "We apply reasonable technical and organizational safeguards, including session-based authentication and account lockout after repeated failed login attempts, to reduce the risk of unauthorized access.",
      "No online system can guarantee absolute security. If we become aware of a data breach affecting your account, we will notify the affected institution and users as required by applicable law.",
    ],
  },
  {
    icon: Cookie,
    title: "4. Cookies & Local Storage",
    body: [
      "EduNexus uses essential cookies and browser storage to keep you signed in, remember your theme preference (light/dark mode), and maintain session security. We do not use third-party advertising or tracking cookies.",
    ],
  },
  {
    icon: Baby,
    title: "5. Children's Privacy",
    body: [
      "EduNexus is designed to be used by schools on behalf of their students, including minors. Student accounts and the information they contain are managed by the institution's administrators and teachers, and are intended for educational use only.",
      "Parents or guardians who have questions about a student's data should contact their school administration, who can in turn reach us using the details below.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "6. Your Rights",
    body: [
      "Depending on your institution's policies and applicable local law, you may have the right to access, correct, or request deletion of your personal information. Requests should generally be routed through your school's administrator, who manages the account records on EduNexus.",
    ],
  },
  {
    icon: RefreshCcw,
    title: "7. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. Material changes will be reflected by updating the \"Last updated\" date below.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Last updated: September 1, 2026
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            EduNexus (&quot;we&quot;, &quot;our&quot;, &quot;the platform&quot;) provides a role-based
            school management system used by administrators, teachers, and students. This
            Privacy Policy explains what information we collect through the platform, how it is
            used, and the choices available to you. By using EduNexus, you agree to the
            practices described here.
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
                8. Contact Us
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 pl-1">
                If you have questions about this Privacy Policy, please reach out to us at{" "}
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