"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin, requireUser } from "@/lib/auth";
import { APPOINTMENT_STATUS } from "@/lib/status.mjs";
import {
  parseScheduledAt,
  parseAssigneeIds,
  canScheduleAppointment,
  canCompleteJob,
} from "@/lib/validation.mjs";

// Human-readable name for the acting user, used in the change log.
function actorName(user) {
  const full = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return full || user.username || "Unknown";
}

export async function createAppointment(formData) {
  const user = await requireAdmin();

  const serviceRequestId = Number(formData.get("serviceRequestId"));
  const scheduledValue = String(formData.get("scheduledAt") ?? "").trim();
  const assigneeIds = parseAssigneeIds(formData.getAll("assigneeIds"));

  const base = `/admin/requests/${serviceRequestId}/appointments/new`;
  const parsed = parseScheduledAt(scheduledValue);
  if (!serviceRequestId) redirect(`/admin/requests`);
  if (parsed.error) redirect(`${base}?error=${parsed.error}`);
  if (assigneeIds.length === 0) redirect(`${base}?error=assignees`);

  // A request must be classified (Job/Contract) before scheduling, and a Job
  // may hold only one appointment (see canScheduleAppointment).
  const requestType = await db.requestType.findUnique({
    where: { serviceRequestId },
  });
  const existingCount =
    requestType?.type === "Job"
      ? await db.appointment.count({ where: { serviceRequestId } })
      : 0;
  const gate = canScheduleAppointment({ requestType, existingCount });
  if (!gate.ok) {
    redirect(`/admin/requests/${serviceRequestId}?appointment=${gate.reason}`);
  }

  await db.appointment.create({
    data: {
      serviceRequestId,
      scheduledAt: parsed.date,
      status: APPOINTMENT_STATUS.SCHEDULED,
      assignees: { connect: assigneeIds.map((id) => ({ id })) },
      changeLogs: {
        create: {
          action: "Scheduled",
          detail: `Appointment scheduled for ${parsed.date.toLocaleString()}.`,
          changedBy: actorName(user),
        },
      },
    },
  });

  redirect(`/admin/requests/${serviceRequestId}?appointment=created`);
}

export async function updateAppointment(formData) {
  const user = await requireAdmin();

  const id = Number(formData.get("id"));
  const serviceRequestId = Number(formData.get("serviceRequestId"));
  const scheduledValue = String(formData.get("scheduledAt") ?? "").trim();
  const assigneeIds = parseAssigneeIds(formData.getAll("assigneeIds"));

  const base = `/admin/requests/${serviceRequestId}/appointments/${id}/edit`;
  const parsed = parseScheduledAt(scheduledValue);
  if (!id || !serviceRequestId) redirect(`/admin/requests`);
  if (parsed.error) redirect(`${base}?error=${parsed.error}`);
  if (assigneeIds.length === 0) redirect(`${base}?error=assignees`);

  // Capture the previous state so we can log exactly what changed.
  const previous = await db.appointment.findUnique({
    where: { id },
    include: { assignees: { select: { id: true, firstName: true, lastName: true } } },
  });
  if (!previous) redirect(`/admin/requests`);

  const changes = [];
  if (previous.scheduledAt.getTime() !== parsed.date.getTime()) {
    changes.push(
      `Rescheduled from ${previous.scheduledAt.toLocaleString()} to ${parsed.date.toLocaleString()}.`
    );
  }
  const prevIds = previous.assignees.map((a) => a.id).sort();
  const nextIds = [...assigneeIds].sort();
  if (JSON.stringify(prevIds) !== JSON.stringify(nextIds)) {
    changes.push("Assigned field workers updated.");
  }

  await db.appointment.update({
    where: { id },
    data: {
      scheduledAt: parsed.date,
      assignees: { set: assigneeIds.map((assigneeId) => ({ id: assigneeId })) },
      ...(changes.length > 0
        ? {
            changeLogs: {
              create: {
                action: "Updated",
                detail: changes.join(" "),
                changedBy: actorName(user),
              },
            },
          }
        : {}),
    },
  });

  redirect(`/admin/requests/${serviceRequestId}?appointment=updated`);
}

export async function deleteAppointment(formData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const serviceRequestId = Number(formData.get("serviceRequestId"));
  if (!id) redirect(`/admin/requests`);

  await db.appointment.delete({ where: { id } });

  redirect(`/admin/requests/${serviceRequestId}?appointment=deleted`);
}

// Field worker records / submits job completion for an appointment.
export async function completeAppointment(formData) {
  const user = await requireUser();

  const id = Number(formData.get("id"));
  const serviceId = Number(formData.get("serviceId"));
  const completionNotes = String(formData.get("completionNotes") ?? "").trim();
  const customerSignOff = String(formData.get("customerSignOff") ?? "").trim();
  const submit = String(formData.get("submit") ?? "") === "1";

  if (!id) redirect(`/appointments`);

  const appointment = await db.appointment.findUnique({
    where: { id },
    include: {
      assignees: { select: { id: true } },
      serviceRequest: { include: { service: true } },
    },
  });

  const isAdmin = user.role?.name === "Admin";
  const isAssignee = appointment?.assignees.some((a) => a.id === user.id);
  if (!appointment || (!isAdmin && !isAssignee)) {
    redirect(`/appointments`);
  }

  // Marking a job as completed requires the customer's sign-off.
  if (submit && !canCompleteJob({ customerSignOff })) {
    redirect(`/appointments/${id}?error=signoff`);
  }

  // Work performed is the selected service (defaults to the request's service).
  let workPerformed = appointment.serviceRequest?.service?.name || null;
  if (Number.isInteger(serviceId) && serviceId > 0) {
    const service = await db.service.findUnique({ where: { id: serviceId } });
    if (service) workPerformed = service.name;
  }

  await db.appointment.update({
    where: { id },
    data: {
      workPerformed,
      completionNotes: completionNotes || null,
      customerSignOff: customerSignOff || null,
      // Completion date/time is captured automatically when marked completed.
      completedAt: submit ? new Date() : appointment.completedAt,
      signedOffAt: submit && customerSignOff ? new Date() : appointment.signedOffAt,
      status: submit ? APPOINTMENT_STATUS.COMPLETED : APPOINTMENT_STATUS.IN_PROGRESS,
      changeLogs: {
        create: {
          action: submit ? "Completed" : "Progress saved",
          detail: submit
            ? `Job completed. Signed off by ${customerSignOff}.`
            : "Completion progress saved.",
          changedBy: actorName(user),
        },
      },
    },
  });

  redirect(`/appointments/${id}?${submit ? "completed=1" : "saved=1"}`);
}
