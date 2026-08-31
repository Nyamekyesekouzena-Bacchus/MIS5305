import { NextResponse } from "next/server";
import {
  verifyToken,
  createAccessToken,
  sessionConfig,
} from "@/lib/session";

const PUBLIC_PATHS = ["/login"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 1) Try the short-lived access token.
  const accessToken = request.cookies.get(sessionConfig.accessCookie)?.value;
  let session = accessToken ? await verifyToken(accessToken) : null;
  if (session?.type !== "access") session = null;

  // 2) No valid access token? Rotate a new one from the refresh token.
  let refreshedAccessToken = null;
  if (!session) {
    const refreshToken = request.cookies.get(sessionConfig.refreshCookie)?.value;
    const refreshPayload = refreshToken ? await verifyToken(refreshToken) : null;
    if (refreshPayload?.type === "refresh") {
      const payload = {
        userId: refreshPayload.userId,
        username: refreshPayload.username,
        role: refreshPayload.role,
      };
      refreshedAccessToken = await createAccessToken(payload);
      session = { ...payload, type: "access" };
    }
  }

  // Attach a freshly rotated access token to whatever response we return.
  const withRefreshed = (response) => {
    if (refreshedAccessToken) {
      response.cookies.set(sessionConfig.accessCookie, refreshedAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: sessionConfig.accessMaxAge,
      });
    }
    return response;
  };

  // Not authenticated and trying to access a protected page -> go to login
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already authenticated -> keep away from the login page
  if (session && pathname.startsWith("/login")) {
    return withRefreshed(NextResponse.redirect(new URL("/", request.url)));
  }

  // Admin area: management (Admin + Manager) may view; write actions are
  // additionally gated server-side so managers stay read-only.
  if (
    pathname.startsWith("/admin") &&
    session?.role !== "Admin" &&
    session?.role !== "Manager"
  ) {
    return withRefreshed(NextResponse.redirect(new URL("/", request.url)));
  }

  return withRefreshed(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
