"use client";
import Link from "next/link";
import { Button, Alert } from "reactstrap";
import ServiceRequestOverview from "@/app/(DashboardLayout)/components/ServiceRequestOverview";
import DeleteInspectionButton from "./DeleteInspectionButton";
import DeleteAppointmentButton from "./DeleteAppointmentButton";
import RequestTypeForm from "./RequestTypeForm";
import PaymentStatusForm from "./PaymentStatusForm";

const inspectionMessages = {
  created: "Inspection scheduled successfully.",
  updated: "Inspection updated successfully.",
  deleted: "Inspection deleted successfully.",
  exists: "This request already has an inspection.",
};

const appointmentMessages = {
  created: "Appointment scheduled successfully.",
  updated: "Appointment updated successfully.",
  deleted: "Appointment deleted successfully.",
  job: "A job can only have one appointment. This request is classified as a Job.",
  notype:
    "Set the request type (Job or Contract) before scheduling an appointment.",
};

const typeMessages = {
  saved: "Request type saved successfully.",
  locked: "The request type can only be set after the inspection is completed.",
  invalid: "Invalid request type.",
  duration: "Please choose a valid contract length.",
};

const paymentMessages = {
  saved: "Payment status updated successfully.",
  locked:
    "The payment status can only be set after the inspection is completed.",
  invalid: "Invalid payment status.",
};

const RequestDetailView = ({ request, searchParams, canManage = true }) => {
  const inspection = request.inspection;
  const hasRequestType = Boolean(request.requestType);
  const isJob = request.requestType?.type === "Job";
  const appointments = request.appointments || [];
  const jobAppointment = isJob ? appointments[0] || null : null;
  const jobAppointmentFilled = isJob && Boolean(jobAppointment);

  const inspectionNotice = searchParams?.inspection
    ? inspectionMessages[searchParams.inspection]
    : null;
  const inspectionNoticeColor =
    searchParams?.inspection === "exists" ? "warning" : "success";
  const appointmentNotice = searchParams?.appointment
    ? appointmentMessages[searchParams.appointment]
    : null;
  const appointmentNoticeColor =
    searchParams?.appointment === "job" ||
    searchParams?.appointment === "notype"
      ? "warning"
      : "success";
  const typeNotice = searchParams?.type
    ? typeMessages[searchParams.type]
    : null;
  const typeNoticeColor = searchParams?.type === "saved" ? "success" : "warning";

  const paymentNotice = searchParams?.payment
    ? paymentMessages[searchParams.payment]
    : null;
  const paymentNoticeColor =
    searchParams?.payment === "saved" ? "success" : "warning";

  const inspectionDone = ["Submitted", "Completed"].includes(
    inspection?.status
  );

  const headerActions = (
    <>
      {canManage ? (
        <Button
          tag={Link}
          href={`/admin/requests/${request.id}/edit`}
          color="primary"
        >
          <i className="bi bi-pencil me-1" /> Edit Request
        </Button>
      ) : null}
      <Button
        tag={Link}
        href={`/admin/customers/${request.customerId}`}
        color="info"
        outline
      >
        <i className="bi bi-person me-1" /> View Customer
      </Button>
      <Button tag={Link} href="/admin/requests" color="light">
        <i className="bi bi-arrow-left me-1" /> Back
      </Button>
    </>
  );

  const inspectionActions = !canManage ? null : !inspection ? (
    <Button
      tag={Link}
      href={`/admin/requests/${request.id}/inspections/new`}
      color="primary"
      size="sm"
    >
      <i className="bi bi-plus-lg" /> Schedule Inspection
    </Button>
  ) : (
    <span className="d-flex gap-2">
      <Button
        tag={Link}
        href={`/admin/requests/${request.id}/inspections/${inspection.id}/edit`}
        color="light"
        size="sm"
      >
        <i className="bi bi-pencil" /> Edit
      </Button>
      <DeleteInspectionButton
        inspection={{ id: inspection.id, serviceRequestId: request.id }}
      />
    </span>
  );

  const appointmentsActions = !canManage ? null : !hasRequestType ? (
    <span className="text-muted small">
      <i className="bi bi-lock me-1" />
      Set the request type first
    </span>
  ) : jobAppointmentFilled ? (
    <span className="d-flex gap-2">
      <Button
        tag={Link}
        href={`/admin/requests/${request.id}/appointments/${jobAppointment.id}/edit`}
        color="light"
        size="sm"
      >
        <i className="bi bi-pencil" /> Edit
      </Button>
      <DeleteAppointmentButton
        appointment={{ id: jobAppointment.id, serviceRequestId: request.id }}
      />
    </span>
  ) : (
    <Button
      tag={Link}
      href={`/admin/requests/${request.id}/appointments/new`}
      color="primary"
      size="sm"
    >
      <i className="bi bi-plus-lg" /> Schedule Appointment
    </Button>
  );

  const renderAppointmentActions =
    !canManage || isJob
      ? null
      : (appt) => (
          <>
            <Button
              tag={Link}
              href={`/admin/requests/${request.id}/appointments/${appt.id}/edit`}
              color="light"
              size="sm"
              className="me-2"
            >
              <i className="bi bi-pencil" /> Edit
            </Button>
            <DeleteAppointmentButton
              appointment={{ id: appt.id, serviceRequestId: request.id }}
            />
          </>
        );

  return (
    <>
      {inspectionNotice ? (
        <Alert color={inspectionNoticeColor}>{inspectionNotice}</Alert>
      ) : null}
      {appointmentNotice ? (
        <Alert color={appointmentNoticeColor}>{appointmentNotice}</Alert>
      ) : null}
      {typeNotice ? <Alert color={typeNoticeColor}>{typeNotice}</Alert> : null}
      {paymentNotice ? (
        <Alert color={paymentNoticeColor}>{paymentNotice}</Alert>
      ) : null}

      <ServiceRequestOverview
        request={request}
        headerActions={headerActions}
        inspectionActions={inspectionActions}
        showPayment
        requestTypePanel={
          canManage ? (
            <RequestTypeForm request={request} inspectionDone={inspectionDone} />
          ) : null
        }
        paymentStatusPanel={
          canManage ? (
            <PaymentStatusForm
              request={request}
              inspectionDone={inspectionDone}
            />
          ) : null
        }
        appointmentsActions={appointmentsActions}
        renderAppointmentActions={renderAppointmentActions}
      />
    </>
  );
};

export default RequestDetailView;
