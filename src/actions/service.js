"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

function parseService(formData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };
}

export async function createService(formData) {
  const user = await requireAdmin();

  const { name, description } = parseService(formData);

  if (!name || !description) {
    redirect("/admin/services?error=missing");
  }

  const created = await db.service.create({ data: { name, description } });

  await recordAudit({
    entity: "Service",
    entityId: created.id,
    action: "Created",
    detail: `Created service "${name}".`,
    user,
  });

  revalidatePath("/admin/services");
  redirect("/admin/services?created=1");
}

export async function updateService(formData) {
  const user = await requireAdmin();

  const id = Number(formData.get("id"));
  const { name, description } = parseService(formData);

  if (!id || !name || !description) {
    redirect(`/admin/services/${id}/edit?error=missing`);
  }

  await db.service.update({
    where: { id },
    data: { name, description },
  });

  await recordAudit({
    entity: "Service",
    entityId: id,
    action: "Updated",
    detail: `Updated service "${name}".`,
    user,
  });

  revalidatePath("/admin/services");
  redirect("/admin/services?updated=1");
}

export async function deleteService(formData) {
  const user = await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id) {
    redirect("/admin/services?error=missing");
  }

  await db.service.delete({ where: { id } });

  await recordAudit({
    entity: "Service",
    entityId: id,
    action: "Deleted",
    detail: `Deleted service #${id}.`,
    user,
  });

  revalidatePath("/admin/services");
  redirect("/admin/services?deleted=1");
}
