"use client";
import { useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Badge,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  FormText,
} from "reactstrap";
import { changePassword } from "@/actions/account";
import ConfirmModal from "../components/ConfirmModal";

const messages = {
  changed: { color: "success", text: "Your password has been updated." },
  error: {
    missing: { color: "danger", text: "Please fill in both password fields." },
    short: {
      color: "danger",
      text: "Password must be at least 6 characters long.",
    },
    mismatch: { color: "danger", text: "The passwords do not match." },
  },
};

const AccountView = ({ user, searchParams }) => {
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "-";

  const changed = searchParams?.changed;
  const error = searchParams?.error;
  const notice =
    (changed && messages.changed) ||
    (error && messages.error[error]) ||
    null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef(null);

  const requestChange = () => {
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
            <i className="bi bi-person-circle me-2"> </i>
            My Account
          </CardTitle>
          <CardBody>
            <CardSubtitle className="mb-3 text-muted" tag="h6">
              Your account details
            </CardSubtitle>
            <Table borderless className="align-middle">
              <tbody>
                <tr className="border-top">
                  <th scope="row" style={{ width: "40%" }}>
                    First Name
                  </th>
                  <td>{user.firstName}</td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Last Name</th>
                  <td>{user.lastName}</td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Username</th>
                  <td>{user.username}</td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Role</th>
                  <td>
                    <Badge color="primary">{user.role}</Badge>
                  </td>
                </tr>
                <tr className="border-top">
                  <th scope="row">Member Since</th>
                  <td>{memberSince}</td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>

        <Card className="mt-4">
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-shield-lock me-2"> </i>
            Change Password
          </CardTitle>
          <CardBody>
            {notice ? <Alert color={notice.color}>{notice.text}</Alert> : null}
            <Form action={changePassword} innerRef={formRef}>
              <FormGroup>
                <Label for="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                />
                <FormText>Must be at least 6 characters long.</FormText>
              </FormGroup>
              <FormGroup>
                <Label for="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </FormGroup>
              <Button color="primary" type="button" className="mt-2" onClick={requestChange}>
                Update Password
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>

      <ConfirmModal
        isOpen={confirmOpen}
        toggle={() => setConfirmOpen(false)}
        title="Change password"
        message="Are you sure you want to change your password?"
        confirmText="Change password"
        confirmColor="primary"
        onConfirm={handleConfirm}
      />
    </Row>
  );
};

export default AccountView;
