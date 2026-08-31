import { db } from "@/lib/db";
import { requireManagement } from "@/lib/auth";
import AdminServicesView from "./AdminServicesView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Service Management",
};

export default async function AdminServicesPage({ searchParams }) {
  const user = await requireManagement();
  const canManage = user.role?.name === "Admin";

  const q = String(searchParams?.q ?? "").trim();

  const where = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const services = await db.service.findMany({
    where,
    orderBy: { id: "asc" },
  });

  return (
    <AdminServicesView
      services={services}
      searchParams={searchParams}
      query={q}
      canManage={canManage}
    />
  );
}
