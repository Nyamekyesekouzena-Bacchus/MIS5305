"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin, getCurrentUser } from "@/lib/auth";

// Usernames are globally unique (including soft-deleted users), so a deleted
// account can be reactivated later without a username collision.
async function usernameTaken(username, excludeId) {
  const existing = await db.user.findFirst({
    where: {
      username,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { id: true },
  });
  return Boolean(existing);
}

export async function createUser(formData) {
  await requireAdmin();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const roleId = Number(formData.get("roleId"));

  if (!firstName || !lastName || !username || !password || !roleId) {
    redirect("/admin/users?error=missing");
  }

  if (await usernameTaken(username)) {
    redirect("/admin/users?error=username");
  }

  const passwordHash = await hashPassword(password);
  await db.user.create({
    data: { firstName, lastName, username, passwordHash, roleId },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?created=user");
}

export async function updateUser(formData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const roleId = Number(formData.get("roleId"));

  if (!id || !firstName || !lastName || !username || !roleId) {
    redirect(`/admin/users/${id}/edit?error=missing`);
  }

  if (await usernameTaken(username, id)) {
    redirect(`/admin/users/${id}/edit?error=username`);
  }

  await db.user.update({
    where: { id },
    data: { firstName, lastName, username, roleId },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?updated=1");
}

export async function softDeleteUser(formData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id) {
    redirect("/admin/users?error=missing");
  }

  // Prevent admins from deleting their own account (avoids lockout).
  const current = await getCurrentUser();
  if (current?.id === id) {
    redirect("/admin/users?error=self");
  }

  await db.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?deleted=1");
}
