import { db } from "@/lib/db";
import { requireManager } from "@/lib/auth";
import {
  DONE_INSPECTION_STATUSES,
  APPOINTMENT_STATUS,
  REQUEST_TYPE,
  PAYMENT_STATUS,
} from "@/lib/status.mjs";
import ReportsView from "./ReportsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Operational Reports",
};

// Parse a YYYY-MM-DD value; returns null when missing/invalid.
function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default async function ReportsPage({ searchParams }) {
  await requireManager();

  // Default range: last 30 days through today.
  const today = new Date();
  const defaultTo = today.toISOString().slice(0, 10);
  const defaultFromDate = new Date(today);
  defaultFromDate.setDate(defaultFromDate.getDate() - 30);
  const defaultFrom = defaultFromDate.toISOString().slice(0, 10);

  const fromStr = searchParams?.from || defaultFrom;
  const toStr = searchParams?.to || defaultTo;

  const from = parseDate(fromStr);
  // Include the entire "to" day (up to 23:59:59.999).
  const toParsed = parseDate(toStr);
  const to = toParsed ? new Date(toParsed.getTime()) : null;
  if (to) to.setHours(23, 59, 59, 999);

  const rangeValid = from && to && from <= to;
  const inRange = rangeValid ? { gte: from, lte: to } : undefined;

  // When the range is invalid we render zeros and let the view show a message.
  const [
    requestsCreated,
    requestsAssigned,
    requestsCompleted,
    inspectionsScheduled,
    inspectionsCompleted,
    appointmentsScheduled,
    appointmentsCompleted,
    jobsClassified,
    contractsClassified,
    paymentsReceived,
    requestsUnpaid,
    completedJobs,
  ] = rangeValid
    ? await Promise.all([
        // Service requests created within the range.
        db.serviceRequest.count({ where: { createdAt: inRange } }),
        // Requests that had staff assigned (an inspection or appointment created in range).
        db.serviceRequest.count({
          where: {
            OR: [
              { inspection: { createdAt: inRange } },
              { appointments: { some: { createdAt: inRange } } },
            ],
          },
        }),
        // Requests with a completed appointment in range (job done).
        db.serviceRequest.count({
          where: {
            appointments: {
              some: { status: APPOINTMENT_STATUS.COMPLETED, completedAt: inRange },
            },
          },
        }),
        // Inspections scheduled to happen in the range.
        db.inspection.count({ where: { scheduledDate: inRange } }),
        // Inspections submitted/completed (updated) in the range.
        db.inspection.count({
          where: { status: { in: DONE_INSPECTION_STATUSES }, updatedAt: inRange },
        }),
        // Appointments scheduled in the range.
        db.appointment.count({ where: { scheduledAt: inRange } }),
        // Appointments completed in the range.
        db.appointment.count({
          where: { status: APPOINTMENT_STATUS.COMPLETED, completedAt: inRange },
        }),
        // Requests classified as jobs / contracts in the range.
        db.requestType.count({ where: { type: REQUEST_TYPE.JOB, createdAt: inRange } }),
        db.requestType.count({
          where: { type: REQUEST_TYPE.CONTRACT, createdAt: inRange },
        }),
        // Payments received (marked paid) in the range.
        db.paymentStatus.count({
          where: { status: PAYMENT_STATUS.PAID, paidAt: inRange },
        }),
        // Requests created in the range that remain unpaid.
        db.serviceRequest.count({
          where: {
            createdAt: inRange,
            OR: [
              { paymentStatus: { is: null } },
              { paymentStatus: { status: PAYMENT_STATUS.NOT_PAID } },
            ],
          },
        }),
        // Completed jobs (list) for the range.
        db.appointment.findMany({
          where: { status: APPOINTMENT_STATUS.COMPLETED, completedAt: inRange },
          include: {
            assignees: true,
            serviceRequest: { include: { customer: true, service: true } },
          },
          orderBy: { completedAt: "desc" },
        }),
      ])
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, []];

  const jobs = (completedJobs || []).map((a) => ({
    id: a.id,
    requestId: a.serviceRequestId,
    completedAt: a.completedAt ? a.completedAt.toISOString() : null,
    workPerformed: a.workPerformed ?? "",
    customerName: a.serviceRequest?.customer?.name ?? "",
    serviceName: a.serviceRequest?.service?.name ?? "",
    assignees: a.assignees.map((x) => `${x.firstName} ${x.lastName}`),
  }));

  return (
    <ReportsView
      from={fromStr}
      to={toStr}
      rangeValid={rangeValid}
      requestStats={{
        created: requestsCreated,
        assigned: requestsAssigned,
        completed: requestsCompleted,
      }}
      inspectionStats={{
        scheduled: inspectionsScheduled,
        completed: inspectionsCompleted,
      }}
      appointmentStats={{
        scheduled: appointmentsScheduled,
        completed: appointmentsCompleted,
      }}
      typeStats={{
        jobs: jobsClassified,
        contracts: contractsClassified,
      }}
      paymentStats={{
        paid: paymentsReceived,
        unpaid: requestsUnpaid,
      }}
      completedJobs={jobs}
    />
  );
}
