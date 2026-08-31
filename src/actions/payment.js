"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PAYMENT_STATUS } from "@/lib/status.mjs";
import { isInspectionDone, validatePaymentStatus } from "@/lib/validation.mjs";
import { recordAudit } from "@/lib/audit";

// Admin records whether a service request has been paid. Only allowed once the
// request's inspection has been completed (the payment is settled afterwards).
export async function setPaymentStatus(formData) {
  const user = await requireAdmin();

  const serviceRequestId = Number(formData.get("serviceRequestId"));
  const status = String(formData.get("status") ?? "").trim();

  if (!serviceRequestId) redirect("/admin/requests");
  const base = `/admin/requests/${serviceRequestId}`;

  const request = await db.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { inspection: true },
  });
  if (!request) redirect("/admin/requests");

  const inspectionDone = isInspectionDone(request.inspection?.status);
  const result = validatePaymentStatus({ status, inspectionDone });
  if (result.error) redirect(`${base}?payment=${result.error}`);

  const paid = result.status === PAYMENT_STATUS.PAID;
  const data = { status: result.status, paidAt: paid ? new Date() : null };

  await db.paymentStatus.upsert({
    where: { serviceRequestId },
    create: { serviceRequestId, ...data },
    update: data,
  });

  await recordAudit({
    entity: "ServiceRequest",
    entityId: serviceRequestId,
    action: "Payment updated",
    detail: `Marked payment as "${result.status}".`,
    user,
  });

  redirect(`${base}?payment=saved`);
}
