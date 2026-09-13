import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/client/plugins";

// Points at the Express API's Better Auth routes (server/src/routes/auth.routes.ts).
// Set NEXT_PUBLIC_SERVER_URL in .env.local when the API isn't on localhost:5000.
//
// Client and server live in separate projects (this Next.js app vs. server/),
// so the `role` field added in server/src/lib/auth.ts can't be inferred
// automatically — it's declared here explicitly instead. Keep this in sync
// with the `additionalFields` in server/src/lib/auth.ts.

const SESSION_COOKIE_NAME = "better-auth.session_token";

/**
 * Writes the session token as a plain document cookie scoped to THIS app's
 * domain (not the Express API's domain). This is separate from — and does
 * not replace — the httpOnly session cookie Express/Better Auth may set on
 * its own domain, which the browser never shares with the Next.js app since
 * they're on different domains.
 *
 * Why this helps: Next.js server actions run on your own domain, so
 * `headers().get("cookie")` in a server action CAN see this cookie, even
 * though it can't see anything set by the Express domain. That means
 * server actions can read the session without you manually passing the
 * token in as an argument every time.
 *
 * Trade-off: because JS has to write this cookie, it can't be httpOnly —
 * so it's readable by any script on the page, same exposure as
 * localStorage. This does not add XSS protection over the existing
 * localStorage approach; it only makes the token visible server-side too.
 */
function setSessionCookie(token: string) {
  if (typeof document === "undefined") return;
  const isSecureContext =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "path=/",
    "max-age=2592000", // 30 days — adjust to match your actual session length
    "SameSite=Lax",
    isSecureContext ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
}

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth`,
  fetchOptions: {
    credentials: "include",
    onRequest(context) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem(SESSION_COOKIE_NAME);
        if (token) {
          context.headers.set("Authorization", `Bearer ${token}`);
        }
      }
    },
    onResponse(context) {
      if (typeof window !== "undefined") {
        const token = context.response.headers.get("set-auth-token");
        if (token) {
          localStorage.setItem(SESSION_COOKIE_NAME, token);
          setSessionCookie(token); // NEW: mirror into a same-domain cookie
        }

        // NEW: clear both localStorage and the cookie on sign-out.
        // Better Auth's sign-out response doesn't carry a token, so detect
        // it by URL instead.
        if (context.response.url?.includes("/sign-out")) {
          localStorage.removeItem(SESSION_COOKIE_NAME);
          clearSessionCookie();
        }
      }
    },
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", input: false },
        phone: { type: "string", required: false },
        location: { type: "string", required: false },
        department: { type: "string", required: false },
        bio: { type: "string", required: false },
        fatherName: { type: "string", required: false },
        motherName: { type: "string", required: false },
        dateOfBirth: { type: "string", required: false },
        address: { type: "string", required: false },
        bloodGroup: { type: "string", required: false },
        schoolName: { type: "string", required: false },
        studentClass: { type: "string", required: false },
        studentSection: { type: "string", required: false },
        qualification: { type: "string", required: false },
      },
    }),
    // Authenticator-app (TOTP) 2FA. No `onTwoFactorRedirect`/`twoFactorPage`
    // here on purpose — AuthPage.tsx reads `data.twoFactorRedirect` from the
    // sign-in response itself and renders the OTP/QR step inline instead of
    // navigating away.
    twoFactorClient(),
  ],
});

export const { signIn, signUp, signOut, useSession, twoFactor } = authClient;

if (typeof window !== "undefined") {
  const existingToken = localStorage.getItem(SESSION_COOKIE_NAME);
  if (existingToken) {
    setSessionCookie(existingToken);
  }
}
