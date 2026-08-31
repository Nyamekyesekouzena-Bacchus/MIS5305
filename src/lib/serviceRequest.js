// Turns a Prisma ServiceRequest (with customer, service, inspection.assignees
// and appointments.assignees included) into a plain, serializable object used
// by the shared <ServiceRequestOverview /> component.
export function serializeRequestOverview(request) {
  if (!request) return null;
  const fullName = (u) => `${u.firstName} ${u.lastName}`.trim();

  return {
    id: request.id,
    customerId: request.customerId,
    serviceId: request.serviceId,
    serviceName: request.service?.name ?? "",
    description: request.description ?? "",
    location: request.location ?? "",
    additionalInfo: request.additionalInfo ?? "",
    createdAt: request.createdAt ? request.createdAt.toISOString() : null,
    requestType: request.requestType
      ? {
          type: request.requestType.type,
          durationMonths: request.requestType.durationMonths ?? null,
          startDate: request.requestType.startDate
            ? request.requestType.startDate.toISOString()
            : null,
          endDate: request.requestType.endDate
            ? request.requestType.endDate.toISOString()
            : null,
        }
      : null,
    paymentStatus: request.paymentStatus
      ? {
          status: request.paymentStatus.status,
          paidAt: request.paymentStatus.paidAt
            ? request.paymentStatus.paidAt.toISOString()
            : null,
        }
      : null,
    customer: {
      id: request.customer?.id ?? request.customerId,
      name: request.customer?.name ?? "",
      phone: request.customer?.phone ?? "",
      address: request.customer?.address ?? "",
      preferredChannel: request.customer?.preferredChannel ?? "",
    },
    inspection: request.inspection
      ? {
          id: request.inspection.id,
          scheduledDate: request.inspection.scheduledDate.toISOString(),
          status: request.inspection.status,
          notes: request.inspection.notes ?? "",
          findings: request.inspection.findings ?? "",
          recommendations: request.inspection.recommendations ?? "",
          assignees: (request.inspection.assignees ?? []).map(fullName),
        }
      : null,
    appointments: (request.appointments ?? []).map((appt) => ({
      id: appt.id,
      scheduledAt: appt.scheduledAt.toISOString(),
      status: appt.status,
      completedAt: appt.completedAt ? appt.completedAt.toISOString() : null,
      workPerformed: appt.workPerformed ?? "",
      completionNotes: appt.completionNotes ?? "",
      customerSignOff: appt.customerSignOff ?? "",
      signedOffAt: appt.signedOffAt ? appt.signedOffAt.toISOString() : null,
      assignees: (appt.assignees ?? []).map(fullName),
      changeLogs: (appt.changeLogs ?? []).map((log) => ({
        id: log.id,
        action: log.action,
        detail: log.detail ?? "",
        changedBy: log.changedBy ?? "",
        createdAt: log.createdAt ? log.createdAt.toISOString() : null,
      })),
    })),
  };
}

// Standard Prisma include tree to hydrate a request for the overview.
export const requestOverviewInclude = {
  customer: true,
  service: true,
  requestType: true,
  paymentStatus: true,
  inspection: { include: { assignees: true } },
  appointments: {
    include: {
      assignees: true,
      changeLogs: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { scheduledAt: "asc" },
  },
};
