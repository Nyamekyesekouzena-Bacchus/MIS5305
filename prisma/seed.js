const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  // Roles
  const roleNames = ["Admin", "Manager", "Field Worker"];
  for (const name of roleNames) {
    await db.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Initial admin user (username: admin / password: admin123)
  const adminRole = await db.role.findUnique({ where: { name: "Admin" } });
  const passwordHash = await bcrypt.hash("admin123", 10);
  await db.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      firstName: "System",
      lastName: "Administrator",
      username: "admin",
      passwordHash,
      roleId: adminRole.id,
    },
  });

  // Initial manager / Managing Director user (username: manager / password: manager123)
  const managerRole = await db.role.findUnique({ where: { name: "Manager" } });
  const managerPasswordHash = await bcrypt.hash("manager123", 10);
  await db.user.upsert({
    where: { username: "manager" },
    update: {
      passwordHash: managerPasswordHash,
      roleId: managerRole.id,
      deletedAt: null,
    },
    create: {
      firstName: "Managing",
      lastName: "Director",
      username: "manager",
      passwordHash: managerPasswordHash,
      roleId: managerRole.id,
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
