import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import EditCustomerForm from "./EditCustomerForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Customer",
};

export default async function EditCustomerPage({ params, searchParams }) {
  await requireAdmin();

  const id = Number(params.id);
  const customer = await db.customer.findUnique({ where: { id } });

  if (!customer) {
    notFound();
  }

  return (
    <EditCustomerForm
      customer={{
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        preferredChannel: customer.preferredChannel,
      }}
      searchParams={searchParams}
    />
  );
}
