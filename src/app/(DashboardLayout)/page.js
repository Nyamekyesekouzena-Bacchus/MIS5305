import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PAYMENT_STATUS } from "@/lib/status.mjs";
import DashboardView from "@/app/(DashboardLayout)/components/dashboard/DashboardView";

export const dynamic = "force-dynamic";

// An inspection is considered "done" once it has been submitted or completed.
const DONE_INSPECTION = ["Submitted", "Completed"];

export default async function Home() {
  const user = await requireUser();
  const roleName = user.role?.name ?? "";
  // Admin and Manager see the overall picture; everyone else is "field staff"
  // and only sees what they were assigned to.
  const isFieldStaff = roleName !== "Admin" && roleName !== "Manager";

  const assignedToMe = { assignees: { some: { id: user.id } } };
  const inspectionWhere = isFieldStaff ? assignedToMe : {};
  const appointmentWhere = isFieldStaff ? assignedToMe : {};

  const [inspections, appointments, requestCount] = await Promise.all([
    db.inspection.findMany({
      where: inspectionWhere,
      include: {
        assignees: true,
        serviceRequest: { include: { customer: true, service: true } },
      },
      orderBy: { scheduledDate: "asc" },
    }),
    db.appointment.findMany({
      where: appointmentWhere,
      include: {
        assignees: true,
        serviceRequest: { include: { customer: true, service: true } },
      },
      orderBy: { scheduledAt: "asc" },
    }),
    isFieldStaff
      ? db.serviceRequest.count({
          where: {
            OR: [
              { inspection: assignedToMe },
              { appointments: { some: assignedToMe } },
            ],
          },
        })
      : db.serviceRequest.count(),
  ]);

  // Management dashboards include an overall breakdown of classified requests
  // (jobs vs contracts). Field staff dashboards do not.
  let typeStats = null;
  let paymentStats = null;
  if (!isFieldStaff) {
    const [jobs, contracts, paid, unpaid] = await Promise.all([
      db.requestType.count({ where: { type: "Job" } }),
      db.requestType.count({ where: { type: "Contract" } }),
      db.paymentStatus.count({ where: { status: PAYMENT_STATUS.PAID } }),
      db.serviceRequest.count({
        where: {
          OR: [
            { paymentStatus: { is: null } },
            { paymentStatus: { status: PAYMENT_STATUS.NOT_PAID } },
          ],
        },
      }),
    ]);
    typeStats = { jobs, contracts };
    paymentStats = { paid, unpaid };
  }

  const now = Date.now();

  const mapInspection = (i) => {
    const done = DONE_INSPECTION.includes(i.status);
    return {
      id: i.id,
      requestId: i.serviceRequestId,
      scheduledDate: i.scheduledDate.toISOString(),
      status: i.status,
      done,
      overdue: !done && i.scheduledDate.getTime() < now,
      customerName: i.serviceRequest?.customer?.name ?? "",
      serviceName: i.serviceRequest?.service?.name ?? "",
      assignees: i.assignees.map((a) => `${a.firstName} ${a.lastName}`),
    };
  };

  const mapAppointment = (a) => {
    const done = a.status === "Completed";
    return {
      id: a.id,
      requestId: a.serviceRequestId,
      scheduledAt: a.scheduledAt.toISOString(),
      status: a.status,
      done,
      overdue: !done && a.scheduledAt.getTime() < now,
      customerName: a.serviceRequest?.customer?.name ?? "",
      serviceName: a.serviceRequest?.service?.name ?? "",
      assignees: a.assignees.map((x) => `${x.firstName} ${x.lastName}`),
    };
  };

  const insp = inspections.map(mapInspection);
  const appt = appointments.map(mapAppointment);

  const inspectionStats = {
    total: insp.length,
    open: insp.filter((i) => !i.done).length,
    completed: insp.filter((i) => i.done).length,
    overdue: insp.filter((i) => i.overdue).length,
  };
  const appointmentStats = {
    total: appt.length,
    open: appt.filter((a) => !a.done).length,
    completed: appt.filter((a) => a.done).length,
    overdue: appt.filter((a) => a.overdue).length,
  };

  // Upcoming = still open, ordered by soonest first.
  const upcomingInspections = insp.filter((i) => !i.done).slice(0, 5);
  const upcomingAppointments = appt.filter((a) => !a.done).slice(0, 5);
  const overdueInspections = insp.filter((i) => i.overdue);
  const overdueAppointments = appt.filter((a) => a.overdue);

  return (
    <DashboardView
      userName={`${user.firstName} ${user.lastName}`.trim() || user.username}
      roleName={roleName || "User"}
      isFieldStaff={isFieldStaff}
      requestCount={requestCount}
      typeStats={typeStats}
      paymentStats={paymentStats}
      inspectionStats={inspectionStats}
      appointmentStats={appointmentStats}
      upcomingInspections={upcomingInspections}
      upcomingAppointments={upcomingAppointments}
      overdueInspections={overdueInspections}
      overdueAppointments={overdueAppointments}
    />
  );
}
