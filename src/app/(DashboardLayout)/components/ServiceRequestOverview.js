"use client";
import React from "react";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Badge,
} from "reactstrap";
import { STATUS_COLORS, PAYMENT_STATUS_COLORS, DEFAULT_PAYMENT_STATUS } from "@/lib/status.mjs";

export const statusColors = STATUS_COLORS;

const InfoRow = ({ label, children, width = "38%" }) => (
  <tr className="border-top">
    <th scope="row" className="text-muted fw-normal" style={{ width }}>
      {label}
    </th>
    <td style={{ whiteSpace: "pre-wrap" }}>{children}</td>
  </tr>
);

const AssigneeBadges = ({ assignees }) =>
  !assignees || assignees.length === 0 ? (
    <span className="text-muted">Unassigned</span>
  ) : (
    assignees.map((name) => (
      <Badge key={name} color="light" className="text-dark border me-1 mb-1">
        <i className="bi bi-person me-1" />
        {name}
      </Badge>
    ))
  );

const ChangeHistory = ({ logs }) =>
  !logs || logs.length === 0 ? null : (
    <ul className="list-unstyled mb-0 small">
      {logs.map((log) => (
        <li key={log.id} className="mb-1">
          <Badge color="light" className="text-dark border me-2">
            {log.action}
          </Badge>
          {log.detail}
          <span className="text-muted">
            {" — "}
            {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
            {log.changedBy ? ` by ${log.changedBy}` : ""}
          </span>
        </li>
      ))}
    </ul>
  );

/**
 * Shared, read-only overview of a service request. Renders identically for
 * every role. Role-specific controls are injected through the optional slots:
 *  - headerActions: node shown in the hero header
 *  - workPanel: node shown prominently under the header (forms, etc.)
 *  - inspectionActions: node shown in the inspection card header
 *  - appointmentsActions: node shown in the appointments card header
 *  - renderAppointmentActions: (appt) => node for a per-row actions column
 *  - activeInspection / activeAppointmentId: highlight the item being worked on
 */
const ServiceRequestOverview = ({
  request,
  headerActions = null,
  workPanel = null,
  inspectionActions = null,
  requestTypePanel = null,
  paymentStatusPanel = null,
  showPayment = false,
  appointmentsActions = null,
  renderAppointmentActions = null,
  activeInspection = false,
  activeAppointmentId = null,
}) => {
  const customer = request.customer || {};
  const inspection = request.inspection || null;
  const appointments = request.appointments || [];
  const requestType = request.requestType || null;
  const paymentStatus = request.paymentStatus?.status || DEFAULT_PAYMENT_STATUS;
  const isJob = requestType?.type === "Job";
  const jobAppointment = isJob ? appointments[0] || null : null;
  const createdAt = request.createdAt
    ? new Date(request.createdAt).toLocaleString()
    : "-";

  return (
    <div>
      {/* Hero header */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardBody className="d-flex flex-wrap align-items-center gap-3">
          <div
            className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: 56, height: 56, flex: "0 0 56px" }}
          >
            <i className="bi bi-clipboard-check" style={{ fontSize: "1.5rem" }} />
          </div>
          <div className="me-auto">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h4 className="mb-0">Service Request #{request.id}</h4>
              <Badge color="primary" pill>
                {request.serviceName || "Service"}
              </Badge>
              {requestType ? (
                <Badge
                  color={requestType.type === "Contract" ? "success" : "info"}
                  pill
                >
                  {requestType.type}
                  {requestType.type === "Contract" &&
                  requestType.durationMonths
                    ? ` · ${requestType.durationMonths} mo`
                    : ""}
                </Badge>
              ) : null}
              {showPayment ? (
                <Badge
                  color={PAYMENT_STATUS_COLORS[paymentStatus] || "secondary"}
                  pill
                >
                  <i className="bi bi-cash-coin me-1" />
                  {paymentStatus}
                </Badge>
              ) : null}
            </div>
            <small className="text-muted">
              <i className="bi bi-person-circle me-1" />
              {customer.name || "Customer"} &middot;{" "}
              <i className="bi bi-clock-history me-1" />
              Created {createdAt}
            </small>
          </div>
          {headerActions ? (
            <div className="d-flex gap-2 flex-wrap">{headerActions}</div>
          ) : null}
        </CardBody>
      </Card>

      {/* Customer + request details */}
      <Row className="g-4">
        <Col lg="6">
          <Card className="h-100 shadow-sm">
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-person-vcard me-2" />
              Customer Information
            </CardTitle>
            <CardBody>
              <Table borderless className="align-middle mb-0">
                <tbody>
                  <InfoRow label="Name">{customer.name || "-"}</InfoRow>
                  <InfoRow label="Phone">
                    {customer.phone ? (
                      <a href={`tel:${customer.phone}`}>{customer.phone}</a>
                    ) : (
                      "-"
                    )}
                  </InfoRow>
                  <InfoRow label="Address">{customer.address || "-"}</InfoRow>
                  <InfoRow label="Preferred Contact">
                    {customer.preferredChannel ? (
                      <Badge color="info">{customer.preferredChannel}</Badge>
                    ) : (
                      "-"
                    )}
                  </InfoRow>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>

        <Col lg="6">
          <Card className="h-100 shadow-sm">
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-file-text me-2" />
              Request Details
            </CardTitle>
            <CardBody>
              <Table borderless className="align-middle mb-0">
                <tbody>
                  <InfoRow label="Service">
                    <Badge color="primary">{request.serviceName || "-"}</Badge>
                  </InfoRow>
                  <InfoRow label="Description">
                    {request.description || "-"}
                  </InfoRow>
                  <InfoRow label="Location">
                    {request.location ? (
                      <>
                        <i className="bi bi-geo-alt me-1 text-primary" />
                        {request.location}
                      </>
                    ) : (
                      "-"
                    )}
                  </InfoRow>
                  <InfoRow label="Additional Info">
                    {request.additionalInfo || "-"}
                  </InfoRow>
                  {showPayment ? (
                    <InfoRow label="Payment">
                      <Badge
                        color={
                          PAYMENT_STATUS_COLORS[paymentStatus] || "secondary"
                        }
                      >
                        {paymentStatus}
                      </Badge>
                      {request.paymentStatus?.paidAt ? (
                        <span className="text-muted">
                          {" "}
                          &middot;{" "}
                          {new Date(
                            request.paymentStatus.paidAt
                          ).toLocaleDateString()}
                        </span>
                      ) : null}
                    </InfoRow>
                  ) : null}
                  <InfoRow label="Created">{createdAt}</InfoRow>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Inspection */}
      <Card
        className={`mt-4 shadow-sm ${
          activeInspection ? "border border-primary" : ""
        }`}
      >
        <CardTitle
          tag="h6"
          className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center"
        >
          <span>
            <i className="bi bi-search me-2" />
            Inspection
          </span>
          {inspectionActions}
        </CardTitle>
        <CardBody>
          {!inspection ? (
            <p className="text-muted mb-0 py-2">
              <i className="bi bi-info-circle me-2" />
              No inspection has been scheduled for this request yet.
            </p>
          ) : (
            <Table borderless className="align-middle mb-0">
              <tbody>
                <InfoRow label="Scheduled Date">
                  {new Date(inspection.scheduledDate).toLocaleString()}
                </InfoRow>
                <InfoRow label="Status">
                  <Badge color={statusColors[inspection.status] || "secondary"}>
                    {inspection.status}
                  </Badge>
                </InfoRow>
                <InfoRow label="Assigned To">
                  <AssigneeBadges assignees={inspection.assignees} />
                </InfoRow>
                <InfoRow label="Notes">{inspection.notes || "-"}</InfoRow>
                <InfoRow label="Findings">{inspection.findings || "-"}</InfoRow>
                <InfoRow label="Recommendations">
                  {inspection.recommendations || "-"}
                </InfoRow>
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Request type classification (Job / Contract) */}
      {requestTypePanel}

      {/* Payment status (Paid / Not Paid) */}
      {paymentStatusPanel}

      {/* Appointments */}
      <Card className="mt-4 shadow-sm">
        <CardTitle
          tag="h6"
          className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center"
        >
          <span>
            <i className="bi bi-calendar-check me-2" />
            {isJob ? "Service Appointment" : "Service Appointments"}
          </span>
          {appointmentsActions}
        </CardTitle>
        <CardBody>
          {isJob ? (
            !jobAppointment ? (
              <p className="text-muted mb-0 py-2">
                <i className="bi bi-info-circle me-2" />
                No appointment has been scheduled for this job yet.
              </p>
            ) : (
              <Table borderless className="align-middle mb-0">
                <tbody>
                  <InfoRow label="Scheduled Date">
                    {new Date(jobAppointment.scheduledAt).toLocaleString()}
                  </InfoRow>
                  <InfoRow label="Status">
                    <Badge
                      color={statusColors[jobAppointment.status] || "secondary"}
                    >
                      {jobAppointment.status}
                    </Badge>
                  </InfoRow>
                  <InfoRow label="Assigned To">
                    <AssigneeBadges assignees={jobAppointment.assignees} />
                  </InfoRow>
                  <InfoRow label="Completed">
                    {jobAppointment.completedAt
                      ? new Date(jobAppointment.completedAt).toLocaleString()
                      : "-"}
                  </InfoRow>
                  <InfoRow label="Work Performed">
                    {jobAppointment.workPerformed || "-"}
                  </InfoRow>
                  <InfoRow label="Completion Notes">
                    {jobAppointment.completionNotes || "-"}
                  </InfoRow>
                  <InfoRow label="Customer Sign-off">
                    {jobAppointment.customerSignOff ? (
                      <>
                        <i className="bi bi-check-circle-fill text-success me-1" />
                        {jobAppointment.customerSignOff}
                        {jobAppointment.signedOffAt ? (
                          <span className="text-muted">
                            {" "}
                            &middot;{" "}
                            {new Date(
                              jobAppointment.signedOffAt
                            ).toLocaleString()}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      "-"
                    )}
                  </InfoRow>
                  {jobAppointment.changeLogs?.length ? (
                    <InfoRow label="Change History">
                      <ChangeHistory logs={jobAppointment.changeLogs} />
                    </InfoRow>
                  ) : null}
                </tbody>
              </Table>
            )
          ) : (
          <div className="table-responsive">
            <Table className="align-middle mb-0" borderless>
              <thead>
                <tr className="text-muted">
                  <th>Scheduled</th>
                  <th>Assigned</th>
                  <th>Status</th>
                  <th>Completed</th>
                  {renderAppointmentActions ? (
                    <th className="text-end">Actions</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr className="border-top">
                    <td
                      colSpan={renderAppointmentActions ? 5 : 4}
                      className="text-center text-muted py-3"
                    >
                      <i className="bi bi-info-circle me-2" />
                      No appointments scheduled yet.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appt) => {
                    const colCount = renderAppointmentActions ? 5 : 4;
                    const hasDetails =
                      appt.workPerformed ||
                      appt.completionNotes ||
                      appt.customerSignOff ||
                      (appt.changeLogs && appt.changeLogs.length > 0);
                    const active = activeAppointmentId === appt.id;
                    return (
                      <React.Fragment key={appt.id}>
                        <tr className={`border-top ${active ? "table-primary" : ""}`}>
                          <td>{new Date(appt.scheduledAt).toLocaleString()}</td>
                          <td>
                            <AssigneeBadges assignees={appt.assignees} />
                          </td>
                          <td>
                            <Badge
                              color={statusColors[appt.status] || "secondary"}
                            >
                              {appt.status}
                            </Badge>
                          </td>
                          <td>
                            {appt.completedAt
                              ? new Date(appt.completedAt).toLocaleString()
                              : "-"}
                          </td>
                          {renderAppointmentActions ? (
                            <td className="text-end text-nowrap">
                              {renderAppointmentActions(appt)}
                            </td>
                          ) : null}
                        </tr>
                        {hasDetails ? (
                          <tr className={active ? "table-primary" : ""}>
                            <td colSpan={colCount} className="pt-0">
                              <div className="ps-2 border-start border-3 border-success">
                                <div className="mb-1">
                                  <span className="text-muted me-2">
                                    Work Performed:
                                  </span>
                                  {appt.workPerformed || "-"}
                                </div>
                                {appt.completionNotes ? (
                                  <div style={{ whiteSpace: "pre-wrap" }}>
                                    <span className="text-muted me-2">
                                      Completion Notes:
                                    </span>
                                    {appt.completionNotes}
                                  </div>
                                ) : null}
                                {appt.customerSignOff ? (
                                  <div className="mt-1">
                                    <span className="text-muted me-2">
                                      Customer Sign-off:
                                    </span>
                                    <i className="bi bi-check-circle-fill text-success me-1" />
                                    {appt.customerSignOff}
                                    {appt.signedOffAt ? (
                                      <span className="text-muted">
                                        {" "}
                                        &middot;{" "}
                                        {new Date(
                                          appt.signedOffAt
                                        ).toLocaleString()}
                                      </span>
                                    ) : null}
                                  </div>
                                ) : null}
                                {appt.changeLogs &&
                                appt.changeLogs.length > 0 ? (
                                  <div className="mt-2">
                                    <span className="text-muted d-block mb-1">
                                      Change History:
                                    </span>
                                    <ChangeHistory logs={appt.changeLogs} />
                                  </div>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
          )}
        </CardBody>
      </Card>

      {/* Work panel (role-specific form / actions) */}
      {workPanel ? <div className="mt-4">{workPanel}</div> : null}
    </div>
  );
};

export default ServiceRequestOverview;
