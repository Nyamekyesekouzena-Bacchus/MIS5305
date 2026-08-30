"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireUser } from "@/lib/auth";

// Users can only change their own password, and only from the My Account page.
export async function changePassword(formData) {
  const user = await requireUser();

  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!newPassword || !confirmPassword) {
    redirect("/account?error=missing");
  }

  if (newPassword.length < 6) {
    redirect("/account?error=short");
  }

  if (newPassword !== confirmPassword) {
    redirect("/account?error=mismatch");
  }

  const passwordHash = await hashPassword(newPassword);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  redirect("/account?changed=1");
}
