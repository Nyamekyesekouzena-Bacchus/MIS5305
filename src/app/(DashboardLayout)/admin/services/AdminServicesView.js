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
import { createService } from "@/actions/service";
import ConfirmModal from "../../components/ConfirmModal";
import DeleteServiceButton from "./DeleteServiceButton";

const messages = {
  created: { color: "success", text: "Service created successfully." },
  updated: { color: "success", text: "Service updated successfully." },
  deleted: { color: "success", text: "Service deleted successfully." },
  error: {
    missing: { color: "danger", text: "Please fill in all required fields." },
  },
};

const AdminServicesView = ({ services, searchParams, query, canManage = true }) => {
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
            <i className="bi bi-tools me-2 text-primary" />
            Services
          </h3>
          <span className="text-muted">
            Services your company offers to customers.
          </span>
        </div>
        <Badge color="light" className="text-dark border ms-auto fs-6 fw-normal">
          {services.length} total
        </Badge>
      </div>

      {notice ? <Alert color={notice.color}>{notice.text}</Alert> : null}

      {/* Add Service */}
      {canManage ? (
        <Card className="mb-4">
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-plus-square me-2"> </i>
            Add New Service
          </CardTitle>
          <CardBody>
            <Form action={createService} innerRef={createFormRef}>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input id="name" name="name" type="text" required />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      type="textarea"
                      rows="4"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Button
                color="primary"
                type="button"
                className="mt-2"
                onClick={requestCreate}
              >
                Create Service
              </Button>
            </Form>
          </CardBody>
        </Card>
      ) : null}

      {/* Services list */}
      <Card>
        <CardBody>
              <CardTitle
                tag="h5"
                className="d-flex align-items-center justify-content-between"
              >
                <span>Service Catalog</span>
                <Badge color="primary" pill>
                  {services.length}
                </Badge>
              </CardTitle>
              <CardSubtitle className="mb-3 text-muted" tag="h6">
                Search and manage all services offered
              </CardSubtitle>

              {/* Search (plain GET form -> query params) */}
              <Form method="get" action="/admin/services">
                <Row className="g-2 align-items-end">
                  <Col sm="9">
                    <Label for="q" className="form-label">
                      Search
                    </Label>
                    <Input
                      id="q"
                      name="q"
                      type="text"
                      placeholder="Name or description"
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
                      <th>Description</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length === 0 ? (
                      <tr className="border-top">
                        <td colSpan="4" className="text-center text-muted py-5">
                          <i
                            className="bi bi-clipboard-x d-block mb-2"
                            style={{ fontSize: "1.75rem" }}
                          />
                          No services found.
                        </td>
                      </tr>
                    ) : (
                      services.map((s) => (
                        <tr key={s.id} className="border-top">
                          <td>{s.id}</td>
                          <td>{s.name}</td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "220px" }}
                          >
                            {s.description}
                          </td>
                          <td className="text-end">
                            <Button
                              tag={Link}
                              href={`/admin/services/${s.id}`}
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
                                  href={`/admin/services/${s.id}/edit`}
                                  color="light"
                                  size="sm"
                                  className="me-2"
                                >
                                  <i className="bi bi-pencil" /> Edit
                                </Button>
                                <DeleteServiceButton service={s} />
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
        title="Create service"
        message="Are you sure you want to create this service?"
        confirmText="Create"
        confirmColor="primary"
        onConfirm={confirmCreate}
      />
    </div>
  );
};

export default AdminServicesView;
