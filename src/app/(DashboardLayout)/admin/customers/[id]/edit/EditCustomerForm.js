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
import { updateCustomer } from "@/actions/customer";
import { CONTACT_CHANNELS } from "@/lib/customerChannels";
import ConfirmModal from "../../../../components/ConfirmModal";

const errors = {
  missing: "Please fill in all required fields.",
  channel: "Please choose a valid contact channel.",
  phone: "That phone number is already used by another customer.",
};

const EditCustomerForm = ({ customer, searchParams }) => {
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
            Edit Customer
          </CardTitle>
          <CardBody>
            {errorText ? <Alert color="danger">{errorText}</Alert> : null}
            <Form action={updateCustomer} innerRef={formRef}>
              <input type="hidden" name="id" value={customer.id} />
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={customer.name}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  defaultValue={customer.phone}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="textarea"
                  defaultValue={customer.address}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="preferredChannel">Preferred Contact Channel</Label>
                <Input
                  id="preferredChannel"
                  name="preferredChannel"
                  type="select"
                  defaultValue={customer.preferredChannel}
                  required
                >
                  {CONTACT_CHANNELS.map((channel) => (
                    <option key={channel} value={channel}>
                      {channel}
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
                <Button tag={Link} href="/admin/customers" color="light">
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
        message="Save changes to this customer?"
        confirmText="Save"
        confirmColor="primary"
        onConfirm={handleConfirm}
      />
    </Row>
  );
};

export default EditCustomerForm;
