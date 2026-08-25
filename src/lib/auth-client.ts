import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Points at the Express API's Better Auth routes (server/src/routes/auth.routes.ts).
// Set NEXT_PUBLIC_SERVER_URL in .env.local when the API isn't on localhost:5000.
//
// Client and server live in separate projects (this Next.js app vs. server/),
// so the `role` field added in server/src/lib/auth.ts can't be inferred
// automatically — it's declared here explicitly instead. Keep this in sync
// with the `additionalFields` in server/src/lib/auth.ts.
export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:5000"}/api/auth`,
  fetchOptions: {
    credentials: "include",
    onRequest(context) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("better-auth.session_token");
        if (token) {
          context.headers.set("Authorization", `Bearer ${token}`);
        }
      }
    },
    onResponse(context) {
      if (typeof window !== "undefined") {
        const token = context.response.headers.get("set-auth-token");
        if (token) {
          localStorage.setItem("better-auth.session_token", token);
        }
      }
    },
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: {type: "string", input: false},
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
