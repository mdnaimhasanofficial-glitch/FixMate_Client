import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// No BetterAuth session cookie -> send the user to the sign-in page
export function middleware(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

// Only the dashboard area needs this check
export const config = {
  matcher: ["/dashboard/:path*"],
};
