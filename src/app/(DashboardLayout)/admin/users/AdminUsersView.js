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

const AdminUsersView = ({ users, roles, searchParams, query, roleFilter }) => {
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
      {notice ? <Alert color={notice.color}>{notice.text}</Alert> : null}
      <Row>
        {/* Add User */}
        <Col md="5">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-person-plus me-2"> </i>
              Add New User
            </CardTitle>
            <CardBody>
              <Form action={createUser} innerRef={createFormRef}>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" type="text" required />
                </FormGroup>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" type="text" required />
                </FormGroup>
                <FormGroup>
                  <Label for="username">Username</Label>
                  <Input id="username" name="username" type="text" required />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </FormGroup>
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
        </Col>

        {/* Users list */}
        <Col md="7">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Users</CardTitle>
              <CardSubtitle className="mb-3 text-muted" tag="h6">
                All active users
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
                <Table className="text-nowrap mt-3 align-middle" borderless>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr className="border-top">
                        <td colSpan="4" className="text-center text-muted py-3">
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
