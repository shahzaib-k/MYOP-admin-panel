import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirect-only guard: it checks for the presence of the session cookie so an
// unauthenticated visitor never even sees a protected page render. It cannot
// verify the token is valid or that the user is still an admin — every
// request the page then makes is re-checked by the backend's own
// protect/restrictTo("admin") middleware, which remains the real boundary.
const COOKIE_NAME = "myop_admin_token";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
