# EduNexus Platform — Individual Contribution Documentation
## Full-Stack Engineering (Frontend & Backend)

> **Platform:** EduNexus — Institutional Educational Management Platform  
> **Contributor:** Tanzim Ahmed  
> **GitHub Handle:** [@Tah56](https://github.com/Tah56)  
> **Contact Email:** tanzimahmed575@gmail.com  
> **Primary Branch:** `tanzim`  
> **Role:** Core Full-Stack Software Engineer  
> **Repositories:**  
> - **Backend API:** [`JubairAhammedJubu/EduNexus-Server`](https://github.com/JubairAhammedJubu/EduNexus-Server)  
> - **Frontend Web App:** [`JubairAhammedJubu/school-management-system`](https://github.com/JubairAhammedJubu/school-management-system)  

---

## 1. Executive Summary

As a core full-stack software engineer on the **EduNexus** project, I was responsible for end-to-end design, database modeling, REST API development, cloud storage integration, and client-side UI/UX implementation across both the **EduNexus Backend Server** and the **Next.js Frontend Client Application**.

My contributions span over **212+ commits** (**84+ backend commits** and **128+ frontend commits**) directly merged into the core development streams. I designed and deployed complete feature verticals from scratch: from the database schema and security middleware to interactive, stateful React 19 dashboards and modal interfaces.

### Contribution Overview Metrics

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 TANZIM AHMED (@Tah56)                                  │
│                             Full-Stack Engineering Summary                             │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ BACKEND (`EduNexus-Server`)               │ FRONTEND (`school-management-system`)       │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • 84+ Commits on `tanzim` branch          │ • 128+ Commits on `tanzim` branch          │
│ • Express 4.21 + TypeScript (ESM)         │ • Next.js 16 (App Router) + React 19       │
│ • Prisma ORM 6.18 + MongoDB Atlas         │ • Tailwind CSS v4 + Framer Motion          │
│ • Better Auth 1.7 Session & Role Guards   │ • Lucide Icons, Recharts, SweetAlert2      │
│ • Cloudflare R2 Object Storage (AWS S3)   │ • jsPDF Dynamic Client-Side Document Gen   │
│ • 45+ Production REST API Endpoints       │ • 30+ Dedicated Dashboard Pages & Modals   │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 2. End-to-End Feature Domains (Full-Stack Ownership)

### Domain 1: Institutional Fee Management & Payment Reconciliation

I built the entire financial lifecycle from ground up, enabling institutions to establish fee rates, track payments across multiple gateways, allow students to submit verification slips, and provide administrators with a verification and receipt pipeline.

#### Backend Implementation (`EduNexus-Server`)
- **Core File:** [`src/routes/fee.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/fee.routes.ts), [`prisma/schema.prisma`](file:///d:/javascript-practice/EduNexus-Server/prisma/schema.prisma)
- **Fee Structure Engine:** Configured baseline structures per grade (`studentClass`), fee classification (`MONTHLY`, `EXAM`, `REGISTRATION`, `OTHER`), and session year with auto-upsert race handling.
- **Multi-Gateway Reconciliation:** Handled Cash, Bank Deposits, and Bangladeshi Mobile Financial Services (**bKash, Nagad, Rocket, Upay**).
- **Payment Verification Pipeline:**
  - Implemented student payment claim endpoints with screenshot slip uploads directly streamed to Cloudflare R2 via Multer memory storage.
  - Built administrative approval/rejection endpoints (`PATCH /admin/fees/claims/:id/approve` and `reject`).
  - Implemented automated alphanumeric receipt generation (`RCPT-TIMESTAMP-RANDOM`).
- **Student Balance Ledger:** Created student balance queries aggregating total dues, amounts paid, pending claims, and overdue alerts.

#### Frontend Implementation (`school-management-system`)
- **Admin Fee Dashboard:** `src/app/dashboard/admin/fees/page.tsx`
  - Metric cards for total collections, pending verification claims, and unpaid balances.
  - Interactive payment verification table with search, status filters, and slip modal viewers.
- **Admin Modals:**
  - `src/components/shared/RecordFeePaymentModal.tsx`: Admin modal to directly record cash and bank payments.
  - `src/components/shared/VerifyPaymentModal.tsx`: Slip inspection and claim approval dialog.
  - `src/components/shared/RejectClaimModal.tsx`: Rejection with required reason feedback.
- **Student Fee Portal:** `src/app/dashboard/student/fee/page.tsx`
  - Student fee breakdown card (Monthly Tuition, Exam Fees, Session Charges).
  - Payment history timeline and receipt download links.
  - `src/components/shared/SubmitFeePaymentModal.tsx`: Drag-and-drop payment slip upload with gateway selector.

---

### Domain 2: Academic Timetable, Periods & Routine Scheduling

I designed the complete timetable matrix to eliminate class scheduling overlaps, automate period creation, and provide tailored schedules for administrators, teachers, and students.

#### Backend Implementation (`EduNexus-Server`)
- **Core Files:** [`src/routes/admin.routine.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/admin.routine.routes.ts), [`src/routes/admin.periods.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/admin.periods.routes.ts), [`src/routes/admin.class.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/admin.class.routes.ts)
- **Period Management:** Created period slot architecture (`seed-standard`) allowing configuration of morning and day shift periods, break times, and duration calculations.
- **Conflict Prevention Engine:** Server-side validation checking against room double-booking, teacher time-slot conflicts, and class section collisions.
- **Dedicated Routine Views:**
  - `GET /api/teacher/routine`: Returns only the authenticated teacher’s weekly timetable, allocated classrooms, and free periods.
  - `GET /api/student/routine`: Dynamically resolves student routine based on their assigned grade, section, and shift/group.

#### Frontend Implementation (`school-management-system`)
- **Admin Master Timetable:**
  - `src/app/dashboard/admin/routine/page.tsx`: Section-by-section timetable overview.
  - `src/app/dashboard/admin/routine/[sectionId]/page.tsx`: Visual weekly schedule grid (Sunday through Thursday) with period slots, teacher chips, and subject tags.
  - `src/app/dashboard/admin/period/page.tsx`: Interactive period manager to define period order, start/end times, and break intervals.
- **Teacher Routine View:** `src/app/dashboard/teacher/routine/page.tsx`
  - Weekly view highlighting classes by day, period time, subject, and assigned classroom number.
- **Student Routine View:** `src/app/dashboard/student/routine/page.tsx`
  - Responsive daily schedule view with active period highlighting and teacher designations.

---

### Domain 3: Student Attendance Tracking & Risk Analytics

I built the attendance management engine from teacher roster marking to automated student absenteeism alerts.

#### Backend Implementation (`EduNexus-Server`)
- **Core File:** [`src/routes/attendance.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/attendance.routes.ts)
- **Roster & Batch Upsert:** Built endpoints for teachers to fetch class rosters and submit batch attendance records with statuses (`PRESENT`, `LATE`, `ABSENT`).
- **Date Normalization & Integrity:** Handled timezone offsets by normalizing all attendance timestamps to local midnight boundaries, strictly enforcing the unique constraint `@@unique([studentId, date])`.
- **At-Risk Detection Engine:** Implemented automated calculations flagging students whose attendance rate drops below **75%**, generating warning metrics for faculty intervention.
- **Security & Pagination:** Hardened queries with role verification, sanitization, and indexed pagination.

#### Frontend Implementation (`school-management-system`)
- **Teacher Attendance Portal:** `src/app/dashboard/teacher/attendance/page.tsx`
  - Class/Section selector with date picker.
  - Quick action controls: "Mark All Present", individual status toggles, and attendance summaries.
  - `src/components/shared/MarkAttendanceModal.tsx`: Quick attendance entry popup.
- **Student Attendance Analytics:** `src/app/dashboard/student/attendance/page.tsx`
  - Overall attendance percentage ring chart.
  - Detailed calendar history log detailing present days, tardies, and excused absences.

---

### Domain 4: Assignment Pipeline & Cloudflare R2 Cloud Storage

I developed the coursework distribution and student homework submission engine with secure file uploads directly to Cloudflare R2 object storage.

#### Backend Implementation (`EduNexus-Server`)
- **Core Files:** [`src/routes/assignment.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/assignment.routes.ts), [`src/lib/r2.ts`](file:///d:/javascript-practice/EduNexus-Server/src/lib/r2.ts)
- **Zero-Egress Object Storage:** Integrated the AWS S3 SDK (`@aws-sdk/client-s3`) configured with Cloudflare R2 credentials for cost-effective file storage.
- **Deep Binary File Validation:**
  - Enforced strict 10MB file size limits and MIME filtering (`application/pdf`).
  - Added binary **magic byte verification** (`%PDF-` / `0x25 0x50 0x44 0x46 0x2D`) to block disguised malicious files.
- **Business Rule Enforcement:**
  - Restricted students to **2 submission attempts maximum** per assignment.
  - Automated status marking (`LATE`) if submissions occur after the deadline.

#### Frontend Implementation (`school-management-system`)
- **Teacher Assignment Workspace:** `src/app/dashboard/teacher/assignments/page.tsx`
  - Assignment creator with deadline selectors, total marks, and subject association.
  - `src/components/shared/AssignmentFormModal.tsx`: Rich modal for authoring and editing coursework.
  - `src/components/shared/SubmissionsModal.tsx`: Submission reviewer displaying student names, submission counts, PDF preview links, and grading inputs.
- **Student Assignment Hub:** `src/app/dashboard/student/assignment/page.tsx`
  - Filterable tabs: "Pending", "Submitted", and "Past Due".
  - `src/components/shared/AssignmentCard.tsx`: Assignment display with remaining attempts counter and status chips.
  - Modal with built-in PDF viewer for previewing submitted documents.

---

### Domain 5: Academic Structure, Curriculum & Subject Requests

I built the structural foundation for classes, sections, academic shifts, subjects, and teacher assignment workflows.

#### Backend Implementation (`EduNexus-Server`)
- **Core Files:** [`src/routes/admin.class.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/admin.class.routes.ts), [`src/routes/admin.subject.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/admin.subject.routes.ts), [`src/routes/subject.request.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/subject.request.routes.ts)
- **Institutional Capacity Limits:**
  - Hard limit of **30 students** per individual section.
  - Hard limit of **60 students** per class/group.
- **National Curriculum Seeder:** Implemented standard Bangladeshi secondary curriculum seeding (`seed-bd-curriculum`).
- **Teacher Subject Requests:** Pipeline for teachers to request teaching slots with administrator approval/rejection.

#### Frontend Implementation (`school-management-system`)
- **Class & Section Administration:** `src/app/dashboard/admin/classes/page.tsx`
  - Grid listing classes (Class 6 through Class 10), sections, shifts (Morning/Day), and enrolled counts.
  - `src/components/shared/SectionDetailDrawer.tsx`: Flyout drawer showing enrolled students and routine for the section.
- **Subject Management:** `src/app/dashboard/admin/subjects/page.tsx`
  - Subject inventory with codes, class associations, and one-click national curriculum seeding button.
- **Subject Request Workflows:**
  - `src/app/dashboard/admin/subject-requests/page.tsx`: Admin review interface for teacher assignment requests.
  - `src/app/dashboard/teacher/subject-requests/page.tsx`: Teacher submission form for requesting classes.
  - `src/app/dashboard/student/subjects/page.tsx`: Student view of enrolled subjects, teacher profiles, and syllabi.

---

### Domain 6: Gradebook & Result Management

I created the grading pipeline connecting teacher evaluation with student grade reports.

#### Backend Implementation (`EduNexus-Server`)
- **Core File:** [`src/routes/result.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/result.routes.ts)
- **Draft to Published Architecture:** Permitted teachers to enter and modify results in `DRAFT` state without premature student visibility until verified and marked `PUBLISHED`.
- **Grade & GPA Mapping:** Automated percentage and standard letter grade conversions.
- **Role-Gated Viewing:** Enforced security ensuring students can only view their own published results.

#### Frontend Implementation (`school-management-system`)
- **Teacher Gradebook:** `src/app/dashboard/teacher/results/page.tsx`
  - `src/components/shared/SubmitResultModal.tsx`: Bulk or individual score entry modal.
  - `src/components/shared/ResultList.tsx`: Tabular results table with status toggling.
- **Admin Results Overview:** `src/app/dashboard/admin/results/page.tsx`
  - Institutional performance summaries across classes and terms.
- **Student Report Card:** `src/app/dashboard/student/result/page.tsx`
  - Dynamic grade cards detailing exam name, score obtained, maximum marks, letter grade, and GPA.

---

### Domain 7: Noticeboard & School Announcements

I developed the institutional announcement board for broadcasting notices across user roles.

#### Backend Implementation (`EduNexus-Server`)
- **Core File:** [`src/routes/notice.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/notice.routes.ts)
- **Notice Model & Priority Sorting:** Modeled notices with category metadata and `isPinned` priority flags (pinned items sorted first, followed by descending creation date).
- **Role-Based Authorship:** Gated publishing and editing to authorized teachers and administrators.

#### Frontend Implementation (`school-management-system`)
- **Admin Notice Management:** `src/app/dashboard/admin/notices/page.tsx`
  - Full CRUD interface for drafting, pinning, categorizing, and deleting announcements.
- **Notice Board Component:** `src/components/NoticeBoard/NoticeBoard.tsx`
  - Interactive announcement card feed with category filters ("Exam", "Holiday", "Urgent", "General").

---

### Domain 8: User Administration, Student Onboarding & Profiles

I built the administrative student enrollment features and user account controls.

#### Backend Implementation (`EduNexus-Server`)
- **Core Files:** [`src/routes/admin.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/admin.routes.ts), [`src/routes/user.routes.ts`](file:///d:/javascript-practice/EduNexus-Server/src/routes/user.routes.ts), [`src/lib/auth.ts`](file:///d:/javascript-practice/EduNexus-Server/src/lib/auth.ts)
- **Direct Student Enrollment:** Built the admin route to onboard students directly, automatically generating sequential roll numbers (`maxRoll + 1`) based on existing class enrollment.
- **Cloudflare R2 Profile Avatars:** Implemented memory-buffered avatar upload pipeline with image MIME checks (JPEG, PNG, WebP).
- **Administrative Account Unlocking:** Implemented `PATCH /api/admin/users/:id/unlock` to clear lockout counters from failed logins.

#### Frontend Implementation (`school-management-system`)
- **Admin User Management:**
  - `src/app/dashboard/admin/students/page.tsx`: Student directory with direct registration modal and roll number generation.
  - `src/app/dashboard/admin/teachers/page.tsx`: Faculty directory with department and qualification tags.
- **User Profile Page:** `src/app/profile/page.tsx`
  - Profile editor with live avatar crop/upload to Cloudflare R2, personal bio, guardian contact details, and blood group.
- **Dashboard Views:**
  - `src/components/DashboardViews/StudentDashboardView.tsx`: Student home dashboard layout.
  - `src/components/DashboardViews/TeacherDashboardView.tsx`: Teacher quick stats and class shortcuts.

---

## 3. Comprehensive Full-Stack API & Page Matrix

| Functional Area | Backend Endpoint (`EduNexus-Server`) | Frontend Route / Component (`school-management-system`) | Access Control |
|---|---|---|:---:|
| **Fee Structure** | `POST/GET /api/admin/fees/structure` | `/dashboard/admin/fees` | Admin |
| **Record Payments** | `POST /api/admin/fees/payments` | `RecordFeePaymentModal.tsx` | Admin |
| **Verify Fee Claims** | `PATCH /api/admin/fees/claims/:id/*` | `VerifyPaymentModal.tsx`, `RejectClaimModal.tsx` | Admin |
| **Student Fee Portal** | `GET /api/student/fees/my-status` | `/dashboard/student/fee` | Student |
| **Submit Fee Claim** | `POST /api/student/fees/submit-claim` | `SubmitFeePaymentModal.tsx` | Student |
| **Master Routine** | `GET/PUT /api/admin/routine/slot` | `/dashboard/admin/routine/[sectionId]` | Admin |
| **Periods Setup** | `GET/POST /api/admin/periods` | `/dashboard/admin/period` | Admin |
| **Teacher Timetable**| `GET /api/teacher/routine` | `/dashboard/teacher/routine` | Teacher |
| **Student Timetable**| `GET /api/student/routine` | `/dashboard/student/routine` | Student |
| **Mark Attendance** | `POST /api/teacher/attendance/mark` | `/dashboard/teacher/attendance`, `MarkAttendanceModal` | Teacher |
| **Student Attendance**| `GET /api/student/attendance` | `/dashboard/student/attendance` | Student |
| **Assignments CRUD**| `POST/PATCH/DELETE /api/teacher/assignments` | `/dashboard/teacher/assignments`, `AssignmentFormModal` | Teacher |
| **Submissions Review**| `GET /api/teacher/assignments/:id/submissions` | `SubmissionsModal.tsx` | Teacher |
| **Submit Homework** | `POST /api/student/assignments/:id/upload` | `/dashboard/student/assignment`, `AssignmentCard` | Student |
| **Results Entry** | `POST/PATCH /api/teacher/results` | `/dashboard/teacher/results`, `SubmitResultModal` | Teacher |
| **Student Results** | `GET /api/student/results` | `/dashboard/student/result` | Student |
| **Classes & Sections**| `GET/POST /api/admin/classes` | `/dashboard/admin/classes`, `SectionDetailDrawer` | Admin |
| **Subject Seeding** | `POST /api/admin/subjects/seed-bd-curriculum`| `/dashboard/admin/subjects` | Admin |
| **Subject Requests** | `GET/POST /api/teacher/requests` | `/dashboard/teacher/subject-requests` | Teacher |
| **Noticeboard** | `GET/POST /api/notices` | `/dashboard/admin/notices`, `NoticeBoard.tsx` | Public / Admin |
| **Direct Student Add**| `POST /api/admin/users` | `/dashboard/admin/students` | Admin |
| **Profile & Avatar** | `PUT /api/user/profile`, `POST /api/user/profile/image` | `/profile` | Authenticated |

---

## 4. Key Git Commit Highlights

### Backend Commits (`EduNexus-Server`)
- `319331c` — *new route add for result route*
- `ed5ce55` — *add: student add route & admin student enrollment enhancements*
- `3fdc7c7` — *Merge pull request #124 (improved attendance route)*
- `5345c3d` — *improved attendance route and data consistency*
- `2c6b2ad` — *Merge pull request #122 (pagination add improve some security)*
- `e27f9d6` — *pagination add, query optimization, and security hardening across user and attendance routes*
- `53fdf9e` — *Merge pull request #112 (routine routes)*
- `bffff7a` — *add the groups and shifts in the routine routes*
- `171678a` — *add teacher routine and schedule query routes*
- `2965b2f` — *mod: teacher subject request and assign class routes*
- `0dd73a3` — *add: multiple routes for admin classes, periods, routine, and academic configuration*
- `4881d6d` — *Merge pull request #99 (fee routes improvements)*
- `5d6c04d` — *fee routes improvements and Cloudflare R2 slip upload pipeline*
- `817d8bc` — *add comprehensive feeRoutes and Prisma financial models*
- `14f74e5` — *fix(security): validate PDF URLs on upload/submit, enforce binary magic byte validation*
- `d351df1` — *add the attendance API, calculations, and bug fixes*
- `da37651` — *add student attendance and result API endpoints*
- `1e09e8f` — *integrate Cloudflare R2 S3 storage for PDF and avatar hosting*
- `8493b98` — *add student PDF submission API with 2-attempt limits*

### Frontend Commits (`school-management-system`)
- `195c2a5` — *student dashboard result not showing issue fix*
- `728c21e` — *Merge pull request #296 from JubairAhammedJubu/tanzim*
- `60c24f2` — *fixing some issue on student and admin workflows*
- `5d0e3b7` — *Merge pull request #294 from JubairAhammedJubu/tanzim*
- `87c3623` — *fix the admin student add section and payment modals*
- `6b9ee24` — *Merge pull request #292 from JubairAhammedJubu/tanzim*
- `bc2c37a` — *fix some bugs in fee claims and verification modals*
- `0b628aa` — *Merge pull request #284 (routine routes in admin)*
- `fb65c70` — *add the groups in the routine route in the admin dashboard*
- `e32737e` — *Merge pull request #282 (teacher routine routes)*
- `a0e506b` — *add teacher routine routes and weekly view*
- `f2ce85c` — *Merge pull request #280 (admin dashboard routes)*
- `dcf35c9` — *mod: modified the admin dashboard routes and add routine route*
- `6e231c5` — *Merge pull request #277 (teacher subject request and assign class)*
- `58f714d` — *mod: teacher subject request and assign class UI*
- `76efc08` — *Merge pull request #275 (new class and routine sections)*
- `3b24411` — *add: new class section and routine section in admin dashboard*
- `693463d` — *Merge pull request #273 (fee section)*
- `1382781` — *working on fee section and verification modals*
- `d804005` — *Merge pull request #269 (admin and student payment section)*
- `1e61aa4` — *working on admin and student payment section*
- `1c0e932` — *fix(security): validate PDF URLs on upload/submit and preview files in modal*
- `14e3cea` — *mod: dynamic result, attendance, and add subjects section into the student dashboard*

---

## 5. Technology Stack Summary

### Frontend Technologies
- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript 5.x
- **Styling & Animation:** Tailwind CSS v4, Framer Motion
- **Icons & Visuals:** Lucide React, Recharts (Attendance & Results charts)
- **UI Components & Feedback:** SweetAlert2, React Toastify, React Fast Marquee
- **Document Generation:** jsPDF (Client-side dynamic receipt generation)
- **Auth Client:** Better Auth Client (`better-auth/react`)

### Backend Technologies
- **Runtime:** Node.js 20+ (ES Modules)
- **Framework:** Express 4.21 with Express Router
- **Database & ORM:** Prisma Client 6.18, MongoDB Atlas (Replica Set)
- **Object Storage:** Cloudflare R2 via AWS SDK S3 client (`@aws-sdk/client-s3`)
- **File Ingestion:** Multer (Memory Storage with binary buffer inspection)
- **Auth Engine:** Better Auth 1.7 (Session tokens, Bearer headers, role guards)
- **Tooling:** `tsx` watch mode, TypeScript compiler (`tsc`)

---

## 6. Conclusion & Impact

By designing and delivering both the server-side API architecture and the client-side user experience, I ensured that every feature set — including institutional fee accounting, routine conflict management, daily attendance rosters, homework assignments, and results publication — operates as a coherent, secure, and user-friendly system. This full-stack ownership eliminated friction between frontend requirements and backend APIs, delivering a robust educational platform for students, faculty, and administration.
