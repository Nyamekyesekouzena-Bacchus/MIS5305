import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import EditRequestForm from "./EditRequestForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Service Request",
};

export default async function EditRequestPage({ params, searchParams }) {
  await requireAdmin();

  const id = Number(params.id);
  const request = await db.serviceRequest.findUnique({ where: { id } });

  if (!request) {
    notFound();
  }

  const [customers, services] = await Promise.all([
    db.customer.findMany({ orderBy: { name: "asc" } }),
    db.service.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <EditRequestForm
      request={{
        id: request.id,
        customerId: request.customerId,
        serviceId: request.serviceId,
        description: request.description,
        location: request.location ?? "",
        additionalInfo: request.additionalInfo ?? "",
      }}
      customers={customers}
      services={services}
      searchParams={searchParams}
    />
  );
}
