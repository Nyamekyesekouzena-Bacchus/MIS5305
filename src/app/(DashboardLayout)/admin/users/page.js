import { db } from "@/lib/db";
import { requireManagement } from "@/lib/auth";
import AdminUsersView from "./AdminUsersView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "User Management",
};

export default async function AdminUsersPage({ searchParams }) {
  const user = await requireManagement();
  const canManage = user.role?.name === "Admin";

  const q = String(searchParams?.q ?? "").trim();
  const roleFilter = String(searchParams?.role ?? "all");

  const where = { deletedAt: null };
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { username: { contains: q, mode: "insensitive" } },
    ];
  }
  if (roleFilter && roleFilter !== "all") {
    where.roleId = Number(roleFilter);
  }

  const [users, roles] = await Promise.all([
    db.user.findMany({
      where,
      include: { role: true },
      orderBy: { id: "asc" },
    }),
    db.role.findMany({ orderBy: { id: "asc" } }),
  ]);

  return (
    <AdminUsersView
      users={users}
      roles={roles}
      searchParams={searchParams}
      query={q}
      roleFilter={roleFilter}
      canManage={canManage}
    />
  );
}
