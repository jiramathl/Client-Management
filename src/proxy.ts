import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Next.js 16 renamed Middleware to Proxy (same mechanism). This is an
// optimistic, cookie-only check — the authoritative check happens again in
// each page/layout via auth() reading the DB-backed session. Admin and
// Portal are genuinely separate authenticated surfaces (HANDOFF gap #5):
// a TEAM session can't wander into /portal and a client session can't
// wander into /admin.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  const isAdminLogin = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin") && !isAdminLogin;
  const isPortalLogin = pathname === "/portal/login";
  const isPortalRoute = pathname.startsWith("/portal") && !isPortalLogin;

  if (isAdminRoute && (!req.auth || role !== "TEAM")) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if (isPortalRoute && (!req.auth || (role !== "OWNER" && role !== "CLIENT"))) {
    return NextResponse.redirect(new URL("/portal/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
