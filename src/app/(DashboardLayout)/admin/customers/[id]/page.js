import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireManagement } from "@/lib/auth";
import CustomerDetailView from "./CustomerDetailView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Details",
};

export default async function CustomerPage({ params }) {
  const user = await requireManagement();
  const canManage = user.role?.name === "Admin";

  const id = Number(params.id);
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      requests: {
        include: {
          service: true,
          requestType: true,
          inspection: true,
          appointments: true,
        },
        orderBy: { id: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const requests = customer.requests.map((r) => ({
    id: r.id,
    serviceName: r.service?.name ?? "",
    createdAt: r.createdAt?.toISOString() ?? null,
    type: r.requestType?.type ?? null,
    inspectionStatus: r.inspection?.status ?? null,
    appointmentCount: r.appointments.length,
  }));

  return (
    <CustomerDetailView
      canManage={canManage}
      requests={requests}
      customer={{
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        preferredChannel: customer.preferredChannel,
        createdAt: customer.createdAt?.toISOString() ?? null,
      }}
    />
  );
}
