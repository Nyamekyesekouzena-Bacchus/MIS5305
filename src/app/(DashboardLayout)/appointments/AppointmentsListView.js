"use client";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Badge,
  Button,
} from "reactstrap";
import { STATUS_COLORS } from "@/lib/status.mjs";

const statusColors = STATUS_COLORS;

const AppointmentsListView = ({ userName, appointments }) => {
  return (
    <Row>
      <Col>
        <Card>
          <CardBody>
            <CardTitle tag="h5">My Appointments</CardTitle>
            <CardSubtitle className="mb-3 text-muted" tag="h6">
              Service appointments assigned to {userName}
            </CardSubtitle>

            <div className="table-responsive">
              <Table className="align-middle" borderless>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Scheduled</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr className="border-top">
                      <td colSpan="6" className="text-center text-muted py-3">
                        You have no appointments assigned.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id} className="border-top">
                        <td>{appt.id}</td>
                        <td>{new Date(appt.scheduledAt).toLocaleString()}</td>
                        <td>{appt.customerName}</td>
                        <td>
                          <Badge color="primary">{appt.serviceName}</Badge>
                        </td>
                        <td>
                          <Badge color={statusColors[appt.status] || "secondary"}>
                            {appt.status}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button
                            tag={Link}
                            href={`/appointments/${appt.id}`}
                            color="primary"
                            size="sm"
                          >
                            <i className="bi bi-check2-square" /> Record Completion
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AppointmentsListView;
