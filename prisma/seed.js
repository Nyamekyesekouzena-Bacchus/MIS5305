const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

const projects = [
  { name: "Jonathan Gover", email: "hgover@gmail.com", project: "Flexy React", status: "pending", weeks: "35", budget: "95K", avatar: "/images/users/user1.jpg" },
  { name: "Martin Gover", email: "hgover@gmail.com", project: "Lading pro React", status: "done", weeks: "35", budget: "95K", avatar: "/images/users/user2.jpg" },
  { name: "Gulshan Gover", email: "hgover@gmail.com", project: "Elite React", status: "holt", weeks: "35", budget: "95K", avatar: "/images/users/user3.jpg" },
  { name: "Pavar Gover", email: "hgover@gmail.com", project: "Flexy React", status: "pending", weeks: "35", budget: "95K", avatar: "/images/users/user4.jpg" },
  { name: "Hanna Gover", email: "hgover@gmail.com", project: "Ample React", status: "done", weeks: "35", budget: "95K", avatar: "/images/users/user5.jpg" },
];

const feeds = [
  { title: "Cras justo odio", icon: "bi bi-bell", color: "primary", date: "6 minute ago" },
  { title: "New user registered.", icon: "bi bi-person", color: "info", date: "6 minute ago" },
  { title: "Server #1 overloaded.", icon: "bi bi-hdd", color: "danger", date: "6 minute ago" },
  { title: "New order received.", icon: "bi bi-bag-check", color: "success", date: "6 minute ago" },
  { title: "Cras justo odio", icon: "bi bi-bell", color: "dark", date: "6 minute ago" },
  { title: "Server #1 overloaded.", icon: "bi bi-hdd", color: "warning", date: "6 minute ago" },
];

const blogs = [
  { title: "This is simple blog", subtitle: "2 comments, 1 Like", description: "This is a wider card with supporting text below as a natural lead-in to additional content.", image: "/images/bg/bg1.jpg", btnbg: "primary" },
  { title: "Lets be simple blog", subtitle: "2 comments, 1 Like", description: "This is a wider card with supporting text below as a natural lead-in to additional content.", image: "/images/bg/bg2.jpg", btnbg: "primary" },
  { title: "Don't Lamp blog", subtitle: "2 comments, 1 Like", description: "This is a wider card with supporting text below as a natural lead-in to additional content.", image: "/images/bg/bg3.jpg", btnbg: "primary" },
  { title: "Simple is beautiful", subtitle: "2 comments, 1 Like", description: "This is a wider card with supporting text below as a natural lead-in to additional content.", image: "/images/bg/bg4.jpg", btnbg: "primary" },
];

async function main() {
  await db.project.deleteMany();
  await db.feed.deleteMany();
  await db.blog.deleteMany();

  await db.project.createMany({ data: projects });
  await db.feed.createMany({ data: feeds });
  await db.blog.createMany({ data: blogs });

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
