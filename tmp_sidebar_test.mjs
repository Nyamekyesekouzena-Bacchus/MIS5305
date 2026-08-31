import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const db = new PrismaClient();
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const LABELS = ["Dashboard", "Users", "Customers", "Services", "Requests", "Inspections", "Appointments", "Reports"];

async function mint(p) {
  return new SignJWT({ ...p, type: "access" })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("15m").sign(secret);
}
async function sidebarFor(user) {
  const t = await mint({ userId: user.id, username: user.username, role: user.role.name });
  const res = await fetch("http://localhost:3000/", { headers: { cookie: `access_token=${t}` } });
  const html = await res.text();
  // Look only inside sidebarNav area for the link labels.
  const present = LABELS.filter((l) => new RegExp(`>${l}</span>`).test(html));
  console.log(`${user.role.name.padEnd(13)}-> ${present.join(", ")}`);
}

async function pick(roleName) {
  return db.user.findFirst({ where: { role: { name: roleName }, deletedAt: null }, include: { role: true } });
}
for (const r of ["Admin", "Manager", "Field Worker"]) {
  const u = await pick(r);
  if (u) await sidebarFor(u); else console.log(`${r}: no user`);
}
await db.$disconnect();
