import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  requestOverviewInclude,
  serializeRequestOverview,
} from "@/lib/serviceRequest";
import AppointmentWorkView from "./AppointmentWorkView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Appointment",
};

function toLocalInput(date) {
  const off = date.getTimezoneOffset();
  return new Date(date.getTime() - off * 60000).toISOString().slice(0, 16);
}

export default async function AppointmentWorkPage({ params, searchParams }) {
  const user = await requireUser();

  const id = Number(params.id);
  const appointment = await db.appointment.findUnique({
    where: { id },
    include: { assignees: true },
  });

  const isAdmin = user.role?.name === "Admin";
  const isAssignee = appointment?.assignees.some((a) => a.id === user.id);

  // Only assigned field workers (or an admin) may open an appointment.
  if (!appointment || (!isAdmin && !isAssignee)) {
    redirect("/appointments");
  }

  const [request, services] = await Promise.all([
    db.serviceRequest.findUnique({
      where: { id: appointment.serviceRequestId },
      include: requestOverviewInclude,
    }),
    db.service.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const nowLocal = toLocalInput(new Date());

  return (
    <AppointmentWorkView
      request={serializeRequestOverview(request)}
      appointment={{
        id: appointment.id,
        status: appointment.status,
        workPerformed: appointment.workPerformed ?? "",
        completionNotes: appointment.completionNotes ?? "",
        customerSignOff: appointment.customerSignOff ?? "",
        completedAt: appointment.completedAt
          ? toLocalInput(appointment.completedAt)
          : nowLocal,
      }}
      services={services}
      searchParams={searchParams}
    />
  );
}
