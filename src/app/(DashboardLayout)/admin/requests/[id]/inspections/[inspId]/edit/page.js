import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import EditInspectionForm from "./EditInspectionForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Inspection",
};

export default async function EditInspectionPage({ params, searchParams }) {
  await requireAdmin();

  const serviceRequestId = Number(params.id);
  const inspectionId = Number(params.inspId);

  const inspection = await db.inspection.findUnique({
    where: { id: inspectionId },
    include: {
      assignees: { select: { id: true } },
      serviceRequest: { include: { customer: true, service: true } },
    },
  });

  if (!inspection || inspection.serviceRequestId !== serviceRequestId) {
    notFound();
  }

  const fieldWorkers = await db.user.findMany({
    where: { deletedAt: null, role: { name: "Field Worker" } },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const assignedIds = inspection.assignees.map((a) => a.id);

  return (
    <EditInspectionForm
      inspection={{
        id: inspection.id,
        serviceRequestId: inspection.serviceRequestId,
        scheduledDate: inspection.scheduledDate.toISOString().slice(0, 10),
        customerName: inspection.serviceRequest?.customer?.name ?? "",
        serviceName: inspection.serviceRequest?.service?.name ?? "",
      }}
      fieldWorkers={fieldWorkers.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        username: u.username,
        assigned: assignedIds.includes(u.id),
      }))}
      minDate={today.toISOString().slice(0, 10)}
      searchParams={searchParams}
    />
  );
}
