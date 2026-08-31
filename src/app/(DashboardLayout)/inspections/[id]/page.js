import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  requestOverviewInclude,
  serializeRequestOverview,
} from "@/lib/serviceRequest";
import InspectionWorkView from "./InspectionWorkView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inspection",
};

export default async function InspectionWorkPage({ params, searchParams }) {
  const user = await requireUser();

  const id = Number(params.id);
  const inspection = await db.inspection.findUnique({
    where: { id },
    include: { assignees: true },
  });

  const isAdmin = user.role?.name === "Admin";
  const isAssignee = inspection?.assignees.some((a) => a.id === user.id);

  // Only assigned field workers (or an admin) may open an inspection.
  if (!inspection || (!isAdmin && !isAssignee)) {
    redirect("/inspections");
  }

  const request = await db.serviceRequest.findUnique({
    where: { id: inspection.serviceRequestId },
    include: requestOverviewInclude,
  });

  return (
    <InspectionWorkView
      request={serializeRequestOverview(request)}
      inspection={{
        id: inspection.id,
        status: inspection.status,
        notes: inspection.notes ?? "",
        findings: inspection.findings ?? "",
        recommendations: inspection.recommendations ?? "",
      }}
      searchParams={searchParams}
    />
  );
}
