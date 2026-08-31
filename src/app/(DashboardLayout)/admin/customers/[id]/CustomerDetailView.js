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

const CustomerDetailView = ({ customer, canManage = true, requests = [] }) => {
  const createdAt = customer.createdAt
    ? new Date(customer.createdAt).toLocaleString()
    : "-";

  return (
    <Row>
      <Col md="8" lg="6">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-person-vcard me-2"> </i>
            Customer Details
          </CardTitle>
          <CardBody>
            <CardSubtitle className="mb-3 text-muted" tag="h6">
              Customer #{customer.id}
            </CardSubtitle>
            <Table borderless className="align-middle">
              <tbody>
                <tr className="border-top">
                  <th scope="row" style={{ width: "40%" }}>
                    Customer ID
                  </th>
                  <td>{customer.id}</td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Name</th>
                  <td>{customer.name}</td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Phone</th>
                  <td>{customer.phone}</td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Address</th>
                  <td>{customer.address}</td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Preferred Contact Channel</th>
                  <td>
                    <Badge color="primary">{customer.preferredChannel}</Badge>
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
                  href={`/admin/customers/${customer.id}/edit`}
                  color="primary"
                  className="me-2"
                >
                  <i className="bi bi-pencil" /> Edit
                </Button>
              ) : null}
              <Button tag={Link} href="/admin/customers" color="light">
                Back to list
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Customer's service requests */}
      <Col md="12" lg="6">
        <Card>
          <CardTitle
            tag="h6"
            className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="bi bi-clipboard-check me-2" />
              Service Requests
            </span>
            <Badge color="secondary" pill>
              {requests.length}
            </Badge>
          </CardTitle>
          <CardBody>
            {requests.length === 0 ? (
              <span className="text-muted">
                This customer has no service requests yet.
              </span>
            ) : (
              <div className="table-responsive">
                <Table borderless className="align-middle mb-0 text-nowrap">
                  <thead>
                    <tr className="text-muted">
                      <th>ID</th>
                      <th>Service</th>
                      <th>Type</th>
                      <th>Created</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id} className="border-top">
                        <td>#{r.id}</td>
                        <td>{r.serviceName || "-"}</td>
                        <td>
                          {r.type ? (
                            <Badge
                              color={r.type === "Contract" ? "success" : "info"}
                            >
                              {r.type}
                            </Badge>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="text-end">
                          <Button
                            tag={Link}
                            href={`/admin/requests/${r.id}`}
                            color="light"
                            size="sm"
                          >
                            <i className="bi bi-eye" /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default CustomerDetailView;
