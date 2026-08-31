"use client";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Badge,
  Alert,
} from "reactstrap";
import { STATUS_COLORS } from "@/lib/status.mjs";

const inspectionStatusColors = STATUS_COLORS;
const appointmentStatusColors = STATUS_COLORS;

const StatCard = ({ label, value, color = "primary", icon }) => (
  <Card className="h-100">
    <CardBody className="d-flex align-items-center">
      <div
        className={`bg-${color} text-white rounded-circle d-flex align-items-center justify-content-center me-3`}
        style={{ width: 48, height: 48, flex: "0 0 48px" }}
      >
        <i className={`bi ${icon}`} style={{ fontSize: "1.25rem" }} />
      </div>
      <div>
        <h4 className="mb-0">{value}</h4>
        <small className="text-muted">{label}</small>
      </div>
    </CardBody>
  </Card>
);

const DashboardView = ({
  userName,
  roleName,
  isFieldStaff,
  requestCount,
  typeStats,
  paymentStats,
  inspectionStats,
  appointmentStats,
  upcomingInspections,
  upcomingAppointments,
  overdueInspections,
  overdueAppointments,
}) => {
  const totalOverdue =
    inspectionStats.overdue + appointmentStats.overdue;

  const inspectionLink = (r) =>
    isFieldStaff ? `/inspections/${r.id}` : `/admin/requests/${r.requestId}`;
  const appointmentLink = (r) =>
    isFieldStaff ? `/appointments/${r.id}` : `/admin/requests/${r.requestId}`;

  return (
    <div>
      {/* Greeting */}
      <div className="mb-4">
        <h3 className="mb-1">Welcome back, {userName}</h3>
        <span className="text-muted">
          {isFieldStaff
            ? "Here is what has been assigned to you."
            : `${roleName} dashboard — overall activity across all requests.`}
        </span>
      </div>

      {/* Overdue banner */}
      {totalOverdue > 0 ? (
        <Alert color="danger" className="d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          <span>
            <strong>{totalOverdue}</strong> item{totalOverdue === 1 ? "" : "s"}{" "}
            overdue — {inspectionStats.overdue} inspection
            {inspectionStats.overdue === 1 ? "" : "s"} and{" "}
            {appointmentStats.overdue} appointment
            {appointmentStats.overdue === 1 ? "" : "s"} past their scheduled
            date.
          </span>
        </Alert>
      ) : null}

      {/* Statistics */}
      <Row className="g-3">
        <Col sm="6" xl="3">
          <StatCard
            label={isFieldStaff ? "My Requests" : "Service Requests"}
            value={requestCount}
            color="primary"
            icon="bi-clipboard-check"
          />
        </Col>
        <Col sm="6" xl="3">
          <StatCard
            label="Open Inspections"
            value={inspectionStats.open}
            color="info"
            icon="bi-search"
          />
        </Col>
        <Col sm="6" xl="3">
          <StatCard
            label="Open Appointments"
            value={appointmentStats.open}
            color="warning"
            icon="bi-calendar-check"
          />
        </Col>
        <Col sm="6" xl="3">
          <StatCard
            label="Overdue"
            value={totalOverdue}
            color={totalOverdue > 0 ? "danger" : "success"}
            icon="bi-exclamation-triangle"
          />
        </Col>
      </Row>

      {/* Classification & payment breakdown (management only) */}
      {typeStats || paymentStats ? (
        <Row className="g-3 mt-1">
          {typeStats ? (
            <>
              <Col sm="6" xl="3">
                <StatCard
                  label="Jobs"
                  value={typeStats.jobs}
                  color="info"
                  icon="bi-hammer"
                />
              </Col>
              <Col sm="6" xl="3">
                <StatCard
                  label="Contracts"
                  value={typeStats.contracts}
                  color="success"
                  icon="bi-file-earmark-text"
                />
              </Col>
            </>
          ) : null}
          {paymentStats ? (
            <>
              <Col sm="6" xl="3">
                <StatCard
                  label="Paid Requests"
                  value={paymentStats.paid}
                  color="success"
                  icon="bi-cash-coin"
                />
              </Col>
              <Col sm="6" xl="3">
                <StatCard
                  label="Not Paid"
                  value={paymentStats.unpaid}
                  color="warning"
                  icon="bi-exclamation-circle"
                />
              </Col>
            </>
          ) : null}
        </Row>
      ) : null}

      {/* Summary breakdown */}
      <Row className="g-3 mt-1">
        <Col md="6">
          <Card className="h-100">
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-search me-2" /> Inspections Summary
            </CardTitle>
            <CardBody>
              <Table borderless className="align-middle mb-0">
                <tbody>
                  <tr className="border-top">
                    <th scope="row">Total</th>
                    <td className="text-end">{inspectionStats.total}</td>
                  </tr>
                  <tr className="border-top">
                    <th scope="row">Open / In Progress</th>
                    <td className="text-end">{inspectionStats.open}</td>
                  </tr>
                  <tr className="border-top">
                    <th scope="row">Completed / Submitted</th>
                    <td className="text-end">{inspectionStats.completed}</td>
                  </tr>
                  <tr className="border-top">
                    <th scope="row">Overdue</th>
                    <td className="text-end">
                      <Badge
                        color={
                          inspectionStats.overdue > 0 ? "danger" : "success"
                        }
                      >
                        {inspectionStats.overdue}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card className="h-100">
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-calendar-check me-2" /> Appointments Summary
            </CardTitle>
            <CardBody>
              <Table borderless className="align-middle mb-0">
                <tbody>
                  <tr className="border-top">
                    <th scope="row">Total</th>
                    <td className="text-end">{appointmentStats.total}</td>
                  </tr>
                  <tr className="border-top">
                    <th scope="row">Open / In Progress</th>
                    <td className="text-end">{appointmentStats.open}</td>
                  </tr>
                  <tr className="border-top">
                    <th scope="row">Completed</th>
                    <td className="text-end">{appointmentStats.completed}</td>
                  </tr>
                  <tr className="border-top">
                    <th scope="row">Overdue</th>
                    <td className="text-end">
                      <Badge
                        color={
                          appointmentStats.overdue > 0 ? "danger" : "success"
                        }
                      >
                        {appointmentStats.overdue}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Upcoming inspections */}
      <Row className="g-3 mt-1">
        <Col lg="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-search me-2" /> Upcoming Inspections
            </CardTitle>
            <CardBody>
              {upcomingInspections.length === 0 ? (
                <span className="text-muted">No open inspections.</span>
              ) : (
                <Table responsive borderless className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Scheduled</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingInspections.map((i) => (
                      <tr key={i.id} className="border-top">
                        <td>
                          <Link href={inspectionLink(i)}>
                            {new Date(i.scheduledDate).toLocaleDateString()}
                          </Link>
                          {i.overdue ? (
                            <Badge color="danger" className="ms-2">
                              Overdue
                            </Badge>
                          ) : null}
                        </td>
                        <td>{i.customerName || "-"}</td>
                        <td>{i.serviceName || "-"}</td>
                        <td>
                          <Badge
                            color={
                              inspectionStatusColors[i.status] || "secondary"
                            }
                          >
                            {i.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Upcoming appointments */}
        <Col lg="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-calendar-check me-2" /> Upcoming Appointments
            </CardTitle>
            <CardBody>
              {upcomingAppointments.length === 0 ? (
                <span className="text-muted">No open appointments.</span>
              ) : (
                <Table responsive borderless className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Scheduled</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.map((a) => (
                      <tr key={a.id} className="border-top">
                        <td>
                          <Link href={appointmentLink(a)}>
                            {new Date(a.scheduledAt).toLocaleString()}
                          </Link>
                          {a.overdue ? (
                            <Badge color="danger" className="ms-2">
                              Overdue
                            </Badge>
                          ) : null}
                        </td>
                        <td>{a.customerName || "-"}</td>
                        <td>{a.serviceName || "-"}</td>
                        <td>
                          <Badge
                            color={
                              appointmentStatusColors[a.status] || "secondary"
                            }
                          >
                            {a.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Overdue detail */}
      {overdueInspections.length > 0 || overdueAppointments.length > 0 ? (
        <Row className="g-3 mt-1">
          <Col xs="12">
            <Card className="border-danger">
              <CardTitle
                tag="h6"
                className="border-bottom p-3 mb-0 text-danger"
              >
                <i className="bi bi-exclamation-triangle-fill me-2" /> Overdue
                Items
              </CardTitle>
              <CardBody>
                <Table responsive borderless className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Scheduled</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdueInspections.map((i) => (
                      <tr key={`i-${i.id}`} className="border-top">
                        <td>
                          <Badge color="info">Inspection</Badge>
                        </td>
                        <td>
                          <Link href={inspectionLink(i)}>
                            {new Date(i.scheduledDate).toLocaleDateString()}
                          </Link>
                        </td>
                        <td>{i.customerName || "-"}</td>
                        <td>{i.serviceName || "-"}</td>
                        <td>
                          <Badge
                            color={
                              inspectionStatusColors[i.status] || "secondary"
                            }
                          >
                            {i.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {overdueAppointments.map((a) => (
                      <tr key={`a-${a.id}`} className="border-top">
                        <td>
                          <Badge color="warning">Appointment</Badge>
                        </td>
                        <td>
                          <Link href={appointmentLink(a)}>
                            {new Date(a.scheduledAt).toLocaleString()}
                          </Link>
                        </td>
                        <td>{a.customerName || "-"}</td>
                        <td>{a.serviceName || "-"}</td>
                        <td>
                          <Badge
                            color={
                              appointmentStatusColors[a.status] || "secondary"
                            }
                          >
                            {a.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : null}
    </div>
  );
};

export default DashboardView;
