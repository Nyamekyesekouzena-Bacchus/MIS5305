const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { SignJWT } = require("jose");

const db = new PrismaClient();

async function mkjwt(userId, username, role) {
  const key = new TextEncoder().encode(process.env.AUTH_SECRET);
  return new SignJWT({ userId, username, role, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(key);
}

async function code(path, token) {
  const res = await fetch(`http://localhost:3000${path}`, {
    headers: { cookie: `access_token=${token}` },
    redirect: "manual",
  });
  return res.status;
}

(async () => {
  const fwRole = await db.role.findUnique({ where: { name: "Field Worker" } });
  const hash = await bcrypt.hash("field123", 10);
  const fw = await db.user.create({
    data: {
      firstName: "Field",
      lastName: "Tester",
      username: "fieldtester_" + Date.now(),
      passwordHash: hash,
      roleId: fwRole.id,
    },
  });
  const c = await db.customer.create({
    data: { name: "Gamma Co", phone: "555-3000", address: "3 Gamma St", preferredChannel: "Email" },
  });
  const s = await db.service.create({ data: { name: "Plumbing", description: "Pipe work" } });
  const r = await db.serviceRequest.create({
    data: { customerId: c.id, serviceId: s.id, description: "Leak check" },
  });
  const future = new Date();
  future.setDate(future.getDate() + 3);
  const ins = await db.inspection.create({
    data: { serviceRequestId: r.id, scheduledDate: future, assignees: { connect: [{ id: fw.id }] } },
  });
  const ins2 = await db.inspection.create({
    data: { serviceRequestId: r.id, scheduledDate: future },
  });

  const admin = await mkjwt(1, "admin", "Admin");
  const fwToken = await mkjwt(fw.id, "fieldtester", "Field Worker");

  console.log("=== admin ===");
  console.log("request detail (w/ inspections) ->", await code(`/admin/requests/${r.id}`, admin), "(200)");
  console.log("schedule inspection form        ->", await code(`/admin/requests/${r.id}/inspections/new`, admin), "(200)");
  console.log("edit inspection form            ->", await code(`/admin/requests/${r.id}/inspections/${ins.id}/edit`, admin), "(200)");
  console.log("edit missing inspection         ->", await code(`/admin/requests/${r.id}/inspections/999999/edit`, admin), "(404)");

  console.log("=== field worker ===");
  console.log("my inspections list             ->", await code(`/inspections`, fwToken), "(200)");
  console.log("assigned inspection             ->", await code(`/inspections/${ins.id}`, fwToken), "(200)");
  console.log("unassigned inspection (blocked) ->", await code(`/inspections/${ins2.id}`, fwToken), "(307 redirect)");
  console.log("field worker hits /admin        ->", await code(`/admin/requests`, fwToken), "(307 redirect)");

  await db.inspection.update({
    where: { id: ins.id },
    data: { notes: "n", findings: "cracked pipe", recommendations: "replace", status: "Submitted" },
  });
  const done = await db.inspection.findUnique({ where: { id: ins.id } });
  console.log("=== findings submit ===");
  console.log("status after submit             ->", done.status, "(Submitted)");
  console.log("findings saved                  ->", done.findings);

  await db.inspection.deleteMany({ where: { serviceRequestId: r.id } });
  await db.serviceRequest.delete({ where: { id: r.id } });
  await db.customer.delete({ where: { id: c.id } });
  await db.service.delete({ where: { id: s.id } });
  await db.user.delete({ where: { id: fw.id } });
  console.log("cleanup done");

  await db.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
