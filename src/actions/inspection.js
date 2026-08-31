"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin, requireUser } from "@/lib/auth";
import { INSPECTION_STATUS } from "@/lib/status.mjs";
import {
  parseScheduledDate,
  parseAssigneeIds,
  canSubmitInspection,
} from "@/lib/validation.mjs";

export async function createInspection(formData) {
  await requireAdmin();

  const serviceRequestId = Number(formData.get("serviceRequestId"));
  const dateValue = String(formData.get("scheduledDate") ?? "").trim();
  const assigneeIds = parseAssigneeIds(formData.getAll("assigneeIds"));

  const base = `/admin/requests/${serviceRequestId}/inspections/new`;
  const parsed = parseScheduledDate(dateValue);
  if (!serviceRequestId) redirect(`/admin/requests`);
  if (parsed.error) redirect(`${base}?error=${parsed.error}`);
  if (assigneeIds.length === 0) redirect(`${base}?error=assignees`);

  // A request can only have one inspection.
  const existing = await db.inspection.findUnique({
    where: { serviceRequestId },
    select: { id: true },
  });
  if (existing) {
    redirect(`/admin/requests/${serviceRequestId}?inspection=exists`);
  }

  await db.inspection.create({
    data: {
      serviceRequestId,
      scheduledDate: parsed.date,
      status: INSPECTION_STATUS.SCHEDULED,
      assignees: { connect: assigneeIds.map((id) => ({ id })) },
    },
  });

  redirect(`/admin/requests/${serviceRequestId}?inspection=created`);
}

export async function updateInspection(formData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const serviceRequestId = Number(formData.get("serviceRequestId"));
  const dateValue = String(formData.get("scheduledDate") ?? "").trim();
  const assigneeIds = parseAssigneeIds(formData.getAll("assigneeIds"));

  const base = `/admin/requests/${serviceRequestId}/inspections/${id}/edit`;
  const parsed = parseScheduledDate(dateValue);
  if (!id || !serviceRequestId) redirect(`/admin/requests`);
  if (parsed.error) redirect(`${base}?error=${parsed.error}`);
  if (assigneeIds.length === 0) redirect(`${base}?error=assignees`);

  await db.inspection.update({
    where: { id },
    data: {
      scheduledDate: parsed.date,
      assignees: { set: assigneeIds.map((assigneeId) => ({ id: assigneeId })) },
    },
  });

  redirect(`/admin/requests/${serviceRequestId}?inspection=updated`);
}

export async function deleteInspection(formData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const serviceRequestId = Number(formData.get("serviceRequestId"));
  if (!id) redirect(`/admin/requests`);

  await db.inspection.delete({ where: { id } });

  redirect(`/admin/requests/${serviceRequestId}?inspection=deleted`);
}

// Field worker records / updates / submits inspection findings.
export async function saveFindings(formData) {
  const user = await requireUser();

  const id = Number(formData.get("id"));
  const notes = String(formData.get("notes") ?? "").trim();
  const findings = String(formData.get("findings") ?? "").trim();
  const recommendations = String(formData.get("recommendations") ?? "").trim();
  const submit = String(formData.get("submit") ?? "") === "1";

  if (!id) redirect(`/inspections`);

  const inspection = await db.inspection.findUnique({
    where: { id },
    include: { assignees: { select: { id: true } } },
  });

  const isAdmin = user.role?.name === "Admin";
  const isAssignee = inspection?.assignees.some((a) => a.id === user.id);
  if (!inspection || (!isAdmin && !isAssignee)) {
    redirect(`/inspections`);
  }

  // Submitting requires findings to have been recorded.
  if (submit && !canSubmitInspection({ findings })) {
    redirect(`/inspections/${id}?error=findings`);
  }

  await db.inspection.update({
    where: { id },
    data: {
      notes: notes || null,
      findings: findings || null,
      recommendations: recommendations || null,
      status: submit ? INSPECTION_STATUS.SUBMITTED : INSPECTION_STATUS.IN_PROGRESS,
    },
  });

  redirect(`/inspections/${id}?${submit ? "submitted=1" : "saved=1"}`);
}
