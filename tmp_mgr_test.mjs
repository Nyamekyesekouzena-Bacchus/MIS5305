import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const db = new PrismaClient();
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

async function mint(payload) {
  return new SignJWT({ ...payload, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}
async function hit(token, path, label) {
  const res = await fetch(`http://localhost:3000${path}`, {
    headers: { cookie: `access_token=${token}` },
    redirect: "manual",
  });
  console.log(`${label.padEnd(36)}-> ${res.status}`);
}

const manager = await db.user.findFirst({
  where: { username: "manager", deletedAt: null },
  include: { role: true },
});
const t = await mint({ userId: manager.id, username: manager.username, role: manager.role.name });
await hit(t, "/reports", "manager -> /reports (allowed)");
await hit(t, "/reports?from=2026-08-01&to=2026-08-30", "manager -> /reports range");
await hit(t, "/", "manager -> / dashboard (overall)");
await hit(t, "/admin/users", "manager -> /admin (blocked)");
await db.$disconnect();
