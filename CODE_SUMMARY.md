# EduNexus — Codebase Summary

This document summarizes **this repository**: the Next.js frontend for EduNexus (School Management System). It describes what is actually in the code, not the product vision in `README.md`.

**Status:** Active development. Marketing/docs describe a full stack (Express + Prisma + PostgreSQL). **This repo is the client only.** The API lives in a separate backend (`NEXT_PUBLIC_SERVER_URL`, typically `http://localhost:5000`).

---

## What this app is

EduNexus is a role-based school portal with three roles: **admin**, **teacher**, and **student**. Public pages market the product. After login, users land in a dashboard with a role-specific sidebar.

The frontend:

- Authenticates against Better Auth on the Express API
- Enforces role routes in the dashboard layout (client-side redirects)
- Talks to the API via `fetch` and Next.js server actions
- Still uses **hardcoded demo data** on many academic/admin screens (attendance, results, fees, class lists, etc.)

---

## Tech stack (this repo)

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Google fonts (Sora, Inter) |
| Animation | Framer Motion / `motion` |
| Charts | Recharts |
| Toasts | `react-toastify`, SweetAlert2 (dependency present) |
| Auth client | `better-auth` React client + TOTP 2FA plugin |
| Images | Next Image; Cloudflare R2 host allowed for profile photos |
| Compiler | React Compiler enabled in `next.config.ts` |

There is **no Prisma, Express, or PostgreSQL** in this tree.

---

## High-level architecture

```
Browser (Next.js)
  ├── Public marketing pages
  ├── Auth UI (Better Auth → Express /api/auth)
  └── Dashboard (role-gated)
        └── Server actions / client fetch
              └── Express API (separate project)
                    └── Database (not in this repo)
```

Session token is stored in **localStorage** (`better-auth.session_token`) and mirrored to a **same-origin cookie** so server actions can send it. The Express domain's httpOnly cookie is not visible to Next.js when apps run on different origins.

Environment:

- `NEXT_PUBLIC_SERVER_URL` — API base URL

---

## Folder map

```
src/
  app/                 # App Router pages
  components/          # Marketing + shared UI + dashboard views
  lib/
    auth-client.ts     # Better Auth client, cookie/localStorage token
    actions/           # Server actions wrapping Express REST
public/                # Logos, SVGs
```

Path alias: `@/*` → `src/*`.

---

## Public routes

| Route | Purpose |
| --- | --- |
| `/` | Landing: hero, solutions, success, showcase, steps, FAQ, CTA |
| `/about` | About content |
| `/contact` | Contact / "Talk to us" |
| `/notices` | Public notice board (`NoticeBoard`) |
| `/login` | Combined login/register (`AuthPage`) |
| `/profile` | Edit profile + image upload (authenticated) |
| `/unauthorized` | Role/session denied |
| `/dashboard` | Redirects to `/dashboard/{role}` or unauthorized |

Root layout: Navbar + Footer + ToastContainer, light/dark theme bootstrap from `localStorage` / system preference.

---

## Authentication and security (frontend)

Implemented in `src/components/CombinedLoginRegister/AuthPage.tsx` and `src/lib/auth-client.ts`.

- **Sign up / sign in** via Better Auth (`signUp`, `signIn`, `signOut`, `useSession`)
- **Admin approval gate:** login polls `checkApprovalStatusAction` (`GET /api/approval-status`). Unapproved emails show a disabled "Pending approval" state and re-check without a full refresh
- **TOTP 2FA:** verify existing authenticator code, or first-login QR setup (`qrcode` package). No backup-code path in the UI
- **Forgot password:** email + authenticator code → `verifyPasswordResetCodeAction` → `setNewPasswordAction` (no email OTP)
- **Client lockout:** failed passwords tracked per email in localStorage (comments describe 3 failures → 5-hour lock)
- **Post-register profile:** extra student/teacher fields saved with `updateUserProfileAction`

Admin-only API UI:

- **Approvals** — `GET /api/admin/pending-users`, `POST /api/admin/approve-user`
- **Security** — look up 2FA status, `POST /api/admin/reset-2fa`

Dashboard layout (`src/app/dashboard/layout.tsx`):

- Sidebar nav by role
- Redirects if session missing or role does not match `/dashboard/admin|teacher|student`
- Theme toggle, logout confirmation modal
- **Client-side only** — not Next.js middleware; URLs can still be requested before JS runs

---

## Dashboard navigation

**Admin:** Overview, Teachers, Students, Classes, Results, Fees, Notices, Approvals, Security

**Teacher:** Overview, Attendance, Examinations, Results, Assignments, Class & Subject Requests, Students, Notices

**Student:** Overview, Attendance, Results, Assignments, Fees, Notices

---

## Server actions (`src/lib/actions`)

All server actions share the same auth pattern: forward the `cookie` header from `next/headers` **and** extract `better-auth.session_token` from the cookie to set an explicit `Authorization: Bearer` header. This covers cross-origin sessions.

| File | Role | Endpoints |
| --- | --- | --- |
| `user-actions.ts` | Profile update | `PUT /api/user/profile` (token from localStorage; **not** `"use server"`) |
| `approval-actions.ts` | Public approval check | `GET /api/approval-status` |
| `password-reset-actions.ts` | Reset via TOTP | `POST /api/password-reset/verify-code`, `.../set-password` |
| `teacher.notice.ts` | Notices CRUD | `GET/POST /api/notices`, `PUT/DELETE /api/notices/:id` |
| `teacher.request.ts` | Class/subject requests | `GET/POST/DELETE /api/teacher/requests`, `PATCH /api/admin/requests/:id` |
| `teacher-students.ts` | Teacher student list | `GET /api/teacher/students` (pagination, search, class filter) |
| `teacher.exam.ts` | Exam schedule CRUD | `GET/POST /api/exams`, `PATCH /api/exams/:id/cancel` |

### `teacher.exam.ts` — detail

Exports three server actions for the teacher examinations page:

- **`getTeacherExamsAction()`** — Fetches all exams; maps raw API data onto the `ExamItem` interface with safe defaults (`section`, `startTime`, `endTime`, `roomNo`, `totalMarks`, `passingMarks`, `invigilator`, `status`).
- **`createTeacherExamAction(payload: CreateExamPayload)`** — `POST /api/exams`; maps the created record back to `ExamItem`.
- **`cancelTeacherExamAction(examId: string)`** — `PATCH /api/exams/:id/cancel`; marks an exam as Cancelled.

Key types exported: `ExamItem`, `CreateExamPayload`, `GetExamsResponse`, `ActionExamResponse`.

---

## Features wired to the API vs UI-only

### Wired to Express (live)

- Auth, 2FA, password reset, approval status
- Profile + profile image (`/api/user/profile`, `/api/user/profile/image`)
- Notices (public + teacher create/edit/delete via `NoticeBoard`)
- Teacher class/subject requests (`/dashboard/teacher/my-classes`)
- Teacher student directory (`/dashboard/teacher/students`)
- Teacher assignment CRUD (`/api/teacher/assignments`) — create, edit, delete, list
- Teacher exam schedule CRUD (`/api/exams`) — list, create, cancel
- Student assignment list, file upload, submit (`/api/student/assignments...`)
- Admin pending users, approve, 2FA lookup/reset

### UI with local/demo data (not persisted here)

- Admin overview stats, teachers, students, classes, results, fees
- Teacher overview charts, attendance, results
- Student overview stats, attendance, results, fees
- README items such as AI at-risk prediction, academic calendar, and report generation are **not implemented** in this frontend

---

## Shared components (notable)

- `NoticeBoard` — list/filter/pin; teachers can create/update/delete
- `AssignmentFormModal` — animated modal (Framer Motion) for create/edit; class-dependent subject list; custom `ModalSelectDropdown` and `SingleFieldDateTimePicker` sub-components; supports both `onSubmit` (external handler) and direct `fetch` paths
- `AssignmentCard`, `DeleteConfirmationModal`
- `TeacherDashboardView` / `StudentDashboardView` — overview widgets (demo numbers)
- Marketing: Hero, FAQ, About, Footer, Navbar, RoleBasedAccess (homepage explainer; not used as a route guard)

---

## Teacher Assignments page (`/dashboard/teacher/assignments`)

`src/app/dashboard/teacher/assignments/page.tsx`

- Client component; fetches assignments via direct `fetch` (not a server action) on mount using `teacherEmail` from session
- Summary cards: Total, Active, Closed counts
- Toolbar: text search, Status dropdown (All / ACTIVE / DRAFT / CLOSED), Class dropdown (All / Class 6–10)
- Assignment grid with skeleton loading state (6 placeholder cards)
- `AssignmentFormModal` for create/edit; `DeleteConfirmationModal` for delete confirmation
- Live state update on save: inserts new assignment at front (sorted by due date) or replaces in-place; falls back to re-fetch if no saved record returned
- Auth: `localStorage` `better-auth.session_token` forwarded as `Authorization: Bearer` header

---

## Conventions and caveats

1. **Split frontend/backend** — keep `role` in `auth-client.ts` aligned with server `additionalFields`.
2. **`"use client"`** is used widely on dashboard pages because session and role checks run in the browser.
3. **`user-actions.ts`** uses `localStorage` and is not a server action despite the name.
4. Admin teachers page includes Bengali comments; rest of the app is English.
5. `tsconfig.json` include list has a leftover `"src/app/dashboard/notices"` entry.
6. `teacher.exam.ts` uses a hard-coded fallback URL (`http://localhost:5000`) while other action files default to `undefined` when `NEXT_PUBLIC_SERVER_URL` is missing.

---

## How to run this frontend

```bash
npm install
# .env.local: NEXT_PUBLIC_SERVER_URL=http://localhost:5000
npm run dev
```

Requires the separate Express/Better Auth API. This repo alone cannot authenticate or persist school data.

---

## Team / product context

Product name: **EduNexus**. Team of six (see `README.md`). Live site and GitHub are linked there. This file is a **code map of the Next.js app** as of the last review of `src/`.
