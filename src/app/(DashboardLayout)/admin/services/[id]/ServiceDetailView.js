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
  Button,
} from "reactstrap";

const ServiceDetailView = ({ service, canManage = true }) => {
  const createdAt = service.createdAt
    ? new Date(service.createdAt).toLocaleString()
    : "-";

  return (
    <Row>
      <Col md="8" lg="6">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-tools me-2"> </i>
            Service Details
          </CardTitle>
          <CardBody>
            <CardSubtitle className="mb-3 text-muted" tag="h6">
              Service #{service.id}
            </CardSubtitle>
            <Table borderless className="align-middle">
              <tbody>
                <tr className="border-top">
                  <th scope="row" style={{ width: "40%" }}>
                    Service ID
                  </th>
                  <td>{service.id}</td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Name</th>
                  <td>{service.name}</td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Description</th>
                  <td style={{ whiteSpace: "pre-wrap" }}>
                    {service.description}
                  </td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Created</th>
                  <td>{createdAt}</td>
                </tr>
              </tbody>
            </Table>
            <div className="mt-3">
              {canManage ? (
                <Button
                  tag={Link}
                  href={`/admin/services/${service.id}/edit`}
                  color="primary"
                  className="me-2"
                >
                  <i className="bi bi-pencil" /> Edit
                </Button>
              ) : null}
              <Button tag={Link} href="/admin/services" color="light">
                Back to list
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ServiceDetailView;
