/**
 * Next.js Middleware
 * Authentication and Route Protection (Edge-compatible)
 * DISABLED FOR TESTING - Dashboard accessible without auth
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware disabled - allow all routes for testing
export function middleware(request: NextRequest) {
  // Allow all requests during testing phase
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|textures|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)",
  ],
};
