import { db } from "@/lib/db";
import { requireManagement } from "@/lib/auth";
import AdminCustomersView from "./AdminCustomersView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Management",
};

export default async function AdminCustomersPage({ searchParams }) {
  const user = await requireManagement();
  const canManage = user.role?.name === "Admin";

  const q = String(searchParams?.q ?? "").trim();

  const where = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
    ];
  }

  const customers = await db.customer.findMany({
    where,
    orderBy: { id: "asc" },
  });

  return (
    <AdminCustomersView
      customers={customers}
      searchParams={searchParams}
      query={q}
      canManage={canManage}
    />
  );
}
