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
import { updateRequest } from "@/actions/request";
import ConfirmModal from "../../../../components/ConfirmModal";

const errors = {
  missing: "Please fill in all required fields.",
};

const EditRequestForm = ({ request, customers, services, searchParams }) => {
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
            Edit Service Request
          </CardTitle>
          <CardBody>
            {errorText ? <Alert color="danger">{errorText}</Alert> : null}
            <Form action={updateRequest} innerRef={formRef}>
              <input type="hidden" name="id" value={request.id} />
              <FormGroup>
                <Label for="customerId">Customer</Label>
                <Input
                  id="customerId"
                  name="customerId"
                  type="select"
                  defaultValue={request.customerId}
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (#{c.id})
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="serviceId">Service</Label>
                <Input
                  id="serviceId"
                  name="serviceId"
                  type="select"
                  defaultValue={request.serviceId}
                  required
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (#{s.id})
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="textarea"
                  rows="3"
                  defaultValue={request.description}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Service location / address"
                  defaultValue={request.location}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="additionalInfo">Additional Info</Label>
                <Input
                  id="additionalInfo"
                  name="additionalInfo"
                  type="textarea"
                  rows="3"
                  defaultValue={request.additionalInfo}
                />
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
                <Button tag={Link} href="/admin/requests" color="light">
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
        message="Save changes to this service request?"
        confirmText="Save"
        confirmColor="primary"
        onConfirm={handleConfirm}
      />
    </Row>
  );
};

export default EditRequestForm;
