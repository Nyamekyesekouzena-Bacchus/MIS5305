"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { REQUEST_TYPE } from "@/lib/status.mjs";
import {
  isInspectionDone,
  validateRequestType,
  contractEndDate,
} from "@/lib/validation.mjs";

// Admin classifies a service request as a "Job" (single appointment) or a
// "Contract" (recurring appointments over a number of months). Only allowed
// once the request's inspection has been completed.
export async function setRequestType(formData) {
  await requireAdmin();

  const serviceRequestId = Number(formData.get("serviceRequestId"));
  const type = String(formData.get("type") ?? "").trim();
  const durationMonths = Number(formData.get("durationMonths"));
  const startValue = String(formData.get("startDate") ?? "").trim();

  if (!serviceRequestId) redirect("/admin/requests");
  const base = `/admin/requests/${serviceRequestId}`;

  const request = await db.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { inspection: true },
  });
  if (!request) redirect("/admin/requests");

  const inspectionDone = isInspectionDone(request.inspection?.status);
  const result = validateRequestType({ type, durationMonths, inspectionDone });
  if (result.error) redirect(`${base}?type=${result.error}`);

  let data = { type: result.type, durationMonths: null, startDate: null, endDate: null };

  if (result.type === REQUEST_TYPE.CONTRACT) {
    const start = startValue ? new Date(startValue) : new Date();
    if (Number.isNaN(start.getTime())) redirect(`${base}?type=invalid`);
    data = {
      type: result.type,
      durationMonths: result.durationMonths,
      startDate: start,
      endDate: contractEndDate(start, result.durationMonths),
    };
  }

  await db.requestType.upsert({
    where: { serviceRequestId },
    create: { serviceRequestId, ...data },
    update: data,
  });

  redirect(`${base}?type=saved`);
}
