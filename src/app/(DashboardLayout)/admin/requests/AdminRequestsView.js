"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Alert,
  Badge,
} from "reactstrap";
import { createRequest } from "@/actions/request";
import {
  PAYMENT_STATUS_COLORS,
  DEFAULT_PAYMENT_STATUS,
} from "@/lib/status.mjs";
import ConfirmModal from "../../components/ConfirmModal";
import DeleteRequestButton from "./DeleteRequestButton";

const messages = {
  created: { color: "success", text: "Service request created successfully." },
  updated: { color: "success", text: "Service request updated successfully." },
  deleted: { color: "success", text: "Service request deleted successfully." },
  error: {
    missing: { color: "danger", text: "Please fill in all required fields." },
  },
};

const AdminRequestsView = ({
  requests,
  customers,
  services,
  searchParams,
  query,
  customerFilter,
  paymentFilter = "all",
  canManage = true,
}) => {
  const created = searchParams?.created;
  const updated = searchParams?.updated;
  const deleted = searchParams?.deleted;
  const error = searchParams?.error;
  const notice =
    (created && messages.created) ||
    (updated && messages.updated) ||
    (deleted && messages.deleted) ||
    (error && messages.error[error]) ||
    null;

  const canCreate = customers.length > 0 && services.length > 0;

  const [createOpen, setCreateOpen] = useState(false);
  const createFormRef = useRef(null);

  const requestCreate = () => {
    const form = createFormRef.current;
    if (form && !form.reportValidity()) return;
    setCreateOpen(true);
  };

  const confirmCreate = () => {
    setCreateOpen(false);
    createFormRef.current?.requestSubmit();
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-4 d-flex flex-wrap align-items-center gap-2">
        <div>
          <h3 className="mb-1">
            <i className="bi bi-clipboard-check me-2 text-primary" />
            Service Requests
          </h3>
          <span className="text-muted">
            Track and manage all customer service requests.
          </span>
        </div>
        <Badge color="light" className="text-dark border ms-auto fs-6 fw-normal">
          {requests.length} total
        </Badge>
      </div>

      {notice ? <Alert color={notice.color}>{notice.text}</Alert> : null}

      {/* Add Request */}
      {canManage ? (
        <Card className="mb-4">
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-clipboard-plus me-2"> </i>
            New Service Request
          </CardTitle>
          <CardBody>
            {!canCreate ? (
              <Alert color="warning">
                You need at least one customer and one service before you can
                create a request.
              </Alert>
            ) : null}
            <Form action={createRequest} innerRef={createFormRef}>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="customerId">Customer</Label>
                    <Input
                      id="customerId"
                      name="customerId"
                      type="select"
                      required
                      disabled={!canCreate}
                    >
                      <option value="">Select a customer…</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (#{c.id})
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="serviceId">Service</Label>
                    <Input
                      id="serviceId"
                      name="serviceId"
                      type="select"
                      required
                      disabled={!canCreate}
                    >
                      <option value="">Select a service…</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (#{s.id})
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      type="textarea"
                      rows="3"
                      required
                      disabled={!canCreate}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Service location / address"
                      required
                      disabled={!canCreate}
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="additionalInfo">Additional Info</Label>
                    <Input
                      id="additionalInfo"
                      name="additionalInfo"
                      type="textarea"
                      rows="3"
                      disabled={!canCreate}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Button
                color="primary"
                type="button"
                className="mt-2"
                onClick={requestCreate}
                disabled={!canCreate}
              >
                Create Request
              </Button>
            </Form>
          </CardBody>
        </Card>
      ) : null}

      {/* Requests list */}
      <Card>
        <CardBody>
              <CardTitle
                tag="h5"
                className="d-flex align-items-center justify-content-between"
              >
                <span>All Requests</span>
                <Badge color="primary" pill>
                  {requests.length}
                </Badge>
              </CardTitle>
              <CardSubtitle className="mb-3 text-muted" tag="h6">
                Search and filter customer service requests
              </CardSubtitle>

              {/* Search & filter (plain GET form -> query params) */}
              <Form method="get" action="/admin/requests">
                <Row className="g-2 align-items-end">
                  <Col sm="6" md="4">
                    <Label for="q" className="form-label">
                      Search
                    </Label>
                    <Input
                      id="q"
                      name="q"
                      type="text"
                      placeholder="Description or info"
                      defaultValue={query}
                    />
                  </Col>
                  <Col sm="6" md="3">
                    <Label for="customer" className="form-label">
                      Customer
                    </Label>
                    <Input
                      id="customer"
                      name="customer"
                      type="select"
                      defaultValue={customerFilter}
                    >
                      <option value="all">All customers</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col sm="6" md="3">
                    <Label for="payment" className="form-label">
                      Payment
                    </Label>
                    <Input
                      id="payment"
                      name="payment"
                      type="select"
                      defaultValue={paymentFilter}
                    >
                      <option value="all">All payments</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Not paid</option>
                    </Input>
                  </Col>
                  <Col sm="6" md="2">
                    <Button color="primary" type="submit" className="w-100">
                      Apply
                    </Button>
                  </Col>
                </Row>
              </Form>

              <div className="table-responsive">
                <Table className="text-nowrap mt-3 align-middle" borderless hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Description</th>
                      <th>Payment</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr className="border-top">
                        <td colSpan="6" className="text-center text-muted py-5">
                          <i
                            className="bi bi-clipboard-x d-block mb-2"
                            style={{ fontSize: "1.75rem" }}
                          />
                          No service requests found.
                        </td>
                      </tr>
                    ) : (
                      requests.map((r) => (
                        <tr key={r.id} className="border-top">
                          <td>{r.id}</td>
                          <td>{r.customer?.name}</td>
                          <td>
                            <Badge color="primary">{r.service?.name}</Badge>
                          </td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "180px" }}
                          >
                            {r.description}
                          </td>
                          <td>
                            <Badge
                              color={
                                PAYMENT_STATUS_COLORS[
                                  r.paymentStatus?.status ||
                                    DEFAULT_PAYMENT_STATUS
                                ] || "secondary"
                              }
                            >
                              {r.paymentStatus?.status || DEFAULT_PAYMENT_STATUS}
                            </Badge>
                          </td>
                          <td className="text-end">
                            <Button
                              tag={Link}
                              href={`/admin/requests/${r.id}`}
                              color="light"
                              size="sm"
                              className="me-2"
                            >
                              <i className="bi bi-eye" /> View
                            </Button>
                            {canManage ? (
                              <>
                                <Button
                                  tag={Link}
                                  href={`/admin/requests/${r.id}/edit`}
                                  color="light"
                                  size="sm"
                                  className="me-2"
                                >
                                  <i className="bi bi-pencil" /> Edit
                                </Button>
                                <DeleteRequestButton request={r} />
                              </>
                            ) : null}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
        </CardBody>
      </Card>

      <ConfirmModal
        isOpen={createOpen}
        toggle={() => setCreateOpen(false)}
        title="Create request"
        message="Are you sure you want to create this service request?"
        confirmText="Create"
        confirmColor="primary"
        onConfirm={confirmCreate}
      />
    </div>
  );
};

export default AdminRequestsView;
