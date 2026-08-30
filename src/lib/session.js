import { SignJWT, jwtVerify } from "jose";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const ACCESS_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

async function sign(payload, maxAgeSeconds) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .sign(getSecretKey());
}

export async function createAccessToken(payload) {
  return sign({ ...payload, type: "access" }, ACCESS_MAX_AGE);
}

export async function createRefreshToken(payload) {
  return sign({ ...payload, type: "refresh" }, REFRESH_MAX_AGE);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export const sessionConfig = {
  accessCookie: ACCESS_COOKIE,
  refreshCookie: REFRESH_COOKIE,
  accessMaxAge: ACCESS_MAX_AGE,
  refreshMaxAge: REFRESH_MAX_AGE,
};
