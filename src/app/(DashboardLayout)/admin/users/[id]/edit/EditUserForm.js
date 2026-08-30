"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { updateUser } from "@/actions/admin";
import ConfirmModal from "../../../../components/ConfirmModal";

const errors = {
  username: "That username is already taken.",
  missing: "Please fill in all required fields.",
};

const EditUserForm = ({ user, roles, searchParams }) => {
  const error = searchParams?.error;
  const errorText = error ? errors[error] : null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef(null);

  const requestSave = () => {
    const form = formRef.current;
    if (form && !form.reportValidity()) return;
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <Row>
      <Col md="8" lg="6">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-pencil-square me-2"> </i>
            Edit User
          </CardTitle>
          <CardBody>
            {errorText ? <Alert color="danger">{errorText}</Alert> : null}
            <Form action={updateUser} innerRef={formRef}>
              <input type="hidden" name="id" value={user.id} />
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  defaultValue={user.firstName}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  defaultValue={user.lastName}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={user.username}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="roleId">Role</Label>
                <Input
                  id="roleId"
                  name="roleId"
                  type="select"
                  defaultValue={user.roleId}
                  required
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <div className="mt-3">
                <Button
                  color="primary"
                  type="button"
                  className="me-2"
                  onClick={requestSave}
                >
                  Save Changes
                </Button>
                <Button tag={Link} href="/admin/users" color="light">
                  Cancel
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>

      <ConfirmModal
        isOpen={confirmOpen}
        toggle={() => setConfirmOpen(false)}
        title="Save changes"
        message="Save changes to this user?"
        confirmText="Save"
        confirmColor="primary"
        onConfirm={handleConfirm}
      />
    </Row>
  );
};

export default EditUserForm;
