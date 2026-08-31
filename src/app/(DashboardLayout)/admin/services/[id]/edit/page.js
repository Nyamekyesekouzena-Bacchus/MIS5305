import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import EditServiceForm from "./EditServiceForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Service",
};

export default async function EditServicePage({ params, searchParams }) {
  await requireAdmin();

  const id = Number(params.id);
  const service = await db.service.findUnique({ where: { id } });

  if (!service) {
    notFound();
  }

  return (
    <EditServiceForm
      service={{
        id: service.id,
        name: service.name,
        description: service.description,
      }}
      searchParams={searchParams}
    />
  );
}
