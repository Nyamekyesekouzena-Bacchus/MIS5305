"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/auth";

export async function login(formData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    redirect("/login?error=1");
  }

  const user = await db.user.findFirst({
    where: { username, deletedAt: null },
    include: { role: true },
  });

  if (!user) {
    redirect("/login?error=1");
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);
  if (!passwordMatches) {
    redirect("/login?error=1");
  }

  await createSession(user);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
