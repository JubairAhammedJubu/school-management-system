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

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth`,
  fetchOptions: {
    credentials: "include",
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
