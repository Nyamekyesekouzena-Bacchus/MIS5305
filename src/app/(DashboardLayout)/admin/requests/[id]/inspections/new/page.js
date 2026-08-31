import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import NewInspectionForm from "./NewInspectionForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Schedule Inspection",
};

export default async function NewInspectionPage({ params, searchParams }) {
  await requireAdmin();

  const serviceRequestId = Number(params.id);
  const request = await db.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { customer: true, service: true, inspection: true },
  });

  if (!request) {
    notFound();
  }

  // A request can only have one inspection — send back if one already exists.
  if (request.inspection) {
    redirect(`/admin/requests/${serviceRequestId}?inspection=exists`);
  }

  const fieldWorkers = await db.user.findMany({
    where: { deletedAt: null, role: { name: "Field Worker" } },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <NewInspectionForm
      request={{
        id: request.id,
        customerName: request.customer?.name ?? "",
        serviceName: request.service?.name ?? "",
      }}
      fieldWorkers={fieldWorkers.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        username: u.username,
      }))}
      minDate={today.toISOString().slice(0, 10)}
      searchParams={searchParams}
    />
  );
}
