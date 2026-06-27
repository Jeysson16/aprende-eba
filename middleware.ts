import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/admin"];
const publicAdminRoutes = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicAdmin = publicAdminRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected || isPublicAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
