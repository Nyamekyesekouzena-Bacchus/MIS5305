import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireManagement } from "@/lib/auth";
import ServiceDetailView from "./ServiceDetailView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Service Details",
};

export default async function ServicePage({ params }) {
  const user = await requireManagement();
  const canManage = user.role?.name === "Admin";

  const id = Number(params.id);
  const service = await db.service.findUnique({ where: { id } });

  if (!service) {
    notFound();
  }

  return (
    <ServiceDetailView
      canManage={canManage}
      service={{
        id: service.id,
        name: service.name,
        description: service.description,
        createdAt: service.createdAt?.toISOString() ?? null,
      }}
    />
  );
}
