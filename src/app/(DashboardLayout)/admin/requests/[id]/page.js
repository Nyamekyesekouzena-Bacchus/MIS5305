import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireManagement } from "@/lib/auth";
import {
  requestOverviewInclude,
  serializeRequestOverview,
} from "@/lib/serviceRequest";
import RequestDetailView from "./RequestDetailView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Service Request Details",
};

export default async function RequestPage({ params, searchParams }) {
  const user = await requireManagement();
  const canManage = user.role?.name === "Admin";

  const id = Number(params.id);
  const request = await db.serviceRequest.findUnique({
    where: { id },
    include: requestOverviewInclude,
  });

  if (!request) {
    notFound();
  }

  return (
    <RequestDetailView
      request={serializeRequestOverview(request)}
      searchParams={searchParams}
      canManage={canManage}
    />
  );
}

