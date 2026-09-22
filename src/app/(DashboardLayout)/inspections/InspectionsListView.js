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

const InspectionsListView = ({ userName, inspections }) => {
  return (
    <Row>
      <Col>
        <Card>
          <CardBody>
            <CardTitle tag="h5">My Inspections</CardTitle>
            <CardSubtitle className="mb-3 text-muted" tag="h6">
              Inspections assigned to {userName}
            </CardSubtitle>

            <div className="table-responsive">
              <Table className="align-middle" borderless>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.length === 0 ? (
                    <tr className="border-top">
                      <td colSpan="6" className="text-center text-muted py-3">
                        You have no inspections assigned.
                      </td>
                    </tr>
                  ) : (
                    inspections.map((ins) => (
                      <tr key={ins.id} className="border-top">
                        <td>{ins.id}</td>
                        <td>
                          {new Date(ins.scheduledDate).toLocaleString()}
                        </td>
                        <td>{ins.customerName}</td>
                        <td>
                          <Badge color="primary">{ins.serviceName}</Badge>
                        </td>
                        <td>
                          <Badge color={statusColors[ins.status] || "secondary"}>
                            {ins.status}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button
                            tag={Link}
                            href={`/inspections/${ins.id}`}
                            color="primary"
                            size="sm"
                          >
                            <i className="bi bi-pencil-square" /> Record Findings
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

export default InspectionsListView;
