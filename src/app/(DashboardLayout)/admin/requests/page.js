import { db } from "@/lib/db";
import { requireManagement } from "@/lib/auth";
import { PAYMENT_STATUS } from "@/lib/status.mjs";
import AdminRequestsView from "./AdminRequestsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Service Requests",
};

export default async function AdminRequestsPage({ searchParams }) {
  const user = await requireManagement();
  const canManage = user.role?.name === "Admin";

  const q = String(searchParams?.q ?? "").trim();
  const customerFilter = String(searchParams?.customer ?? "all");
  const paymentFilter = String(searchParams?.payment ?? "all");

  const and = [];
  if (q) {
    and.push({
      OR: [
        { description: { contains: q, mode: "insensitive" } },
        { additionalInfo: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (customerFilter && customerFilter !== "all") {
    and.push({ customerId: Number(customerFilter) });
  }
  if (paymentFilter === "paid") {
    and.push({ paymentStatus: { status: PAYMENT_STATUS.PAID } });
  } else if (paymentFilter === "unpaid") {
    // A request is unpaid when it has no payment record yet or is marked Not Paid.
    and.push({
      OR: [
        { paymentStatus: { is: null } },
        { paymentStatus: { status: PAYMENT_STATUS.NOT_PAID } },
      ],
    });
  }

  const where = and.length ? { AND: and } : {};

  const [requests, customers, services] = await Promise.all([
    db.serviceRequest.findMany({
      where,
      include: { customer: true, service: true, paymentStatus: true },
      orderBy: { id: "asc" },
    }),
    db.customer.findMany({ orderBy: { name: "asc" } }),
    db.service.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminRequestsView
      requests={requests}
      customers={customers}
      services={services}
      searchParams={searchParams}
      query={q}
      customerFilter={customerFilter}
      paymentFilter={paymentFilter}
      canManage={canManage}
    />
  );
}
