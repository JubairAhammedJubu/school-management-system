# EduNexus — Complete Codebase Summary

This document provides a comprehensive technical reference for **this repository**: the Next.js frontend for **EduNexus** (School Management System). It reflects the actual implementation across all pages, components, server actions, authentication workflows, and API integrations.

> **Architecture Context:**  
> This repository is the **client-only Next.js application**. The REST API and database (Better Auth, Express, Prisma, PostgreSQL) run in a separate backend service specified by the environment variable `NEXT_PUBLIC_SERVER_URL` (typically `http://localhost:5000`).

---

## Table of Contents

1. [Tech Stack & Dependencies](#tech-stack--dependencies)
2. [High-Level Architecture](#high-level-architecture)
3. [Authentication, 2FA & Authorization](#authentication-2fa--authorization)
4. [Directory & File Structure](#directory--file-structure)
5. [Public & Shared Routes](#public--shared-routes)
6. [Role-Based Dashboards & Pages](#role-based-dashboards--pages)
   - [Admin Dashboard](#admin-dashboard-dashboardadmin)
   - [Teacher Dashboard](#teacher-dashboard-dashboardteacher)
   - [Student Dashboard](#student-dashboard-dashboardstudent)
7. [Server Actions Reference](#server-actions-reference-srclibactions)
8. [Direct Client-Side API Integrations](#direct-client-side-api-integrations)
9. [Component Catalog](#component-catalog)
10. [Environment Variables & Setup](#environment-variables--setup)

---

## Tech Stack & Dependencies

| Category | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | React Compiler enabled in `next.config.ts` |
| **UI Library** | React 19 + TypeScript | Full type safety across props, actions, and API payloads |
| **Styling** | Tailwind CSS 4 + Vanilla CSS | Custom animations, Sora & Inter Google fonts |
| **Animation** | Framer Motion (`framer-motion`) | Modal transitions, layout animations, page reveals |
| **Data Visualization**| Recharts | Responsive AreaCharts & BarCharts for analytics |
| **Icons** | Lucide React | Modern vector icon set |
| **Notifications** | `react-toastify` | Interactive toast notifications across client & actions |
| **Authentication** | `better-auth` (React client) | Client-side session management + TOTP 2FA plugin |
| **QR Code** | `qrcode` | QR generation for two-factor authentication setup |
| **Asset Storage** | Next.js Image + Cloudflare R2 | Allowed remote image pattern for user avatars |

---

## High-Level Architecture

```
Browser Client (Next.js App Router)
  │
  ├── 1. Public Pages (Landing, About, Contact, Notices, Terms, Privacy)
  │
  ├── 2. Auth Flow (Combined Login/Register, 2FA verification, Approval poll)
  │
  ├── 3. Dashboard Shell (`/dashboard/layout.tsx` role-gated sidebar & navbar)
  │     ├── Admin Portal (`/dashboard/admin/*`)
  │     ├── Teacher Portal (`/dashboard/teacher/*`)
  │     └── Student Portal (`/dashboard/student/*`)
  │
  └── Communication Channels to Backend:
        ├── Server Actions (`src/lib/actions/*.ts` via Next.js server runtime)
        └── Client Fetch (`authedFetch()` / `getAuthToken()` with Bearer token)
              │
              ▼
        Express REST API (`NEXT_PUBLIC_SERVER_URL` - separate repo)
              │
              ▼
        PostgreSQL via Prisma ORM
```

### Cross-Origin Auth Token Synchronization
Because the Next.js frontend and Express backend typically operate on distinct domains or ports in production and development:
1. `better-auth` stores the session token in browser **`localStorage`** under the key `better-auth.session_token`.
2. The auth client mirrors this token into a **same-origin cookie** (`better-auth.session_token`).
3. **Server Actions** read this cookie via `next/headers` and forward it as `Authorization: Bearer <token>` and `Cookie: better-auth.session_token=<token>` to the Express backend.
4. **Client Components** retrieve the token from `localStorage` and supply `Authorization: Bearer <token>` on direct fetch requests.

---

## Authentication, 2FA & Authorization

Source files: `src/components/CombinedLoginRegister/AuthPage.tsx`, `src/lib/auth-client.ts`, `src/lib/actions/approval-actions.ts`, `src/lib/actions/password-reset-actions.ts`.

### 1. Registration Flow
- Supports registration for **Teacher** and **Student** accounts.
- **Student Extra Fields:** Class (`Class 6` to `Class 10`), Section (`Section A`, `Section B`), Department/Group (`Science`, `Business Studies`, `Humanities` for Class 9/10), Date of Birth, Guardian Name, Guardian Phone, Address.
- **Teacher Extra Fields:** Designation, Department, Academic Qualification, Phone Number, Joining Date.
- Profile extras are saved to the backend via `updateUserProfileAction` (`PUT /api/user/profile`).

### 2. Admin Approval Gate
- Newly registered accounts default to an **unapproved** status.
- Upon login, `checkApprovalStatusAction` (`GET /api/approval-status`) is polled.
- Unapproved users see a persistent "Approval Pending" modal that can re-check approval status on-demand without reloading the page.

### 3. Two-Factor Authentication (TOTP 2FA)
- Configured via Better Auth TOTP plugin.
- First-time setup renders a QR code generated by the `qrcode` library.
- Returning users with 2FA enabled must submit their 6-digit authenticator code before access is granted.
- Admin can reset a locked/lost 2FA token from the Admin Security dashboard (`POST /api/admin/reset-2fa`).

### 4. Password Reset
- Flow: User enters email + 6-digit TOTP code.
- Backend verifies code via `verifyPasswordResetCodeAction` (`POST /api/password-reset/verify-code`).
- User inputs new password via `setNewPasswordAction` (`POST /api/password-reset/set-password`).

### 5. Role-Based Route Protection
- Implemented in `src/app/dashboard/layout.tsx`.
- Client-side verification reads the current session role:
  - Role `admin` ➔ Allowed `/dashboard/admin/*`
  - Role `teacher` ➔ Allowed `/dashboard/teacher/*`
  - Role `student` ➔ Allowed `/dashboard/student/*`
- Unauthorized attempts trigger redirection to `/unauthorized` or `/login`.

---

## Directory & File Structure

```
d:/javascript-practice/school-management-system/
├── public/                                # Public assets, logos, illustration SVGs
├── src/
│   ├── app/                               # Next.js App Router
│   │   ├── about/page.tsx                 # About institutional page
│   │   ├── contact/page.tsx               # Contact & support page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                 # Role-gated dashboard layout, sidebar, theme toggle
│   │   │   ├── page.tsx                   # Redirects to role-specific dashboard
│   │   │   ├── admin/                     # Admin Portal
│   │   │   │   ├── page.tsx               # Admin overview & live platform statistics
│   │   │   │   ├── approvals/page.tsx     # Pending user approval queue
│   │   │   │   ├── classes/page.tsx       # Class, section & subject manager
│   │   │   │   ├── events/page.tsx        # Academic event & holiday calendar scheduler
│   │   │   │   ├── fees/page.tsx          # Invoicing, fee collections & PDF receipts
│   │   │   │   ├── notices/page.tsx       # Admin institutional notices authoring
│   │   │   │   ├── results/page.tsx       # School-wide exam performance & publishing
│   │   │   │   ├── security/page.tsx      # User 2FA status lookup & reset
│   │   │   │   ├── students/page.tsx      # Student directory & profile manager
│   │   │   │   └── teachers/page.tsx      # Teacher directory & credential manager
│   │   │   ├── teacher/                   # Teacher Portal
│   │   │   │   ├── page.tsx               # Teacher overview dashboard
│   │   │   │   ├── assignments/page.tsx   # Assignment CRUD & student submissions viewer
│   │   │   │   ├── attendance/page.tsx    # Interactive attendance tracker & analytics
│   │   │   │   ├── examinations/page.tsx  # Exam routines, schedules & room allocations
│   │   │   │   ├── my-classes/page.tsx    # Class/subject assignment requests
│   │   │   │   ├── notices/page.tsx       # Teacher notice board management
│   │   │   │   ├── results/page.tsx       # Grade entry, automated grading & results
│   │   │   │   └── students/page.tsx      # Enrolled student directory
│   │   │   └── student/                   # Student Portal
│   │   │       ├── page.tsx               # Student overview & academic progress
│   │   │       ├── assignment/page.tsx    # Assignment submissions & file attachments
│   │   │       ├── attendance/page.tsx    # Student personal attendance logs
│   │   │       ├── examinations/page.tsx  # Student exam timetable
│   │   │       ├── fee/page.tsx           # Fee invoices & payment receipts
│   │   │       ├── notices/page.tsx       # Student notice board viewer
│   │   │       └── result/page.tsx        # Published grades & report cards
│   │   ├── login/page.tsx                 # Combined auth page (sign-in/sign-up)
│   │   ├── notices/page.tsx               # Public notices board
│   │   ├── privacy/page.tsx               # Privacy policy
│   │   ├── profile/page.tsx               # User profile editor & avatar uploader
│   │   ├── terms/page.tsx                 # Terms of service
│   │   ├── unauthorized/page.tsx          # Access denied view
│   │   ├── globals.css                    # Tailwind CSS 4 theme tokens & styles
│   │   ├── layout.tsx                     # Root HTML layout (Navbar, Footer, Toasts)
│   │   └── page.tsx                       # Landing page
│   ├── components/
│   │   ├── CombinedLoginRegister/         # Auth modal, forms, 2FA QR code
│   │   ├── DashboardViews/                # Role dashboard overview cards & widgets
│   │   ├── NoticeBoard/                   # Notice list, filter, pin-to-top component
│   │   ├── shared/                        # Shared reusable dialogs and widgets
│   │   │   ├── AssignmentCard.tsx         # Assignment display card with actions
│   │   │   ├── AssignmentFormModal.tsx    # Assignment create/edit modal
│   │   │   ├── DeleteConfirmationModal.tsx# Generic delete prompt
│   │   │   ├── EnterResultButton.tsx      # Action button trigger for result entry
│   │   │   ├── MarkAttendanceModal.tsx    # Interactive class attendance marker
│   │   │   ├── ResultDetailsModal.tsx     # Result viewer modal
│   │   │   ├── ResultList.tsx             # Paginated/filterable results table
│   │   │   ├── SubmissionsModal.tsx       # Student assignment submissions inspector
│   │   │   └── SubmitResultModal.tsx      # Grade entry & edit modal with auto-calculation
│   │   ├── Navbar/                        # Global public header
│   │   └── Footer/                        # Global public footer
│   └── lib/
│       ├── auth-client.ts                 # Better Auth client & session helpers
│       └── actions/                       # Next.js Server Actions
│           ├── approval-actions.ts        # Approval status check
│           ├── password-reset-actions.ts  # TOTP password reset verification
│           ├── teacher-students.ts        # Paginated teacher student directory
│           ├── teacher.exam.ts            # Exam routines CRUD
│           ├── teacher.notice.ts          # Notice board CRUD
│           ├── teacher.request.ts         # Teacher class/subject requests
│           └── user-actions.ts            # Client-side user profile updater
├── CODE_SUMMARY.md                        # Architecture and codebase reference
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # TypeScript configuration
└── next.config.ts                         # Next.js configuration (React Compiler, images)
```

---

## Public & Shared Routes

| Route | File Path | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Main marketing landing page: Hero, Solution Cards, Features, Live Marquee, Step-by-Step guide, Testimonials, FAQ, and CTA. |
| `/about` | `src/app/about/page.tsx` | Mission, vision, core values, institutional background, and leadership team overview. |
| `/contact` | `src/app/contact/page.tsx` | Interactive inquiry form, support channels, campus map, and contact information. |
| `/notices` | `src/app/notices/page.tsx` | Public school bulletin board displaying institution-wide announcements. |
| `/login` | `src/app/login/page.tsx` | Unified login, student/teacher registration, TOTP 2FA verification, and approval status gateway. |
| `/profile` | `src/app/profile/page.tsx` | Authenticated user profile view with live editing and avatar upload to Cloudflare R2 / Express API (`/api/user/profile/image`). |
| `/unauthorized` | `src/app/unauthorized/page.tsx` | Access-denied feedback screen for forbidden role access or missing permissions. |
| `/privacy` | `src/app/privacy/page.tsx` | Comprehensive institutional privacy policy and student data compliance standards. |
| `/terms` | `src/app/terms/page.tsx` | Terms of service and platform acceptable use guidelines. |

---

## Role-Based Dashboards & Pages

### Admin Dashboard (`/dashboard/admin`)

The Admin area provides school administrators full operational control over academic records, personnel, finances, and system settings.

* **Overview (`/dashboard/admin/page.tsx`)**:
  * Real-time metrics fetched directly from `GET /api/admin/stats`.
  * Displays total users, students, teachers, admins, pending approvals, locked accounts, total notices, assignments, exams, results, and class assignment requests.
* **Teachers (`/dashboard/admin/teachers/page.tsx` — FR-02)**:
  * Complete faculty management: Add new teachers, edit profiles, toggle active/leave availability, modify roles, and revoke credentials.
* **Students (`/dashboard/admin/students/page.tsx` — FR-01)**:
  * Student enrollment: Add students, update biographical and guardian records, assign class and section, search and filter by grade.
* **Classes & Sections (`/dashboard/admin/classes/page.tsx` — FR-03)**:
  * Structure management: Create classes (Class 6–10), assign sections (A & B), map academic subjects, and review/approve teacher class assignment requests.
* **Results Management (`/dashboard/admin/results/page.tsx` — FR-05)**:
  * Institute-wide grade tracking, exam performance analysis, pass/fail ratios, and grade sheet publishing.
* **Fees & Finance (`/dashboard/admin/fees/page.tsx` — FR-06)**:
  * Invoice generation, payment status tracking (Paid / Partial / Unpaid), payment receipts, and printable PDF invoice generation.
* **Notices (`/dashboard/admin/notices/page.tsx` — FR-07)**:
  * Author institutional notices, pin urgent announcements to the top, and target specific audiences (`All`, `Teachers`, `Students`).
* **Events Calendar (`/dashboard/admin/events/page.tsx` — FR-10)**:
  * Academic calendar scheduling for Holidays, Exams, Sports events, Faculty meetings, and Academic milestones with audience filtering.
* **Approvals (`/dashboard/admin/approvals/page.tsx`)**:
  * Live approval queue calling `GET /api/admin/pending-users` and `POST /api/admin/approve-user` to activate new accounts.
* **Security (`/dashboard/admin/security/page.tsx`)**:
  * Inspect 2FA enrollment status and perform emergency two-factor resets via `POST /api/admin/reset-2fa`.

---

### Teacher Dashboard (`/dashboard/teacher`)

Designed for educators to manage classes, attendance, exams, grades, and student assignments.

* **Overview (`/dashboard/teacher/page.tsx`)**:
  * Displays teacher profile summary, active courses, schedule highlights, and quick access shortcuts.
* **Attendance Tracker (`/dashboard/teacher/attendance/page.tsx`)**:
  * **Live Endpoints:**
    * `GET /api/teacher/attendance/stats` — Overall statistics: Total students, Present count/rate, Late count/rate, Absent count/rate, weekly attendance trends, class attendance distribution.
    * `GET /api/teacher/attendance/students?grade=...&section=...&group=...&date=...` — Loads class roster with existing attendance status.
    * `POST /api/teacher/attendance/mark` — Bulk submits marked attendance records.
  * **UI Features:** AreaChart and BarChart visualizations, preset date filters (`Single Day`, `This Week`, `This Month`, `Custom Date Range`), Class (6–10), Section (A, B), Group (Science, Business Studies, Humanities), and attendance status filters.
  * **Modal:** `MarkAttendanceModal.tsx` supports search, bulk "All Present" / "All Absent" shortcuts, and individual toggle buttons.
* **Examinations (`/dashboard/teacher/examinations/page.tsx`)**:
  * Powered by server actions in `src/lib/actions/teacher.exam.ts`.
  * Features: Create exam schedules, assign room numbers, set start/end times, total marks, and passing criteria. Supports cancelling exams.
* **Results Management (`/dashboard/teacher/results/page.tsx`)**:
  * **Live Endpoints:** `GET /api/teacher/results`, `POST /api/teacher/results`, `PATCH /api/teacher/results/:id`, `DELETE /api/teacher/results/:id`.
  * **Automated Grading:** Automatic grade assignment (`A+`, `A`, `B+`, `B`, `C`, `D`, `F`) calculated from percentage (`score / total * 100`).
  * **SubmitResultModal:** Integrates with `getTeacherStudentsAction()` to auto-select students from the teacher's active roster.
  * **Analytics:** Visual grade distribution pills and high-achiever (`B+` or higher) percentage calculator.
* **Assignments (`/dashboard/teacher/assignments/page.tsx`)**:
  * **Live Endpoint:** `GET /api/teacher/assignments?teacherEmail=...`.
  * **AssignmentFormModal:** Create and edit assignments with title, description, class, section, subject, total marks, and due date.
  * **SubmissionsModal (`src/components/shared/SubmissionsModal.tsx`):** View all student submissions for a given assignment, including submission timestamps, status (`SUBMITTED`, `LATE`, `GRADED`), attempts used, written content, and download links for uploaded files.
  * **DeleteConfirmationModal:** Safe confirmation before removing assignments.
* **Class & Subject Requests (`/dashboard/teacher/my-classes/page.tsx`)**:
  * Request new class, section, and subject teaching assignments; monitor status (`PENDING`, `APPROVED`, `REJECTED`); withdraw requests via `teacher.request.ts`.
* **Students Directory (`/dashboard/teacher/students/page.tsx`)**:
  * Paginated roster of students enrolled in the teacher's assigned classes using `teacher-students.ts`.
* **Notices (`/dashboard/teacher/notices/page.tsx`)**:
  * View, create, update, and delete institutional notices via `teacher.notice.ts`.

---

### Student Dashboard (`/dashboard/student`)

The student portal provides learners access to their schedules, submissions, grades, and administrative updates.

* **Overview (`/dashboard/student/page.tsx`)**:
  * Overall academic progress, GPA tracker, upcoming assignment deadlines, and attendance summary.
* **Assignments (`/dashboard/student/assignment/page.tsx`)**:
  * Live integration with `GET /api/student/assignments`.
  * File upload integration, submission attempts tracking, deadline countdowns, and teacher grading feedback.
* **Attendance (`/dashboard/student/attendance/page.tsx`)**:
  * Personal attendance percentage, monthly calendar breakdown, present/late/absent records.
* **Examinations (`/dashboard/student/examinations/page.tsx`)**:
  * Personal examination schedule, dates, timings, subject codes, and assigned examination rooms.
* **Results (`/dashboard/student/result/page.tsx`)**:
  * Published examination report cards, subject-wise marks, grades, and academic remarks.
* **Fees (`/dashboard/student/fee/page.tsx`)**:
  * Student tuition fee invoices, outstanding dues, payment history, and downloadable payment receipts.
* **Notices (`/dashboard/student/notices/page.tsx`)**:
  * School announcements and academic notices targeted to students.

---

## Server Actions Reference (`src/lib/actions`)

All server actions forward the `better-auth.session_token` cookie and an explicit `Authorization: Bearer <token>` header to maintain seamless cross-origin authentication with the Express API.

| File | Exported Actions | HTTP Method & Path | Description |
|---|---|---|---|
| `approval-actions.ts` | `checkApprovalStatusAction(email)` | `GET /api/approval-status?email=...` | Checks whether a registered user is approved by an administrator |
| `password-reset-actions.ts` | `verifyPasswordResetCodeAction(email, code)`<br>`setNewPasswordAction(email, newPassword)` | `POST /api/password-reset/verify-code`<br>`POST /api/password-reset/set-password` | Verifies 6-digit TOTP code and updates password |
| `teacher-students.ts` | `getTeacherStudentsAction(params)` | `GET /api/teacher/students?...` | Returns paginated student roster with search and class filtering |
| `teacher.exam.ts` | `getTeacherExamsAction()`<br>`createTeacherExamAction(payload)`<br>`cancelTeacherExamAction(examId)` | `GET /api/exams`<br>`POST /api/exams`<br>`PATCH /api/exams/:id/cancel` | Exam routine listing, creation, and cancellation |
| `teacher.notice.ts` | `getTeacherNoticesAction()`<br>`createTeacherNoticeAction(payload)`<br>`updateTeacherNoticeAction(id, payload)`<br>`deleteTeacherNoticeAction(id)` | `GET /api/notices`<br>`POST /api/notices`<br>`PUT /api/notices/:id`<br>`DELETE /api/notices/:id` | Full CRUD operations for teacher notice board management |
| `teacher.request.ts` | `getTeacherRequestsAction()`<br>`createTeacherRequestAction(payload)`<br>`deleteTeacherRequestAction(id)`<br>`updateAdminTeacherRequestStatusAction(id, status)` | `GET /api/teacher/requests`<br>`POST /api/teacher/requests`<br>`DELETE /api/teacher/requests/:id`<br>`PATCH /api/admin/requests/:id` | Teacher class assignment requests and admin approval flow |
| `user-actions.ts` | `updateUserProfileAction(payload)` | `PUT /api/user/profile` | Client action using `localStorage` token to update profile details |

---

## Direct Client-Side API Integrations

In addition to Server Actions, several components communicate with the backend using direct `fetch()` calls with bearer tokens retrieved from `localStorage`:

| Feature Area | Endpoint | HTTP Method | Invoking Component / Page |
|---|---|---|---|
| **Admin Stats** | `/api/admin/stats` | `GET` | `src/app/dashboard/admin/page.tsx` |
| **Admin Approvals** | `/api/admin/pending-users`<br>`/api/admin/approve-user` | `GET`<br>`POST` | `src/app/dashboard/admin/approvals/page.tsx` |
| **Admin Security** | `/api/admin/reset-2fa` | `POST` | `src/app/dashboard/admin/security/page.tsx` |
| **Teacher Attendance** | `/api/teacher/attendance/stats`<br>`/api/teacher/attendance/students`<br>`/api/teacher/attendance/mark` | `GET`<br>`GET`<br>`POST` | `src/app/dashboard/teacher/attendance/page.tsx`<br>`src/components/shared/MarkAttendanceModal.tsx` |
| **Teacher Results** | `/api/teacher/results`<br>`/api/teacher/results/:id` | `GET`, `POST`<br>`PATCH`, `DELETE` | `src/components/shared/ResultList.tsx`<br>`src/components/shared/SubmitResultModal.tsx` |
| **Teacher Assignments** | `/api/teacher/assignments` | `GET`, `POST`, `PUT`, `DELETE` | `src/app/dashboard/teacher/assignments/page.tsx`<br>`src/components/shared/AssignmentFormModal.tsx` |
| **Student Assignments** | `/api/student/assignments` | `GET`, `POST` | `src/app/dashboard/student/assignment/page.tsx` |
| **User Profile Picture** | `/api/user/profile/image` | `POST` (multipart/form-data) | `src/app/profile/page.tsx` |

---

## Component Catalog

### Shared Modals & Widgets (`src/components/shared`)

* **`AssignmentCard.tsx`**: Renders assignment card with subject, title, due date, status badge (`ACTIVE`, `DRAFT`, `CLOSED`), past-due pill, and action menu (Edit, View Submissions, Delete).
* **`AssignmentFormModal.tsx`**: Framer Motion animated modal for creating and updating assignments. Features class-dependent subject dropdowns, total marks input, custom date-time picker, and validation.
* **`SubmissionsModal.tsx`**: Modal allowing teachers to review all student submissions for an assignment. Shows student profile, class/section, submission date, status badge, attempt counter, text response, and download buttons for file attachments.
* **`MarkAttendanceModal.tsx`**: Interactive roster modal allowing teachers to mark attendance for a specific class, section, and date. Includes search bar, quick "All Present" / "All Absent" buttons, and individual status toggles.
* **`SubmitResultModal.tsx`**: Results entry modal featuring automatic student roster lookup via `getTeacherStudentsAction()`, automated percentage-to-grade calculation (`A+` to `F`), exam presets, and draft/published toggles.
* **`ResultList.tsx`**: Rich data table displaying student grades, exams, scores, and status with text search, class filter, status filter, and floating portal action menu.
* **`ResultDetailsModal.tsx`**: Inspection modal displaying grade badge, calculated percentage bar, student metadata, and examination details.
* **`DeleteConfirmationModal.tsx`**: Polished confirmation modal with alert styling, danger buttons, and busy spinner state.

### Dashboard & Layout Components

* **`src/app/dashboard/layout.tsx`**: Core shell for all dashboard views. Includes collapsible sidebar navigation tailored to current user role (`admin`, `teacher`, `student`), top bar with breadcrumbs, theme toggle (`light` / `dark`), and logout confirmation modal.
* **`src/components/DashboardViews/TeacherDashboardView.tsx`**: Overview dashboard cards and metric widgets for teachers.
* **`src/components/DashboardViews/StudentDashboardView.tsx`**: Summary dashboard cards and academic progress tracking for students.
* **`src/components/NoticeBoard/NoticeBoard.tsx`**: Interactive notice list with search, category filtering, and pin-to-top highlights.

---

## Environment Variables & Setup

### Environment Configuration (`.env.local`)

```bash
# URL of the Express + Better Auth backend API
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

### Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

3. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

4. **Linting:**
   ```bash
   npm run lint
   ```

---

*Summary updated to reflect all recent commits, newly implemented features (Teacher Attendance tracking, Result auto-grading, Submissions Modal, Admin Events scheduler, and expanded registration flow).*
