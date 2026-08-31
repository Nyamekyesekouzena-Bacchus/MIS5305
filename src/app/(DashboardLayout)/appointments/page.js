import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import AppointmentsListView from "./AppointmentsListView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Appointments",
};

export default async function MyAppointmentsPage() {
  const user = await requireUser();

  const appointments = await db.appointment.findMany({
    where: { assignees: { some: { id: user.id } } },
    include: {
      serviceRequest: { include: { customer: true, service: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <AppointmentsListView
      userName={`${user.firstName} ${user.lastName}`}
      appointments={appointments.map((appt) => ({
        id: appt.id,
        scheduledAt: appt.scheduledAt.toISOString(),
        status: appt.status,
        completedAt: appt.completedAt ? appt.completedAt.toISOString() : null,
        customerName: appt.serviceRequest?.customer?.name ?? "",
        serviceName: appt.serviceRequest?.service?.name ?? "",
      }))}
    />
  );
}
