# EduNexus — Complete Codebase Technical Summary

This document provides a comprehensive, authoritative technical reference for **EduNexus** (School Management System frontend). It outlines the architecture, technology stack, directory structure, routing system, authentication and authorization flows, server actions, client-side API integrations, design tokens, and setup instructions.

> **Architecture Context:**  
> This repository is the **client-only Next.js 16 application**. The backend REST API, authentication engine (Better Auth), ORM (Prisma), and database (PostgreSQL) reside in an independent Express service configured via `NEXT_PUBLIC_SERVER_URL` (typically `http://localhost:5000`).

---

## Table of Contents

1. [Tech Stack & Dependencies](#tech-stack--dependencies)
2. [High-Level Architecture & Communication](#high-level-architecture--communication)
3. [Authentication, 2FA & Authorization Workflows](#authentication-2fa--authorization-workflows)
4. [Directory & File Structure](#directory--file-structure)
5. [Public & Shared Routes](#public--shared-routes)
6. [Role-Based Dashboards & Pages](#role-based-dashboards--pages)
   - [Admin Portal](#admin-portal-dashboardadmin)
   - [Teacher Portal](#teacher-portal-dashboardteacher)
   - [Student Portal](#student-portal-dashboardstudent)
7. [Next.js Server Actions Reference](#nextjs-server-actions-reference-srclibactions)
8. [Direct Client-Side API Integrations](#direct-client-side-api-integrations)
9. [Component Catalog](#component-catalog)
10. [Design System & Global Styling](#design-system--global-styling)
11. [Environment Variables & Local Setup](#environment-variables--local-setup)

---

## Tech Stack & Dependencies

| Category | Technology | Version | Notes |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `^16.3.3` | React Compiler enabled (`reactCompiler: true`), App Router, API rewrites |
| **UI Core** | React & React DOM | `19.2.8` | Full React 19 capabilities with TypeScript 5 |
| **Styling** | Tailwind CSS v4 | `^4.0.0` | `@tailwindcss/postcss`, `@theme inline`, custom dark variants, skeleton shimmer |
| **Animation** | Framer Motion & Motion | `^13.1.0` | Dynamic modals, spring transitions, staggered list reveals, tab switches |
| **Data Visualization** | Recharts | `^3.10.1` | Responsive AreaCharts & BarCharts for attendance trends and distributions |
| **Authentication** | Better Auth (React Client) | `^1.7.1` | Cookie-based session tracking, `twoFactorClient()`, `inferAdditionalFields()` |
| **2FA QR Codes** | QRCode | `^1.5.4` | In-browser QR code generation for TOTP authenticator setup |
| **Icons** | Lucide React | `^1.33.0` | Comprehensive vector icon library |
| **Notifications** | React Toastify | `^11.0.5` | Dismissible toasts for success/error feedback across actions and pages |
| **Modal / Dialogs** | SweetAlert2 | `^11.26.25` | Alert modals and action confirmations |
| **Marquee** | React Fast Marquee | `^1.6.5` | Smooth ticker marquee for landing page partners and highlights |
| **Asset Delivery** | Cloudflare R2 + Next Image | — | Avatar storage at `pub-6206e14077b248589a5c3dca443b6dc5.r2.dev` |

---

## High-Level Architecture & Communication

```
Browser Client (Next.js 16 App Router)
  │
  ├── 1. Public & Marketing Pages (Landing, About, Contact, Notices, Terms, Privacy)
  │
  ├── 2. Unified Auth Portal (`/login` — Sign-in, Sign-up, TOTP 2FA, Approval Gate)
  │
  ├── 3. Authenticated User Profile (`/profile` — Avatar upload, bio & field edits)
  │
  ├── 4. Role-Gated Dashboard Shell (`/dashboard/layout.tsx`)
  │     ├── Admin Portal (`/dashboard/admin/*`)
  │     ├── Teacher Portal (`/dashboard/teacher/*`)
  │     └── Student Portal (`/dashboard/student/*`)
  │
  └── Communication Channels to Express Backend:
        ├── Server Actions (`src/lib/actions/*.ts` executed on Next.js server runtime)
        └── Client Fetch (`credentials: "include"` with automatic HttpOnly session cookie)
              │
              ▼
        Next.js API Reverse Proxy (`next.config.ts` rewrites `/api/:path*`)
              │
              ▼
        Express REST API (`NEXT_PUBLIC_SERVER_URL` / Better Auth backend)
              │
              ▼
        Prisma ORM ➔ PostgreSQL Database
```

### Native HttpOnly Cookie Authentication Architecture
- **No Client-Side Token Storage**: Sensitive JWTs or session keys are **never** stored in `localStorage` or `sessionStorage` (mitigating XSS extraction).
- **Automatic Cookie Forwarding**: All browser fetch requests use `credentials: "include"`. The browser automatically transmits the `better-auth.session_token` cookie.
- **First-Party Reverse Proxy**: In `next.config.ts`, `/api/:path*` is proxied directly to `NEXT_PUBLIC_SERVER_URL`, avoiding third-party cross-site cookie restrictions.
- **Client Session Hook**: Client components access current session and role exclusively via Better Auth's `useSession()` hook.

---

## Authentication, 2FA & Authorization Workflows

Primary files: `src/components/CombinedLoginRegister/AuthPage.tsx`, `src/lib/auth-client.ts`, `src/lib/actions/approval-actions.ts`, `src/lib/actions/password-reset-actions.ts`, `src/lib/actions/user-actions.ts`.

### 1. Dual-Role Registration Flow
Supports self-registration for both **Teachers** and **Students**:
- **Students**: Captures Student Class (`Class 6` to `Class 10`), Section (`Section A`, `Section B`), Department/Group (`Science`, `Business Studies`, `Humanities` for Class 9/10), Date of Birth, Guardian Name, Guardian Phone, and Address.
- **Teachers**: Captures Department, Designation, Academic Qualification, Phone Number, and Joining Date.
- Profile details are synced to the Express backend via `updateUserProfileAction` (`PUT /api/user/profile`).

### 2. Administrator Approval Gate
- Newly registered accounts default to `isApproved = false`.
- Upon sign-in, the system queries `checkApprovalStatusAction` (`GET /api/approval-status?email=...`).
- Unapproved accounts encounter an interactive "Approval Pending" modal that permits real-time re-checking without reloading the page.
- Administrators review and approve pending users in `/dashboard/admin/approvals`.

### 3. Two-Factor Authentication (TOTP 2FA)
- Integrated using Better Auth's `twoFactorClient()` plugin.
- **Setup Flow**: Generates a TOTP secret and renders a scannable QR code via `qrcode`.
- **Validation Flow**: During login, if 2FA is active, an OTP step prompts for the 6-digit authenticator code.
- **Emergency Reset**: Administrators can reset lost or locked 2FA credentials from `/dashboard/admin/security` (`POST /api/admin/reset-2fa`).

### 4. Password Reset Flow
- User submits email and 6-digit TOTP verification code.
- Code is verified via `verifyPasswordResetCodeAction` (`POST /api/password-reset/verify-code`).
- User provides a new password via `setNewPasswordAction` (`POST /api/password-reset/set-password`).

### 5. Role-Based Route Protection (RBAC)
Enforced at the layout level in `src/app/dashboard/layout.tsx`:
- Validates the current session role from `useSession()`:
  - `admin` ➔ Granted access to `/dashboard/admin/*`
  - `teacher` ➔ Granted access to `/dashboard/teacher/*`
  - `student` ➔ Granted access to `/dashboard/student/*`
- Unauthorized role access triggers an automatic redirect to `/unauthorized` or `/login`.

---

## Directory & File Structure

```
d:/javascript-practice/school-management-system/
├── public/                                      # Static public media, SVG logos, illustrations
├── src/
│   ├── app/                                     # Next.js App Router
│   │   ├── about/page.tsx                       # Institutional mission, vision, leadership
│   │   ├── contact/page.tsx                     # Inquiry form, location details, support
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                       # Role-gated dashboard shell (nav, sidebar, theme)
│   │   │   ├── page.tsx                         # Role redirector (admin/teacher/student)
│   │   │   ├── admin/                           # Administrator Portal
│   │   │   │   ├── page.tsx                     # Admin metrics & high-level stats
│   │   │   │   ├── approvals/page.tsx           # User approval queue
│   │   │   │   ├── classes/page.tsx             # Classes, sections, subjects & teacher assignments
│   │   │   │   ├── events/page.tsx              # Academic calendar, exams, sports & holidays
│   │   │   │   ├── fees/page.tsx                # Invoicing, fee collections & PDF generation
│   │   │   │   ├── notices/page.tsx             # Institutional notice authoring & pinning
│   │   │   │   ├── results/page.tsx             # Institute-wide results publishing & grading
│   │   │   │   ├── security/page.tsx            # 2FA enrollment inspection & emergency reset
│   │   │   │   ├── students/page.tsx            # Student directory & management
│   │   │   │   └── teachers/page.tsx            # Teacher directory & credentials
│   │   │   ├── teacher/                         # Educator Portal
│   │   │   │   ├── page.tsx                     # Educator summary & quick links
│   │   │   │   ├── assignments/page.tsx         # Assignment CRUD & student submissions inspector
│   │   │   │   ├── attendance/page.tsx          # Attendance analytics & marking modal
│   │   │   │   ├── examinations/page.tsx        # Exam routines & schedule management
│   │   │   │   ├── my-classes/page.tsx          # Class/subject assignment request queue
│   │   │   │   ├── notices/page.tsx             # Teacher notice board management
│   │   │   │   ├── results/page.tsx             # Grade entry, automated grading & score lists
│   │   │   │   └── students/page.tsx            # Enrolled student directory
│   │   │   └── student/                         # Student Portal
│   │   │       ├── page.tsx                     # Academic summary, GPA & deadlines
│   │   │       ├── assignment/page.tsx          # Assignment submissions & teacher feedback
│   │   │       ├── attendance/page.tsx          # Personal attendance tracking & logs
│   │   │       ├── examinations/page.tsx        # Exam routine & timetable viewer
│   │   │       ├── fee/page.tsx                 # Invoices, fee breakdown & payment receipts
│   │   │       ├── notices/page.tsx             # Student notice announcements
│   │   │       ├── result/page.tsx              # Published report cards & grades
│   │   │       └── subjects/page.tsx            # Enrolled subjects, teachers & class info
│   │   ├── login/page.tsx                       # Unified Auth (Sign-in, Register, 2FA, Approval)
│   │   ├── notices/page.tsx                     # Public notice bulletin
│   │   ├── privacy/page.tsx                     # Privacy policy & data protection terms
│   │   ├── profile/page.tsx                     # User profile management & avatar upload
│   │   ├── terms/page.tsx                       # Terms of service
│   │   ├── unauthorized/page.tsx                # 403 Forbidden access feedback page
│   │   ├── not-found.tsx                        # Custom 404 page
│   │   ├── globals.css                          # Tailwind CSS v4 theme, tokens & utilities
│   │   ├── layout.tsx                           # Root HTML shell (Navbar, Footer, ToastContainer)
│   │   └── page.tsx                             # Landing page
│   ├── components/
│   │   ├── About/About.tsx                      # About page presentation component
│   │   ├── Banner/Banner.tsx                    # Highlight promotional banners
│   │   ├── CombinedLoginRegister/AuthPage.tsx   # Auth form, register fields, 2FA modal
│   │   ├── DashboardViews/
│   │   │   ├── TeacherDashboardView.tsx         # Teacher overview metric widgets
│   │   │   └── StudentDashboardView.tsx         # Student progress & overview widgets
│   │   ├── FAQ/FAQ.tsx                          # Interactive expandable FAQ accordion
│   │   ├── Footer/Footer.tsx                    # Global institutional footer
│   │   ├── HowItWorks/HowItWorks.tsx            # Workflow demonstration section
│   │   ├── Marquee/MarqueeSection.tsx           # React Fast Marquee ticker
│   │   ├── Navbar/Navbar.tsx                    # Global public navigation bar
│   │   ├── NoticeBoard/NoticeBoard.tsx          # Interactive notices feed with pin support
│   │   ├── ProductVisionQuote/                  # Institutional quote callout
│   │   ├── RoleBasedAccess/                     # Interactive role showcase
│   │   ├── TalkToUs/TalkToUs.tsx                # Contact inquiry modal/block
│   │   ├── homepage/                            # Landing page modular blocks
│   │   │   ├── hero/Hero.tsx                    # Landing hero with CTA
│   │   │   ├── managementsolution/              # Solution capabilities overview
│   │   │   ├── managementshowcase/              # Interactive feature showcase
│   │   │   ├── threesteps/                      # 3-step onboarding explanation
│   │   │   ├── studentsuccess/                  # Metrics & student success highlights
│   │   │   ├── customerfeedback/feedback.tsx    # Testimonials & institutional reviews
│   │   │   └── fnalcta/finalcta.tsx             # Final conversion CTA block
│   │   └── shared/                              # Reusable interactive components
│   │       ├── AssignmentCard.tsx               # Assignment card with action dropdown
│   │       ├── AssignmentFormModal.tsx          # Modal for creating/editing assignments
│   │       ├── DeleteConfirmationModal.tsx      # Safe delete confirmation dialog
│   │       ├── EnterResultButton.tsx            # Result entry trigger button
│   │       ├── MarkAttendanceModal.tsx          # Class attendance marking dialog
│   │       ├── ResultDetailsModal.tsx           # Modal for inspecting grade breakdown
│   │       ├── ResultList.tsx                   # Filterable/paginated results table
│   │       ├── SubmissionsModal.tsx             # Modal inspecting student submissions
│   │       └── SubmitResultModal.tsx            # Grade entry modal with auto percentage/grade
│   └── lib/
│       ├── auth-client.ts                       # Better Auth client config & session hooks
│       └── actions/                             # Next.js Server Actions
│           ├── approval-actions.ts              # Account approval verification
│           ├── password-reset-actions.ts        # TOTP password reset verification
│           ├── teacher-students.ts              # Paginated teacher student directory
│           ├── teacher.exam.ts                  # Exam routines CRUD
│           ├── teacher.notice.ts                # Teacher notice board CRUD
│           ├── teacher.request.ts               # Class/subject assignment requests
│           └── user-actions.ts                  # Profile updates & email existence check
├── next.config.ts                               # Compiler options, image domains & API rewrites
├── package.json                                 # Dependencies & scripts
└── tsconfig.json                                # TypeScript configuration
```

---

## Public & Shared Routes

| Route | File Path | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Main marketing landing page with Hero, Showcase, Solutions, Steps, Testimonials, FAQ, and CTA. |
| `/about` | `src/app/about/page.tsx` | Institutional history, vision, mission, core values, and administrative leadership. |
| `/contact` | `src/app/contact/page.tsx` | Contact details, inquiry submission form, campus location, and support desk info. |
| `/notices` | `src/app/notices/page.tsx` | Public announcements and notices bulletin. |
| `/login` | `src/app/login/page.tsx` | Unified login, student/teacher registration, TOTP 2FA, and approval check. |
| `/profile` | `src/app/profile/page.tsx` | Authenticated user profile view with live editing and avatar upload to Cloudflare R2 (`/api/user/profile/image`). |
| `/unauthorized` | `src/app/unauthorized/page.tsx` | 403 Forbidden feedback screen for unauthorized role navigation. |
| `/not-found` | `src/app/not-found.tsx` | 404 page for non-existent routes. |
| `/privacy` | `src/app/privacy/page.tsx` | Institutional privacy policy and data governance standards. |
| `/terms` | `src/app/terms/page.tsx` | Terms of service and platform acceptable use guidelines. |

---

## Role-Based Dashboards & Pages

### Admin Portal (`/dashboard/admin`)

* **Overview (`/dashboard/admin/page.tsx`)**:
  * Live platform metrics from `GET /api/admin/stats`: total users, students, teachers, admins, pending approvals, locked accounts, total notices, assignments, exams, and class requests.
* **Teachers Management (`/dashboard/admin/teachers/page.tsx`)**:
  * Faculty directory: add new teachers, update records, toggle active/leave status, assign designations, and revoke access.
* **Students Management (`/dashboard/admin/students/page.tsx`)**:
  * Student enrollment: create student profiles, assign class/section/group, edit guardian information, and search/filter students.
* **Classes & Sections (`/dashboard/admin/classes/page.tsx`)**:
  * Academic structure manager: Class 6 to 10 setup, Sections A & B, subject mapping, and review/approval of teacher class requests.
* **Results Management (`/dashboard/admin/results/page.tsx`)**:
  * Institute-wide grade inspection, pass/fail analysis, exam performance metrics, and grade report publishing.
* **Fees & Finance (`/dashboard/admin/fees/page.tsx`)**:
  * Tuition fee invoicing, collection tracking (Paid / Partial / Due), invoice generation, and printable PDF receipts.
* **Notices (`/dashboard/admin/notices/page.tsx`)**:
  * Author institutional notices, pin announcements to top, and filter audience (`All`, `Teachers`, `Students`).
* **Events Calendar (`/dashboard/admin/events/page.tsx`)**:
  * School calendar scheduler for Holidays, Exams, Sports, Faculty Meetings, and Milestones with category filters.
* **Approvals Queue (`/dashboard/admin/approvals/page.tsx`)**:
  * Queue for newly registered accounts calling `GET /api/admin/pending-users` and `POST /api/admin/approve-user`.
* **Security (`/dashboard/admin/security/page.tsx`)**:
  * Inspect user 2FA enrollment status and execute emergency two-factor resets via `POST /api/admin/reset-2fa`.

---

### Teacher Portal (`/dashboard/teacher`)

* **Overview (`/dashboard/teacher/page.tsx`)**:
  * Educator summary, active classes, daily schedule highlights, quick action buttons, and notice feeds.
* **Attendance Tracker (`/dashboard/teacher/attendance/page.tsx`)**:
  * Analytics & charts: AreaChart and BarChart displaying attendance rates and weekly trends via `GET /api/teacher/attendance/stats`.
  * Class roster: `GET /api/teacher/attendance/students?grade=...&section=...&group=...&date=...`.
  * Bulk submission: `POST /api/teacher/attendance/mark` using `MarkAttendanceModal.tsx`.
* **Examinations (`/dashboard/teacher/examinations/page.tsx`)**:
  * Managed through server actions in `teacher.exam.ts`.
  * Create routines, assign exam hall/room numbers, define start/end dates, total marks, and passing scores.
* **Results Management (`/dashboard/teacher/results/page.tsx`)**:
  * Live CRUD: `GET /api/teacher/results`, `POST /api/teacher/results`, `PATCH /api/teacher/results/:id`, `DELETE /api/teacher/results/:id`.
  * Automated Grade Calculation: Computes percentage and maps to `A+` (≥80), `A` (≥70), `B+` (≥60), `B` (≥50), `C` (≥40), `D` (≥33), `F` (<33).
  * Auto-selects students from teacher's active roster via `getTeacherStudentsAction()`.
* **Assignments (`/dashboard/teacher/assignments/page.tsx`)**:
  * Endpoints: `GET /api/teacher/assignments?teacherEmail=...`, `POST`, `PUT`, `DELETE`.
  * `AssignmentFormModal`: Title, description, class, section, subject, marks, and due date.
  * `SubmissionsModal`: Review all student submissions, submission timestamps, status (`SUBMITTED`, `LATE`, `GRADED`), attempt counts, written content, and file attachments.
  * `DeleteConfirmationModal`: Safe confirmation dialog before deletion.
* **Class & Subject Requests (`/dashboard/teacher/my-classes/page.tsx`)**:
  * Submit class/subject assignment requests, track status (`PENDING`, `APPROVED`, `REJECTED`), or withdraw requests via `teacher.request.ts`.
* **Students Directory (`/dashboard/teacher/students/page.tsx`)**:
  * Paginated student roster for teacher's assigned classes using `teacher-students.ts`.
* **Notices (`/dashboard/teacher/notices/page.tsx`)**:
  * CRUD operations for teacher announcements via `teacher.notice.ts`.

---

### Student Portal (`/dashboard/student`)

* **Overview (`/dashboard/student/page.tsx`)**:
  * Academic progress, GPA overview, upcoming assignments, exam countdowns, and attendance summary.
* **Assignments (`/dashboard/student/assignment/page.tsx`)**:
  * Live integration with `GET /api/student/assignments`.
  * View active tasks, submit written responses or file attachments, check submission attempts, and review grading feedback.
* **Attendance (`/dashboard/student/attendance/page.tsx`)**:
  * Live integration with `GET /api/student/attendance`.
  * Personal attendance percentage, monthly calendar breakdown, present/late/absent counts, and search filter.
* **Examinations (`/dashboard/student/examinations/page.tsx`)**:
  * Exam schedule and timetable fetched via `getTeacherExamsAction()` filtered by student's class and section.
* **Subjects (`/dashboard/student/subjects/page.tsx`)**:
  * Live integration with `GET /api/student/subjects`.
  * Shows assigned class subjects, assigned teachers, subject codes, and class/section metadata.
* **Results (`/dashboard/student/result/page.tsx`)**:
  * Live integration with `GET /api/student/results`.
  * Displays published exam report cards, subject scores, grades, and academic performance.
* **Fees (`/dashboard/student/fee/page.tsx`)**:
  * Student tuition fees, breakdown of dues, payment history, and status badges (`Paid`, `Due`).
* **Notices (`/dashboard/student/notices/page.tsx`)**:
  * Targeted student announcements and institutional notices.

---

## Next.js Server Actions Reference (`src/lib/actions`)

All server actions execute on the Next.js server runtime, forward authentication cookies, and interface with the backend Express API:

| File | Exported Action | HTTP Method & Path | Purpose |
|---|---|---|---|
| `approval-actions.ts` | `checkApprovalStatusAction(email)` | `GET /api/approval-status?email=...` | Verifies whether a user account has been approved by an administrator |
| `password-reset-actions.ts` | `verifyPasswordResetCodeAction(email, code)` | `POST /api/password-reset/verify-code` | Validates a 6-digit TOTP code for password reset |
| `password-reset-actions.ts` | `setNewPasswordAction(email, newPassword)` | `POST /api/password-reset/set-password` | Updates password after TOTP verification succeeds |
| `teacher-students.ts` | `getTeacherStudentsAction(params)` | `GET /api/teacher/students?...` | Returns paginated student roster with search, class, and section filters |
| `teacher.exam.ts` | `getTeacherExamsAction()` | `GET /api/exams` | Fetches examination routines and schedules |
| `teacher.exam.ts` | `createTeacherExamAction(payload)` | `POST /api/exams` | Creates a new examination schedule |
| `teacher.exam.ts` | `cancelTeacherExamAction(examId)` | `PATCH /api/exams/:id/cancel` | Cancels an scheduled examination |
| `teacher.notice.ts` | `getTeacherNoticesAction()` | `GET /api/notices` | Fetches institutional notices |
| `teacher.notice.ts` | `createTeacherNoticeAction(payload)` | `POST /api/notices` | Creates a new notice |
| `teacher.notice.ts` | `updateTeacherNoticeAction(id, payload)` | `PUT /api/notices/:id` | Updates an existing notice |
| `teacher.notice.ts` | `deleteTeacherNoticeAction(id)` | `DELETE /api/notices/:id` | Deletes a notice |
| `teacher.request.ts` | `getTeacherRequestsAction()` | `GET /api/teacher/requests` | Fetches teacher class/subject assignment requests |
| `teacher.request.ts` | `createTeacherRequestAction(payload)` | `POST /api/teacher/requests` | Submits a class assignment request |
| `teacher.request.ts` | `deleteTeacherRequestAction(id)` | `DELETE /api/teacher/requests/:id` | Withdraws a pending request |
| `teacher.request.ts` | `updateAdminTeacherRequestStatusAction(id, status)` | `PATCH /api/admin/requests/:id` | Approves or rejects a teacher assignment request |
| `user-actions.ts` | `updateUserProfileAction(data)` | `PUT /api/user/profile` | Updates user profile fields via Express API |
| `user-actions.ts` | `checkUserExistsAction(email)` | `GET /api/user/check-exists?email=...` | Checks if an email is registered |

---

## Direct Client-Side API Integrations

In addition to Server Actions, client components issue direct `fetch()` calls with `credentials: "include"`, leveraging automatic HttpOnly cookie transmission:

| Domain | Endpoint | HTTP Method | Invoking Component / Page |
|---|---|---|---|
| **Admin Stats** | `/api/admin/stats` | `GET` | `src/app/dashboard/admin/page.tsx` |
| **Admin Approvals** | `/api/admin/pending-users`<br>`/api/admin/approve-user` | `GET`<br>`POST` | `src/app/dashboard/admin/approvals/page.tsx` |
| **Admin Security** | `/api/admin/reset-2fa` | `POST` | `src/app/dashboard/admin/security/page.tsx` |
| **Teacher Attendance** | `/api/teacher/attendance/stats`<br>`/api/teacher/attendance/students`<br>`/api/teacher/attendance/mark` | `GET`<br>`GET`<br>`POST` | `src/app/dashboard/teacher/attendance/page.tsx`<br>`src/components/shared/MarkAttendanceModal.tsx` |
| **Teacher Results** | `/api/teacher/results`<br>`/api/teacher/results/:id` | `GET`, `POST`<br>`PATCH`, `DELETE` | `src/components/shared/ResultList.tsx`<br>`src/components/shared/SubmitResultModal.tsx` |
| **Teacher Assignments** | `/api/teacher/assignments` | `GET`, `POST`, `PUT`, `DELETE` | `src/app/dashboard/teacher/assignments/page.tsx`<br>`src/components/shared/AssignmentFormModal.tsx` |
| **Student Assignments** | `/api/student/assignments` | `GET`, `POST` | `src/app/dashboard/student/assignment/page.tsx` |
| **Student Attendance** | `/api/student/attendance` | `GET` | `src/app/dashboard/student/attendance/page.tsx` |
| **Student Results** | `/api/student/results` | `GET` | `src/app/dashboard/student/result/page.tsx` |
| **Student Subjects** | `/api/student/subjects` | `GET` | `src/app/dashboard/student/subjects/page.tsx` |
| **User Profile Image** | `/api/user/profile/image` | `POST` (multipart/form-data) | `src/app/profile/page.tsx` |

---

## Component Catalog

### Shared Interactive Modals & Widgets (`src/components/shared`)
- **`AssignmentCard.tsx`**: Renders assignment card with subject, title, due date, status badge (`ACTIVE`, `DRAFT`, `CLOSED`), past-due pill, and action menu (Edit, View Submissions, Delete).
- **`AssignmentFormModal.tsx`**: Framer Motion modal for creating and updating assignments. Features class-dependent subject dropdowns, total marks input, custom date-time picker, and input validation.
- **`SubmissionsModal.tsx`**: Modal for teachers to inspect all student submissions for an assignment. Displays student profile, class/section, timestamp, status badge (`SUBMITTED`, `LATE`, `GRADED`), attempt counter, written answer, and file download triggers.
- **`MarkAttendanceModal.tsx`**: Class attendance modal for teachers. Includes search, bulk "All Present" / "All Absent" actions, and individual status toggles (`Present`, `Late`, `Absent`).
- **`SubmitResultModal.tsx`**: Grade entry dialog integrating `getTeacherStudentsAction()`. Auto-calculates percentages, assigns letter grades (`A+` to `F`), and toggles draft/published status.
- **`ResultList.tsx`**: Responsive data table for student grades with text search, class filter, status filter, and floating portal action menu.
- **`ResultDetailsModal.tsx`**: Modal presenting individual student grade breakdown, percentage visual bar, and exam metadata.
- **`DeleteConfirmationModal.tsx`**: Reusable safety confirmation modal with warning icons, destructive styling, and loading spinner states.

### Dashboard Shell & Views
- **`src/app/dashboard/layout.tsx`**: Unified dashboard shell with responsive sidebar, dynamic role navigation, breadcrumbs, theme switcher, and logout modal.
- **`TeacherDashboardView.tsx`**: Teacher overview dashboard metrics, schedules, and quick navigation cards.
- **`StudentDashboardView.tsx`**: Student progress metrics, deadlines, and grade tracking widgets.
- **`NoticeBoard.tsx`**: Notice bulletin component featuring search, category filters, and pinned announcement styling.

### Marketing & Institutional Components
- **`Navbar.tsx` & `Footer.tsx`**: Global responsive header and institutional footer.
- **`Hero.tsx`**: Modern marketing hero with CTA actions and animated visual elements.
- **`MarqueeSection.tsx`**: Smooth continuous ticker using `react-fast-marquee`.
- **`managementshowcase/`, `managementsolution/`, `threesteps/`, `studentsuccess/`, `customerfeedback/`, `fnalcta/`**: Modular landing page sections presenting platform benefits, onboarding steps, and customer social proof.

---

## Design System & Global Styling

Defined in `src/app/globals.css`:
- **CSS Framework**: Tailwind CSS v4 using `@import "tailwindcss";`.
- **Dark Mode Support**: Configured via `@custom-variant dark (&:where(.dark, .dark *));`.
- **Theme Tokens**:
  - `--background`: `#ffffff` (Light) / `#030712` (Dark)
  - `--foreground`: `#171717` (Light) / `#f9fafb` (Dark)
  - `--font-sans`: `Inter`
  - `--font-heading`: `Sora`
- **Custom Utility Classes**:
  - `.no-scrollbar`: Hides browser scrollbars while retaining scroll functionality.
  - `.skeleton-shimmer`: Left-to-right animated linear-gradient shimmer for smooth skeleton loading states without abrupt layout shifts.

---

## Environment Variables & Local Setup

### Environment Configuration (`.env.local`)

```bash
# Base URL for the Express + Better Auth backend service
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

### Local Development Commands

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Application starts locally on `http://localhost:3000`.

3. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

4. **Lint Codebase:**
   ```bash
   npm run lint
   ```

---

*Summary generated for `school-management-system` repository. Fully reflects all routes, components, server actions, client API integrations, and the native Better Auth HttpOnly cookie architecture.*
