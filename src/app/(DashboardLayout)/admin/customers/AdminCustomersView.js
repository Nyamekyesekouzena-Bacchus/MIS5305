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
import { createCustomer } from "@/actions/customer";
import { CONTACT_CHANNELS } from "@/lib/customerChannels";
import ConfirmModal from "../../components/ConfirmModal";
import DeleteCustomerButton from "./DeleteCustomerButton";

const messages = {
  created: { color: "success", text: "Customer created successfully." },
  updated: { color: "success", text: "Customer updated successfully." },
  deleted: { color: "success", text: "Customer deleted successfully." },
  error: {
    missing: { color: "danger", text: "Please fill in all required fields." },
    channel: { color: "danger", text: "Please choose a valid contact channel." },
    phone: {
      color: "danger",
      text: "That phone number is already used by another customer.",
    },
  },
};

const AdminCustomersView = ({ customers, searchParams, query, canManage = true }) => {
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
            <i className="bi bi-person-vcard me-2 text-primary" />
            Customers
          </h3>
          <span className="text-muted">
            Your customer directory and contact details.
          </span>
        </div>
        <Badge color="light" className="text-dark border ms-auto fs-6 fw-normal">
          {customers.length} total
        </Badge>
      </div>

      {notice ? <Alert color={notice.color}>{notice.text}</Alert> : null}

      {/* Add Customer */}
      {canManage ? (
        <Card className="mb-4">
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-person-plus me-2"> </i>
            Add New Customer
          </CardTitle>
          <CardBody>
            <Form action={createCustomer} innerRef={createFormRef}>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input id="name" name="name" type="text" required />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input id="phone" name="phone" type="text" required />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="preferredChannel">Preferred Contact Channel</Label>
                    <Input
                      id="preferredChannel"
                      name="preferredChannel"
                      type="select"
                      required
                    >
                      {CONTACT_CHANNELS.map((channel) => (
                        <option key={channel} value={channel}>
                          {channel}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="address">Address</Label>
                    <Input id="address" name="address" type="textarea" required />
                  </FormGroup>
                </Col>
              </Row>
              <Button
                color="primary"
                type="button"
                className="mt-2"
                onClick={requestCreate}
              >
                Create Customer
              </Button>
            </Form>
          </CardBody>
        </Card>
      ) : null}

      {/* Customers list */}
      <Card>
        <CardBody>
              <CardTitle
                tag="h5"
                className="d-flex align-items-center justify-content-between"
              >
                <span>Customer Directory</span>
                <Badge color="primary" pill>
                  {customers.length}
                </Badge>
              </CardTitle>
              <CardSubtitle className="mb-3 text-muted" tag="h6">
                Search and manage all customers
              </CardSubtitle>

              {/* Search (plain GET form -> query params) */}
              <Form method="get" action="/admin/customers">
                <Row className="g-2 align-items-end">
                  <Col sm="9">
                    <Label for="q" className="form-label">
                      Search
                    </Label>
                    <Input
                      id="q"
                      name="q"
                      type="text"
                      placeholder="Name, phone or address"
                      defaultValue={query}
                    />
                  </Col>
                  <Col sm="3">
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
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Channel</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr className="border-top">
                        <td colSpan="5" className="text-center text-muted py-5">
                          <i
                            className="bi bi-person-x d-block mb-2"
                            style={{ fontSize: "1.75rem" }}
                          />
                          No customers found.
                        </td>
                      </tr>
                    ) : (
                      customers.map((c) => (
                        <tr key={c.id} className="border-top">
                          <td>{c.id}</td>
                          <td>{c.name}</td>
                          <td>{c.phone}</td>
                          <td>
                            <Badge color="primary">{c.preferredChannel}</Badge>
                          </td>
                          <td className="text-end">
                            <Button
                              tag={Link}
                              href={`/admin/customers/${c.id}`}
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
                                  href={`/admin/customers/${c.id}/edit`}
                                  color="light"
                                  size="sm"
                                  className="me-2"
                                >
                                  <i className="bi bi-pencil" /> Edit
                                </Button>
                                <DeleteCustomerButton customer={c} />
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
        title="Create customer"
        message="Are you sure you want to create this customer?"
        confirmText="Create"
        confirmColor="primary"
        onConfirm={confirmCreate}
      />
    </div>
  );
};

export default AdminCustomersView;
