import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
const db = new PrismaClient();
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const mint = (p) => new SignJWT({ ...p, type: "access" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("15m").sign(secret);

const admin = await db.user.findFirst({ where: { username: "admin", deletedAt: null } });
const at = await mint({ userId: admin.id, username: admin.username, role: "Admin" });
const cookie = { cookie: `access_token=${at}` };

// find a request with a completed/submitted inspection
const done = await db.serviceRequest.findFirst({
  where: { inspection: { status: { in: ["Submitted", "Completed"] } } },
  include: { inspection: true },
});
const notDone = await db.serviceRequest.findFirst({
  where: { OR: [{ inspection: null }, { inspection: { status: { notIn: ["Submitted", "Completed"] } } }] },
});
console.log("done req:", done?.id, done?.inspection?.status, "| not-done req:", notDone?.id);

async function get(id) {
  const res = await fetch(`http://localhost:3000/admin/requests/${id}`, { headers: cookie });
  const html = await res.text();
  return { status: res.status, html };
}

if (done) {
  const r = await get(done.id);
  console.log(`\n[done ${done.id}] status`, r.status);
  console.log("  has 'Request Type' panel:", r.html.includes("Request Type"));
  console.log("  shows classification select:", r.html.includes("Classification"));
  console.log("  shows locked msg:", r.html.includes("only be set after"));
}
if (notDone) {
  const r = await get(notDone.id);
  console.log(`\n[not-done ${notDone.id}] status`, r.status);
  console.log("  has 'Request Type' panel:", r.html.includes("Request Type"));
  console.log("  shows locked msg:", r.html.includes("only be set after"));
  console.log("  shows classification select:", r.html.includes("Classification"));
}
await db.$disconnect();
