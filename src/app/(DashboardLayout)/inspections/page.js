import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import InspectionsListView from "./InspectionsListView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Inspections",
};

export default async function MyInspectionsPage() {
  const user = await requireUser();

  const inspections = await db.inspection.findMany({
    where: { assignees: { some: { id: user.id } } },
    include: {
      serviceRequest: { include: { customer: true, service: true } },
    },
    orderBy: { scheduledDate: "asc" },
  });

  return (
    <InspectionsListView
      userName={`${user.firstName} ${user.lastName}`}
      inspections={inspections.map((ins) => ({
        id: ins.id,
        scheduledDate: ins.scheduledDate.toISOString(),
        status: ins.status,
        customerName: ins.serviceRequest?.customer?.name ?? "",
        serviceName: ins.serviceRequest?.service?.name ?? "",
        requestId: ins.serviceRequestId,
      }))}
    />
  );
}
