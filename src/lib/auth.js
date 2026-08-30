import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createAccessToken,
  createRefreshToken,
  verifyToken,
  sessionConfig,
} from "@/lib/session";

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export async function createSession(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role?.name ?? user.role,
  };

  const accessToken = await createAccessToken(payload);
  const refreshToken = await createRefreshToken(payload);

  const store = cookies();
  store.set(
    sessionConfig.accessCookie,
    accessToken,
    cookieOptions(sessionConfig.accessMaxAge)
  );
  store.set(
    sessionConfig.refreshCookie,
    refreshToken,
    cookieOptions(sessionConfig.refreshMaxAge)
  );
}

export async function destroySession() {
  const store = cookies();
  store.delete(sessionConfig.accessCookie);
  store.delete(sessionConfig.refreshCookie);
}

export async function getSession() {
  const store = cookies();

  const accessToken = store.get(sessionConfig.accessCookie)?.value;
  const accessPayload = accessToken ? await verifyToken(accessToken) : null;
  if (accessPayload?.type === "access") return accessPayload;

  // Access token missing/expired: fall back to the refresh token for identity.
  // Access-token rotation itself happens in middleware.
  const refreshToken = store.get(sessionConfig.refreshCookie)?.value;
  const refreshPayload = refreshToken ? await verifyToken(refreshToken) : null;
  if (refreshPayload?.type === "refresh") return refreshPayload;

  return null;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  return db.user.findFirst({
    where: { id: Number(session.userId), deletedAt: null },
    include: { role: true },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role?.name !== "Admin") redirect("/");
  return user;
}
