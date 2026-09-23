import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/admin",
  "/teacher",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // =========================
  // 1. Generate CSP nonce
  // =========================
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `'script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "'style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  // =========================
  // 2. Clone request headers
  // =========================
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  // =========================
  // 3. Create response
  // =========================
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // =========================
  // 4. Security headers
  // =========================
  response.headers.set("Content-Security-Policy", csp);

  response.headers.set("X-Content-Type-Options", "nosniff");

  response.headers.set("X-Frame-Options", "DENY");

  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // =========================
  // 5. Protected route check
  // =========================

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // Better Auth session cookie
    const sessionCookie =
      request.cookies.get("better-auth.session_token")?.value;

    // No session → login
    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);

      // Optional: remember requested page
      loginUrl.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

// =========================
// 6. Proxy matcher
// =========================

export const config = {
  matcher: [
    /*
     * Run proxy on application pages.
     * Skip static files and Next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};