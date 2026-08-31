"use client";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Badge,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";

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

const ReportsView = ({
  from,
  to,
  rangeValid,
  requestStats,
  inspectionStats,
  appointmentStats,
  typeStats,
  paymentStats,
  completedJobs,
}) => {
  return (
    <div>
      <div className="mb-4">
        <h3 className="mb-1">Operational Reports</h3>
        <span className="text-muted">
          Service requests, inspections, appointments and completed jobs for a
          selected date range.
        </span>
      </div>

      {/* Date range filter */}
      <Card className="mb-4">
        <CardBody>
          <Form method="get" className="row g-3 align-items-end">
            <Col sm="4" md="3">
              <FormGroup className="mb-0">
                <Label for="from">From</Label>
                <Input id="from" name="from" type="date" defaultValue={from} />
              </FormGroup>
            </Col>
            <Col sm="4" md="3">
              <FormGroup className="mb-0">
                <Label for="to">To</Label>
                <Input id="to" name="to" type="date" defaultValue={to} />
              </FormGroup>
            </Col>
            <Col sm="4" md="3">
              <Button color="primary" type="submit">
                <i className="bi bi-funnel me-1" /> Generate Report
              </Button>
            </Col>
          </Form>
        </CardBody>
      </Card>

      {!rangeValid ? (
        <Alert color="warning">
          Please choose a valid date range (the &quot;From&quot; date must be on
          or before the &quot;To&quot; date).
        </Alert>
      ) : null}

      {/* Service Requests */}
      <h6 className="text-muted text-uppercase mb-2">Service Requests</h6>
      <Row className="g-3">
        <Col sm="6" xl="4">
          <StatCard
            label="Created"
            value={requestStats.created}
            color="primary"
            icon="bi-clipboard-plus"
          />
        </Col>
        <Col sm="6" xl="4">
          <StatCard
            label="Assigned"
            value={requestStats.assigned}
            color="info"
            icon="bi-person-check"
          />
        </Col>
        <Col sm="6" xl="4">
          <StatCard
            label="Completed"
            value={requestStats.completed}
            color="success"
            icon="bi-clipboard-check"
          />
        </Col>
      </Row>

      {/* Inspections & Appointments */}
      <h6 className="text-muted text-uppercase mb-2 mt-4">
        Inspections &amp; Appointments
      </h6>
      <Row className="g-3">
        <Col sm="6" xl="3">
          <StatCard
            label="Inspections Scheduled"
            value={inspectionStats.scheduled}
            color="secondary"
            icon="bi-search"
          />
        </Col>
        <Col sm="6" xl="3">
          <StatCard
            label="Inspections Completed"
            value={inspectionStats.completed}
            color="success"
            icon="bi-search"
          />
        </Col>
        <Col sm="6" xl="3">
          <StatCard
            label="Appointments Scheduled"
            value={appointmentStats.scheduled}
            color="warning"
            icon="bi-calendar-check"
          />
        </Col>
        <Col sm="6" xl="3">
          <StatCard
            label="Appointments Completed"
            value={appointmentStats.completed}
            color="success"
            icon="bi-calendar-check"
          />
        </Col>
      </Row>

      {/* Request classification */}
      <h6 className="text-muted text-uppercase mb-2 mt-4">
        Request Classification
      </h6>
      <Row className="g-3">
        <Col sm="6" xl="4">
          <StatCard
            label="Jobs"
            value={typeStats?.jobs ?? 0}
            color="info"
            icon="bi-hammer"
          />
        </Col>
        <Col sm="6" xl="4">
          <StatCard
            label="Contracts"
            value={typeStats?.contracts ?? 0}
            color="success"
            icon="bi-file-earmark-text"
          />
        </Col>
      </Row>

      {/* Payments */}
      <h6 className="text-muted text-uppercase mb-2 mt-4">Payments</h6>
      <Row className="g-3">
        <Col sm="6" xl="4">
          <StatCard
            label="Payments Received"
            value={paymentStats?.paid ?? 0}
            color="success"
            icon="bi-cash-coin"
          />
        </Col>
        <Col sm="6" xl="4">
          <StatCard
            label="Unpaid (created in range)"
            value={paymentStats?.unpaid ?? 0}
            color="warning"
            icon="bi-exclamation-circle"
          />
        </Col>
      </Row>

      {/* Completed jobs list */}
      <Card className="mt-4">
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi bi-check2-circle me-2" /> Completed Jobs
        </CardTitle>
        <CardBody>
          {completedJobs.length === 0 ? (
            <span className="text-muted">
              No completed jobs in the selected range.
            </span>
          ) : (
            <Table responsive borderless className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Completed</th>
                  <th>Customer</th>
                  <th>Service Performed</th>
                  <th>Field Staff</th>
                </tr>
              </thead>
              <tbody>
                {completedJobs.map((j) => (
                  <tr key={j.id} className="border-top">
                    <td>#{j.requestId}</td>
                    <td>
                      {j.completedAt
                        ? new Date(j.completedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>{j.customerName || "-"}</td>
                    <td>{j.workPerformed || j.serviceName || "-"}</td>
                    <td>
                      {j.assignees.length ? (
                        j.assignees.map((name) => (
                          <Badge
                            key={name}
                            color="light"
                            className="text-dark me-1"
                          >
                            {name}
                          </Badge>
                        ))
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ReportsView;
