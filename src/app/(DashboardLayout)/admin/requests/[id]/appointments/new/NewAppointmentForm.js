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
  Alert,
} from "reactstrap";
import { createAppointment } from "@/actions/appointment";
import ConfirmModal from "@/app/(DashboardLayout)/components/ConfirmModal";

const errors = {
  missing: "Please choose an appointment date and time.",
  invalid: "That date/time is not valid.",
  past: "The appointment cannot be scheduled in the past.",
  assignees: "Please assign at least one field worker.",
  conflict:
    "One or more selected field workers are already booked for another appointment around that time.",
};

const NewAppointmentForm = ({ request, fieldWorkers, minDate, searchParams }) => {
  const error = searchParams?.error;
  const errorText = error ? errors[error] : null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef(null);

  const hasWorkers = fieldWorkers.length > 0;

  const requestCreate = () => {
    const form = formRef.current;
    if (form && !form.reportValidity()) return;
    if (!form.querySelector('input[name="assigneeIds"]:checked')) {
      window.alert("Please assign at least one field worker.");
      return;
    }
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
            <i className="bi bi-calendar-plus me-2"> </i>
            Schedule Appointment
          </CardTitle>
          <CardBody>
            <CardSubtitle className="mb-3 text-muted" tag="h6">
              Request #{request.id} — {request.customerName} ({request.serviceName})
            </CardSubtitle>

            {errorText ? <Alert color="danger">{errorText}</Alert> : null}
            {!hasWorkers ? (
              <Alert color="warning">
                There are no field workers to assign yet. Create a user with the
                &quot;Field Worker&quot; role first.
              </Alert>
            ) : null}

            <Form action={createAppointment} innerRef={formRef}>
              <input
                type="hidden"
                name="serviceRequestId"
                value={request.id}
              />
              <FormGroup>
                <Label for="scheduledAt">Date &amp; Time</Label>
                <Input
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  min={minDate}
                  required
                  disabled={!hasWorkers}
                />
              </FormGroup>

              <FormGroup>
                <Label className="d-block">Assign Field Workers</Label>
                {fieldWorkers.map((w) => (
                  <FormGroup check key={w.id} className="mb-1">
                    <Input
                      id={`worker-${w.id}`}
                      name="assigneeIds"
                      type="checkbox"
                      value={w.id}
                      disabled={!hasWorkers}
                    />
                    <Label check for={`worker-${w.id}`}>
                      {w.name} <span className="text-muted">(@{w.username})</span>
                    </Label>
                  </FormGroup>
                ))}
              </FormGroup>

              <div className="mt-3">
                <Button
                  color="primary"
                  type="button"
                  className="me-2"
                  onClick={requestCreate}
                  disabled={!hasWorkers}
                >
                  Schedule Appointment
                </Button>
                <Button
                  tag={Link}
                  href={`/admin/requests/${request.id}`}
                  color="light"
                >
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
        title="Schedule appointment"
        message="Schedule this appointment and notify the assigned field workers?"
        confirmText="Schedule"
        confirmColor="primary"
        onConfirm={handleConfirm}
      />
    </Row>
  );
};

export default NewAppointmentForm;
