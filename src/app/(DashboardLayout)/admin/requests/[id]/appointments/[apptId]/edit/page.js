import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import EditAppointmentForm from "./EditAppointmentForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Appointment",
};

function localMin() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

function toLocalInput(date) {
  const off = date.getTimezoneOffset();
  return new Date(date.getTime() - off * 60000).toISOString().slice(0, 16);
}

export default async function EditAppointmentPage({ params, searchParams }) {
  await requireAdmin();

  const serviceRequestId = Number(params.id);
  const appointmentId = Number(params.apptId);

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      assignees: { select: { id: true } },
      serviceRequest: { include: { customer: true, service: true } },
    },
  });

  if (!appointment || appointment.serviceRequestId !== serviceRequestId) {
    notFound();
  }

  const fieldWorkers = await db.user.findMany({
    where: { deletedAt: null, role: { name: "Field Worker" } },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  const assignedIds = appointment.assignees.map((a) => a.id);

  return (
    <EditAppointmentForm
      appointment={{
        id: appointment.id,
        serviceRequestId: appointment.serviceRequestId,
        scheduledAt: toLocalInput(appointment.scheduledAt),
        customerName: appointment.serviceRequest?.customer?.name ?? "",
        serviceName: appointment.serviceRequest?.service?.name ?? "",
      }}
      fieldWorkers={fieldWorkers.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        username: u.username,
        assigned: assignedIds.includes(u.id),
      }))}
      minDate={localMin()}
      searchParams={searchParams}
    />
  );
}
