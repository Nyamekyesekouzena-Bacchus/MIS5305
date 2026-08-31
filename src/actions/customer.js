"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { CONTACT_CHANNELS } from "@/lib/customerChannels";

function parseCustomer(formData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    preferredChannel: String(formData.get("preferredChannel") ?? "").trim(),
  };
}

export async function createCustomer(formData) {
  const user = await requireAdmin();

  const { name, phone, address, preferredChannel } = parseCustomer(formData);

  if (!name || !phone || !address || !preferredChannel) {
    redirect("/admin/customers?error=missing");
  }
  if (!CONTACT_CHANNELS.includes(preferredChannel)) {
    redirect("/admin/customers?error=channel");
  }

  const existingPhone = await db.customer.findUnique({ where: { phone } });
  if (existingPhone) {
    redirect("/admin/customers?error=phone");
  }

  const created = await db.customer.create({
    data: { name, phone, address, preferredChannel },
  });

  await recordAudit({
    entity: "Customer",
    entityId: created.id,
    action: "Created",
    detail: `Created customer "${name}".`,
    user,
  });

  revalidatePath("/admin/customers");
  redirect("/admin/customers?created=1");
}

export async function updateCustomer(formData) {
  const user = await requireAdmin();

  const id = Number(formData.get("id"));
  const { name, phone, address, preferredChannel } = parseCustomer(formData);

  if (!id || !name || !phone || !address || !preferredChannel) {
    redirect(`/admin/customers/${id}/edit?error=missing`);
  }
  if (!CONTACT_CHANNELS.includes(preferredChannel)) {
    redirect(`/admin/customers/${id}/edit?error=channel`);
  }

  const existingPhone = await db.customer.findUnique({ where: { phone } });
  if (existingPhone && existingPhone.id !== id) {
    redirect(`/admin/customers/${id}/edit?error=phone`);
  }

  await db.customer.update({
    where: { id },
    data: { name, phone, address, preferredChannel },
  });

  await recordAudit({
    entity: "Customer",
    entityId: id,
    action: "Updated",
    detail: `Updated customer "${name}".`,
    user,
  });

  revalidatePath("/admin/customers");
  redirect("/admin/customers?updated=1");
}

export async function deleteCustomer(formData) {
  const user = await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id) {
    redirect("/admin/customers?error=missing");
  }

  await db.customer.delete({ where: { id } });

  await recordAudit({
    entity: "Customer",
    entityId: id,
    action: "Deleted",
    detail: `Deleted customer #${id}.`,
    user,
  });

  revalidatePath("/admin/customers");
  redirect("/admin/customers?deleted=1");
}
