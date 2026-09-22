import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import NewAppointmentForm from "./NewAppointmentForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Schedule Appointment",
};

function localMin() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export default async function NewAppointmentPage({ params, searchParams }) {
  await requireAdmin();

  const serviceRequestId = Number(params.id);
  const request = await db.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { customer: true, service: true },
  });

  if (!request) {
    notFound();
  }

  const fieldWorkers = await db.user.findMany({
    where: { deletedAt: null, role: { name: "Field Worker" } },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  return (
    <NewAppointmentForm
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
      minDate={localMin()}
      searchParams={searchParams}
    />
  );
}
