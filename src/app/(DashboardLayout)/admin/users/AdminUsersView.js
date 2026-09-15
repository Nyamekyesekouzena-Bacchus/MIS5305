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
import { createUser } from "@/actions/admin";
import ConfirmModal from "../../components/ConfirmModal";
import DeleteUserButton from "./DeleteUserButton";
import PasswordInput from "@/components/PasswordInput";

const messages = {
  created: {
    user: { color: "success", text: "User created successfully." },
  },
  updated: {
    1: { color: "success", text: "User updated successfully." },
  },
  deleted: {
    1: { color: "success", text: "User deleted successfully." },
  },
  error: {
    username: { color: "danger", text: "That username is already taken." },
    missing: { color: "danger", text: "Please fill in all required fields." },
    self: { color: "danger", text: "You cannot delete your own account." },
  },
};

const AdminUsersView = ({ users, roles, searchParams, query, roleFilter, canManage = true }) => {
  const created = searchParams?.created;
  const updated = searchParams?.updated;
  const deleted = searchParams?.deleted;
  const error = searchParams?.error;
  const notice =
    (created && messages.created[created]) ||
    (updated && messages.updated[updated]) ||
    (deleted && messages.deleted[deleted]) ||
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
            <i className="bi bi-people me-2 text-primary" />
            Users
          </h3>
          <span className="text-muted">
            Manage staff accounts and their roles.
          </span>
        </div>
        <Badge color="light" className="text-dark border ms-auto fs-6 fw-normal">
          {users.length} total
        </Badge>
      </div>

      {notice ? <Alert color={notice.color}>{notice.text}</Alert> : null}

      {/* Add User */}
      {canManage ? (
        <Card className="mb-4">
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-person-plus me-2"> </i>
            Add New User
          </CardTitle>
          <CardBody>
            <Form action={createUser} innerRef={createFormRef}>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" type="text" required />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" type="text" required />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input id="username" name="username" type="text" required />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <PasswordInput
                      id="password"
                      name="password"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="roleId">Role</Label>
                    <Input id="roleId" name="roleId" type="select" required>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Button
                color="primary"
                type="button"
                className="mt-2"
                onClick={requestCreate}
              >
                Create User
              </Button>
            </Form>
          </CardBody>
        </Card>
      ) : null}

      {/* Users list */}
      <Card>
        <CardBody>
              <CardTitle
                tag="h5"
                className="d-flex align-items-center justify-content-between"
              >
                <span>Staff Accounts</span>
                <Badge color="primary" pill>
                  {users.length}
                </Badge>
              </CardTitle>
              <CardSubtitle className="mb-3 text-muted" tag="h6">
                Search and manage all active users
              </CardSubtitle>

              {/* Search & filter (plain GET form -> query params) */}
              <Form method="get" action="/admin/users">
                <Row className="g-2 align-items-end">
                  <Col sm="6">
                    <Label for="q" className="form-label">
                      Search
                    </Label>
                    <Input
                      id="q"
                      name="q"
                      type="text"
                      placeholder="Name or username"
                      defaultValue={query}
                    />
                  </Col>
                  <Col sm="4">
                    <Label for="role" className="form-label">
                      Role
                    </Label>
                    <Input
                      id="role"
                      name="role"
                      type="select"
                      defaultValue={roleFilter}
                    >
                      <option value="all">All roles</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col sm="2">
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
                      <th>Name</th>
                      <th>Username</th>
                      <th>Role</th>
                      {canManage ? <th className="text-end">Actions</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr className="border-top">
                        <td colSpan={canManage ? "4" : "3"} className="text-center text-muted py-5">
                          <i
                            className="bi bi-person-x d-block mb-2"
                            style={{ fontSize: "1.75rem" }}
                          />
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-top">
                          <td>
                            {u.firstName} {u.lastName}
                          </td>
                          <td>{u.username}</td>
                          <td>
                            <Badge color="primary">{u.role?.name}</Badge>
                          </td>
                          {canManage ? (
                            <td className="text-end">
                              <Button
                                tag={Link}
                                href={`/admin/users/${u.id}/edit`}
                                color="light"
                                size="sm"
                                className="me-2"
                              >
                                <i className="bi bi-pencil" /> Edit
                              </Button>
                              <DeleteUserButton user={u} />
                            </td>
                          ) : null}
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
        title="Create user"
        message="Are you sure you want to create this user?"
        confirmText="Create"
        confirmColor="primary"
        onConfirm={confirmCreate}
      />
    </div>
  );
};

export default AdminUsersView;
