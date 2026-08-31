"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

function parseRequest(formData) {
  return {
    customerId: Number(formData.get("customerId")),
    serviceId: Number(formData.get("serviceId")),
    description: String(formData.get("description") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    additionalInfo: String(formData.get("additionalInfo") ?? "").trim(),
  };
}

export async function createRequest(formData) {
  const user = await requireAdmin();

  const { customerId, serviceId, description, location, additionalInfo } =
    parseRequest(formData);

  if (!customerId || !serviceId || !description || !location) {
    redirect("/admin/requests?error=missing");
  }

  const created = await db.serviceRequest.create({
    data: {
      customerId,
      serviceId,
      description,
      location,
      additionalInfo: additionalInfo || null,
    },
  });

  await recordAudit({
    entity: "ServiceRequest",
    entityId: created.id,
    action: "Created",
    detail: `Created service request #${created.id}.`,
    user,
  });

  revalidatePath("/admin/requests");
  redirect("/admin/requests?created=1");
}

export async function updateRequest(formData) {
  const user = await requireAdmin();

  const id = Number(formData.get("id"));
  const { customerId, serviceId, description, location, additionalInfo } =
    parseRequest(formData);

  if (!id || !customerId || !serviceId || !description || !location) {
    redirect(`/admin/requests/${id}/edit?error=missing`);
  }

  await db.serviceRequest.update({
    where: { id },
    data: {
      customerId,
      serviceId,
      description,
      location,
      additionalInfo: additionalInfo || null,
    },
  });

  await recordAudit({
    entity: "ServiceRequest",
    entityId: id,
    action: "Updated",
    detail: `Updated service request #${id}.`,
    user,
  });

  revalidatePath("/admin/requests");
  redirect("/admin/requests?updated=1");
}

export async function deleteRequest(formData) {
  const user = await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id) {
    redirect("/admin/requests?error=missing");
  }

  await db.serviceRequest.delete({ where: { id } });

  await recordAudit({
    entity: "ServiceRequest",
    entityId: id,
    action: "Deleted",
    detail: `Deleted service request #${id}.`,
    user,
  });

  revalidatePath("/admin/requests");
  redirect("/admin/requests?deleted=1");
}
