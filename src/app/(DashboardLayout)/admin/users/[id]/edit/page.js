import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import EditUserForm from "./EditUserForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit User",
};

export default async function EditUserPage({ params, searchParams }) {
  await requireAdmin();

  const id = Number(params.id);
  const user = await db.user.findFirst({
    where: { id, deletedAt: null },
    include: { role: true },
  });

  if (!user) {
    notFound();
  }

  const roles = await db.role.findMany({ orderBy: { id: "asc" } });

  return (
    <EditUserForm
      user={{
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        roleId: user.roleId,
      }}
      roles={roles}
      searchParams={searchParams}
    />
  );
}
